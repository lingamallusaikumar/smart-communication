'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BarChart3, TrendingUp, DollarSign, Users, MessageSquare, LifeBuoy, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Executive Analytics & BI</h1>
              <p className="text-xs text-slate-500 mt-1">Cross-functional business intelligence across sales revenue, customer growth, omnichannel inbox, and SLA support performance.</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">
              Live Business Telemetry
            </span>
          </div>

          {/* Key Metric Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Total ARR</span>
              <p className="text-3xl font-black text-slate-900">$482,500</p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14.8% YoY Growth
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Lead Conversion Rate</span>
              <p className="text-3xl font-black text-blue-600">24.6%</p>
              <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +3.2% from benchmark
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Avg First Response</span>
              <p className="text-3xl font-black text-purple-600">4.2 min</p>
              <p className="text-xs text-purple-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 98.4% SLA Met
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Total Conversations</span>
              <p className="text-3xl font-black text-emerald-600">3,892</p>
              <p className="text-xs text-slate-400 font-medium">WhatsApp 47.5% • Email 31.8%</p>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Omnichannel Channel Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Omnichannel Channel Share</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>WhatsApp Business API</span>
                    <span>47.5% (1,850 Messages)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[47.5%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Direct Email Integration</span>
                    <span>31.8% (1,240 Messages)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-[31.8%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Website WebChat Widget</span>
                    <span>13.9% (540 Messages)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full w-[13.9%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>SMS / Call Notes</span>
                    <span>6.8% (262 Messages)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full w-[6.8%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Velocity & Stage Conversion */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Sales Stage Velocity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Qualification → Proposal Stage</span>
                  <span className="font-bold text-blue-600">62.5% Pass Rate (Avg 4.1 Days)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Proposal → Negotiation Stage</span>
                  <span className="font-bold text-purple-600">48.2% Pass Rate (Avg 6.3 Days)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Negotiation → Closed Won</span>
                  <span className="font-bold text-emerald-600">74.1% Pass Rate (Avg 2.8 Days)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
