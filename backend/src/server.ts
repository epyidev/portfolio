import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import dataService from './dataService';
import { authenticateToken, requireAdmin, JWT_SECRET, AuthRequest } from './auth';
import { User, Project, BlogPost } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Articles de blog
app.get('/api/blog', (req, res) => {
  try {
    const posts = dataService.getBlogPosts()
      .sort((a, b) => a.order - b.order);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

// Article de blog individuel
app.get('/api/blog/:id', (req, res) => {
  try {
    const post = dataService.getBlogPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
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

app.post('/api/admin/projects', upload.single('thumbnail'), (req, res) => {
  try {
    const { title, shortDescription, longDescription, visibility, order } = req.body;
    
    const project: Project = {
      id: uuidv4(),
      title,
      shortDescription,
      longDescription,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
      visibility: visibility || 'public',
      order: parseInt(order) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataService.addProject(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du projet' });
  }
});

app.put('/api/admin/projects/:id', upload.single('thumbnail'), (req, res) => {
  try {
    const { title, shortDescription, longDescription, visibility, order } = req.body;
    
    const updateData: Partial<Project> = {
      title,
      shortDescription,
      longDescription,
      visibility,
      order: parseInt(order) || 0
    };

    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    }

    const success = dataService.updateProject(req.params.id, updateData);
    if (!success) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    const updatedProject = dataService.getProjectById(req.params.id);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
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

// Gestion des articles de blog
app.get('/api/admin/blog', (req, res) => {
  try {
    const posts = dataService.getBlogPosts().sort((a, b) => a.order - b.order);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

app.post('/api/admin/blog', (req, res) => {
  try {
    const { title, shortDescription, content, publishDate, order } = req.body;
    
    const post: BlogPost = {
      id: uuidv4(),
      title,
      shortDescription,
      content,
      publishDate: publishDate || new Date().toISOString(),
      order: parseInt(order) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataService.addBlogPost(post);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
  }
});

app.put('/api/admin/blog/:id', (req, res) => {
  try {
    const { title, shortDescription, content, publishDate, order } = req.body;
    
    const updateData: Partial<BlogPost> = {
      title,
      shortDescription,
      content,
      publishDate,
      order: parseInt(order) || 0
    };

    const success = dataService.updateBlogPost(req.params.id, updateData);
    if (!success) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    const updatedPost = dataService.getBlogPostById(req.params.id);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
  }
});

app.delete('/api/admin/blog/:id', (req, res) => {
  try {
    const success = dataService.deleteBlogPost(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
  }
});

// Gestion de la configuration
app.put('/api/admin/config/homepage', (req, res) => {
  try {
    const { greeting, contactEmail, contactPhone, markdownContent } = req.body;
    
    dataService.updateHomePage({
      greeting,
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

// Route de téléchargement du CV
app.get('/api/cv/download', (req, res) => {
  const cvPath = path.join(__dirname, '../uploads/cv.pdf');
  res.download(cvPath, 'CV-Pierre-Lihoreau.pdf', (err) => {
    if (err) {
      res.status(404).json({ error: 'CV non trouvé' });
    }
  });
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
