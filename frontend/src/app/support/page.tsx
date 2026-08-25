'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { LifeBuoy, Plus, Clock, CheckCircle2, AlertTriangle, ShieldCheck, User, Building } from 'lucide-react';

export default function SupportPage() {
  const [tickets, setTickets] = useState([
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-1082',
      customerName: 'Sarah Jenkins',
      company: 'TechCorp Solutions',
      subject: 'Webhook Configuration for WhatsApp Events',
      priority: 'HIGH',
      status: 'OPEN',
      assignedAgent: 'Alex Morgan',
      slaResponseTime: 'In 12 mins',
      slaResolutionTime: 'In 3 hours',
      slaBreached: false,
    },
    {
      id: 'tkt-2',
      ticketNumber: 'TKT-1081',
      customerName: 'Elena Rostova',
      company: 'Starlight Logistics',
      subject: 'API Key Renewal Prior to Billing Cycle',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      assignedAgent: 'Support Team',
      slaResponseTime: 'Responded (4m ago)',
      slaResolutionTime: 'In 45 mins',
      slaBreached: false,
    },
    {
      id: 'tkt-3',
      ticketNumber: 'TKT-1079',
      customerName: 'Michael Chang',
      company: 'Global Retail Network',
      subject: 'CSV Customer Import Column Mapping',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      assignedAgent: 'Alex Morgan',
      slaResponseTime: 'Met',
      slaResolutionTime: 'Met',
      slaBreached: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    customerName: '',
    company: '',
    priority: 'MEDIUM',
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newTicket.customerName || 'Enterprise Account',
      company: newTicket.company || 'Enterprise Account',
      subject: newTicket.subject,
      priority: newTicket.priority,
      status: 'OPEN',
      assignedAgent: 'Alex Morgan',
      slaResponseTime: 'In 15 mins',
      slaResolutionTime: 'In 4 hours',
      slaBreached: false,
    };

    setTickets([created, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: '', description: '', customerName: '', company: '', priority: 'MEDIUM' });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Support Ticket
            </button>
          </div>

          {/* SLA Performance Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Tickets</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{tickets.length}</p>
              </div>
              <LifeBuoy className="w-8 h-8 text-blue-600" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Open Tickets</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{tickets.filter(t => t.status !== 'RESOLVED').length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Resolved</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">SLA Compliance</p>
                <p className="text-2xl font-black text-blue-600 mt-1">98.4%</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Tickets Directory Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Ticket # & Subject</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">SLA Timers</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((tkt) => (
                    <tr key={tkt.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <span className="text-xs font-mono text-blue-600 font-bold block">{tkt.ticketNumber}</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{tkt.subject}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-800">
                        <p className="font-semibold text-slate-900">{tkt.customerName}</p>
                        <p className="text-slate-500">{tkt.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          tkt.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          tkt.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tkt.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs space-y-1">
                        <p className="text-slate-600">
                          <span className="text-slate-400">Response SLA:</span> <span className="font-semibold text-slate-800">{tkt.slaResponseTime}</span>
                        </p>
                        <p className="text-slate-600">
                          <span className="text-slate-400">Resolution SLA:</span> <span className="font-semibold text-slate-800">{tkt.slaResolutionTime}</span>
                        </p>
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
                            onClick={() => handleUpdateStatus(tkt.id, 'RESOLVED')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
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

      {/* Create Ticket Modal */}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Sarah Jenkins"
                    value={newTicket.customerName}
                    onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="TechCorp Solutions"
                    value={newTicket.company}
                    onChange={(e) => setNewTicket({ ...newTicket, company: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority (SLA Tier)</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="LOW">LOW (4h response / 24h resolution)</option>
                  <option value="MEDIUM">MEDIUM (1h response / 12h resolution)</option>
                  <option value="HIGH">HIGH (30m response / 4h resolution)</option>
                  <option value="URGENT">URGENT (15m response / 2h resolution)</option>
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
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
