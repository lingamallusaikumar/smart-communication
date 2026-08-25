'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { KanbanSquare, Plus, Building, User, ChevronRight, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealService, DealData } from '@/services/dealService';

export default function DealsPage() {
  const queryClient = useQueryClient();

  // Demo Fallback Data Structure
  const initialStages = [
    {
      id: 'stage-1',
      name: 'Qualification',
      probability: 20,
      deals: [
        { id: 'deal-1', title: 'Apex Logistics SLA Renewal', value: 18000, company: 'Apex Logistics', contact: 'Robert Fox' },
        { id: 'deal-2', title: 'FinTech Growth Package', value: 25000, company: 'FinTech Dynamics', contact: 'David Miller' }
      ]
    },
    {
      id: 'stage-2',
      name: 'Proposal / Demo',
      probability: 50,
      deals: [
        { id: 'deal-3', title: 'CloudScale Infrastructure CRM', value: 60000, company: 'CloudScale Networks', contact: 'Jessica Alba' }
      ]
    },
    {
      id: 'stage-3',
      name: 'Negotiation',
      probability: 75,
      deals: [
        { id: 'deal-4', title: 'TechCorp 50-Seat Enterprise License', value: 45000, company: 'TechCorp Solutions', contact: 'Sarah Jenkins' }
      ]
    },
    {
      id: 'stage-4',
      name: 'Closed Won',
      probability: 100,
      deals: [
        { id: 'deal-5', title: 'Global Retail Omnichannel Hub', value: 120000, company: 'Global Retail Network', contact: 'Michael Chang' }
      ]
    }
  ];

  const [stages, setStages] = useState(initialStages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: '', value: '', company: '', stageId: 'stage-1' });

  // Fetch Deals & Forecast from REST API
  const { data: apiDeals, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealService.getDeals(),
  });

  const { data: forecastData } = useQuery({
    queryKey: ['sales-forecast'],
    queryFn: dealService.getSalesForecast,
  });

  // Forecasting Math
  const totalPipeline = forecastData?.totalPipelineValue || stages.reduce((acc, stage) => 
    acc + stage.deals.reduce((dAcc, deal) => dAcc + deal.value, 0), 0
  );

  const weightedForecast = forecastData?.weightedForecast || stages.reduce((acc, stage) => 
    acc + stage.deals.reduce((dAcc, deal) => dAcc + (deal.value * stage.probability / 100), 0), 0
  );

  // Update Stage Mutation
  const updateStageMutation = useMutation({
    mutationFn: ({ dealId, stageId }: { dealId: string; stageId: string }) => 
      dealService.updateDealStage(dealId, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['sales-forecast'] });
    },
  });

  const moveDealStage = (dealId: string, currentStageId: string, targetStageId: string) => {
    updateStageMutation.mutate({ dealId, stageId: targetStageId });

    let movedDeal: any = null;
    const updatedStages = stages.map(stage => {
      if (stage.id === currentStageId) {
        movedDeal = stage.deals.find(d => d.id === dealId);
        return { ...stage, deals: stage.deals.filter(d => d.id !== dealId) };
      }
      return stage;
    });

    if (movedDeal) {
      setStages(updatedStages.map(stage => {
        if (stage.id === targetStageId) {
          return { ...stage, deals: [...stage.deals, movedDeal] };
        }
        return stage;
      }));
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `deal-${Date.now()}`,
      title: newDeal.title,
      value: parseFloat(newDeal.value) || 10000,
      company: newDeal.company || 'Enterprise Account',
      contact: 'Account Manager'
    };

    setStages(stages.map(stage => {
      if (stage.id === newDeal.stageId) {
        return { ...stage, deals: [...stage.deals, created] };
      }
      return stage;
    }));

    setIsModalOpen(false);
    setNewDeal({ title: '', value: '', company: '', stageId: 'stage-1' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline Kanban</h1>
              <p className="text-xs text-slate-500 mt-1">Manage sales opportunities, stage velocity, and revenue forecasting.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900"
                title="Refresh Forecast"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Deal Opportunity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Pipeline Value</p>
              <p className="text-2xl font-black text-slate-900 mt-1">${Number(totalPipeline).toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Weighted Revenue Forecast</p>
              <p className="text-2xl font-black text-blue-600 mt-1">${Number(weightedForecast).toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase">Active Opportunities</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {stages.reduce((acc, s) => acc + s.deals.length, 0)} Deals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 space-y-4 min-h-[600px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{stage.name}</h3>
                    <span className="text-[11px] font-semibold text-slate-500">{stage.probability}% Probability</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {stage.deals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stage.deals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <p className="font-bold text-slate-900 text-sm">{deal.title}</p>
                        <span className="font-extrabold text-blue-600 text-sm">${deal.value.toLocaleString()}</span>
                      </div>

                      <div className="text-xs text-slate-500 space-y-1">
                        <p className="flex items-center gap-1 font-medium text-slate-700">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> {deal.company}
                        </p>
                        <p className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {deal.contact}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[10px]">Move Stage:</span>
                        <div className="flex gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => moveDealStage(deal.id, stage.id, stages[idx - 1].id)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                            >
                              ← Back
                            </button>
                          )}
                          {idx < stages.length - 1 && (
                            <button
                              onClick={() => moveDealStage(deal.id, stage.id, stages[idx + 1].id)}
                              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[11px] font-semibold flex items-center gap-0.5"
                            >
                              Next <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create Sales Deal</h2>
            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise License Expansion"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Account</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Deal Value ($)</label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
