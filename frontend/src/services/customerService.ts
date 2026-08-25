import { api } from '@/lib/api';

export interface CustomerData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  jobTitle?: string;
  address?: string;
  status?: string;
  company?: { id: string; name: string };
  assignedOwner?: { id: string; firstName: string; lastName: string };
}

export const customerService = {
  getCustomers: async (): Promise<CustomerData[]> => {
    const res = await api.get('/customers');
    return res.data;
  },

  getCustomerById: async (id: string): Promise<CustomerData> => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  createCustomer: async (customer: Partial<CustomerData>, companyId?: string): Promise<CustomerData> => {
    const res = await api.post('/customers', customer, {
      params: companyId ? { companyId } : {},
    });
    return res.data;
  },

  addCustomerNote: async (customerId: string, content: string) => {
    const res = await api.post(`/customers/${customerId}/notes`, { content });
    return res.data;
  },

  getCustomerTimeline: async (customerId: string) => {
    const res = await api.get(`/customers/${customerId}/timeline`);
    return res.data;
  },
};
