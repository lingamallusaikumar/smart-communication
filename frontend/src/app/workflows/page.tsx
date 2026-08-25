'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Zap, Plus, ArrowDown, Play, CheckCircle2, User, Mail, Clock, Filter, CheckSquare } from 'lucide-react';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: 'Automated Lead Qualification & Welcome Sequence',
      description: 'Triggers automatically when a new inbound lead is registered.',
      trigger: 'NEW_LEAD_CREATED',
      isActive: true,
      executions: 142,
      steps: [
        { type: 'TRIGGER', label: 'Event: New Lead Created', icon: Zap, color: 'bg-amber-500 text-white' },
        { type: 'ACTION', label: 'Action: Assign Sales Representative (Round-Robin)', icon: User, color: 'bg-blue-600 text-white' },
        { type: 'ACTION', label: 'Action: Send Welcome Email & Deck', icon: Mail, color: 'bg-blue-600 text-white' },
        { type: 'DELAY', label: 'Wait: 2 Business Days', icon: Clock, color: 'bg-purple-600 text-white' },
        { type: 'CONDITION', label: 'Condition: Has Lead Opened Email or Clicked Link?', icon: Filter, color: 'bg-emerald-600 text-white' },
        { type: 'ACTION', label: 'Action: Create Follow-up Task for Assigned Rep', icon: CheckSquare, color: 'bg-blue-600 text-white' }
      ]
    },
    {
      id: 'wf-2',
      name: 'SLA Support Ticket Escalation Rules',
      description: 'Triggers when a support ticket priority is marked URGENT.',
      trigger: 'TICKET_PRIORITY_URGENT',
      isActive: true,
      executions: 28,
      steps: [
        { type: 'TRIGGER', label: 'Event: Ticket Priority = URGENT', icon: Zap, color: 'bg-red-500 text-white' },
        { type: 'ACTION', label: 'Action: Send Instant WhatsApp Alert to Lead Support Engineer', icon: Mail, color: 'bg-blue-600 text-white' },
        { type: 'ACTION', label: 'Action: Set SLA First Response Timer to 15 Mins', icon: Clock, color: 'bg-amber-600 text-white' }
      ]
    }
  ]);

  const [selectedWfId, setSelectedWfId] = useState('wf-1');
  const activeWf = workflows.find(w => w.id === selectedWfId) || workflows[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWfName, setNewWfName] = useState('');
  const [newWfTrigger, setNewWfTrigger] = useState('NEW_LEAD_CREATED');

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `wf-${Date.now()}`,
      name: newWfName,
      description: 'Custom automated event sequence.',
      trigger: newWfTrigger,
      isActive: true,
      executions: 0,
      steps: [
        { type: 'TRIGGER', label: `Event: ${newWfTrigger}`, icon: Zap, color: 'bg-amber-500 text-white' },
        { type: 'ACTION', label: 'Action: Send Email Notification', icon: Mail, color: 'bg-blue-600 text-white' }
      ]
    };
    setWorkflows([...workflows, created]);
    setSelectedWfId(created.id);
    setIsModalOpen(false);
    setNewWfName('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Event-Driven Workflow Builder</h1>
              <p className="text-xs text-slate-500 mt-1">Design visual automated rules triggered by lead, deal, communication, or support events.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Workflow Rule
            </button>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Workflows List Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">Active Automation Rules</h3>
              <div className="space-y-2">
                {workflows.map(wf => (
                  <div
                    key={wf.id}
                    onClick={() => setSelectedWfId(wf.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedWfId === wf.id ? 'bg-blue-50/80 border-blue-600 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm truncate">{wf.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{wf.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-mono bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {wf.trigger}
                      </span>
                      <span className="text-slate-400 font-medium">{wf.executions} Executions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Step-by-Step Diagram View */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{activeWf.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{activeWf.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Rule Active
                  </span>
                  <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Play className="w-3 h-3" /> Test Workflow
                  </button>
                </div>
              </div>

              {/* Step Sequence Diagram */}
              <div className="max-w-md mx-auto space-y-4 py-4">
                {activeWf.steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={idx}>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
                        <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center font-bold shadow-md`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{step.type} STEP {idx + 1}</span>
                          <p className="font-bold text-slate-900 text-sm mt-0.5">{step.label}</p>
                        </div>
                      </div>

                      {idx < activeWf.steps.length - 1 && (
                        <div className="flex justify-center my-1">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <ArrowDown className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create Workflow Automation Rule</h2>
            <form onSubmit={handleCreateWorkflow} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Workflow Name</label>
                <input
                  type="text"
                  required
                  placeholder="Automated Ticket Alert"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Trigger Event</label>
                <select
                  value={newWfTrigger}
                  onChange={(e) => setNewWfTrigger(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="NEW_LEAD_CREATED">New Lead Created</option>
                  <option value="DEAL_STAGE_CHANGED">Deal Stage Changed</option>
                  <option value="TICKET_OPENED">Support Ticket Opened</option>
                  <option value="MESSAGE_RECEIVED">Omnichannel Message Received</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-md"
                >
                  Save Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
