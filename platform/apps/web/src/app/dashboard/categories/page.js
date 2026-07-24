'use client';

import { Layers, Box, Cpu, Building2, Stethoscope, Shield, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    { id: '1', name: 'IT & Software', icon: Cpu, value: '$124.5B', count: '45,210', topDept: 'DoD', topSupplier: 'Microsoft', color: 'from-blue-500 to-indigo-500', bgIcon: 'text-blue-500/10' },
    { id: '2', name: 'Defense & Aerospace', icon: Shield, value: '$210.8B', count: '12,400', topDept: 'DoD', topSupplier: 'Lockheed Martin', color: 'from-rose-500 to-red-600', bgIcon: 'text-rose-500/10' },
    { id: '3', name: 'Healthcare Services', icon: Stethoscope, value: '$84.2B', count: '28,105', topDept: 'VA', topSupplier: 'McKesson', color: 'from-emerald-400 to-emerald-600', bgIcon: 'text-emerald-500/10' },
    { id: '4', name: 'Construction', icon: Building2, value: '$65.1B', count: '31,800', topDept: 'GSA', topSupplier: 'Turner', color: 'from-amber-400 to-orange-500', bgIcon: 'text-amber-500/10' },
    { id: '5', name: 'Professional Services', icon: Box, value: '$92.3B', count: '55,000', topDept: 'DHS', topSupplier: 'Deloitte', color: 'from-purple-500 to-purple-700', bgIcon: 'text-purple-500/10' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900  flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            <Layers className="w-6 h-6" />
          </div>
          Category Intelligence
        </h1>
        <p className="text-slate-500  text-lg">Analyze spending across major procurement categories and identify growth areas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="group relative bg-white/60  backdrop-blur-xl border border-slate-200  rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50  hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Background Icon */}
            <div className={`absolute -right-6 -bottom-6 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${cat.bgIcon}`}>
              <cat.icon className="w-40 h-40" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-white  rounded-[14px] flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-slate-900 " />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900  flex-1">{cat.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spend</span>
                  <span className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${cat.color}`}>
                    {cat.value}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contracts</span>
                  <span className="text-xl font-bold text-slate-800 ">{cat.count}</span>
                </div>
              </div>
              
              <div className="mt-auto space-y-3 bg-slate-50/80  rounded-2xl p-4 border border-slate-100 ">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Top Department</span>
                  <span className="font-semibold text-slate-900 ">{cat.topDept}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Top Supplier</span>
                  <span className="font-semibold text-slate-900 ">{cat.topSupplier}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm font-medium text-blue-600  group-hover:text-blue-700  transition-colors">
                View detailed analysis <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

