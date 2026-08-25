import { api } from '@/lib/api';

export interface TicketData {
  id?: string;
  ticketNumber?: string;
  subject: string;
  description: string;
  status?: string;
  priority?: string;
  firstResponseDueAt?: string;
  resolutionDueAt?: string;
  customer?: { firstName: string; lastName: string; company?: { name: string } };
}

export const supportService = {
  getTickets: async (): Promise<TicketData[]> => {
    const res = await api.get('/support/tickets');
    return res.data;
  },

  createTicket: async (ticket: Partial<TicketData>, customerId?: string): Promise<TicketData> => {
    const res = await api.post('/support/tickets', ticket, {
      params: customerId ? { customerId } : {},
    });
    return res.data;
  },

  updateTicketStatus: async (ticketId: string, status: string): Promise<TicketData> => {
    const res = await api.patch(`/support/tickets/${ticketId}/status`, { status });
    return res.data;
  },

  getSupportMetrics: async () => {
    const res = await api.get('/support/metrics');
    return res.data;
  },
};
