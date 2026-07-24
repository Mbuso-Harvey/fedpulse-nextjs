'use client';

import { useState } from 'react';
import { Copy, Search, ArrowRight, Briefcase, Zap } from 'lucide-react';

export default function SimilarPage() {
  const [query, setQuery] = useState('');

  const mockSimilar = [
    { id: '1', title: 'IT Enterprise Support Services', dept: 'Department of Defense', supplier: 'Booz Allen Hamilton', value: '$45.2M', score: 94, category: 'IT Services' },
    { id: '2', title: 'Cloud Infrastructure Modernization', dept: 'Department of Homeland Security', supplier: 'AWS', value: '$112M', score: 88, category: 'Cloud' },
    { id: '3', title: 'Data Analytics Platform', dept: 'Veterans Affairs', supplier: 'Palantir', value: '$34.5M', score: 76, category: 'Software' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <header className="mb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Copy className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Similar Opportunity Finder</h1>
            <p className="text-slate-400 mt-1">Discover related contracts using semantic search</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mb-12 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-2 flex items-center shadow-2xl">
          <Search className="w-6 h-6 text-slate-400 ml-6 mr-3" />
          <input 
            type="text" 
            placeholder="Enter keywords, RFP number, or describe the contract..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 px-2 py-4 text-lg"
          />
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2">
            Find Matches <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {mockSimilar.map((item, i) => (
          <div key={item.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:bg-slate-900/60 hover:border-white/10 transition-all duration-300 shadow-xl group">
            <div className="h-1.5 w-full bg-slate-800 flex">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-md border border-white/5">
                    <Briefcase size={14} /> {item.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-md border border-emerald-500/20">
                    {item.score}% Match
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{item.title}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Agency</p>
                    <p className="text-slate-300 font-medium">{item.dept}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Supplier</p>
                    <p className="text-slate-300 font-medium">{item.supplier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Value</p>
                    <p className="text-slate-300 font-medium font-mono text-lg">{item.value}</p>
                  </div>
                </div>
              </div>
              
              <button className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors font-medium">
                Use as Reference <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
