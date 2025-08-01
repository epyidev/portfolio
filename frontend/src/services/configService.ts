import api from './api';
import type { Config, HomePageContent, SocialNetwork } from '../types';

export interface HomePageConfig {
  greeting: string;
  shortDescription: string;
  contactEmail: string;
  contactPhone: string;
  markdownContent: string;
  heroBackgroundImage?: string;
  updatedAt: string;
}

const configService = {
  async getConfig(): Promise<Config> {
    const response = await api.get('/config');
    return response.data;
  },

  async updateHomePage(homePageData: Partial<HomePageContent>): Promise<HomePageContent> {
    const response = await api.put('/admin/config/homepage', homePageData);
    return response.data;
  },

  async updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<SocialNetwork[]> {
    const response = await api.put('/admin/config/social', { socialNetworks });
    return response.data;
  },

  async addSocialNetwork(socialNetwork: Omit<SocialNetwork, 'id'>): Promise<SocialNetwork> {
    const response = await api.post('/admin/config/social', socialNetwork);
    return response.data;
  },

  async deleteSocialNetwork(id: string): Promise<void> {
    await api.delete(`/admin/config/social/${id}`);
  },

  async uploadFile(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Utiliser la route spécifique pour le CV si c'est un PDF
    const endpoint = file.type === 'application/pdf' ? '/admin/cv/upload' : '/admin/upload';
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDownloadCVUrl(): string {
    return `${api.defaults.baseURL}/cv/download`;
  },

  // Gestion des images de fond hero
  async uploadHomePageHeroBackground(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('heroBackground', file);
    
    const response = await api.post('/admin/config/homepage/hero-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadPortfolioHeroBackground(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('heroBackground', file);
    
    const response = await api.post('/admin/config/portfolio/hero-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async removeHomePageHeroBackground(): Promise<void> {
    await api.delete('/admin/config/homepage/hero-background');
  },

  async removePortfolioHeroBackground(): Promise<void> {
    await api.delete('/admin/config/portfolio/hero-background');
  },
};

export default configService;
