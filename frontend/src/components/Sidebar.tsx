'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Target, 
  KanbanSquare, 
  MessageSquare, 
  LifeBuoy, 
  CheckSquare, 
  Zap, 
  Bot, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Sales Deals', href: '/deals', icon: KanbanSquare },
  { name: 'Smart Inbox', href: '/inbox', icon: MessageSquare },
  { name: 'Support Tickets', href: '/support', icon: LifeBuoy },
  { name: 'Tasks & Calendar', href: '/tasks', icon: CheckSquare },
  { name: 'Workflows', href: '/workflows', icon: Zap },
  { name: 'AI Intelligence', href: '/ai', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-black text-xl w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="font-bold text-lg text-white tracking-tight">SmartComm</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.5 rounded">CRM</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>SmartComm v1.0</span>
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
        </span>
      </div>
    </aside>
  );
}
