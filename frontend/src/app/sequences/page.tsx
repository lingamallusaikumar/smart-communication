'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, GitBranch, Zap, Play, Pause, Plus, Trash2, ArrowDown, Users, CheckCircle, XCircle, X, ChevronDown, ChevronRight, Edit } from 'lucide-react';

interface DripStep {
  id: string;
  stepOrder: number;
  stepType: string;
  subject: string;
  htmlContent: string;
  waitDurationHours: number;
  conditionField: string;
  conditionOperator: string;
  conditionValue: string;
}

interface DripSequence {
  id: string;
  name: string;
  description: string;
  status: string;
  triggerEvent: string;
  totalEnrolled: number;
  totalCompleted: number;
  totalDropped: number;
  steps: DripStep[];
  createdAt: string;
}

const DEMO_SEQUENCES: DripSequence[] = [
  {
    id: '1', name: 'New User Onboarding', description: 'Guide new users through product setup and key features over their first week', status: 'ACTIVE', triggerEvent: 'SIGNUP', totalEnrolled: 342, totalCompleted: 198, totalDropped: 44, createdAt: '2026-01-15T00:00:00Z',
    steps: [
      { id: 's1', stepOrder: 0, stepType: 'EMAIL', subject: 'Welcome! Let\'s get you set up', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 's2', stepOrder: 1, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 24, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 's3', stepOrder: 2, stepType: 'EMAIL', subject: 'Day 2: Adding your first contacts', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 's4', stepOrder: 3, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 48, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 's5', stepOrder: 4, stepType: 'CONDITION', subject: '', htmlContent: '', waitDurationHours: 0, conditionField: 'has_imported_contacts', conditionOperator: 'equals', conditionValue: 'true' },
      { id: 's6', stepOrder: 5, stepType: 'EMAIL', subject: 'Day 5: Advanced features to boost productivity', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
    ]
  },
  {
    id: '2', name: 'Post-Purchase Upsell', description: 'Nurture customers after purchase to encourage plan upgrades and add-ons', status: 'ACTIVE', triggerEvent: 'PURCHASE', totalEnrolled: 188, totalCompleted: 121, totalDropped: 22, createdAt: '2026-02-10T00:00:00Z',
    steps: [
      { id: 't1', stepOrder: 0, stepType: 'EMAIL', subject: 'Thank you for your purchase!', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 't2', stepOrder: 1, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 72, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 't3', stepOrder: 2, stepType: 'EMAIL', subject: 'Getting the most out of your new plan', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 't4', stepOrder: 3, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 168, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 't5', stepOrder: 4, stepType: 'ACTION', subject: '', htmlContent: '', waitDurationHours: 0, conditionField: 'tag', conditionOperator: 'add', conditionValue: 'upsell_target' },
      { id: 't6', stepOrder: 5, stepType: 'EMAIL', subject: 'Exclusive: Upgrade and save 25%', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
    ]
  },
  {
    id: '3', name: 'Abandoned Cart Recovery', description: 'Re-engage visitors who left before completing their purchase', status: 'PAUSED', triggerEvent: 'ABANDONED_CART', totalEnrolled: 89, totalCompleted: 31, totalDropped: 18, createdAt: '2026-03-05T00:00:00Z',
    steps: [
      { id: 'u1', stepOrder: 0, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 1, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 'u2', stepOrder: 1, stepType: 'EMAIL', subject: 'You forgot something in your cart!', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 'u3', stepOrder: 2, stepType: 'WAIT', subject: '', htmlContent: '', waitDurationHours: 24, conditionField: '', conditionOperator: '', conditionValue: '' },
      { id: 'u4', stepOrder: 3, stepType: 'EMAIL', subject: 'Last chance — your cart is expiring soon', htmlContent: '', waitDurationHours: 0, conditionField: '', conditionOperator: '', conditionValue: '' },
    ]
  },
];

const STEP_TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  EMAIL: { icon: <Mail className="w-4 h-4" />, color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-200', label: 'Send Email' },
  WAIT: { icon: <Clock className="w-4 h-4" />, color: 'text-amber-700', bgColor: 'bg-amber-100 border-amber-200', label: 'Wait' },
  CONDITION: { icon: <GitBranch className="w-4 h-4" />, color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-200', label: 'Check Condition' },
  ACTION: { icon: <Zap className="w-4 h-4" />, color: 'text-green-700', bgColor: 'bg-green-100 border-green-200', label: 'Perform Action' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  ACTIVE: { color: 'bg-green-100 text-green-700', label: 'Active' },
  PAUSED: { color: 'bg-amber-100 text-amber-700', label: 'Paused' },
  DRAFT: { color: 'bg-gray-100 text-gray-600', label: 'Draft' },
};

const TRIGGER_LABELS: Record<string, string> = {
  SIGNUP: '🆕 On Signup',
  PURCHASE: '💳 On Purchase',
  ABANDONED_CART: '🛒 Abandoned Cart',
  MANUAL: '✋ Manual',
};

export default function SequencesPage() {
  const [sequences, setSequences] = useState<DripSequence[]>(DEMO_SEQUENCES);
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStep, setShowAddStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', triggerEvent: 'SIGNUP' });
  const [stepForm, setStepForm] = useState({ stepType: 'EMAIL', subject: '', waitDurationHours: 24, conditionField: '', conditionOperator: 'equals', conditionValue: '' });

  const handleCreateSequence = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newSeq: DripSequence = { id: String(Date.now()), name: form.name, description: form.description, status: 'DRAFT', triggerEvent: form.triggerEvent, totalEnrolled: 0, totalCompleted: 0, totalDropped: 0, steps: [], createdAt: new Date().toISOString() };
    setSequences(prev => [newSeq, ...prev]);
    setForm({ name: '', description: '', triggerEvent: 'SIGNUP' });
    setShowCreateModal(false);
    setLoading(false);
  };

  const handleAddStep = async (seqId: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const seq = sequences.find(s => s.id === seqId);
    if (!seq) return;
    const newStep: DripStep = { id: String(Date.now()), stepOrder: seq.steps.length, stepType: stepForm.stepType, subject: stepForm.subject, htmlContent: '', waitDurationHours: stepForm.waitDurationHours, conditionField: stepForm.conditionField, conditionOperator: stepForm.conditionOperator, conditionValue: stepForm.conditionValue };
    setSequences(prev => prev.map(s => s.id === seqId ? { ...s, steps: [...s.steps, newStep] } : s));
    setShowAddStep(null);
    setStepForm({ stepType: 'EMAIL', subject: '', waitDurationHours: 24, conditionField: '', conditionOperator: 'equals', conditionValue: '' });
    setLoading(false);
  };

  const handleRemoveStep = (seqId: string, stepId: string) => {
    setSequences(prev => prev.map(s => s.id === seqId ? { ...s, steps: s.steps.filter(st => st.id !== stepId).map((st, i) => ({ ...st, stepOrder: i })) } : s));
  };

  const handleToggleStatus = (seqId: string) => {
    setSequences(prev => prev.map(s => s.id === seqId ? { ...s, status: s.status === 'ACTIVE' ? 'PAUSED' : s.status === 'PAUSED' ? 'ACTIVE' : 'ACTIVE' } : s));
  };

  const handleDelete = (seqId: string) => {
    setSequences(prev => prev.filter(s => s.id !== seqId));
    if (expandedId === seqId) setExpandedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><GitBranch className="w-8 h-8 text-blue-600" />Drip Sequences</h1>
          <p className="text-gray-500 mt-1">Build visual automated email flows triggered by customer behavior</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> New Sequence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sequences', value: sequences.length, sub: 'All time', icon: <GitBranch className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
          { label: 'Active', value: sequences.filter(s => s.status === 'ACTIVE').length, sub: 'Running now', icon: <Play className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
          { label: 'Total Enrolled', value: sequences.reduce((s, seq) => s + seq.totalEnrolled, 0), sub: 'Contacts in flow', icon: <Users className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
          { label: 'Completed', value: sequences.reduce((s, seq) => s + seq.totalCompleted, 0), sub: 'Finished the flow', icon: <CheckCircle className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-100' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Sequence List */}
      <div className="space-y-4">
        {sequences.map(seq => {
          const st = STATUS_CONFIG[seq.status] || STATUS_CONFIG.DRAFT;
          const completionRate = seq.totalEnrolled > 0 ? (seq.totalCompleted / seq.totalEnrolled) * 100 : 0;
          const dropRate = seq.totalEnrolled > 0 ? (seq.totalDropped / seq.totalEnrolled) * 100 : 0;
          const isExpanded = expandedId === seq.id;

          return (
            <div key={seq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : seq.id)}>
                <div className="mt-0.5">{isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{seq.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>{st.label}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{TRIGGER_LABELS[seq.triggerEvent]}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{seq.steps.length} steps</span>
                  </div>
                  {seq.description && <p className="text-sm text-gray-500">{seq.description}</p>}
                  {seq.totalEnrolled > 0 && (
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Users className="w-3 h-3" />{seq.totalEnrolled.toLocaleString()} enrolled</div>
                      <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle className="w-3 h-3" />{completionRate.toFixed(0)}% completed</div>
                      <div className="flex items-center gap-2 text-xs text-red-500"><XCircle className="w-3 h-3" />{dropRate.toFixed(0)}% dropped</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleToggleStatus(seq.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${seq.status === 'ACTIVE' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {seq.status === 'ACTIVE' ? <><Pause className="w-3 h-3" />Pause</> : <><Play className="w-3 h-3" />Activate</>}
                  </button>
                  <button onClick={() => handleDelete(seq.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Sequence Flow</h4>
                    <button onClick={() => setShowAddStep(seq.id)} className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      <Plus className="w-3 h-3" />Add Step
                    </button>
                  </div>

                  <div className="max-w-md">
                    {seq.steps.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No steps yet</p>
                        <p className="text-xs mt-1">Click "Add Step" to start building your flow</p>
                      </div>
                    ) : seq.steps.map((step, idx) => {
                      const cfg = STEP_TYPE_CONFIG[step.stepType] || STEP_TYPE_CONFIG.EMAIL;
                      return (
                        <div key={step.id}>
                          <div className={`flex items-start gap-3 p-4 border rounded-xl ${cfg.bgColor} transition-all`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm ${cfg.color}`}>{cfg.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-gray-500">Step {idx + 1}</span>
                                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                              </div>
                              {step.stepType === 'EMAIL' && <p className="text-sm font-medium text-gray-900 truncate">{step.subject || 'No subject set'}</p>}
                              {step.stepType === 'WAIT' && <p className="text-sm font-medium text-gray-900">Wait {step.waitDurationHours >= 24 ? `${step.waitDurationHours / 24} day(s)` : `${step.waitDurationHours} hour(s)`}</p>}
                              {step.stepType === 'CONDITION' && <p className="text-sm font-medium text-gray-900">If {step.conditionField} {step.conditionOperator} &quot;{step.conditionValue}&quot;</p>}
                              {step.stepType === 'ACTION' && <p className="text-sm font-medium text-gray-900">{step.conditionOperator} tag: &quot;{step.conditionValue}&quot;</p>}
                            </div>
                            <button onClick={() => handleRemoveStep(seq.id, step.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          {idx < seq.steps.length - 1 && (
                            <div className="flex items-center justify-center my-1">
                              <ArrowDown className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Step Form */}
                  {showAddStep === seq.id && (
                    <div className="mt-4 max-w-md border border-gray-200 rounded-xl p-4 bg-white">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">Add New Step</h5>
                      <div className="space-y-3">
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Step Type</label>
                          <select value={stepForm.stepType} onChange={e => setStepForm(f => ({ ...f, stepType: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="EMAIL">📧 Send Email</option>
                            <option value="WAIT">⏳ Wait</option>
                            <option value="CONDITION">🔀 Check Condition</option>
                            <option value="ACTION">⚡ Perform Action</option>
                          </select>
                        </div>
                        {stepForm.stepType === 'EMAIL' && <div><label className="block text-xs font-medium text-gray-600 mb-1">Email Subject</label><input type="text" value={stepForm.subject} onChange={e => setStepForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject line..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>}
                        {stepForm.stepType === 'WAIT' && <div><label className="block text-xs font-medium text-gray-600 mb-1">Wait Duration (hours)</label><input type="number" min="1" value={stepForm.waitDurationHours} onChange={e => setStepForm(f => ({ ...f, waitDurationHours: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>}
                        {stepForm.stepType === 'CONDITION' && (
                          <div className="grid grid-cols-3 gap-2">
                            <input type="text" value={stepForm.conditionField} onChange={e => setStepForm(f => ({ ...f, conditionField: e.target.value }))} placeholder="Field" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <select value={stepForm.conditionOperator} onChange={e => setStepForm(f => ({ ...f, conditionOperator: e.target.value }))} className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                              <option value="equals">equals</option><option value="not_equals">≠</option><option value="contains">contains</option><option value="is_true">is true</option>
                            </select>
                            <input type="text" value={stepForm.conditionValue} onChange={e => setStepForm(f => ({ ...f, conditionValue: e.target.value }))} placeholder="Value" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        )}
                        {stepForm.stepType === 'ACTION' && (
                          <div className="grid grid-cols-2 gap-2">
                            <select value={stepForm.conditionOperator} onChange={e => setStepForm(f => ({ ...f, conditionOperator: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                              <option value="add">Add Tag</option><option value="remove">Remove Tag</option><option value="notify">Notify Team</option>
                            </select>
                            <input type="text" value={stepForm.conditionValue} onChange={e => setStepForm(f => ({ ...f, conditionValue: e.target.value }))} placeholder="Value..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => setShowAddStep(null)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                          <button onClick={() => handleAddStep(seq.id)} disabled={loading} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Add Step</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-900">Create Drip Sequence</h2></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Sequence Name *</label><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. New User Onboarding" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="What does this sequence do?" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
                <select value={form.triggerEvent} onChange={e => setForm(f => ({ ...f, triggerEvent: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="SIGNUP">On Signup</option>
                  <option value="PURCHASE">On Purchase</option>
                  <option value="ABANDONED_CART">Abandoned Cart</option>
                  <option value="MANUAL">Manual Enrollment</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={handleCreateSequence} disabled={loading || !form.name.trim()} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Sequence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
