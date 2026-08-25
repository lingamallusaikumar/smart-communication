import { api } from '@/lib/api';

export const aiService = {
  analyzeText: async (text: string) => {
    const res = await api.post('/ai/analyze', { text });
    return res.data;
  },

  getCustomerMemory: async (customerId: string) => {
    const res = await api.get(`/ai/memory/${customerId}`);
    return res.data;
  },

  updateCustomerMemory: async (customerId: string, memoryData: any) => {
    const res = await api.put(`/ai/memory/${customerId}`, memoryData);
    return res.data;
  },

  getInsights: async () => {
    const res = await api.get('/ai/insights');
    return res.data;
  },
};
