import api from './api';

export interface DashboardStats {
  projectsCount: number;
  blogPostsCount: number;
  hasCVFile: boolean;
  lastLoginDate: string;
}

const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }
};

export default dashboardService;
