'use client';

import { GitCompare, Check, TrendingUp, DollarSign, FileText, Star } from 'lucide-react';
import { useDepartments } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

export default function ComparePage() {
  const [tab, setTab] = useState('departments');
  const { data: depts, loading } = useDepartments();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex justify-center"><Skeleton className="h-20 w-48 rounded-3xl" /></div>
          <div className="grid grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const deptA = depts.length > 0 ? depts[0] : null;
  const deptB = depts.length > 1 ? depts[1] : null;

  const mockData = {
    entityA: { 
      name: deptA?.name || 'Department of Defense', 
      spend: deptA ? `$${(deptA.totalValue / 1000000000).toFixed(1)}B` : '$412B', 
      contracts: deptA?.contractCount?.toString() || '89,234', 
      avgValue: '$4.6M', 
      topCategory: 'Defense & Aerospace' 
    },
    entityB: { 
      name: deptB?.name || 'Department of Homeland Security', 
      spend: deptB ? `$${(deptB.totalValue / 1000000000).toFixed(1)}B` : '$92B', 
      contracts: deptB?.contractCount?.toString() || '21,405', 
      avgValue: '$4.2M', 
      topCategory: 'IT Services' 
    }
  };

  const metrics = [
    { label: 'Total Spend (FY25)', icon: DollarSign, key: 'spend', better: 'A' },
    { label: 'Active Contracts', icon: FileText, key: 'contracts', better: 'A' },
    { label: 'Average Contract Value', icon: TrendingUp, key: 'avgValue', better: 'A' },
    { label: 'Top Category', icon: Star, key: 'topCategory', better: null }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.15)] mb-6">
          <GitCompare className="w-10 h-10 text-rose-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent mb-4">Compare Intelligence</h1>
        <p className="text-slate-400 text-lg">Side-by-side analysis of entities and market trends</p>
      </header>

      <div className="max-w-5xl mx-auto mb-10 flex justify-center">
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 flex gap-2 backdrop-blur-md">
          <button 
            className={`px-8 py-3 rounded-xl font-medium transition-all ${tab === 'departments' ? 'bg-rose-500/20 text-rose-300 shadow-lg border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            onClick={() => setTab('departments')}
          >
            Departments
          </button>
          <button 
            className={`px-8 py-3 rounded-xl font-medium transition-all ${tab === 'suppliers' ? 'bg-rose-500/20 text-rose-300 shadow-lg border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            onClick={() => setTab('suppliers')}
          >
            Suppliers
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Entity A</label>
            <select className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-rose-500 transition-colors appearance-none cursor-pointer">
              <option>Department of Defense</option>
              <option>Veterans Affairs</option>
            </select>
          </div>
          
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-slate-400 italic">
              VS
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Entity B</label>
            <select className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer">
              <option>Department of Homeland Security</option>
              <option>Health & Human Services</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40">
                <th className="py-6 px-8 text-slate-400 font-semibold uppercase tracking-wider text-sm border-b border-white/5 w-1/3">Metric</th>
                <th className="py-6 px-8 text-white font-bold text-lg border-b border-white/5 text-center">{mockData.entityA.name}</th>
                <th className="py-6 px-8 text-white font-bold text-lg border-b border-white/5 text-center">{mockData.entityB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-8 flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-rose-400 transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="font-medium text-slate-300">{metric.label}</span>
                    </td>
                    <td className={`py-6 px-8 text-center text-lg ${metric.better === 'A' ? 'text-emerald-400 font-bold bg-emerald-500/[0.02]' : 'text-slate-300 font-medium'}`}>
                      <div className="flex items-center justify-center gap-2">
                        {mockData.entityA[metric.key]}
                        {metric.better === 'A' && <Check size={20} className="text-emerald-400" />}
                      </div>
                    </td>
                    <td className={`py-6 px-8 text-center text-lg ${metric.better === 'B' ? 'text-emerald-400 font-bold bg-emerald-500/[0.02]' : 'text-slate-300 font-medium'}`}>
                      <div className="flex items-center justify-center gap-2">
                        {mockData.entityB[metric.key]}
                        {metric.better === 'B' && <Check size={20} className="text-emerald-400" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
