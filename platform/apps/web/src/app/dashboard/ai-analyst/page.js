'use client';

import { useState } from 'react';
import { BrainCircuit, ChevronRight, Activity, AlertTriangle, CheckCircle, Navigation, Loader2 } from 'lucide-react';

export default function AnalystPage() {
  const [selectedOpp, setSelectedOpp] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    const value = e.target.value;
    setSelectedOpp(value);
    
    if (!value) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          opportunityDetails: `Opportunity ID: ${value}. Description: Looking for enterprise cloud migration and cyber security services.` 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate AI analysis. Make sure your API key is configured correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI Procurement Analyst</h1>
            <p className="text-muted-foreground mt-1">Deep AI-driven assessment and action planning</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl blur-md transition duration-500 opacity-50 group-hover:opacity-100"></div>
          <select 
            className="relative w-full bg-card border border-border text-foreground text-lg rounded-xl px-6 py-4 appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-premium disabled:opacity-50"
            value={selectedOpp}
            onChange={handleAnalyze}
            disabled={loading}
          >
            <option value="" disabled>Select an opportunity to analyze...</option>
            <option value="RFQ-10293">DHS - Cloud Infrastructure Modernization (RFQ-10293)</option>
            <option value="RFP-44921">VA - Telehealth Services Expansion (RFP-44921)</option>
          </select>
          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none rotate-90" />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-lg animate-pulse">Consulting Gemini on procurement strategy...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl text-destructive flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                <h3 className="text-lg font-medium text-muted-foreground mb-6">Overall Assessment</h3>
                
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="76" className="stroke-muted" strokeWidth="8" fill="none" />
                    <circle cx="80" cy="80" r="76" className="stroke-emerald-500" strokeWidth="8" fill="none" strokeDasharray="477" strokeDashoffset={477 - (477 * analysis.score) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                  </svg>
                  <span className="text-5xl font-bold text-foreground">{analysis.score}</span>
                </div>

                <div className="px-8 py-2 bg-emerald-500/10 text-emerald-600  border border-emerald-500/20 rounded-full text-xl font-bold tracking-widest">
                  {analysis.recommendation}
                </div>
              </div>
              
              <div className="md:col-span-2 glass-card p-8 rounded-3xl flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Executive Summary
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" /> Risk Analysis
                </h3>
                <ul className="space-y-4">
                  {analysis.risks?.map(risk => (
                    <li key={risk.id} className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border hover:border-muted-foreground/30 transition-colors">
                      <span className={`w-3 h-3 rounded-full ${risk.level === 'high' ? 'bg-destructive' : 'bg-amber-500'}`}></span>
                      <span className="text-foreground font-medium">{risk.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" /> Action Plan
                </h3>
                <ul className="space-y-4">
                  {analysis.actions?.map((action, i) => (
                    <li key={action.id} className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border hover:border-muted-foreground/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground block font-medium">{action.text}</span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full border ${action.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'} uppercase tracking-wider font-semibold whitespace-nowrap`}>
                        {action.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

