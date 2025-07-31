import api from './api';
import type { BlogPost } from '../types';

const blogService = {
  // Public
  async getBlogPosts(): Promise<BlogPost[]> {
    const response = await api.get('/blog');
    return response.data;
  },

  async getBlogPost(id: string): Promise<BlogPost> {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  // Admin
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const response = await api.get('/admin/blog');
    return response.data;
  },

  async createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const response = await api.post('/admin/blog', postData);
    return response.data;
  },

  async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    const response = await api.put(`/admin/blog/${id}`, postData);
    return response.data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    await api.delete(`/admin/blog/${id}`);
  },
};

export default blogService;
