import { api } from '@/lib/api';

export interface DealData {
  id?: string;
  title: string;
  value: number;
  probability?: number;
  status?: string;
  lostReason?: string;
  expectedCloseDate?: string;
  stage?: { id: string; name: string; winProbability: number };
  company?: { name: string };
  customer?: { firstName: string; lastName: string };
}

export const dealService = {
  getPipelines: async () => {
    const res = await api.get('/deals/pipelines');
    return res.data;
  },

  getDeals: async (pipelineId?: string): Promise<DealData[]> => {
    const res = await api.get('/deals', {
      params: pipelineId ? { pipelineId } : {},
    });
    return res.data;
  },

  createDeal: async (deal: Partial<DealData>, pipelineId: string, stageId: string, customerId?: string, companyId?: string): Promise<DealData> => {
    const res = await api.post('/deals', deal, {
      params: { pipelineId, stageId, customerId, companyId },
    });
    return res.data;
  },

  updateDealStage: async (dealId: string, stageId: string, status?: string): Promise<DealData> => {
    const res = await api.patch(`/deals/${dealId}/stage`, { stageId, status });
    return res.data;
  },

  getSalesForecast: async () => {
    const res = await api.get('/deals/forecast');
    return res.data;
  },
};
