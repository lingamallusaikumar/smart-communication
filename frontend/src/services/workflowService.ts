import { api } from '@/lib/api';

export interface WorkflowData {
  id?: string;
  name: string;
  triggerType: string;
  description?: string;
  isActive?: boolean;
}

export const workflowService = {
  getWorkflows: async (): Promise<WorkflowData[]> => {
    const res = await api.get('/workflows');
    return res.data;
  },

  createWorkflow: async (workflow: Partial<WorkflowData>): Promise<WorkflowData> => {
    const res = await api.post('/workflows', workflow);
    return res.data;
  },

  triggerWorkflow: async (triggerType: string, payload?: any) => {
    const res = await api.post('/workflows/trigger', { triggerType, ...payload });
    return res.data;
  },
};
