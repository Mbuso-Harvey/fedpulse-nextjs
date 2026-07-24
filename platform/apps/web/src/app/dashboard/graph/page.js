'use client';

import { Network, Search, Filter } from 'lucide-react';

export default function GraphPage() {
  const nodes = [
    { id: 1, label: 'DoD', type: 'dept', x: 50, y: 50 },
    { id: 2, label: 'Lockheed Martin', type: 'supplier', x: 20, y: 30 },
    { id: 3, label: 'Boeing', type: 'supplier', x: 80, y: 30 },
    { id: 4, label: 'Northrop Grumman', type: 'supplier', x: 20, y: 70 },
    { id: 5, label: 'Raytheon', type: 'supplier', x: 80, y: 70 },
    { id: 6, label: 'F-35 Program', type: 'contract', x: 35, y: 40 },
    { id: 7, label: 'Space Systems', type: 'contract', x: 65, y: 60 }
  ];

  const edges = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 2, target: 6 },
    { source: 1, target: 6 },
    { source: 3, target: 7 },
    { source: 1, target: 7 }
  ];

  const getColor = (type) => {
    switch(type) {
      case 'dept': return 'from-blue-500 to-cyan-500 shadow-blue-500/50';
      case 'supplier': return 'from-purple-500 to-pink-500 shadow-purple-500/50';
      case 'contract': return 'from-amber-500 to-orange-500 shadow-amber-500/50';
      default: return 'from-slate-500 to-slate-400 shadow-slate-500/50';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950 flex flex-col text-slate-200 overflow-hidden">
      <header className="p-6 shrink-0 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              <Network className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Knowledge Graph</h1>
              <p className="text-slate-400 text-sm">Entity & Contract Relationships</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Find node..." className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-teal-500 outline-none w-64" />
            </div>
            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors">
              <Filter className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col gap-8 shrink-0 z-10">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Graph Statistics</h3>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <span className="block text-slate-400 text-xs uppercase font-semibold mb-1">Total Nodes</span>
                <span className="text-2xl font-bold text-white font-mono">14,293</span>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <span className="block text-slate-400 text-xs uppercase font-semibold mb-1">Total Edges</span>
                <span className="text-2xl font-bold text-white font-mono">89,401</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legend</h3>
            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <span className="text-sm font-medium text-slate-300">Department</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                <span className="text-sm font-medium text-slate-300">Supplier</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <span className="text-sm font-medium text-slate-300">Contract</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge, i) => {
              const s = nodes.find(n => n.id === edge.source);
              const t = nodes.find(n => n.id === edge.target);
              return (
                <line 
                  key={i} 
                  x1={`${s.x}%`} y1={`${s.y}%`} 
                  x2={`${t.x}%`} y2={`${t.y}%`} 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
              );
            })}
          </svg>
          
          {nodes.map(node => (
            <div 
              key={node.id} 
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-gradient-to-br ${getColor(node.type)} text-white font-semibold text-sm shadow-lg border border-white/20 cursor-pointer hover:scale-110 hover:z-10 transition-transform duration-300 whitespace-nowrap`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
