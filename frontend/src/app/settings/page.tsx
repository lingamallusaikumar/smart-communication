'use client';

import { useState } from 'react';
import { Settings, User, Building, Shield, Bell, Key, CreditCard, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'organization', label: 'Organization', icon: <Building className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing & Plan', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'api', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    setSaved(false);
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Settings className="w-8 h-8 text-gray-600" />Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account, organization, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm">JD</div>
                  <div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Change Avatar</button>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" defaultValue="John" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" defaultValue="john.doe@example.com" disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                  <p className="text-xs text-gray-500 mt-1">To change your email address, please contact support.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" defaultValue="Administrator" disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Organization Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" defaultValue="Acme Corporation" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Retail</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <input type="password" placeholder="Current Password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input type="password" placeholder="New Password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input type="password" placeholder="Confirm New Password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100">Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { title: 'New Deal Assigned', desc: 'When a new deal is assigned to you' },
                  { title: 'Deal Won', desc: 'When a deal in your pipeline is marked as Won' },
                  { title: 'New Ticket Assigned', desc: 'When a support ticket is assigned to you' },
                  { title: 'Customer Reply', desc: 'When a customer replies to your ticket or email' },
                  { title: 'Daily Summary', desc: 'A daily digest of your tasks and pipeline status' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={idx !== 4} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons (common for all tabs that have form-like content) */}
          {['profile', 'organization', 'security', 'notifications'].includes(activeTab) && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3 max-w-2xl">
              {saved && <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved successfully</span>}
              <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Billing & Plan</h2>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">Enterprise Plan</span>
                    <h3 className="text-2xl font-bold mb-1">$499.00 / month</h3>
                    <p className="text-blue-100 text-sm">Next billing date: Sept 1, 2026</p>
                  </div>
                  <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">Manage Plan</button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-4 mt-8">Billing History</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr><th className="px-4 py-3 text-gray-500 font-semibold">Date</th><th className="px-4 py-3 text-gray-500 font-semibold">Description</th><th className="px-4 py-3 text-gray-500 font-semibold">Amount</th><th className="px-4 py-3 text-gray-500 font-semibold">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-4 py-3">Aug 1, 2026</td><td className="px-4 py-3 text-gray-900">Enterprise Plan - Monthly</td><td className="px-4 py-3 font-medium">$499.00</td><td className="px-4 py-3"><span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold">Paid</span></td></tr>
                    <tr><td className="px-4 py-3">Jul 1, 2026</td><td className="px-4 py-3 text-gray-900">Enterprise Plan - Monthly</td><td className="px-4 py-3 font-medium">$499.00</td><td className="px-4 py-3"><span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold">Paid</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">Generate New Key</button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Use these keys to authenticate API requests from your own application. Do not share them publicly.</p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">Production Key</h4>
                    <p className="text-xs text-gray-500">Created on Jan 15, 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="bg-gray-100 px-3 py-1.5 rounded text-sm text-gray-700 font-mono">sk_live_...4f9a</code>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Reveal</button>
                    <button className="text-sm text-red-600 font-medium hover:underline ml-2">Revoke</button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Test Key</h4>
                    <p className="text-xs text-gray-500">Created on Jan 15, 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="bg-white border border-gray-200 px-3 py-1.5 rounded text-sm text-gray-700 font-mono">sk_test_...8b2c</code>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Reveal</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
