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
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001;

// Fonction pour corriger les URLs relatives en URLs absolues
const fixImageUrls = (req: express.Request, data: any): any => {
  if (!data) return data;
  
  const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'https';
  const host = req.get('Host') || req.get('X-Forwarded-Host') || req.headers.host || `localhost:${PORT}`;
  const baseUrl = `${protocol}://${host}`;
  
  // Récursivement corriger toutes les URLs d'images
  const fixUrls = (obj: any): any => {
    if (typeof obj === 'string') {
      // Corriger les URLs qui commencent par /uploads/ ou qui contiennent localhost
      if (obj.startsWith('/uploads/')) {
        return `${baseUrl}${obj}`;
      }
      if (obj.includes('localhost:') && obj.includes('/uploads/')) {
        return obj.replace(/https?:\/\/localhost:\d+/, baseUrl);
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(fixUrls);
    }
    
    if (obj && typeof obj === 'object') {
      const fixed: any = {};
      for (const key in obj) {
        fixed[key] = fixUrls(obj[key]);
      }
      return fixed;
    }
    
    return obj;
  };
  
  return fixUrls(data);
};

// Fonction utilitaire pour générer des URLs absolues pour les uploads
const getFullUploadUrl = (req: express.Request, relativePath: string) => {
  // Si une URL publique est définie dans les variables d'environnement, l'utiliser
  if (process.env.PUBLIC_URL) {
    const finalUrl = `${process.env.PUBLIC_URL}${relativePath}`;
    console.log(`🔍 Using PUBLIC_URL: ${finalUrl}`);
    return finalUrl;
  }
  
  // En production, forcer l'utilisation du domaine public
  if (process.env.NODE_ENV === 'production') {
    // Essayer de détecter le vrai domaine depuis les headers
    const forwardedHost = req.get('X-Forwarded-Host') || req.get('Host');
    
    if (forwardedHost && !forwardedHost.includes('localhost') && !forwardedHost.includes('127.0.0.1') && !forwardedHost.includes('82.153.202.154')) {
      const protocol = req.get('X-Forwarded-Proto') || 'https';
      const cleanHost = forwardedHost.split(':')[0]; // Enlever le port si présent
      const finalUrl = `${protocol}://${cleanHost}${relativePath}`;
      console.log(`🔍 Production URL generated: ${finalUrl}`);
      return finalUrl;
    }
    
    // Fallback: utiliser le domaine connu
    const finalUrl = `https://pierrelihoreau.lets-pop.fr${relativePath}`;
    console.log(`🔍 Using hardcoded domain: ${finalUrl}`);
    return finalUrl;
  }
  
  // Fallback pour développement
  const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'https';
  const host = req.get('Host') || req.get('X-Forwarded-Host') || req.headers.host || `localhost:${PORT}`;
  
  console.log(`🔍 Development URL - Protocol: ${protocol}, Host: ${host}, Path: ${relativePath}`);
  
  return `${protocol}://${host}${relativePath}`;
};

// Middleware de sécurité - Configuration minimale pour éviter les conflits HTTPS/HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Désactiver complètement la CSP qui cause les problèmes
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  originAgentCluster: false
}));

// CORS - configuration pour production HTTPS et développement
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Permet toutes les origines en production
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: false
};
app.use(cors(corsOptions));

// Trust proxy pour HTTPS (important pour Pterodactyl avec SSL)
app.set('trust proxy', 1);

// Ne pas forcer HTTPS - laissons Pterodactyl gérer ça

// Rate limiting désactivé pour un portfolio personnel
// Plus de limites de requêtes - idéal pour les images et assets

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images) avec optimisations
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1y', // Cache pendant 1 an
  etag: true,
  lastModified: true
}));

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

// Configuration multer pour les images de fond hero
const heroBackgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hero-backgrounds/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hero-bg-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadHeroBackground = multer({ 
  storage: heroBackgroundStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max pour les images de fond
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images (JPEG, PNG, WebP) sont autorisées pour les images de fond'));
    }
  }
});

