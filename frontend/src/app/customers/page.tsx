'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Search, Plus, User, Building, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock initial demo data
  const [customers, setCustomers] = useState([
    {
      id: 'cust-101',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@techcorp.io',
      phone: '+1 (555) 234-5678',
      company: 'TechCorp Solutions',
      jobTitle: 'VP of Engineering',
      status: 'ACTIVE',
      owner: 'Alex Morgan',
    },
    {
      id: 'cust-102',
      firstName: 'Michael',
      lastName: 'Chang',
      email: 'm.chang@globalretail.com',
      phone: '+1 (555) 876-5432',
      company: 'Global Retail Network',
      jobTitle: 'Director of IT',
      status: 'ACTIVE',
      owner: 'Taylor Swift',
    },
    {
      id: 'cust-103',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena@starlight.eu',
      phone: '+44 20 7946 0912',
      company: 'Starlight Logistics',
      jobTitle: 'Head of Operations',
      status: 'LEAD',
      owner: 'Alex Morgan',
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `cust-${Date.now()}`,
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      phone: newCustomer.phoneNumber,
      company: newCustomer.company || 'Independent',
      jobTitle: newCustomer.jobTitle || 'Contact',
      status: 'ACTIVE',
      owner: 'Alex Morgan',
    };
    setCustomers([created, ...customers]);
    setIsModalOpen(false);
    setNewCustomer({ firstName: '', lastName: '', email: '', phoneNumber: '', company: '', jobTitle: '' });
  };

  const filteredCustomers = customers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customer Directory (360°)</h1>
              <p className="text-xs text-slate-500 mt-1">Manage 360-degree customer records, contacts, and activity timelines.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
            >
              <Plus className="w-4 h-4" /> Add New Customer
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5">Company & Title</th>
                    <th className="px-6 py-3.5">Contact Info</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Account Owner</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {cust.firstName[0]}{cust.lastName[0]}
                        </div>
                        <div>
                          <p>{cust.firstName} {cust.lastName}</p>
                          <span className="text-xs text-slate-400 font-normal">ID: {cust.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> {cust.company}
                        </p>
                        <p className="text-xs text-slate-500">{cust.jobTitle}</p>
                      </td>
                      <td className="px-6 py-4 text-xs space-y-1">
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {cust.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {cust.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
                          {cust.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700">
                        {cust.owner}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/customers/${cust.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition"
                        >
                          360° Profile <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add New Customer</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company</label>
                <input
                  type="text"
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
