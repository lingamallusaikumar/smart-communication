import { api } from '@/lib/api';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await api.get('/analytics/audit-logs');
    return res.data;
  },
};
