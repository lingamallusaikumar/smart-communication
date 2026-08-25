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
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function Customer360ProfilePage({ params }: { params: { id: string } }) {
  const [noteContent, setNoteContent] = useState('');
  
  // Mock customer 360 data
  const [customer, setCustomer] = useState({
    id: params.id || 'cust-101',
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
  });

  const [timeline, setTimeline] = useState([
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
      time: ' Yesterday',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'act-4',
      type: 'MEETING',
      title: 'Executive Demo Call Completed',
      description: 'Showcased Smart Communication Hub and visual workflow automation builder.',
      author: 'Alex Morgan',
      time: '3 days ago',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'act-3',
      type: 'WHATSAPP_SENT',
      title: 'WhatsApp Conversation Initiated',
      description: 'Confirmed availability for product demo call on Thursday.',
      author: 'Sarah Jenkins',
      time: '4 days ago',
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'act-2',
      type: 'EMAIL_SENT',
      title: 'Welcome Email Sent',
      description: 'Sent SmartCommunication CRM enterprise product overview presentation.',
      author: 'Alex Morgan',
      time: '5 days ago',
      icon: Mail,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'act-1',
      type: 'CUSTOMER_CREATED',
      title: 'Customer Profile Created',
      description: 'Lead converted and added to organization CRM repository.',
      author: 'System',
      time: '6 days ago',
      icon: User,
      color: 'text-slate-600 bg-slate-100',
    },
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'NOTE_ADDED',
      title: 'Internal Agent Note Added',
      description: noteContent,
      author: 'Alex Morgan',
      time: 'Just now',
      icon: FileText,
      color: 'text-slate-700 bg-slate-100',
    };

    setTimeline([newActivity, ...timeline]);
    setNoteContent('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/customers" className="hover:text-slate-800">Customers</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">{customer.firstName} {customer.lastName}</span>
          </div>

          {/* Header Card */}
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
                <div className="flex items-center gap-2 mt-2">
                  {customer.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                      <Tag className="w-3 h-3 text-slate-400" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/inbox" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md shadow-blue-600/20 transition">
                <MessageSquare className="w-4 h-4" /> Start Conversation
              </Link>
            </div>
          </div>

          {/* Profile Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Metadata & Smart Customer Memory */}
            <div className="space-y-6">
              {/* Customer Contact Details */}
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

              {/* Smart Customer Memory Bank (AI Intelligence) */}
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

                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 block">Detected Product Interest</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customer.memory.productInterests.map(item => (
                        <span key={item} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 360-Degree Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Note Card */}
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
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Post Note to 360 Timeline
                    </button>
                  </div>
                </form>
              </div>

              {/* Chronological Activity Feed */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900">360-Degree Interaction Timeline</h3>
                  <span className="text-xs text-slate-400 font-medium">{timeline.length} Activities Recorded</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {timeline.map((act) => {
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
