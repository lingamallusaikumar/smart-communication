'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Send, 
  Paperclip, 
  Bot, 
  Lock, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationService, ConversationData, MessageData } from '@/services/communicationService';

export default function SmartInboxPage() {
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [selectedConvId, setSelectedConvId] = useState('conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const queryClient = useQueryClient();

  // Demo Fallback Conversations
  const demoConversations: ConversationData[] = [
    {
      id: 'conv-1',
      channelType: 'WHATSAPP',
      subject: 'Custom SLA & Seat Expansion Query',
      status: 'OPEN',
      priority: 'HIGH',
      lastMessageAt: '10:42 AM',
      customer: { id: 'c1', firstName: 'Sarah', lastName: 'Jenkins', company: { name: 'TechCorp Solutions' } }
    },
    {
      id: 'conv-2',
      channelType: 'EMAIL',
      subject: 'Revised Contract Review',
      status: 'OPEN',
      priority: 'MEDIUM',
      lastMessageAt: '9:15 AM',
      customer: { id: 'c2', firstName: 'Michael', lastName: 'Chang', company: { name: 'Global Retail Network' } }
    },
  ];

  const demoMessages: MessageData[] = [
    { id: 'm1', senderType: 'CUSTOMER', content: 'Hi Alex, we are really enjoying SmartCommunication CRM so far!', channelType: 'WHATSAPP', isInternalNote: false },
    { id: 'm2', senderType: 'AGENT', content: 'Glad to hear that Sarah! How can I assist you today?', channelType: 'WHATSAPP', isInternalNote: false },
    { id: 'm3', senderType: 'CUSTOMER', content: 'Could you please confirm if we can add 5 additional sales reps to our current plan?', channelType: 'WHATSAPP', isInternalNote: false },
  ];

  // Fetch Conversations from REST API
  const { data: apiConversations, isLoading: isLoadingConvs, refetch: refetchConvs } = useQuery({
    queryKey: ['conversations', activeChannel],
    queryFn: () => communicationService.getConversations(activeChannel),
  });

  const conversationsList = (apiConversations && apiConversations.length > 0) ? apiConversations : demoConversations;
  const activeConv = conversationsList.find(c => c.id === selectedConvId) || conversationsList[0];

  // Fetch Messages for Selected Conversation
  const { data: apiMessages } = useQuery({
    queryKey: ['messages', selectedConvId],
    queryFn: () => communicationService.getMessages(selectedConvId),
    enabled: !!selectedConvId,
  });

  const messagesList = (apiMessages && apiMessages.length > 0) ? apiMessages : demoMessages;

  // Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: ({ convId, content, isNote }: { convId: string; content: string; isNote: boolean }) =>
      communicationService.sendMessage(convId, content, isNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConvId] });
      setMessageInput('');
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMutation.mutate({
      convId: selectedConvId,
      content: messageInput,
      isNote: isInternalNote
    });
  };

  const applySmartReply = (reply: string) => {
    setMessageInput(reply);
    setIsInternalNote(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 flex min-h-0 bg-white border-t border-slate-200">
          {/* Column 1: Conversations List */}
          <div className="w-80 border-r border-slate-200 flex flex-col min-h-0 bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-slate-900 text-lg">Smart Inbox</h1>
                <button onClick={() => refetchConvs()} className="text-slate-400 hover:text-slate-700">
                  <RefreshCw className={`w-4 h-4 ${isLoadingConvs ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['ALL', 'EMAIL', 'WHATSAPP', 'WEBCHAT', 'SMS'].map(channel => (
                  <button
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      activeChannel === channel
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversationsList.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer transition ${
                    selectedConvId === conv.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {conv.customer ? `${conv.customer.firstName} ${conv.customer.lastName}` : 'Customer Contact'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{conv.lastMessageAt}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium truncate mt-0.5">{conv.customer?.company?.name || 'Enterprise Account'}</p>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{conv.subject || 'Customer Conversation'}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      conv.channelType === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                      conv.channelType === 'EMAIL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {conv.channelType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Message Thread View */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  {activeConv?.customer ? `${activeConv.customer.firstName} ${activeConv.customer.lastName}` : 'Customer Contact'}
                </h2>
                <p className="text-xs text-slate-500">{activeConv?.customer?.company?.name} • {activeConv?.subject}</p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                {activeConv?.channelType} Channel
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesList.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${msg.senderType === 'AGENT' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700">{msg.senderType === 'AGENT' ? 'Alex Morgan' : 'Customer'}</span>
                    {msg.isInternalNote && <span className="bg-amber-100 text-amber-800 font-bold px-1.5 rounded">Internal Note</span>}
                  </div>
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.isInternalNote
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : msg.senderType === 'AGENT'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsInternalNote(false)}
                    className={`font-semibold transition ${!isInternalNote ? 'text-blue-600 underline' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Reply to Customer ({activeConv?.channelType})
                  </button>
                  <button
                    onClick={() => setIsInternalNote(true)}
                    className={`font-semibold flex items-center gap-1 transition ${isInternalNote ? 'text-amber-600 underline' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Lock className="w-3 h-3" /> Internal Agent Note
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder={isInternalNote ? "Write internal note for sales/support team..." : `Type ${activeConv?.channelType} response...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className={`w-full border rounded-xl p-3 text-sm focus:outline-none transition ${
                    isInternalNote ? 'bg-amber-50/50 border-amber-300 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <button type="button" className="p-1.5 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50 ${
                      isInternalNote ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> {sendMutation.isPending ? 'Sending...' : isInternalNote ? 'Log Note' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Column 3: AI Assistant */}
          <div className="w-80 border-l border-slate-200 bg-white p-5 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">AI Assistant & Smart Replies</h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live AI Summary</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Customer is inquiring about expanding team seats by 5 sales reps and requesting custom SLA rules.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Smart Reply Suggestions
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => applySmartReply('Hi Sarah, yes! You can easily scale your workspace with 5 additional seats directly from Settings > Billing.')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-900 transition leading-snug"
                >
                  "Hi Sarah, yes! You can easily scale your workspace with 5 additional seats..."
                </button>
                <button
                  onClick={() => applySmartReply('Hello Sarah, I can prepare a custom enterprise add-on proposal for the 5 seats + custom SLA rules today.')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-900 transition leading-snug"
                >
                  "Hello Sarah, I can prepare a custom enterprise add-on proposal today..."
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
