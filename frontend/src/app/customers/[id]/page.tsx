'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare, 
  Plus, 
  Bot, 
  Calendar, 
  DollarSign, 
  LifeBuoy, 
  FileText,
  Tag,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';

export default function Customer360ProfilePage({ params }: { params: { id: string } }) {
  const [noteContent, setNoteContent] = useState('');
  const queryClient = useQueryClient();

  const customerId = params.id || 'cust-101';

  // Demo Fallbacks
  const demoCustomer = {
    id: customerId,
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.j@techcorp.io',
    phone: '+1 (555) 234-5678',
    company: 'TechCorp Solutions',
    jobTitle: 'VP of Engineering',
    status: 'ACTIVE',
    owner: 'Alex Morgan',
    tags: ['VIP Enterprise', 'WhatsApp Preferred', 'Decision Maker'],
    memory: {
      preferredChannel: 'WhatsApp',
      preferredTime: '10:00 AM – 12:00 PM',
      productInterests: ['Enterprise CRM Package', 'AI Intelligence Add-on'],
      sentiment: 'POSITIVE',
    }
  };

  const demoTimeline = [
    {
      id: 'act-6',
      type: 'SUPPORT_TICKET',
      title: 'Support Ticket #T-1082 Created',
      description: 'Customer submitted ticket regarding API webhooks configuration for WhatsApp events.',
      author: 'Sarah Jenkins',
      time: '2 hours ago',
      icon: LifeBuoy,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'act-5',
      type: 'DEAL_CREATED',
      title: 'Deal "TechCorp 50-Seat Enterprise License" Created',
      description: 'Sales deal created with value $45,000 in Negotiation stage.',
      author: 'Alex Morgan',
      time: 'Yesterday',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  // Fetch Customer 360 & Timeline from REST API
  const { data: apiCustomer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerService.getCustomerById(customerId),
    enabled: !!customerId,
  });

  const { data: apiTimeline, refetch: refetchTimeline } = useQuery({
    queryKey: ['customer-timeline', customerId],
    queryFn: () => customerService.getCustomerTimeline(customerId),
    enabled: !!customerId,
  });

  const customer = apiCustomer ? {
    id: apiCustomer.id || customerId,
    firstName: apiCustomer.firstName,
    lastName: apiCustomer.lastName,
    email: apiCustomer.email,
    phone: apiCustomer.phoneNumber || '+1 (555) 234-5678',
    company: apiCustomer.company?.name || 'TechCorp Solutions',
    jobTitle: apiCustomer.jobTitle || 'VP of Engineering',
    status: apiCustomer.status || 'ACTIVE',
    owner: apiCustomer.assignedOwner ? `${apiCustomer.assignedOwner.firstName} ${apiCustomer.assignedOwner.lastName}` : 'Alex Morgan',
    tags: demoCustomer.tags,
    memory: demoCustomer.memory,
  } : demoCustomer;

  const timeline = (apiTimeline && apiTimeline.length > 0) ? apiTimeline.map((item: any) => ({
    id: item.id,
    type: item.activityType,
    title: item.title,
    description: item.description,
    author: item.actor ? `${item.actor.firstName} ${item.actor.lastName}` : 'System',
    time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
  })) : demoTimeline;

  // Add Note Mutation
  const addNoteMutation = useMutation({
    mutationFn: (content: string) => customerService.addCustomerNote(customerId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-timeline', customerId] });
      setNoteContent('');
    },
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addNoteMutation.mutate(noteContent);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Link href="/customers" className="hover:text-slate-800">Customers</Link>
              <span>/</span>
              <span className="text-slate-800 font-bold">{customer.firstName} {customer.lastName}</span>
            </div>
            <button
              onClick={() => refetchTimeline()}
              className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-slate-900"
              title="Refresh Timeline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                {customer.firstName[0]}{customer.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{customer.firstName} {customer.lastName}</h1>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {customer.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 mt-0.5 flex items-center gap-2">
                  <span>{customer.jobTitle}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{customer.company}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/inbox" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition">
                <MessageSquare className="w-4 h-4" /> Start Conversation
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Contact Specifications</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Work Email</span>
                    <span className="font-medium text-slate-800 flex items-center gap-2 mt-0.5">
                      <Mail className="w-4 h-4 text-slate-400" /> {customer.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Phone Number</span>
                    <span className="font-medium text-slate-800 flex items-center gap-2 mt-0.5">
                      <Phone className="w-4 h-4 text-slate-400" /> {customer.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Assigned Owner</span>
                    <span className="font-medium text-slate-800 flex items-center gap-2 mt-0.5">
                      <User className="w-4 h-4 text-slate-400" /> {customer.owner}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-6 shadow-md border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                  <h3 className="font-bold">Smart Customer Memory Bank</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Preferred Channel</span>
                    <span className="font-bold text-emerald-400">{customer.memory.preferredChannel}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Preferred Window</span>
                    <span className="font-semibold text-slate-200">{customer.memory.preferredTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Log Internal Note or Activity</h3>
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Type internal note, phone call summary, or customer insight..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addNoteMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" /> Post Note to 360 Timeline
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900">360-Degree Interaction Timeline</h3>
                  <span className="text-xs text-slate-400 font-medium">{timeline.length} Activities Recorded</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {timeline.map((act: any) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="relative flex items-start gap-4">
                        <div className={`absolute -left-6 p-1.5 rounded-full border-2 border-white shadow-sm ${act.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-sm text-slate-900">{act.title}</p>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {act.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                          <span className="text-[10px] text-slate-400 font-medium block pt-1">Logged by: {act.author}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
