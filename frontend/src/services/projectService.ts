import api from './api';
import type { Project } from '../types';

const projectService = {
  // Public
  async getPublicProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Admin
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get('/admin/projects');
    return response.data;
  },

  async createProject(formData: FormData): Promise<Project> {
    const response = await api.post('/admin/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProject(id: string, formData: FormData): Promise<Project> {
    const response = await api.put(`/admin/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/admin/projects/${id}`);
  },

  // Alias pour la compatibilité avec l'interface
  async getProjects(): Promise<Project[]> {
    return this.getPublicProjects();
  },
};

export default projectService;
