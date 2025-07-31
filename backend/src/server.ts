import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import dataService from './dataService';
import { authenticateToken, requireAdmin, JWT_SECRET, AuthRequest } from './auth';
import { User, Project } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:5173", "http://localhost:3000"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite de 100 requêtes par fenêtre
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images) avec CORS
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Configuration multer pour les CV (PDF uniquement)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'cv.pdf'); // Nom fixe pour le CV
  }
});

const uploadCV = multer({ 
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seul le format PDF est autorisé pour le CV'));
    }
  }
});

// Routes publiques

// Configuration et contenu de la page d'accueil
app.get('/api/config', (req, res) => {
  try {
    const config = dataService.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la configuration' });
  }
});

// Projets publics
app.get('/api/projects', (req, res) => {
  try {
    const projects = dataService.getProjects()
      .filter(project => project.visibility === 'public')
      .sort((a, b) => a.order - b.order);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

// Projet individuel
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = dataService.getProjectById(req.params.id);
    if (!project || project.visibility === 'private') {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du projet' });
  }
});

// Authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const user = dataService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Routes administrateur protégées
app.use('/api/admin', authenticateToken, requireAdmin);

// Gestion des projets
app.get('/api/admin/projects', (req, res) => {
  try {
    const projects = dataService.getProjects().sort((a, b) => a.order - b.order);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

app.post('/api/admin/projects', (req, res) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(400).json({ error: err.message || 'Erreur lors de l\'upload du fichier' });
    }
    
    try {
      const { title, shortDescription, longDescription, category, tags, visibility, order } = req.body;
      
      // Validation des champs requis
      if (!title || !shortDescription || !longDescription) {
        return res.status(400).json({ error: 'Titre, description courte et description longue sont requis' });
      }
      
      // Parse tags si c'est une string JSON
      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch (e) {
          console.error('Erreur parsing tags:', e);
          parsedTags = [];
        }
      }
      
      const project: Project = {
        id: uuidv4(),
        title,
        shortDescription,
        longDescription,
        category: category || '',
        tags: parsedTags,
        thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
        visibility: visibility || 'public',
        order: parseInt(order) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Création projet:', project.title, 'avec thumbnail:', project.thumbnail);
      dataService.addProject(project);
      res.status(201).json(project);
    } catch (error) {
      console.error('Erreur création projet:', error);
      res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
  });
});

app.put('/api/admin/projects/:id', (req, res) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload mise à jour:', err);
      return res.status(400).json({ error: err.message || 'Erreur lors de l\'upload du fichier' });
    }
    
    try {
      const { title, shortDescription, longDescription, category, tags, visibility, order } = req.body;
      
      // Parse tags si c'est une string JSON
      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch (e) {
          console.error('Erreur parsing tags mise à jour:', e);
          parsedTags = [];
        }
      }
      
      const updateData: Partial<Project> = {
        title,
        shortDescription,
        longDescription,
        category: category || '',
        tags: parsedTags,
        visibility,
        order: parseInt(order) || 0
      };

      if (req.file) {
        updateData.thumbnail = `/uploads/${req.file.filename}`;
        console.log('Mise à jour projet avec nouvelle thumbnail:', updateData.thumbnail);
      }

      const success = dataService.updateProject(req.params.id, updateData);
      if (!success) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      const updatedProject = dataService.getProjectById(req.params.id);
      res.json(updatedProject);
    } catch (error) {
      console.error('Erreur mise à jour projet:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
    }
  });
});

app.delete('/api/admin/projects/:id', (req, res) => {
  try {
    const success = dataService.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

// Gestion de la configuration
app.put('/api/admin/config/homepage', (req, res) => {
  try {
    const { greeting, shortDescription, contactEmail, contactPhone, markdownContent } = req.body;
    
    dataService.updateHomePage({
      greeting,
      shortDescription,
      contactEmail,
      contactPhone,
      markdownContent
    });

    const config = dataService.getConfig();
    res.json(config.homePage);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la page d\'accueil' });
  }
});

app.put('/api/admin/config/social', (req, res) => {
  try {
    const { socialNetworks } = req.body;
    
    dataService.updateSocialNetworks(socialNetworks);
    
    const config = dataService.getConfig();
    res.json(config.socialNetworks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des réseaux sociaux' });
  }
});

// Ajouter un réseau social
app.post('/api/admin/config/social', (req, res) => {
  try {
    const socialNetwork = req.body;
    
    const config = dataService.getConfig();
    const newSocialNetwork = {
      id: Date.now().toString(),
      ...socialNetwork,
    };
    
    const updatedSocialNetworks = [...config.socialNetworks, newSocialNetwork];
    dataService.updateSocialNetworks(updatedSocialNetworks);
    
    res.json(newSocialNetwork);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du réseau social' });
  }
});

// Supprimer un réseau social
app.delete('/api/admin/config/social/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const config = dataService.getConfig();
    const updatedSocialNetworks = config.socialNetworks.filter(social => social.id !== id);
    dataService.updateSocialNetworks(updatedSocialNetworks);
    
    res.json({ message: 'Réseau social supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du réseau social' });
  }
});

// Upload de fichiers
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }
    
    res.json({ 
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
  }
});

// Upload spécifique pour le CV
app.post('/api/admin/cv/upload', authenticateToken, uploadCV.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier CV uploadé' });
    }
    
    res.json({ 
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      message: 'CV uploadé avec succès'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload du CV' });
  }
});

// Route de téléchargement du CV
app.get('/api/cv/download', (req, res) => {
  const cvPath = path.join(__dirname, '../uploads/cv.pdf');
  res.download(cvPath, 'CV-Pierre-Lihoreau.pdf', (err) => {
    if (err) {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  });
});

// Route de suppression du CV
app.delete('/api/admin/cv', authenticateToken, (req, res) => {
  try {
    const cvPath = path.join(__dirname, '../uploads/cv.pdf');
    if (fs.existsSync(cvPath)) {
      fs.unlinkSync(cvPath);
      res.json({ message: 'CV supprimé avec succès' });
    } else {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du CV' });
  }
});

// Route pour récupérer les statistiques du dashboard
app.get('/api/admin/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const projects = dataService.getProjects();
    const cvPath = path.join(__dirname, '../uploads/cv.pdf');
    const hasCVFile = fs.existsSync(cvPath);

    const stats = {
      projectsCount: projects.length,
      hasCVFile,
      lastLoginDate: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Initialisation d'un utilisateur admin par défaut
const initializeAdmin = async () => {
  const users = dataService.getUsers();
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      id: uuidv4(),
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    users.push(adminUser);
    dataService.saveUsers(users);
    console.log('Utilisateur admin créé - Username: admin, Password: admin123');
  }
};

// Démarrage du serveur
app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
