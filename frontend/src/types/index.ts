export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: string;
  title: string;
  description: string; // Alias pour shortDescription
  shortDescription: string;
  longDescription: string;
  content: string; // Alias pour longDescription
  technologies: string[]; // Nouveau champ
  imageUrl?: string; // Alias pour thumbnail
  thumbnail: string;
  githubUrl?: string; // Nouveau champ
  demoUrl?: string; // Nouveau champ
  featured: boolean; // Nouveau champ basé sur order/visibility
  visibility: 'public' | 'unlisted' | 'private';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string; // Nouveau champ généré à partir du titre
  excerpt: string; // Alias pour shortDescription
  shortDescription: string;
  content: string;
  imageUrl?: string; // Nouveau champ
  category: string; // Nouveau champ
  tags: string[]; // Nouveau champ
  published: boolean; // Nouveau champ basé sur la date
  publishedAt: string; // Alias pour publishDate
  publishDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomePageContent {
  greeting: string;
  shortDescription: string;
  contactEmail: string;
  contactPhone: string;
  markdownContent: string;
  updatedAt: string;
}

export interface SocialNetwork {
  id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
}

export interface Config {
  homePage: HomePageContent;
  socialNetworks: SocialNetwork[];
}
