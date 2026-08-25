import { api } from '@/lib/api';

export interface ConversationData {
  id: string;
  channelType: string;
  subject?: string;
  status: string;
  priority: string;
  lastMessageAt: string;
  customer?: { id: string; firstName: string; lastName: string; company?: { name: string } };
}

export interface MessageData {
  id?: string;
  senderType: string;
  senderId?: string;
  content: string;
  channelType: string;
  isInternalNote?: boolean;
  createdAt?: string;
}

export const communicationService = {
  getConversations: async (channel?: string): Promise<ConversationData[]> => {
    const res = await api.get('/communication/conversations', {
      params: channel ? { channel } : {},
    });
    return res.data;
  },

  getMessages: async (conversationId: string): Promise<MessageData[]> => {
    const res = await api.get(`/communication/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string, isInternalNote: boolean = false): Promise<MessageData> => {
    const res = await api.post(`/communication/conversations/${conversationId}/messages`, {
      content,
      isInternalNote,
    });
    return res.data;
  },

  createConversation: async (customerId: string, channelType: string, subject: string, initialMessage?: string) => {
    const res = await api.post('/communication/conversations', {
      customerId,
      channelType,
      subject,
      initialMessage,
    });
    return res.data;
  },

  getTemplates: async () => {
    const res = await api.get('/communication/templates');
    return res.data;
  },
};
