'use client';

import { useState } from 'react';
import { Users, UserPlus, Search, Mail, Shield, Trash2, Edit, MoreVertical } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  lastActive: string;
}

const DEMO_TEAM: TeamMember[] = [
  { id: '1', name: 'John Doe', email: 'john@acme.com', role: 'ADMIN', department: 'Management', status: 'ACTIVE', lastActive: '2 mins ago' },
  { id: '2', name: 'Jane Smith', email: 'jane@acme.com', role: 'MANAGER', department: 'Sales', status: 'ACTIVE', lastActive: '1 hour ago' },
  { id: '3', name: 'Mike Johnson', email: 'mike@acme.com', role: 'USER', department: 'Sales', status: 'ACTIVE', lastActive: '5 hours ago' },
  { id: '4', name: 'Sarah Lee', email: 'sarah@acme.com', role: 'USER', department: 'Support', status: 'ACTIVE', lastActive: 'Yesterday' },
  { id: '5', name: 'Alex Wong', email: 'alex@acme.com', role: 'USER', department: 'Marketing', status: 'INVITED', lastActive: 'Never' },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  MANAGER: 'bg-blue-100 text-blue-700',
  USER: 'bg-gray-100 text-gray-700',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INVITED: 'bg-amber-100 text-amber-700',
  DISABLED: 'bg-red-100 text-red-700',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(DEMO_TEAM);
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const filtered = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-8 h-8 text-blue-600" />Team Members</h1>
          <p className="text-gray-500 mt-1">Manage users, roles, and permissions within your organization</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <UserPlus className="w-5 h-5" /> Invite User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {members.length} total users
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                      {member.name.substring(0,2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3"/>{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_COLORS[member.role]}`}>
                    <Shield className="w-3 h-3" /> {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.department}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[member.status]}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{member.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-900">Invite Team Member</h2></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" placeholder="colleague@acme.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" placeholder="John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>User</option><option>Manager</option><option>Admin</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Sales</option><option>Support</option><option>Marketing</option><option>Management</option></select></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowInviteModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowInviteModal(false)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
