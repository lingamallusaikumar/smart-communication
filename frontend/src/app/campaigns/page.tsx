'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Pause, Play, BarChart3, Users, Target, Zap, Plus, Search, Eye, Trash2, Edit, X, TrendingUp, MousePointer, AlertCircle } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  campaignType: string;
  status: string;
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface CampaignAnalytics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

interface MarketingMetrics {
  totalCampaigns: number;
  runningCampaigns: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRecipients: number;
}

const DEMO_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Q3 Product Launch Announcement', subject: 'Exciting New Features in SmartCommunication CRM 🚀', campaignType: 'EMAIL', status: 'COMPLETED', totalRecipients: 5420, totalDelivered: 5344, totalOpened: 1872, totalClicked: 421, totalBounced: 76, scheduledAt: null, sentAt: '2026-07-15T10:00:00Z', createdAt: '2026-07-10T00:00:00Z' },
  { id: '2', name: 'August Newsletter', subject: 'CRM Tips & Tricks for High-Growth Teams', campaignType: 'EMAIL', status: 'RUNNING', totalRecipients: 3200, totalDelivered: 2900, totalOpened: 870, totalClicked: 194, totalBounced: 45, scheduledAt: null, sentAt: '2026-08-20T09:00:00Z', createdAt: '2026-08-18T00:00:00Z' },
  { id: '3', name: 'Black Friday Early Access', subject: 'You\'re invited: Exclusive 40% off — Limited time only', campaignType: 'EMAIL', status: 'SCHEDULED', totalRecipients: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, scheduledAt: '2026-11-25T08:00:00Z', sentAt: null, createdAt: '2026-08-22T00:00:00Z' },
  { id: '4', name: 'Win-Back Inactive Users', subject: 'We miss you! Here\'s what\'s new', campaignType: 'EMAIL', status: 'PAUSED', totalRecipients: 1100, totalDelivered: 980, totalOpened: 215, totalClicked: 38, totalBounced: 22, scheduledAt: null, sentAt: '2026-08-10T11:00:00Z', createdAt: '2026-08-08T00:00:00Z' },
  { id: '5', name: 'Flash Sale SMS Blast', subject: '24-Hour Flash Sale — 30% Off All Plans', campaignType: 'SMS', status: 'COMPLETED', totalRecipients: 2800, totalDelivered: 2765, totalOpened: 2100, totalClicked: 890, totalBounced: 35, scheduledAt: null, sentAt: '2026-07-30T12:00:00Z', createdAt: '2026-07-28T00:00:00Z' },
  { id: '6', name: 'Onboarding Welcome Series', subject: 'Welcome to SmartCommunication! Let\'s get started', campaignType: 'EMAIL', status: 'DRAFT', totalRecipients: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, scheduledAt: null, sentAt: null, createdAt: '2026-08-24T00:00:00Z' },
];

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  DRAFT: { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Draft' },
  SCHEDULED: { color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Scheduled' },
  RUNNING: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Running' },
  PAUSED: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Paused' },
  COMPLETED: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Completed' },
  CANCELLED: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Cancelled' },
};

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  EMAIL: { color: 'bg-blue-100 text-blue-700', icon: <Mail className="w-3 h-3" /> },
  SMS: { color: 'bg-green-100 text-green-700', icon: <Send className="w-3 h-3" /> },
  PUSH: { color: 'bg-purple-100 text-purple-700', icon: <Zap className="w-3 h-3" /> },
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function CircleProgress({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <p className="text-xl font-bold text-gray-900 -mt-12">{value.toFixed(1)}%</p>
      <p className="text-xs text-gray-500 mt-8">{label}</p>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS);
  const [filtered, setFiltered] = useState<Campaign[]>(DEMO_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', campaignType: 'EMAIL', htmlContent: '', textContent: '' });
  const [metrics, setMetrics] = useState<MarketingMetrics>({ totalCampaigns: 6, runningCampaigns: 1, avgOpenRate: 34.8, avgClickRate: 20.1, totalRecipients: 12520 });

  useEffect(() => {
    let result = campaigns;
    if (activeTab !== 'all') result = result.filter(c => c.status === activeTab.toUpperCase());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeTab, search, campaigns]);

  useEffect(() => {
    const running = campaigns.filter(c => c.status === 'RUNNING').length;
    const totalR = campaigns.reduce((s, c) => s + c.totalRecipients, 0);
    const totalO = campaigns.reduce((s, c) => s + c.totalOpened, 0);
    const totalC = campaigns.reduce((s, c) => s + c.totalClicked, 0);
    setMetrics({
      totalCampaigns: campaigns.length,
      runningCampaigns: running,
      avgOpenRate: totalR > 0 ? totalO / totalR * 100 : 0,
      avgClickRate: totalO > 0 ? totalC / totalO * 100 : 0,
      totalRecipients: totalR,
    });
  }, [campaigns]);

  const getAnalytics = (c: Campaign): CampaignAnalytics => ({
    deliveryRate: c.totalRecipients > 0 ? c.totalDelivered / c.totalRecipients * 100 : 0,
    openRate: c.totalDelivered > 0 ? c.totalOpened / c.totalDelivered * 100 : 0,
    clickRate: c.totalOpened > 0 ? c.totalClicked / c.totalOpened * 100 : 0,
    bounceRate: c.totalRecipients > 0 ? c.totalBounced / c.totalRecipients * 100 : 0,
  });

  const handleLaunch = async (id: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'RUNNING', sentAt: new Date().toISOString() } : c));
    setLoading(false);
  };

  const handlePause = async (id: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'PAUSED' } : c));
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.subject.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newC: Campaign = { id: String(Date.now()), name: form.name, subject: form.subject, campaignType: form.campaignType, status: 'DRAFT', totalRecipients: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, scheduledAt: null, sentAt: null, createdAt: new Date().toISOString() };
    setCampaigns(prev => [newC, ...prev]);
    setForm({ name: '', subject: '', campaignType: 'EMAIL', htmlContent: '', textContent: '' });
    setShowCreateModal(false);
    setLoading(false);
  };

  const tabs = ['all', 'draft', 'scheduled', 'running', 'paused', 'completed'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Mail className="w-8 h-8 text-blue-600" />Campaigns</h1>
          <p className="text-gray-500 mt-1">Create, launch, and track your email, SMS, and push campaigns</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> New Campaign
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Campaigns', value: String(metrics.totalCampaigns), icon: <Target className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100', sub: 'All time' },
          { label: 'Active Now', value: String(metrics.runningCampaigns), icon: <Play className="w-5 h-5 text-green-600" />, bg: 'bg-green-100', sub: 'Running' },
          { label: 'Total Recipients', value: metrics.totalRecipients.toLocaleString(), icon: <Users className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100', sub: 'Across all campaigns' },
          { label: 'Avg Open Rate', value: `${metrics.avgOpenRate.toFixed(1)}%`, icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-100', sub: 'Industry avg: 21%' },
          { label: 'Avg Click Rate', value: `${metrics.avgClickRate.toFixed(1)}%`, icon: <MousePointer className="w-5 h-5 text-pink-600" />, bg: 'bg-pink-100', sub: 'Industry avg: 2.5%' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{m.label}</span>
              <div className={`w-10 h-10 ${m.bg} rounded-xl flex items-center justify-center`}>{m.icon}</div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No campaigns found</p>
          </div>
        ) : filtered.map(campaign => {
          const st = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.DRAFT;
          const tp = TYPE_CONFIG[campaign.campaignType] || TYPE_CONFIG.EMAIL;
          const analytics = getAnalytics(campaign);
          return (
            <div key={campaign.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tp.color}`}>{tp.icon}{campaign.campaignType}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${st.bgColor} ${st.color}`}>{st.label}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{campaign.name}</h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{campaign.subject}</p>
                </div>
              </div>

              {campaign.totalRecipients > 0 && (
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-0.5"><span>Open Rate</span><span>{analytics.openRate.toFixed(1)}%</span></div>
                    <ProgressBar value={campaign.totalOpened} max={campaign.totalDelivered} color="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-0.5"><span>Click Rate</span><span>{analytics.clickRate.toFixed(1)}%</span></div>
                    <ProgressBar value={campaign.totalClicked} max={campaign.totalOpened} color="bg-green-500" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-center"><p className="text-sm font-bold text-gray-900">{campaign.totalRecipients.toLocaleString()}</p><p className="text-xs text-gray-400">Recipients</p></div>
                    <div className="text-center"><p className="text-sm font-bold text-gray-900">{campaign.totalDelivered.toLocaleString()}</p><p className="text-xs text-gray-400">Delivered</p></div>
                    <div className="text-center"><p className="text-sm font-bold text-gray-900">{campaign.totalOpened.toLocaleString()}</p><p className="text-xs text-gray-400">Opened</p></div>
                    <div className="text-center"><p className="text-sm font-bold text-gray-900">{campaign.totalClicked.toLocaleString()}</p><p className="text-xs text-gray-400">Clicked</p></div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400">{campaign.sentAt ? `Sent ${new Date(campaign.sentAt).toLocaleDateString()}` : campaign.scheduledAt ? `Scheduled for ${new Date(campaign.scheduledAt).toLocaleDateString()}` : `Created ${new Date(campaign.createdAt).toLocaleDateString()}`}</p>

              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                {campaign.totalRecipients > 0 && (
                  <button onClick={() => setAnalyticsOpen(campaign)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><BarChart3 className="w-3 h-3" />Analytics</button>
                )}
                {(campaign.status === 'DRAFT' || campaign.status === 'PAUSED') && (
                  <button onClick={() => handleLaunch(campaign.id)} disabled={loading} className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-700">
                    <Play className="w-3 h-3" />Launch
                  </button>
                )}
                {campaign.status === 'RUNNING' && (
                  <button onClick={() => handlePause(campaign.id)} disabled={loading} className="flex items-center gap-1 text-xs bg-amber-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-amber-600">
                    <Pause className="w-3 h-3" />Pause
                  </button>
                )}
                <button onClick={() => handleDelete(campaign.id)} className="ml-auto text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Modal */}
      {analyticsOpen && (() => {
        const analytics = getAnalytics(analyticsOpen);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Campaign Analytics</h2>
                  <p className="text-sm text-gray-500">{analyticsOpen.name}</p>
                </div>
                <button onClick={() => setAnalyticsOpen(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6 mb-6">
                  <CircleProgress value={analytics.deliveryRate} label="Delivery Rate" color="#3b82f6" />
                  <CircleProgress value={analytics.openRate} label="Open Rate" color="#22c55e" />
                  <CircleProgress value={analytics.clickRate} label="Click Rate" color="#a855f7" />
                  <CircleProgress value={analytics.bounceRate} label="Bounce Rate" color="#ef4444" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Recipients', value: analyticsOpen.totalRecipients.toLocaleString(), color: 'text-blue-600' },
                    { label: 'Delivered', value: analyticsOpen.totalDelivered.toLocaleString(), color: 'text-green-600' },
                    { label: 'Opened', value: analyticsOpen.totalOpened.toLocaleString(), color: 'text-purple-600' },
                    { label: 'Clicked', value: analyticsOpen.totalClicked.toLocaleString(), color: 'text-amber-600' },
                    { label: 'Bounced', value: analyticsOpen.totalBounced.toLocaleString(), color: 'text-red-600' },
                    { label: 'Status', value: analyticsOpen.status, color: 'text-gray-900' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">New Campaign</h2>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. August Newsletter" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Line *</label><input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Catchy subject to maximize opens" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                <select value={form.campaignType} onChange={e => setForm(f => ({ ...f, campaignType: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="EMAIL">📧 Email</option>
                  <option value="SMS">💬 SMS</option>
                  <option value="PUSH">🔔 Push Notification</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label><textarea value={form.htmlContent} onChange={e => setForm(f => ({ ...f, htmlContent: e.target.value }))} rows={8} placeholder="<html>...</html> or paste your email HTML here" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Plain Text Content</label><textarea value={form.textContent} onChange={e => setForm(f => ({ ...f, textContent: e.target.value }))} rows={4} placeholder="Plain text version for email clients that don't support HTML" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={loading || !form.name.trim() || !form.subject.trim()} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
