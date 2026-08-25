'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Target, Plus, UserCheck, Flame, Building, Mail, Phone, ArrowRight } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: 'lead-1',
      firstName: 'David',
      lastName: 'Miller',
      email: 'd.miller@fintech.io',
      company: 'FinTech Dynamics',
      status: 'QUALIFIED',
      score: 85,
      estimatedValue: '$35,000',
      source: 'Website Inbound',
    },
    {
      id: 'lead-2',
      firstName: 'Jessica',
      lastName: 'Alba',
      email: 'jessica@cloudscale.net',
      company: 'CloudScale Networks',
      status: 'PROPOSAL',
      score: 92,
      estimatedValue: '$60,000',
      source: 'LinkedIn Campaign',
    },
    {
      id: 'lead-3',
      firstName: 'Robert',
      lastName: 'Fox',
      email: 'robert@apexlogistics.com',
      company: 'Apex Logistics',
      status: 'NEW',
      score: 45,
      estimatedValue: '$18,000',
      source: 'Cold Outreach',
    },
  ]);

  const handleConvertLead = (id: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: 'CONVERTED' } : l));
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
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md">
              <Plus className="w-4 h-4" /> Create Lead
            </button>
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
                        {lead.company}
                        <span className="block text-[11px] text-slate-400 font-normal">Source: {lead.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                          lead.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Flame className="w-3.5 h-3.5 text-amber-500" /> {lead.score} / 100
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{lead.estimatedValue}</td>
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
                            onClick={() => handleConvertLead(lead.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 ml-auto shadow-sm"
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
