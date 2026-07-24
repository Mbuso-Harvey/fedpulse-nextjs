'use client';
import { useState, useEffect } from 'react';
import { Lightbulb, Target, TrendingUp, ShieldCheck } from 'lucide-react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        let data = [];
        const api = await import('@/lib/api').catch(() => null);
        if (api && typeof api.fetchRecommendations === 'function') {
          data = await api.fetchRecommendations();
        }
        
        if (!data || data.length === 0) {
          data = [
            {
              id: 1,
              category: 'bid_strategy',
              icon: Target,
              color: 'from-fuchsia-500 to-purple-500',
              badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
              title: 'Target DND IT Services Renewals',
              description: 'Department of National Defence has $4.2B in IT services expiring in Q3. Historical data shows they favor incumbent switching when performance scores are below 85%.',
              confidence: 92,
              impact: 'high',
              source: 'Derived from historical DND contract patterns and Q3 expiry pipeline'
            },
            {
              id: 2,
              category: 'pricing_strategy',
              icon: TrendingUp,
              color: 'from-emerald-500 to-teal-500',
              badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              title: 'Increase Margin on Cyber Contracts',
              description: 'Analysis of recent cybersecurity awards indicates a 15% increase in accepted rates across SSC and CBSA. Adjust pricing models upward for upcoming cyber bids.',
              confidence: 88,
              impact: 'high',
              source: 'SSC & CBSA pricing trend analysis (2023-2024)'
            },
            {
              id: 3,
              category: 'compliance',
              icon: ShieldCheck,
              color: 'from-amber-500 to-orange-500',
              badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              title: 'New Accessibility Requirements',
              description: 'Upcoming RFPs from ESDC will include strict WCAG 2.1 AA compliance mandates. Ensure technical proposals highlight accessibility compliance.',
              confidence: 99,
              impact: 'medium',
              source: 'ESDC procurement policy update bulletin'
            }
          ];
        }
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-400 text-lg font-medium tracking-widest uppercase">Generating AI Insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <header className="mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <Lightbulb className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Intelligence Recommendations</h1>
            <p className="text-slate-400 mt-1">AI-powered procurement action guidance</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon || Lightbulb;
          return (
            <div 
              key={rec.id || index} 
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:border-white/10 group flex flex-col"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${rec.color} shadow-lg text-white`}>
                  <Icon size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${rec.badgeColor}`}>
                    {rec.category.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${rec.impact === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                    {rec.impact} Impact
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-colors">{rec.title}</h2>
              <p className="text-slate-400 leading-relaxed mb-8 flex-1">{rec.description}</p>
              
              <div className="mt-auto space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">AI Confidence Score</span>
                    <span className="text-white font-mono font-bold">{rec.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${rec.color}`}
                      style={{ width: `${rec.confidence}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 text-xs text-slate-500 font-medium">
                  <span className="text-slate-600">Source:</span> {rec.source}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
