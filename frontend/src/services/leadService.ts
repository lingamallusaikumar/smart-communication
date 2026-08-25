import { api } from '@/lib/api';

export interface LeadData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  status?: string;
  score?: number;
  estimatedValue?: number;
}

export const leadService = {
  getLeads: async (): Promise<LeadData[]> => {
    const res = await api.get('/leads');
    return res.data;
  },

  getLeadById: async (id: string): Promise<LeadData> => {
    const res = await api.get(`/leads/${id}`);
    return res.data;
  },

  createLead: async (lead: Partial<LeadData>): Promise<LeadData> => {
    const res = await api.post('/leads', lead);
    return res.data;
  },

  updateLeadStatus: async (leadId: string, status: string): Promise<LeadData> => {
    const res = await api.patch(`/leads/${leadId}/status`, { status });
    return res.data;
  },

  convertLeadToCustomer: async (leadId: string) => {
    const res = await api.post(`/leads/${leadId}/convert`);
    return res.data;
  },
};
