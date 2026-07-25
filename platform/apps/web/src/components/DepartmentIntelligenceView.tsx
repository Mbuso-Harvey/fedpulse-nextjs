"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Contract, DepartmentProfile } from '@/lib/types';
import { useContracts, useDepartments } from '@/lib/api';
import { 
  Building2, ArrowLeft, ArrowUpRight, BarChart3, Sparkles, Download
} from 'lucide-react';

interface DepartmentIntelligenceViewProps {
  onSelectContract: (contract: Contract) => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const DepartmentIntelligenceView: React.FC<DepartmentIntelligenceViewProps> = ({
  onSelectContract,
  onRunAiAnalyst,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentProfile | null>(null);
  const { data: MOCK_CONTRACTS, loading: contractsLoading } = useContracts();
  const { data: DEPARTMENT_STATS, loading: deptsLoading } = useDepartments();

  if (contractsLoading || deptsLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-8 w-1/2 mb-6" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Filter mock contracts for selected department
  const deptContracts = selectedDept
    ? MOCK_CONTRACTS.filter(
        c => c.department.toLowerCase().includes(selectedDept.name.toLowerCase()) ||
             c.department.toLowerCase().includes(selectedDept.code.toLowerCase())
      )
    : [];

  const displayContracts = deptContracts.length > 0 ? deptContracts : MOCK_CONTRACTS.slice(0, 4);

  const renewalChartData = [
    { year: '2023', val: '$820M', height: '40%' },
    { year: '2024', val: '$1.1B', height: '60%' },
    { year: '2025', val: '$1.4B', height: '75%' },
    { year: '2026 (Peak)', val: selectedDept ? `$${(selectedDept.totalValue / 1000000000).toFixed(1)}B` : '$1.8B', height: '100%', active: true },
    { year: '2027', val: '$650M', height: '35%' },
  ];

  // Max value for progress bars
  const maxDeptValue = Math.max(...DEPARTMENT_STATS.map(d => d.totalValue));

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const getMonopolyIndex = (dept: DepartmentProfile) => {
    // Sum the market share of the top 3 suppliers
    const concentration = dept.topSuppliers.slice(0, 3).reduce((sum, s) => sum + s.share, 0);
    if (concentration > 50) return { label: 'High (Monopolized)', color: 'text-rose-600 bg-rose-50 border-rose-100', val: concentration };
    if (concentration > 30) return { label: 'Medium (Concentrated)', color: 'text-amber-600 bg-amber-50 border-amber-100', val: concentration };
    return { label: 'Low (Fragmented)', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', val: concentration };
  };

  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If a department is selected, render Detailed View */}
        {selectedDept ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Back Button & Header */}
            <div className="bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm">
              <button
                onClick={() => setSelectedDept(null)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Market Data</span>
              </button>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-[#635bff] text-white text-xs font-mono font-extrabold rounded-lg shadow-stripe-sm">
                      {selectedDept.code}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
                    {selectedDept.name}
                  </h1>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Total Value</span>
                    <span className="text-lg font-black text-[#0a2540]">{formatCurrency(selectedDept.totalValue)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Active Contracts</span>
                    <span className="text-lg font-black text-[#635bff]">{selectedDept.contractCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Top Vendor</span>
                    <span className="text-xs font-bold text-[#0a2540] truncate block">{selectedDept.topSuppliers[0]?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Chart */}
            <div className="bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#635bff]">
                    <BarChart3 className="w-4 h-4" />
                    <span>Annual Contract Renewal Cadence</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0a2540] mt-0.5">
                    {selectedDept.code} Renewal Volume Forecast (2023 - 2027)
                  </h3>
                </div>
              </div>

              <div className="h-44 flex items-end justify-between gap-4 px-6 pb-2 pt-6 bg-slate-50/70 rounded-xl border border-slate-100">
                {renewalChartData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className={`text-[11px] font-extrabold mb-2 ${item.active ? 'text-[#635bff]' : 'text-slate-500'}`}>
                      {item.val}
                    </span>
                    <div 
                      style={{ height: item.height }} 
                      className={`w-full max-w-[60px] rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                        item.active 
                          ? 'bg-gradient-to-t from-[#635bff] to-[#e056fd] shadow-stripe-sm' 
                          : 'bg-slate-300'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-600 mt-2 font-mono">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Active Contracts Table */}
            <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-stripe overflow-hidden">
              <div className="p-5 border-b border-[#e6ebf1] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0a2540]">
                    Expiring Contracts in {selectedDept.name}
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e6ebf1] font-bold text-[#0a2540] text-sm">
                      <th className="py-4 px-5">Contract</th>
                      <th className="py-4 px-5">Incumbent</th>
                      <th className="py-4 px-5">Value</th>
                      <th className="py-4 px-5">Days Left</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6ebf1] text-sm">
                    {displayContracts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-semibold text-[#635bff]">{c.title}</td>
                        <td className="py-4 px-5 text-slate-600">{c.incumbent}</td>
                        <td className="py-4 px-5 font-bold text-[#0a2540]">{formatCurrency(c.value)}</td>
                        <td className="py-4 px-5">
                          <span className={`font-bold ${c.daysLeft < 30 ? 'text-rose-600' : c.daysLeft < 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {c.daysLeft}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => onRunAiAnalyst(c as any)}
                            className="px-3 py-1.5 rounded-lg bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-sm inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Strategy</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* High Density Table View of All Departments */
          <div className="space-y-6">
            <div className="text-left bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635bff] text-xs font-bold mb-2">
                  <Building2 className="w-4 h-4 text-[#635bff]" />
                  <span>Federal Market Sandbox</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
                  Department Intelligence
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  High-density federal market data. Sorted by total historical spend.
                </p>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-colors inline-flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Entire Market (CSV)
              </button>
            </div>

            {/* High Density Data Table */}
            <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-stripe overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e6ebf1] font-bold text-[#0a2540] text-sm">
                      <th className="py-4 px-6 w-1/3">Department</th>
                      <th className="py-4 px-6">Market Value</th>
                      <th className="py-4 px-6">Monopoly Index</th>
                      <th className="py-4 px-6">Top Category</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6ebf1] text-sm">
                    {DEPARTMENT_STATS.sort((a, b) => b.totalValue - a.totalValue).map((dept) => {
                      const monopoly = getMonopolyIndex(dept);
                      const widthPercent = Math.max(5, (dept.totalValue / maxDeptValue) * 100);
                      
                      return (
                        <tr key={dept.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedDept(dept)}>
                          <td className="py-5 px-6">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-[#635bff]">{dept.name}</span>
                            </div>
                            <div className="mt-1 text-xs text-slate-500 flex items-center space-x-2">
                              <span>{dept.contractCount.toLocaleString()} Active Contracts</span>
                              <span>•</span>
                              <span>{dept.topSuppliers[0]?.name} (Incumbent)</span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="font-black text-[#0a2540] mb-1.5">{formatCurrency(dept.totalValue)}</div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#635bff] rounded-full" 
                                style={{ width: `${widthPercent}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${monopoly.color}`}>
                              {monopoly.label}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Top 3 control {monopoly.val.toFixed(1)}%</div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                              {dept.topCategories[0]?.category || 'Various'}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); /* Download logic */ }}
                                className="p-2 text-slate-400 hover:text-[#635bff] hover:bg-indigo-50 rounded-md transition-colors"
                                title="Download Market Report (CSV)"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 group-hover:text-[#635bff] transition-colors">
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
        )}

      </div>
    </div>
  );
};
