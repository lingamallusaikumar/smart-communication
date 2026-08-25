'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Globe, 
  Search, 
  Send, 
  Paperclip, 
  Bot, 
  FileText, 
  Lock, 
  Check, 
  Sparkles, 
  Tag, 
  User 
} from 'lucide-react';

export default function SmartInboxPage() {
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [selectedConvId, setSelectedConvId] = useState('conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Mock Conversations List
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      customerName: 'Sarah Jenkins',
      company: 'TechCorp Solutions',
      channel: 'WHATSAPP',
      subject: 'Custom SLA & Seat Expansion Query',
      lastMessage: 'Could you please confirm if we can add 5 additional sales reps to our current plan?',
      lastTime: '10:42 AM',
      unread: true,
      sentiment: 'POSITIVE',
      intent: 'Pricing & Seat Expansion',
      aiSummary: 'Customer is inquiring about expanding team seats by 5 sales reps and requesting custom SLA rules.',
      smartReplies: [
        'Hi Sarah, yes! You can easily scale your workspace with 5 additional seats directly from Settings > Billing.',
        'Hello Sarah, I can prepare a custom enterprise add-on proposal for the 5 seats + custom SLA rules today.'
      ]
    },
    {
      id: 'conv-2',
      customerName: 'Michael Chang',
      company: 'Global Retail Network',
      channel: 'EMAIL',
      subject: 'Revised Contract Review',
      lastMessage: 'Thank you for sending over the revised contract. We are reviewing it with legal.',
      lastTime: '9:15 AM',
      unread: false,
      sentiment: 'NEUTRAL',
      intent: 'Contract Review',
      aiSummary: 'Legal team reviewing contract terms. Expected feedback by end of day.',
      smartReplies: [
        'Thanks Michael, please let us know if your legal team has any questions regarding section 4.',
        'Sounds great Michael! Looking forward to your update.'
      ]
    },
    {
      id: 'conv-3',
      customerName: 'Elena Rostova',
      company: 'Starlight Logistics',
      channel: 'WEBCHAT',
      subject: 'API Key Integration Question',
      lastMessage: 'Is there a free trial option available for the AI Smart Customer Memory module?',
      lastTime: 'Yesterday',
      unread: false,
      sentiment: 'URGENT',
      intent: 'Product Inquiry',
      aiSummary: 'User requesting trial access to Smart Memory module.',
      smartReplies: [
        'Hi Elena, I have activated a 14-day free trial for the AI Intelligence suite on your workspace!',
        'Hello Elena, I can schedule a quick 10-min walkthrough call to show you the Smart Memory feature.'
      ]
    }
  ]);

  // Mock Active Messages
  const [messages, setMessages] = useState<Record<string, Array<any>>>({
    'conv-1': [
      { id: 'm1', sender: 'CUSTOMER', name: 'Sarah Jenkins', content: 'Hi Alex, we are really enjoying SmartCommunication CRM so far!', time: '10:30 AM', channel: 'WHATSAPP', isInternal: false },
      { id: 'm2', sender: 'AGENT', name: 'Alex Morgan', content: 'Glad to hear that Sarah! How can I assist you today?', time: '10:35 AM', channel: 'WHATSAPP', isInternal: false },
      { id: 'm3', sender: 'CUSTOMER', name: 'Sarah Jenkins', content: 'Could you please confirm if we can add 5 additional sales reps to our current plan?', time: '10:42 AM', channel: 'WHATSAPP', isInternal: false },
    ],
    'conv-2': [
      { id: 'm10', sender: 'AGENT', name: 'Alex Morgan', content: 'Attached the revised enterprise contract for your review.', time: '9:00 AM', channel: 'EMAIL', isInternal: false },
      { id: 'm11', sender: 'CUSTOMER', name: 'Michael Chang', content: 'Thank you for sending over the revised contract. We are reviewing it with legal.', time: '9:15 AM', channel: 'EMAIL', isInternal: false },
    ],
    'conv-3': [
      { id: 'm20', sender: 'CUSTOMER', name: 'Elena Rostova', content: 'Is there a free trial option available for the AI Smart Customer Memory module?', time: 'Yesterday', channel: 'WEBCHAT', isInternal: false },
    ]
  });

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activeMessages = messages[selectedConvId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'AGENT',
      name: 'Alex Morgan',
      content: messageInput,
      time: 'Just now',
      channel: activeConv.channel,
      isInternal: isInternalNote
    };

    setMessages({
      ...messages,
      [selectedConvId]: [...(messages[selectedConvId] || []), newMsg]
    });

    setMessageInput('');
  };

  const applySmartReply = (reply: string) => {
    setMessageInput(reply);
    setIsInternalNote(false);
  };

  const filteredConversations = conversations.filter(c => 
    activeChannel === 'ALL' || c.channel === activeChannel
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 flex min-h-0 bg-white border-t border-slate-200">
          {/* Column 1: Conversations List */}
          <div className="w-80 border-r border-slate-200 flex flex-col min-h-0 bg-slate-50/50">
            {/* Header & Channel Filter Bar */}
            <div className="p-4 border-b border-slate-200 space-y-3">
              <h1 className="font-bold text-slate-900 text-lg">Smart Inbox</h1>
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

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer transition ${
                    selectedConvId === conv.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm truncate">{conv.customerName}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium truncate mt-0.5">{conv.company}</p>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      conv.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                      conv.channel === 'EMAIL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {conv.channel}
                    </span>
                    {conv.sentiment && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                        {conv.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Message Thread View */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Thread Header */}
            <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">{activeConv.customerName}</h2>
                <p className="text-xs text-slate-500">{activeConv.company} • {activeConv.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                  {activeConv.channel} Channel
                </span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'AGENT' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700">{msg.name}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                    {msg.isInternal && <span className="bg-amber-100 text-amber-800 font-bold px-1.5 rounded">Internal Note</span>}
                  </div>
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.isInternal
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : msg.sender === 'AGENT'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsInternalNote(false)}
                    className={`font-semibold transition ${!isInternalNote ? 'text-blue-600 underline' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Reply to Customer ({activeConv.channel})
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
                  placeholder={isInternalNote ? "Write internal note for sales/support team..." : `Type ${activeConv.channel} response...`}
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
                    className={`px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-md transition ${
                      isInternalNote ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> {isInternalNote ? 'Log Note' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Column 3: AI Customer Intelligence Side-Panel */}
          <div className="w-80 border-l border-slate-200 bg-white p-5 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">AI Assistant & Smart Replies</h3>
            </div>

            {/* Conversation Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live AI Summary</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {activeConv.aiSummary}
              </p>
            </div>

            {/* Intent & Sentiment */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                <span className="text-slate-600">Customer Intent</span>
                <span className="font-bold text-blue-700">{activeConv.intent}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-slate-600">Sentiment Score</span>
                <span className="font-bold text-emerald-700">{activeConv.sentiment}</span>
              </div>
            </div>

            {/* Contextual Smart Replies */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Smart Reply Suggestions
              </span>
              <div className="space-y-2">
                {activeConv.smartReplies?.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => applySmartReply(reply)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-900 transition leading-snug"
                  >
                    "{reply}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
