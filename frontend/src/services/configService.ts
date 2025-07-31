import api from './api';
import { Config, HomePageContent, SocialNetwork } from '../types';

export const configService = {
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

  async uploadFile(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDownloadCVUrl(): string {
    return `${api.defaults.baseURL}/cv/download`;
  },
};
