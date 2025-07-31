export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: 'admin';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  thumbnail: string;
  visibility: 'public' | 'unlisted' | 'private';
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
