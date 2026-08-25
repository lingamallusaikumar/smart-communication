'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { CheckSquare, Calendar, Plus, Clock, AlertCircle, CheckCircle2, User, Building } from 'lucide-react';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');

  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Send Enterprise Proposal to TechCorp',
      description: 'Prepare custom 50-seat pricing breakdown with WhatsApp integration add-on.',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: 'Today, 4:00 PM',
      assignedTo: 'Alex Morgan',
      customer: 'Sarah Jenkins (TechCorp)',
    },
    {
      id: 'task-2',
      title: 'Follow-up Call with Global Retail Legal Team',
      description: 'Review contract section 4 regarding SLA uptime guarantees.',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      dueDate: 'Tomorrow, 11:00 AM',
      assignedTo: 'Alex Morgan',
      customer: 'Michael Chang (Global Retail)',
    },
    {
      id: 'task-3',
      title: 'Schedule Product Walkthrough for Starlight',
      description: 'Demo AI Smart Customer Memory Bank feature.',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: 'Yesterday',
      assignedTo: 'Taylor Swift',
      customer: 'Elena Rostova (Starlight)',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'PENDING',
      dueDate: newTask.dueDate || 'Tomorrow, 5:00 PM',
      assignedTo: 'Alex Morgan',
      customer: 'Assigned Customer',
    };
    setTasks([created, ...tasks]);
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Task Management & Calendar</h1>
              <p className="text-xs text-slate-500 mt-1">Organize team tasks, follow-up reminders, and customer call events.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-md transition ${viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                >
                  Task List
                </button>
                <button
                  onClick={() => setViewMode('CALENDAR')}
                  className={`px-3 py-1.5 rounded-md transition ${viewMode === 'CALENDAR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                >
                  Calendar View
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Create Task
              </button>
            </div>
          </div>

          {viewMode === 'LIST' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {tasks.map((task) => (
                <div key={task.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition ${
                      task.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-blue-500'
                    }`}
                  >
                    {task.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-slate-900 text-base ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">{task.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Due: {task.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Assigne: {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Building className="w-3.5 h-3.5" /> {task.customer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900">Calendar View (August 2026)</h3>
                <span className="text-xs text-slate-500 font-medium">Weekly View</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 py-2 border-b border-slate-100">
                <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
              </div>
              <div className="grid grid-cols-7 gap-2 h-96">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-2 text-xs text-slate-400 font-medium bg-slate-50/50 hover:bg-blue-50/50 transition">
                    <span className="font-bold text-slate-700">{i + 1}</span>
                    {i === 24 && (
                      <div className="mt-1 bg-blue-600 text-white p-1 rounded text-[10px] font-bold truncate">
                        11:00 AM Call w/ Global Retail
                      </div>
                    )}
                    {i === 25 && (
                      <div className="mt-1 bg-amber-500 text-white p-1 rounded text-[10px] font-bold truncate">
                        4:00 PM TechCorp Proposal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Send proposal"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                />
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
