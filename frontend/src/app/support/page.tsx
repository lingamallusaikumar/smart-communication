'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { LifeBuoy, Plus, Clock, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService, TicketData } from '@/services/supportService';

export default function SupportPage() {
  const queryClient = useQueryClient();

  const demoTickets: TicketData[] = [
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-1082',
      subject: 'Webhook Configuration for WhatsApp Events',
      priority: 'HIGH',
      status: 'OPEN',
      customer: { firstName: 'Sarah', lastName: 'Jenkins', company: { name: 'TechCorp Solutions' } }
    },
    {
      id: 'tkt-2',
      ticketNumber: 'TKT-1081',
      subject: 'API Key Renewal Prior to Billing Cycle',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      customer: { firstName: 'Elena', lastName: 'Rostova', company: { name: 'Starlight Logistics' } }
    },
    {
      id: 'tkt-3',
      ticketNumber: 'TKT-1079',
      subject: 'CSV Customer Import Column Mapping',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      customer: { firstName: 'Michael', lastName: 'Chang', company: { name: 'Global Retail Network' } }
    },
  ];

  // Fetch Tickets & Metrics from REST API
  const { data: apiTickets, isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: supportService.getTickets,
  });

  const { data: metricsData } = useQuery({
    queryKey: ['support-metrics'],
    queryFn: supportService.getSupportMetrics,
  });

  const tickets = (apiTickets && apiTickets.length > 0) ? apiTickets : demoTickets;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

  // Create Ticket Mutation
  const createMutation = useMutation({
    mutationFn: (data: Partial<TicketData>) => supportService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-metrics'] });
      setIsModalOpen(false);
      setNewTicket({ subject: '', description: '', priority: 'MEDIUM' });
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => supportService.updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-metrics'] });
    },
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      subject: newTicket.subject,
      description: newTicket.description,
      priority: newTicket.priority,
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Support Ticket & SLA Management</h1>
              <p className="text-xs text-slate-500 mt-1">Track customer support tickets, automated SLA timers, and agent resolution metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900"
                title="Refresh Support Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Create Support Ticket
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Tickets</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{metricsData?.totalTickets || tickets.length}</p>
              </div>
              <LifeBuoy className="w-8 h-8 text-blue-600" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Open Tickets</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{metricsData?.openTickets || tickets.filter(t => t.status !== 'RESOLVED').length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Resolved</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{metricsData?.resolvedTickets || tickets.filter(t => t.status === 'RESOLVED').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">SLA Compliance</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{metricsData?.slaCompliancePercentage || 98.4}%</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Ticket # & Subject</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((tkt) => (
                    <tr key={tkt.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <span className="text-xs font-mono text-blue-600 font-bold block">{tkt.ticketNumber || 'TKT-1082'}</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{tkt.subject}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-800">
                        <p className="font-semibold text-slate-900">
                          {tkt.customer ? `${tkt.customer.firstName} ${tkt.customer.lastName}` : 'Sarah Jenkins'}
                        </p>
                        <p className="text-slate-500">{tkt.customer?.company?.name || 'TechCorp Solutions'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          tkt.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          tkt.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tkt.priority || 'MEDIUM'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          tkt.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          tkt.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tkt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {tkt.status !== 'RESOLVED' ? (
                          <button
                            onClick={() => handleUpdateStatus(tkt.id!, 'RESOLVED')}
                            disabled={updateStatusMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition disabled:opacity-50"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Ticket Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Webhook event failure"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority (SLA Tier)</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe customer issue..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-md disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
