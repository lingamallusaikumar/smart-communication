'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Target, Plus, UserCheck, Flame, ArrowRight, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, LeadData } from '@/services/leadService';

export default function LeadsPage() {
  const queryClient = useQueryClient();

  const demoLeads: LeadData[] = [
    {
      id: 'lead-1',
      firstName: 'David',
      lastName: 'Miller',
      email: 'd.miller@fintech.io',
      companyName: 'FinTech Dynamics',
      status: 'QUALIFIED',
      score: 85,
      estimatedValue: 35000,
    },
    {
      id: 'lead-2',
      firstName: 'Jessica',
      lastName: 'Alba',
      email: 'jessica@cloudscale.net',
      companyName: 'CloudScale Networks',
      status: 'PROPOSAL',
      score: 92,
      estimatedValue: 60000,
    },
  ];

  // Fetch Leads from Backend REST API
  const { data: apiLeads, isLoading, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: leadService.getLeads,
  });

  const leads = (apiLeads && apiLeads.length > 0) ? apiLeads : demoLeads;

  // Convert Lead Mutation
  const convertMutation = useMutation({
    mutationFn: (id: string) => leadService.convertLeadToCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const handleConvertLead = (id: string) => {
    convertMutation.mutate(id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lead Pipeline & Qualification</h1>
              <p className="text-xs text-slate-500 mt-1">Track inbound lead stages, lead scoring, and convert qualified leads to active customers.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg"
                title="Refresh Leads"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md">
                <Plus className="w-4 h-4" /> Create Lead
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Lead Contact</th>
                    <th className="px-6 py-3.5">Company</th>
                    <th className="px-6 py-3.5">Lead Score</th>
                    <th className="px-6 py-3.5">Est. Value</th>
                    <th className="px-6 py-3.5">Status Stage</th>
                    <th className="px-6 py-3.5 text-right">Conversion Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <p>{lead.firstName} {lead.lastName}</p>
                        <p className="text-xs text-slate-400 font-normal">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {lead.companyName || 'Independent Lead'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                          (lead.score || 80) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Flame className="w-3.5 h-3.5 text-amber-500" /> {lead.score || 80} / 100
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">${(lead.estimatedValue || 25000).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {lead.status === 'CONVERTED' ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <UserCheck className="w-4 h-4" /> Converted to Customer
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConvertLead(lead.id!)}
                            disabled={convertMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 ml-auto shadow-sm disabled:opacity-50"
                          >
                            Convert to 360 Customer <ArrowRight className="w-3.5 h-3.5" />
                          </button>
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
    </div>
  );
}
