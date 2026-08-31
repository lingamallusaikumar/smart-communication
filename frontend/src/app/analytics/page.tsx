'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Activity, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const revData = [
  { month: 'Jan', revenue: 45000, deals: 32 },
  { month: 'Feb', revenue: 52000, deals: 40 },
  { month: 'Mar', revenue: 48000, deals: 36 },
  { month: 'Apr', revenue: 61000, deals: 45 },
  { month: 'May', revenue: 59000, deals: 42 },
  { month: 'Jun', revenue: 75000, deals: 55 },
  { month: 'Jul', revenue: 82000, deals: 60 },
  { month: 'Aug', revenue: 95000, deals: 68 },
];

const customerGrowthData = [
  { month: 'Jan', total: 120, new: 12 },
  { month: 'Feb', total: 135, new: 15 },
  { month: 'Mar', total: 148, new: 13 },
  { month: 'Apr', total: 170, new: 22 },
  { month: 'May', total: 188, new: 18 },
  { month: 'Jun', total: 215, new: 27 },
  { month: 'Jul', total: 245, new: 30 },
  { month: 'Aug', total: 280, new: 35 },
];

const pipelineData = [
  { name: 'Lead', count: 120, value: 150000 },
  { name: 'Qualified', count: 85, value: 250000 },
  { name: 'Proposal', count: 45, value: 380000 },
  { name: 'Negotiation', count: 20, value: 420000 },
  { name: 'Closed Won', count: 68, value: 516000 },
];

const winLossData = [
  { name: 'Won', value: 68 },
  { name: 'Lost', value: 32 },
];
const COLORS = ['#22c55e', '#ef4444'];

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Activity className="w-8 h-8 text-blue-600" />Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Key metrics and performance indicators for your organization</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
          <Calendar className="w-4 h-4" /> Year to Date
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue (YTD)</p>
            <p className="text-3xl font-bold text-gray-900">$516,000</p>
            <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" /> 24% vs last year
            </div>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-green-50 opacity-50 z-0" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Customers</p>
            <p className="text-3xl font-bold text-gray-900">280</p>
            <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" /> 16% vs last year
            </div>
          </div>
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-50 opacity-50 z-0" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Pipeline Value</p>
            <p className="text-3xl font-bold text-gray-900">$1.2M</p>
            <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" /> 8% vs last month
            </div>
          </div>
          <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-50 opacity-50 z-0" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <div className="flex items-center gap-1 mt-2 text-sm font-medium text-red-500">
              <ArrowDownRight className="w-4 h-4" /> 2% vs last month
            </div>
          </div>
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-50 opacity-50 z-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Customer Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar yAxisId="left" dataKey="total" name="Total Customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="new" name="New Customers" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Value by Stage */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6">Pipeline Value by Stage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                <Tooltip formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Pipeline Value']} cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
