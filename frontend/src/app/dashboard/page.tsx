'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Users, 
  Target, 
  DollarSign, 
  MessageSquare, 
  LifeBuoy, 
  TrendingUp, 
  Bot, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between border border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 font-semibold px-3 py-1 rounded-full text-xs mb-3 border border-blue-500/30">
                <Bot className="w-3.5 h-3.5" /> AI Engine Active
              </div>
              <h1 className="text-2xl font-bold tracking-tight">SmartCommunication Executive Workspace</h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Real-time insights across your customer 360 profiles, active sales opportunities, omnichannel message queues, and AI recommendations.
              </p>
            </div>
            <div className="hidden lg:flex gap-3">
              <Link href="/deals" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition shadow-lg shadow-blue-600/30">
                Manage Deals
              </Link>
              <Link href="/inbox" className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm border border-slate-700 transition">
                Open Smart Inbox
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.4% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">$482,500</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.2% conversion rate
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Omnichannel Messages</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">3,892</p>
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" /> Avg Response 4.2m
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">14</p>
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> 98.4% SLA Compliance
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <LifeBuoy className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* AI Intelligence & Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Insights & Next-Best Action */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-900">AI Customer Intelligence</h2>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Real-time</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Acme Corp (Enterprise Lead)</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded">Positive Sentiment</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    "Customer expressed strong interest in WhatsApp Integration & custom SLA rules during call."
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600">Next Action: Send Enterprise Proposal</span>
                    <button className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                      Execute <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Starlight Logistics</span>
                    <span className="text-xs bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded">Urgent Support</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    "WebChat inquiry regarding API key renewal prior to end of month subscription."
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-600">Next Action: Assign Support Agent</span>
                    <button className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                      Assign <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Omnichannel Inbox Quick Feed */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-bold text-slate-900">Unified Omnichannel Activity</h2>
                  <p className="text-xs text-slate-500">Live feed across Email, WhatsApp, WebChat and Phone Calls</p>
                </div>
                <Link href="/inbox" className="text-xs text-blue-600 font-semibold hover:underline">
                  View All Inbox →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="py-3 flex items-start gap-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">WhatsApp</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Sarah Jenkins (TechCorp)</p>
                      <span className="text-xs text-slate-400">2 mins ago</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      "Could you please confirm if we can add 5 additional sales reps to our current plan?"
                    </p>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">Email</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Michael Chang (Global Retail)</p>
                      <span className="text-xs text-slate-400">14 mins ago</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      "Thank you for sending over the revised contract. We are reviewing it with legal."
                    </p>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded">WebChat</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Visitor #8492</p>
                      <span className="text-xs text-slate-400">45 mins ago</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      "Is there a free trial option available for the AI Smart Customer Memory module?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
