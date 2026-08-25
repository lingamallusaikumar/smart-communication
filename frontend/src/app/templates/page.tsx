'use client';

import { useState, useEffect } from 'react';
import { Mail, FileText, Code, Eye, Plus, Trash2, Edit, Tag, Layout, X, CheckCircle, Search } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  category: string;
  variables: string;
  active: boolean;
  createdAt: string;
}

const DEMO_TEMPLATES: EmailTemplate[] = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to SmartCommunication, {{firstName}}!', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#2563eb;padding:40px;text-align:center"><h1 style="color:#fff;margin:0">Welcome aboard! 🎉</h1></div><div style="padding:40px"><p>Hi {{firstName}},</p><p>We are thrilled to have you on board. SmartCommunication CRM is here to help you manage your customer relationships like never before.</p><p>Your account has been set up and you can start exploring right away.</p><a href="{{loginUrl}}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">Get Started →</a></div><div style="background:#f3f4f6;padding:20px;text-align:center;font-size:12px;color:#6b7280">© 2026 SmartCommunication CRM. All rights reserved.</div></div>', category: 'TRANSACTIONAL', variables: 'firstName,loginUrl', active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: '2', name: 'Monthly Newsletter', subject: '{{month}} Newsletter — Insights & Updates from SmartCommunication', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#1e293b;padding:40px;text-align:center"><h1 style="color:#fff">{{month}} Newsletter</h1><p style="color:#94a3b8">SmartCommunication CRM</p></div><div style="padding:40px"><h2>This month\'s highlights</h2><p>{{highlights}}</p><h2>Tips & Tricks</h2><p>{{tips}}</p></div></div>', category: 'MARKETING', variables: 'month,highlights,tips', active: true, createdAt: '2026-01-15T00:00:00Z' },
  { id: '3', name: 'Invoice Notification', subject: 'Invoice #{{invoiceNumber}} from SmartCommunication', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#2563eb;padding:30px;text-align:center"><h1 style="color:#fff;font-size:24px">Invoice Ready</h1></div><div style="padding:40px"><p>Hi {{customerName}},</p><p>Please find your invoice <strong>#{{invoiceNumber}}</strong> attached to this email.</p><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f3f4f6"><td style="padding:10px">Amount Due</td><td style="padding:10px;text-align:right;font-weight:700">${{amount}}</td></tr><tr><td style="padding:10px">Due Date</td><td style="padding:10px;text-align:right">{{dueDate}}</td></tr></table><a href="{{paymentUrl}}" style="display:inline-block;background:#22c55e;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600">Pay Now →</a></div></div>', category: 'TRANSACTIONAL', variables: 'customerName,invoiceNumber,amount,dueDate,paymentUrl', active: true, createdAt: '2026-02-01T00:00:00Z' },
  { id: '4', name: 'Win-Back Campaign', subject: 'We miss you, {{firstName}}! Here\'s 20% off to come back', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:50px;text-align:center"><h1 style="color:#fff;font-size:32px">We miss you! 💜</h1></div><div style="padding:40px;text-align:center"><p style="font-size:18px">Hi {{firstName}}, it\'s been a while...</p><p>We\'ve made lots of improvements since you last visited. Come back and see what\'s new!</p><div style="background:#f3f4f6;border-radius:12px;padding:24px;margin:24px 0"><p style="font-size:14px;color:#6b7280;margin:0">Your exclusive offer</p><p style="font-size:36px;font-weight:700;color:#6366f1;margin:8px 0">20% OFF</p><p style="font-size:14px;color:#6b7280;margin:0">Use code: {{couponCode}}</p></div><a href="{{ctaUrl}}" style="display:inline-block;background:#6366f1;color:#fff;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:600">Claim Your Discount →</a></div></div>', category: 'MARKETING', variables: 'firstName,couponCode,ctaUrl', active: true, createdAt: '2026-03-01T00:00:00Z' },
  { id: '5', name: 'Support Ticket Update', subject: 'Update on your support ticket #{{ticketId}}', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#f59e0b;padding:30px;text-align:center"><h1 style="color:#fff">Ticket Update</h1></div><div style="padding:40px"><p>Hi {{customerName}},</p><p>Your support ticket <strong>#{{ticketId}}</strong> has been updated.</p><div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0"><p style="margin:0"><strong>Status:</strong> {{status}}</p><p style="margin:8px 0 0"><strong>Update:</strong> {{updateMessage}}</p></div><a href="{{ticketUrl}}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View Ticket →</a></div></div>', category: 'NOTIFICATION', variables: 'customerName,ticketId,status,updateMessage,ticketUrl', active: true, createdAt: '2026-03-15T00:00:00Z' },
  { id: '6', name: 'Renewal Reminder', subject: 'Your subscription renews in {{daysLeft}} days', htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#0f172a;padding:30px;text-align:center"><h1 style="color:#fff">Renewal Reminder</h1></div><div style="padding:40px"><p>Hi {{firstName}},</p><p>Your <strong>{{planName}}</strong> subscription is set to renew in <strong>{{daysLeft}} days</strong> on {{renewalDate}}.</p><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f3f4f6"><td style="padding:10px">Plan</td><td style="padding:10px;text-align:right">{{planName}}</td></tr><tr><td style="padding:10px">Renewal Amount</td><td style="padding:10px;text-align:right;font-weight:700">${{amount}}</td></tr><tr style="background:#f3f4f6"><td style="padding:10px">Renewal Date</td><td style="padding:10px;text-align:right">{{renewalDate}}</td></tr></table><a href="{{manageUrl}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Manage Subscription</a></div></div>', category: 'NOTIFICATION', variables: 'firstName,planName,daysLeft,renewalDate,amount,manageUrl', active: false, createdAt: '2026-04-01T00:00:00Z' },
];

const CATEGORIES = ['All', 'Marketing', 'Transactional', 'Notification'];

const CATEGORY_COLORS: Record<string, string> = {
  MARKETING: 'bg-purple-100 text-purple-700',
  TRANSACTIONAL: 'bg-blue-100 text-blue-700',
  NOTIFICATION: 'bg-amber-100 text-amber-700',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEMO_TEMPLATES);
  const [filtered, setFiltered] = useState<EmailTemplate[]>(DEMO_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showPreviewTab, setShowPreviewTab] = useState<'code' | 'preview'>('code');
  const [form, setForm] = useState({ name: '', subject: '', htmlContent: '', category: 'MARKETING', variables: '', active: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let result = templates;
    if (activeCategory !== 'All') result = result.filter(t => t.category === activeCategory.toUpperCase());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeCategory, search, templates]);

  const openCreate = () => {
    setEditTemplate(null);
    setForm({ name: '', subject: '', htmlContent: '', category: 'MARKETING', variables: '', active: true });
    setShowModal(true);
  };

  const openEdit = (t: EmailTemplate) => {
    setEditTemplate(t);
    setForm({ name: t.name, subject: t.subject, htmlContent: t.htmlContent, category: t.category, variables: t.variables, active: t.active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const payload: EmailTemplate = { id: editTemplate?.id || String(Date.now()), name: form.name, subject: form.subject, htmlContent: form.htmlContent, category: form.category, variables: form.variables, active: form.active, createdAt: editTemplate?.createdAt || new Date().toISOString() };
    if (editTemplate) setTemplates(prev => prev.map(t => t.id === editTemplate.id ? payload : t));
    else setTemplates(prev => [payload, ...prev]);
    setShowModal(false);
    setLoading(false);
  };

  const handleDelete = (id: string) => setTemplates(prev => prev.filter(t => t.id !== id));
  const toggleActive = (id: string) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  const getVariableList = (vars: string) => vars.split(',').map(v => v.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Layout className="w-8 h-8 text-blue-600" />Email Templates</h1>
          <p className="text-gray-500 mt-1">Create reusable HTML email templates with dynamic variable support</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Templates', value: templates.length, color: 'bg-blue-100', icon: <FileText className="w-5 h-5 text-blue-600" /> },
          { label: 'Marketing', value: templates.filter(t => t.category === 'MARKETING').length, color: 'bg-purple-100', icon: <Mail className="w-5 h-5 text-purple-600" /> },
          { label: 'Transactional', value: templates.filter(t => t.category === 'TRANSACTIONAL').length, color: 'bg-blue-100', icon: <FileText className="w-5 h-5 text-blue-600" /> },
          { label: 'Notification', value: templates.filter(t => t.category === 'NOTIFICATION').length, color: 'bg-amber-100', icon: <Tag className="w-5 h-5 text-amber-600" /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>{s.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
          ))}
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No templates found</p>
          </div>
        ) : filtered.map(template => (
          <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            {/* Preview thumbnail */}
            <div className="h-36 bg-gray-50 border-b border-gray-100 overflow-hidden relative">
              <div className="absolute inset-0 scale-[0.35] origin-top-left w-[286%] h-[286%] pointer-events-none">
                <div dangerouslySetInnerHTML={{ __html: template.htmlContent }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50" />
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{template.subject}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${CATEGORY_COLORS[template.category] || 'bg-gray-100 text-gray-600'}`}>{template.category}</span>
              </div>
              {getVariableList(template.variables).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {getVariableList(template.variables).map(v => (
                    <span key={v} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-mono">{'{{' + v + '}}'}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <button onClick={() => toggleActive(template.id)} className={`text-xs font-semibold flex items-center gap-1 ${template.active ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />{template.active ? 'Active' : 'Inactive'}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPreviewTemplate(template)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => openEdit(template)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(template.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{previewTemplate.name}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowPreviewTab('code')} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${showPreviewTab === 'code' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Code className="w-4 h-4" />Code</button>
                <button onClick={() => setShowPreviewTab('preview')} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${showPreviewTab === 'preview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Eye className="w-4 h-4" />Preview</button>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-lg ml-2"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {showPreviewTab === 'code' ? (
                <pre className="p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap">{previewTemplate.htmlContent}</pre>
              ) : (
                <div className="p-4" dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editTemplate ? 'Edit Template' : 'Create Email Template'}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label><input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="MARKETING">Marketing</option>
                      <option value="TRANSACTIONAL">Transactional</option>
                      <option value="NOTIFICATION">Notification</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Variables <span className="text-gray-400">(comma separated)</span></label><input type="text" value={form.variables} onChange={e => setForm(f => ({ ...f, variables: e.target.value }))} placeholder="e.g. firstName,email,ctaUrl" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setForm(f => ({ ...f, active: !f.active }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </div>
                  {form.htmlContent && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Live Preview</p>
                      <div className="border border-gray-200 rounded-xl overflow-hidden h-48 overflow-y-auto">
                        <div className="scale-[0.6] origin-top-left w-[167%]" dangerouslySetInnerHTML={{ __html: form.htmlContent }} />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
                  <textarea value={form.htmlContent} onChange={e => setForm(f => ({ ...f, htmlContent: e.target.value }))} rows={24} placeholder="<div>Your email HTML here...</div>" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Saving...' : editTemplate ? 'Save Changes' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
