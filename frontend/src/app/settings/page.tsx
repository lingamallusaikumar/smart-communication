'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Building, Users, ShieldCheck, Key, Lock, Globe, Mail, CheckCircle2, UserPlus } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'ORG' | 'USERS' | 'SECURITY' | 'AUDIT'>('ORG');

  const [users] = useState([
    { id: 'usr-1', name: 'Alex Morgan', email: 'alex@acme.com', role: 'ORG_ADMIN', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Taylor Swift', email: 'taylor@acme.com', role: 'SALES_MANAGER', status: 'ACTIVE' },
    { id: 'usr-3', name: 'Jordan Belfort', email: 'jordan@acme.com', role: 'SALES_REP', status: 'ACTIVE' },
    { id: 'usr-4', name: 'Sam Altman', email: 'sam@acme.com', role: 'SUPPORT_AGENT', status: 'ACTIVE' },
  ]);

  const [auditLogs] = useState([
    { id: 'log-1', action: 'USER_LOGIN', user: 'Alex Morgan', ip: '192.168.1.45', time: '10 mins ago' },
    { id: 'log-2', action: 'DEAL_STAGE_UPDATED', user: 'Taylor Swift', ip: '192.168.1.88', time: '1 hour ago' },
    { id: 'log-3', action: 'CUSTOMER_CONVERTED', user: 'Jordan Belfort', ip: '192.168.1.12', time: '3 hours ago' },
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Organization & Security Administration</h1>
            <p className="text-xs text-slate-500 mt-1">Manage organization details, team roles, permissions, and audit logs.</p>
          </div>

          {/* Settings Tabs */}
          <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('ORG')}
              className={`pb-3 transition border-b-2 ${activeTab === 'ORG' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Organization Details
            </button>
            <button
              onClick={() => setActiveTab('USERS')}
              className={`pb-3 transition border-b-2 ${activeTab === 'USERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Team Members & Roles ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('SECURITY')}
              className={`pb-3 transition border-b-2 ${activeTab === 'SECURITY' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Security & JWT Token Policy
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`pb-3 transition border-b-2 ${activeTab === 'AUDIT' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              System Audit Logs
            </button>
          </div>

          {/* Tab 1: Organization Details */}
          {activeTab === 'ORG' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Organization Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Corporation"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Custom Domain</label>
                  <input
                    type="text"
                    defaultValue="acme.smartcomm.io"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subscription Plan</label>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full inline-block">
                    ENTERPRISE AI PLATFORM
                  </span>
                </div>
                <div className="pt-2">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users & Roles */}
          {activeTab === 'USERS' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">User Directory & Role Matrix</h3>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <UserPlus className="w-4 h-4" /> Invite Team Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Member Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Assigned Role</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Security */}
          {activeTab === 'SECURITY' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Enterprise Security Policy</h3>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-900">BCrypt Password Hashing</p>
                    <p className="text-slate-500">Strengths round = 10</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-900">JWT Token Refresh Rotation</p>
                    <p className="text-slate-500">Access Token Expiry = 24 Hours</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-900">Row-Level Multi-Tenant Isolation</p>
                    <p className="text-slate-500">TenantContext ThreadLocal Filter</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Audit Logs */}
          {activeTab === 'AUDIT' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">System Audit Trail</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Action Event</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{log.action}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{log.user}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{log.ip}</td>
                        <td className="px-4 py-3 text-slate-400">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
