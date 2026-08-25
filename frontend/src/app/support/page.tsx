'use client';

import { useState, useEffect } from 'react';
import { LifeBuoy, Plus, Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, RefreshCw, X, Send, MoreVertical, Paperclip } from 'lucide-react';

interface TicketComment {
  id: string;
  authorName: string;
  authorRole: string; // CUSTOMER, AGENT, ADMIN
  content: string;
  internal: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: string; // OPEN, IN_PROGRESS, PENDING_CUSTOMER, RESOLVED, CLOSED
  priority: string; // LOW, MEDIUM, HIGH, URGENT
  category: string;
  assignedToName: string | null;
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
}

interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  activeTickets: number;
}

const DEMO_TICKETS: SupportTicket[] = [
  { id: '1', ticketNumber: 'TCK-1001', customerName: 'Alex Morgan', customerEmail: 'alex@acme.com', subject: 'Cannot access my billing portal', description: 'When I click on the billing section, I just get a spinning wheel.', status: 'OPEN', priority: 'HIGH', category: 'BILLING', assignedToName: null, comments: [], createdAt: '2026-08-25T10:00:00Z', updatedAt: '2026-08-25T10:00:00Z' },
  { id: '2', ticketNumber: 'TCK-1002', customerName: 'Sarah Chen', customerEmail: 'sarah@globetech.com', subject: 'How do I set up a drip sequence?', description: 'I am trying to create an onboarding sequence but the UI is confusing.', status: 'IN_PROGRESS', priority: 'MEDIUM', category: 'TECHNICAL', assignedToName: 'Agent Smith', comments: [
    { id: 'c1', authorName: 'Sarah Chen', authorRole: 'CUSTOMER', content: 'I am trying to create an onboarding sequence but the UI is confusing.', internal: false, createdAt: '2026-08-24T14:00:00Z' },
    { id: 'c2', authorName: 'Agent Smith', authorRole: 'AGENT', content: 'Hi Sarah, here is a link to our documentation on setting up sequences. Let me know if you need a walkthrough.', internal: false, createdAt: '2026-08-24T14:30:00Z' }
  ], createdAt: '2026-08-24T14:00:00Z', updatedAt: '2026-08-24T14:30:00Z' },
  { id: '3', ticketNumber: 'TCK-1003', customerName: 'Mike Johnson', customerEmail: 'mike@techstart.io', subject: 'Feature Request: Dark Mode', description: 'Please add dark mode to the CRM.', status: 'PENDING_CUSTOMER', priority: 'LOW', category: 'FEATURE_REQUEST', assignedToName: 'Agent Smith', comments: [], createdAt: '2026-08-20T09:00:00Z', updatedAt: '2026-08-22T11:00:00Z' },
  { id: '4', ticketNumber: 'TCK-1004', customerName: 'Lisa Park', customerEmail: 'lisa@innovate.co', subject: 'CRM keeps crashing on mobile', description: 'Whenever I open a deal on the mobile site, it crashes.', status: 'RESOLVED', priority: 'URGENT', category: 'BUG', assignedToName: 'Agent Jones', comments: [], createdAt: '2026-08-15T16:00:00Z', updatedAt: '2026-08-16T10:00:00Z' },
  { id: '5', ticketNumber: 'TCK-1005', customerName: 'John Doe', customerEmail: 'john@example.com', subject: 'Where is my invoice?', description: 'I paid last week but didn\'t get a receipt.', status: 'CLOSED', priority: 'MEDIUM', category: 'BILLING', assignedToName: 'Agent Jones', comments: [], createdAt: '2026-08-10T12:00:00Z', updatedAt: '2026-08-12T15:00:00Z' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: { label: 'Open', color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-3 h-3" /> },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
  PENDING_CUSTOMER: { label: 'Pending Customer', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-600', icon: <CheckCircle className="w-3 h-3" /> },
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-gray-500 bg-gray-100',
  MEDIUM: 'text-blue-700 bg-blue-100',
  HIGH: 'text-amber-700 bg-amber-100',
  URGENT: 'text-red-700 bg-red-100',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(DEMO_TICKETS);
  const [filtered, setFiltered] = useState<SupportTicket[]>(DEMO_TICKETS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({ customerName: '', customerEmail: '', subject: '', description: '', priority: 'MEDIUM', category: 'GENERAL' });

  const metrics: SupportMetrics = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'OPEN').length,
    inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolvedTickets: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
    activeTickets: tickets.filter(t => ['OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER'].includes(t.status)).length,
  };

  useEffect(() => {
    let result = tickets;
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.ticketNumber.toLowerCase().includes(q) || 
        t.subject.toLowerCase().includes(q) || 
        t.customerName.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, tickets]);

  const handleCreateTicket = async () => {
    if (!form.subject || !form.customerEmail) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newTicket: SupportTicket = {
      id: String(Date.now()),
      ticketNumber: `TCK-${1000 + tickets.length + 1}`,
      customerName: form.customerName || form.customerEmail.split('@')[0],
      customerEmail: form.customerEmail,
      subject: form.subject,
      description: form.description,
      status: 'OPEN',
      priority: form.priority,
      category: form.category,
      assignedToName: null,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
    setShowCreateModal(false);
    setForm({ customerName: '', customerEmail: '', subject: '', description: '', priority: 'MEDIUM', category: 'GENERAL' });
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !viewTicket) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    
    const comment: TicketComment = {
      id: String(Date.now()),
      authorName: 'Support Agent',
      authorRole: 'AGENT',
      content: newComment,
      internal: isInternalComment,
      createdAt: new Date().toISOString()
    };
    
    const updatedTicket = {
      ...viewTicket,
      status: isInternalComment ? viewTicket.status : 'PENDING_CUSTOMER',
      assignedToName: viewTicket.assignedToName || 'Support Agent',
      updatedAt: new Date().toISOString(),
      comments: [...viewTicket.comments, comment]
    };
    
    setTickets(prev => prev.map(t => t.id === viewTicket.id ? updatedTicket : t));
    setViewTicket(updatedTicket);
    setNewComment('');
    setIsInternalComment(false);
    setLoading(false);
  };

  const updateTicketStatus = (status: string) => {
    if (!viewTicket) return;
    const updatedTicket = { ...viewTicket, status, updatedAt: new Date().toISOString() };
    setTickets(prev => prev.map(t => t.id === viewTicket.id ? updatedTicket : t));
    setViewTicket(updatedTicket);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><LifeBuoy className="w-8 h-8 text-blue-600" />Help Desk</h1>
          <p className="text-gray-500 mt-1">Manage customer support tickets, inquiries, and issues</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> New Ticket
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Active Tickets</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.activeTickets}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Unassigned (Open)</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.openTickets}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">In Progress</span>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.inProgressTickets}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Resolved</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.resolvedTickets}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main List */}
        <div className={`flex-1 ${viewTicket ? 'hidden lg:block lg:w-1/2 xl:w-2/3' : 'w-full'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING_CUSTOMER">Pending Customer</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 hidden md:table-cell">Status</th>
                  <th className="px-6 py-4 hidden md:table-cell">Assignee</th>
                  <th className="px-6 py-4 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => {
                  const st = STATUS_CONFIG[t.status];
                  const pr = PRIORITY_COLORS[t.priority];
                  return (
                    <tr key={t.id} onClick={() => setViewTicket(t)} className={`cursor-pointer hover:bg-gray-50 transition-colors ${viewTicket?.id === t.id ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold text-gray-900">{t.ticketNumber}</span>
                          <span className="text-xs text-gray-500 mt-1">{t.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold text-gray-900 line-clamp-1">{t.subject}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${pr}`}>{t.priority} • {t.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color}`}>{st.icon}{st.label}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{t.assignedToName || 'Unassigned'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-gray-500">{new Date(t.updatedAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No tickets found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Details View */}
        {viewTicket && (
          <div className="w-full lg:w-1/2 xl:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
              <div>
                <h2 className="font-bold text-gray-900">{viewTicket.ticketNumber}</h2>
                <p className="text-xs text-gray-500">From: {viewTicket.customerName} ({viewTicket.customerEmail})</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500"><MoreVertical className="w-5 h-5" /></button>
                <button onClick={() => setViewTicket(null)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 lg:hidden"><X className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
              <select value={viewTicket.status} onChange={e => updateTicketStatus(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">Assignee: {viewTicket.assignedToName || 'Unassigned'}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Original Post */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{viewTicket.subject}</h3>
                  <span className="text-xs text-gray-400">{new Date(viewTicket.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewTicket.description}</p>
              </div>

              {/* Comments */}
              {viewTicket.comments.map(c => (
                <div key={c.id} className={`p-4 rounded-xl border ${c.internal ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{c.authorName}</span>
                      <span className="text-[10px] font-bold bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{c.authorRole}</span>
                      {c.internal && <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">INTERNAL NOTE</span>}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={isInternalComment} onChange={e => setIsInternalComment(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                  Internal Note (hidden from customer)
                </label>
              </div>
              <div className="relative">
                <textarea 
                  value={newComment} 
                  onChange={e => setNewComment(e.target.value)} 
                  placeholder={isInternalComment ? "Write an internal note for your team..." : "Reply to the customer..."}
                  className={`w-full border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 resize-none ${isInternalComment ? 'border-amber-300 bg-amber-50 focus:ring-amber-500' : 'border-gray-200 focus:ring-blue-500'}`}
                  rows={3}
                />
                <button onClick={handleAddComment} disabled={loading || !newComment.trim()} className={`absolute right-3 bottom-3 p-2 rounded-lg text-white disabled:opacity-50 ${isInternalComment ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-900">Create Ticket</h2></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label><input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label><input type="email" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="GENERAL">General</option><option value="BILLING">Billing</option><option value="TECHNICAL">Technical</option><option value="FEATURE_REQUEST">Feature</option><option value="BUG">Bug</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={handleCreateTicket} disabled={loading || !form.subject || !form.customerEmail} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
