'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Building2, Search, Plus, Globe, Users, DollarSign } from 'lucide-react';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = [
    {
      id: 'comp-1',
      name: 'TechCorp Solutions',
      industry: 'Enterprise Software',
      website: 'www.techcorp.io',
      employees: '250-500',
      revenue: '$12,500,000',
      contactsCount: 4,
    },
    {
      id: 'comp-2',
      name: 'Global Retail Network',
      industry: 'E-commerce & Logistics',
      website: 'www.globalretail.com',
      employees: '1,000+',
      revenue: '$48,000,000',
      contactsCount: 8,
    },
    {
      id: 'comp-3',
      name: 'Starlight Logistics',
      industry: 'Freight & Supply Chain',
      website: 'www.starlight.eu',
      employees: '100-250',
      revenue: '$5,200,000',
      contactsCount: 2,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Company Directory</h1>
              <p className="text-xs text-slate-500 mt-1">Manage corporate accounts, industry metrics, and linked customer contacts.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md">
              <Plus className="w-4 h-4" /> Add Company
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div key={comp.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                    {comp.contactsCount} Linked Contacts
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{comp.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{comp.industry}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <p className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> {comp.website}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {comp.employees} Employees
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {comp.revenue} Annual Rev
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