// Routes publiques

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Serveur fonctionne !', 
    port: PORT, 
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Configuration et contenu de la page d'accueil
app.get('/api/config', (req, res) => {
  try {
    const config = dataService.getConfig();
    const fixedConfig = fixImageUrls(req, config);
    res.json(fixedConfig);
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
    const fixedProjects = fixImageUrls(req, projects);
    res.json(fixedProjects);
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
    const fixedProject = fixImageUrls(req, project);
    res.json(fixedProject);
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
    const fixedProjects = fixImageUrls(req, projects);
    res.json(fixedProjects);
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
      const { title, shortDescription, longDescription, tags, visibility, order } = req.body;
      
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
        tags: parsedTags,
        thumbnail: req.file ? getFullUploadUrl(req, `/uploads/${req.file.filename}`) : '',
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
      const { title, shortDescription, longDescription, tags, visibility, order } = req.body;
      
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
        tags: parsedTags,
        visibility,
        order: parseInt(order) || 0
      };

      if (req.file) {
        updateData.thumbnail = getFullUploadUrl(req, `/uploads/${req.file.filename}`);
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

// Upload d'image de fond pour la page d'accueil
app.post('/api/admin/config/homepage/hero-background', (req, res) => {
  uploadHeroBackground.single('heroBackground')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload image de fond page d\'accueil:', err);
      return res.status(400).json({ error: err.message || 'Erreur lors de l\'upload de l\'image' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    try {
      const imageUrl = getFullUploadUrl(req, `/uploads/hero-backgrounds/${req.file.filename}`);
      
      // Mettre à jour la configuration
      dataService.updateHomePage({ heroBackgroundImage: imageUrl });

      res.json({
        filename: req.file.filename,
        url: imageUrl,
        message: 'Image de fond de la page d\'accueil mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'image' });
    }
  });
});

// Upload d'image de fond pour la page portfolio
app.post('/api/admin/config/portfolio/hero-background', (req, res) => {
  uploadHeroBackground.single('heroBackground')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload image de fond portfolio:', err);
      return res.status(400).json({ error: err.message || 'Erreur lors de l\'upload de l\'image' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    try {
      const imageUrl = getFullUploadUrl(req, `/uploads/hero-backgrounds/${req.file.filename}`);
      
      // Mettre à jour la configuration
      dataService.updatePortfolioPage({ heroBackgroundImage: imageUrl });

      res.json({
        filename: req.file.filename,
        url: imageUrl,
        message: 'Image de fond du portfolio mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'image' });
    }
  });
});

// Supprimer l'image de fond de la page d'accueil
app.delete('/api/admin/config/homepage/hero-background', (req, res) => {
  try {
    dataService.updateHomePage({ heroBackgroundImage: '' });
    res.json({ message: 'Image de fond de la page d\'accueil supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image de fond' });
  }
});

// Supprimer l'image de fond du portfolio
app.delete('/api/admin/config/portfolio/hero-background', (req, res) => {
  try {
    dataService.updatePortfolioPage({ heroBackgroundImage: '' });
    res.json({ message: 'Image de fond du portfolio supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image de fond' });
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
      url: getFullUploadUrl(req, `/uploads/${req.file.filename}`)
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
      url: getFullUploadUrl(req, `/uploads/${req.file.filename}`),
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

// Servir les fichiers statiques du frontend (en production)
if (process.env.NODE_ENV === 'production') {
  // Simple : les fichiers frontend sont dans /dist
  const frontendPath = path.join(__dirname, '.');  // __dirname pointe déjà vers dist/
  console.log(`🔍 Looking for frontend files in: ${frontendPath}`);
  
  // Lister tous les fichiers dans le dossier pour debug
  try {
    const allFiles = fs.readdirSync(frontendPath);
    console.log(`📁 All files in ${frontendPath}:`, allFiles);
  } catch (err) {
    console.error(`❌ Cannot read directory ${frontendPath}:`, err);
  }
  
  const indexPath = path.join(frontendPath, 'index.html');
  console.log(`🔍 Looking for index.html at: ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    console.log(`✅ Frontend files found! Serving from: ${frontendPath}`);
    
    // Servir les fichiers statiques avec cache optimisé
    app.use(express.static(frontendPath, {
      maxAge: '1y', // Cache pendant 1 an pour les assets
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        // Cache plus court pour index.html
        if (path.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    
    // Route catch-all pour servir index.html (SPA routing)
    app.get('*', (req, res) => {
      // Skip API routes et fichiers statiques
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return res.status(404).json({ error: 'Route non trouvée' });
      }
      
      console.log(`📄 Serving index.html for route: ${req.path}`);
      res.sendFile(indexPath);
    });
  } else {
    console.error(`❌ index.html not found at: ${indexPath}`);
    console.error('❌ Frontend files must be built and placed in the dist folder!');
  }
}

// Démarrage du serveur
app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`SERVER_PORT: ${process.env.SERVER_PORT}`);
  console.log(`Dist directory: ${path.join(__dirname, '../dist')}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`Application accessible sur http://localhost:${PORT}`);
    // Vérifier si le dossier dist existe
    const distExists = fs.existsSync(path.join(__dirname, '../dist'));
    console.log(`Dossier dist existe: ${distExists}`);
    if (distExists) {
      const distFiles = fs.readdirSync(path.join(__dirname, '../dist'));
      console.log(`Fichiers dans dist:`, distFiles);
    }
  }
});

export default app;
