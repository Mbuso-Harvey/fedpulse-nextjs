"use client";
import React from 'react';
import { SUPPLIER_STATS, MOCK_CONTRACTS } from '@/lib/mockData';
import { ActiveView, Contract } from '@/lib/types';
import { Users, Briefcase, Award, Building2, ArrowUpRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface SuppliersViewProps {
  onSelectContract: (contract: Contract) => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  onSelectContract,
  onRunAiAnalyst,
}) => {
  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title Header */}
        <div className="mb-8 text-left bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635bff] text-xs font-bold mb-2">
              <Users className="w-4 h-4 text-[#635bff]" />
              <span>2,273 Federal Incumbent Vendors Profiled</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
              Incumbent Supplier Market Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze prime vendor market share, incumbent lock-in win rates, and primary federal buyer relationships.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Avg Incumbent Win Rate</span>
              <span className="text-base font-black text-[#635bff]">73.8%</span>
            </div>
          </div>
        </div>

        {/* Supplier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {SUPPLIER_STATS.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-2xl p-6 border border-[#e6ebf1] shadow-stripe-sm hover:shadow-stripe transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0a2540]">
                      {sup.name}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 font-medium mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{sup.headquarters || sup.location}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Win Rate</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-100">
                      {sup.winRate || '65%'}
                    </span>
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block">Total Federal Portfolio</span>
                    <span className="text-base font-black text-[#0a2540]">{sup.totalValue || `$${(sup.totalContractValue/1000000000).toFixed(1)}B`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Active Contracts</span>
                    <span className="text-base font-black text-[#635bff]">{sup.activeContractsCount || sup.contractCount}</span>
                  </div>
                </div>

                {/* Top Departments */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Top Federal Buyer Departments:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(sup.topDepartments || sup.departmentFootprint?.map(d => d.deptName) || []).map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50/80 text-[#635bff] font-bold text-xs border border-indigo-100">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Incumbent Renewal Contracts Spotlight */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample Expiring Contracts for {sup.name}:
                </span>
                <div className="space-y-2">
                  {MOCK_CONTRACTS.filter(c => c.supplier === sup.name || c.incumbent === sup.name).map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => onSelectContract(c)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#0a2540]">{c.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.department} • {c.value}</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunAiAnalyst(c);
                        }}
                        className="px-2 py-1 bg-[#635bff] text-white rounded text-[10px] font-bold flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Strategy</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
