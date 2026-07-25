"use client";
import React from 'react';
import { Contract, SupplierProfile } from '@/lib/types';
import { useContracts, useSuppliers } from '@/lib/api';
import { Users, Crosshair, Sparkles, Download, ArrowUpRight } from 'lucide-react';

interface SuppliersViewProps {
  onSelectContract: (contract: Contract) => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  onSelectContract,
  onRunAiAnalyst,
}) => {
  const { data: MOCK_CONTRACTS, loading: contractsLoading } = useContracts();
  const { data: SUPPLIER_STATS, loading: supsLoading } = useSuppliers();

  if (contractsLoading || supsLoading) {
    return <div className="p-8 text-slate-400">Loading intelligence data...</div>;
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const getThreatLevel = (sup: SupplierProfile) => {
    const depts = sup.departmentFootprint?.length || 0;
    const val = sup.totalContractValue;
    if (depts >= 2 && val > 1000000000) return { label: 'Apex Predator', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (depts === 1 || (depts > 1 && val < 500000000)) return { label: 'Niche Specialist', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    return { label: 'Vulnerable Target', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title Header */}
        <div className="mb-8 text-left bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635bff] text-xs font-bold mb-2">
              <Users className="w-4 h-4 text-[#635bff]" />
              <span>Competitor Threat Board</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
              Incumbent Supplier Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze prime vendor market share, lock-in win rates, and generate AI-driven strategies to unseat incumbents.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs hidden sm:block">
              <span className="text-slate-400 font-medium block">Avg Incumbent Win Rate</span>
              <span className="text-base font-black text-[#635bff]">73.8%</span>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-colors inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Suppliers (CSV)
            </button>
          </div>
        </div>

        {/* High Density Threat Board Data Table */}
        <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-stripe overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e6ebf1] font-bold text-[#0a2540] text-sm">
                  <th className="py-4 px-6 w-1/4">Supplier</th>
                  <th className="py-4 px-6">Threat Level</th>
                  <th className="py-4 px-6">Total Portfolio Value</th>
                  <th className="py-4 px-6 w-1/4">Whitespace (Missing Depts)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6ebf1] text-sm">
                {SUPPLIER_STATS.sort((a, b) => b.totalContractValue - a.totalContractValue).map((sup) => {
                  const threat = getThreatLevel(sup);
                  // Mock whitespace: if they are heavily in DOD, they might have whitespace in HHS
                  const hasDOD = sup.departmentFootprint?.some(d => d.deptName === 'DOD');
                  const whitespace = hasDOD ? 'HHS, VA' : 'DOD, DHS';

                  return (
                    <tr key={sup.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="font-semibold text-[#635bff]">{sup.name}</div>
                        <div className="mt-1 text-xs text-slate-500 flex items-center space-x-2">
                          <span>{sup.contractCount || sup.activeContractsCount} Contracts</span>
                          <span>•</span>
                          <span>{sup.location || sup.headquarters}</span>
                        </div>
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {sup.setAsideCapabilities?.map(cap => (
                            <span key={cap} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase">{cap}</span>
                          ))}
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${threat.color}`}>
                          {threat.label}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1.5">
                          In {sup.departmentFootprint?.length || 1} core departments
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="font-black text-[#0a2540] text-base">{formatCurrency(sup.totalContractValue)}</div>
                        <div className="text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-1.5 py-0.5 rounded">
                          Win Rate: {sup.winRate || '78%'}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block border border-slate-200">
                          {whitespace}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1.5">
                          High capability match, 0% footprint
                        </div>
                      </td>

                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end items-center space-x-3">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              // Mock find contract for this supplier
                              const relatedContract = MOCK_CONTRACTS.find(c => c.supplier === sup.name || c.incumbent === sup.name);
                              if (relatedContract) onRunAiAnalyst(relatedContract as any);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-sm inline-flex items-center space-x-1 cursor-pointer transition-colors"
                            title="Generate AI Unseat Strategy"
                          >
                            <Crosshair className="w-3 h-3" />
                            <span>Unseat Strategy</span>
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-[#635bff] transition-colors" title="View Supplier Profile">
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
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
    </div>
  );
};
