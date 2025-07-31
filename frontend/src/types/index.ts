export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  visibility: 'public' | 'unlisted' | 'private';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  publishDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomePageContent {
  greeting: string;
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

export interface AuthResponse {
  token: string;
  user: User;
}
