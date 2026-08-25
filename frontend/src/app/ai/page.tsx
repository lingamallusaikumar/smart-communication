'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Bot, Sparkles, TrendingUp, AlertCircle, ArrowRight, Brain, Zap, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AiIntelligencePage() {
  const [inputText, setInputText] = useState(
    "Hi Sarah, we are considering adding 5 new sales representatives to our SmartCommunication workspace before the end of the month. Could you confirm pricing and if custom SLA rules can be applied?"
  );

  const [aiResult, setAiResult] = useState<any>({
    sentiment: 'POSITIVE',
    intent: 'Pricing & Seat Expansion',
    summary: 'Customer inquiring about adding 5 sales reps and custom SLA rules prior to end of month.',
    recommendedAction: 'Schedule an executive demo call within 24 hours and send enterprise pricing proposal.',
    smartReplies: [
      'Hi Sarah! Yes, you can add 5 additional sales reps directly. I can send a custom proposal today.',
      'Hello Sarah, I would be glad to set up a 15-minute call to walk through the custom SLA configuration for your team.'
    ]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const lower = inputText.toLowerCase();
      let sentiment = 'POSITIVE';
      if (lower.contains ? lower.contains('issue') || lower.contains('cancel') : lower.includes('cancel')) {
        sentiment = 'NEGATIVE';
      } else if (lower.includes('urgent') || lower.includes('error')) {
        sentiment = 'URGENT';
      }

      setAiResult({
        sentiment,
        intent: lower.includes('pricing') || lower.includes('seat') ? 'Pricing & Seat Expansion' : 'General Product Inquiry',
        summary: `AI analyzed conversation text (${inputText.length} characters). Extracted key intent & sentiment metrics.`,
        recommendedAction: 'Assign Sales Manager for follow-up outreach within 24 hours.',
        smartReplies: [
          'Thank you for reaching out! I can assist you with your request immediately.',
          'I have forwarded your inquiry to our account specialist for review.'
        ]
      });
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between border border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 font-semibold px-3 py-1 rounded-full text-xs mb-3 border border-blue-500/30">
                <Brain className="w-3.5 h-3.5" /> Smart Customer Memory Bank
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Engine</h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Real-time conversation summaries, customer sentiment analysis, intent detection, and automated smart customer memory bank.
              </p>
            </div>
            <Sparkles className="w-16 h-16 text-blue-400 opacity-20 hidden md:block" />
          </div>

          {/* AI Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Customer Sentiment</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">68% Positive</p>
                <p className="text-xs text-slate-400 mt-1">Across 1,248 Conversations</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                😊
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Urgent Risk Signals</p>
                <p className="text-2xl font-bold text-red-600 mt-1">4 Escalations</p>
                <p className="text-xs text-slate-400 mt-1">Requires Support Response</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                ⚠️
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Smart Memory Banks</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">1,120 Profiles</p>
                <p className="text-xs text-slate-400 mt-1">Channel & Window Tracked</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">AI Smart Replies</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">94.2% Accepted</p>
                <p className="text-xs text-slate-400 mt-1">By Sales & Support Agents</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Live AI Conversation Analysis Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Simulator */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900">Live AI Conversation Analyzer</h2>
              </div>
              <form onSubmit={handleRunAnalysis} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Paste Customer Message or Transcript
                  </label>
                  <textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition leading-relaxed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> {isAnalyzing ? 'Analyzing via AI Engine...' : 'Run AI Sentiment & Intent Analysis'}
                </button>
              </form>
            </div>

            {/* AI Real-time Output Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <h2 className="font-bold">AI Customer Insights Output</h2>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {aiResult.sentiment} SENTIMENT
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Detected Customer Intent</span>
                  <p className="text-sm font-bold text-blue-300">{aiResult.intent}</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Executive Summary</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{aiResult.summary}</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider block">Recommended Next-Best Action</span>
                  <p className="text-slate-100 font-semibold">{aiResult.recommendedAction}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Suggested Smart Replies</span>
                  {aiResult.smartReplies.map((reply: string, idx: number) => (
                    <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/40 text-slate-300 text-xs">
                      "{reply}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
