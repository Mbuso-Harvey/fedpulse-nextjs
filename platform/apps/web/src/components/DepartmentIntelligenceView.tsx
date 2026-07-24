"use client";
import React, { useState } from 'react';
import { DEPARTMENTS as DEPARTMENT_STATS, EXPIRING_CONTRACTS as MOCK_CONTRACTS } from '@/lib/mockData';
import { Contract, DepartmentStat } from '@/lib/types';
import { 
  Building2, DollarSign, ArrowLeft, ArrowUpRight, TrendingUp, Sparkles, 
  Calendar, ShieldAlert, ChevronRight, BarChart3, FileText, CheckCircle2
} from 'lucide-react';

interface DepartmentIntelligenceViewProps {
  onSelectContract: (contract: Contract) => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const DepartmentIntelligenceView: React.FC<DepartmentIntelligenceViewProps> = ({
  onSelectContract,
  onRunAiAnalyst,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentStat | null>(null);

  // Filter mock contracts for selected department
  const deptContracts = selectedDept
    ? MOCK_CONTRACTS.filter(
        c => c.department.toLowerCase().includes(selectedDept.name.toLowerCase()) ||
             c.department.toLowerCase().includes(selectedDept.code.toLowerCase())
      )
    : [];

  // Fallback to all mock contracts if none match specific filter
  const displayContracts = deptContracts.length > 0 ? deptContracts : MOCK_CONTRACTS.slice(0, 4);

  // Mock annual renewal volume data for chart
  const renewalChartData = [
    { year: '2023', val: '$820M', height: '40%' },
    { year: '2024', val: '$1.1B', height: '60%' },
    { year: '2025', val: '$1.4B', height: '75%' },
    { year: '2026 (Peak)', val: selectedDept ? selectedDept.totalValue : '$1.8B', height: '100%', active: true },
    { year: '2027', val: '$650M', height: '35%' },
  ];

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
                <span>Back to All Federal Departments</span>
              </button>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-[#635bff] text-white text-xs font-mono font-extrabold rounded-lg shadow-stripe-sm">
                      {selectedDept.code}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                      {selectedDept.expiringCount30Days} Renewals Expiry Under 30 Days
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
                    {selectedDept.name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {selectedDept.description}
                  </p>
                </div>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Total Value</span>
                    <span className="text-lg font-black text-[#0a2540]">{selectedDept.totalValue}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Active Contracts</span>
                    <span className="text-lg font-black text-[#635bff]">{selectedDept.activeContracts}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Top Vendor</span>
                    <span className="text-xs font-bold text-[#0a2540] truncate block">{selectedDept.topSupplier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending / Renewal Volume Chart */}
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
                <span className="text-xs text-slate-400 font-mono">Source: PSPC Open Procurement Graph</span>
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
                  <p className="text-xs text-slate-500">
                    Direct access to active procurement tenders & AI capture recommendations.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#e6ebf1] text-slate-500 uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-5">Contract Title</th>
                      <th className="py-3.5 px-5">Incumbent Vendor</th>
                      <th className="py-3.5 px-5">Value</th>
                      <th className="py-3.5 px-5">Expiry Window</th>
                      <th className="py-3.5 px-5 text-center">AI Win Score</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6ebf1]">
                    {displayContracts.map((c) => (
                      <tr key={c.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="py-4 px-5">
                          <div 
                            onClick={() => onSelectContract(c)}
                            className="font-bold text-[#0a2540] hover:text-[#635bff] cursor-pointer text-sm"
                          >
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.rfpReference}</div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-[#0a2540]">{c.supplier}</td>
                        <td className="py-4 px-5 font-black text-[#0a2540] text-sm">{c.value}</td>
                        <td className="py-4 px-5">
                          <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 font-bold text-xs border border-amber-100">
                            {c.daysLeft} days left
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#635bff] font-bold text-xs border border-indigo-100 inline-flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{c.winProbability}%</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => onRunAiAnalyst(c)}
                            className="px-3 py-1.5 rounded-lg bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-sm inline-flex items-center space-x-1 transition-all cursor-pointer"
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
          /* Grid View of All Departments */
          <div className="space-y-6">
            <div className="text-left bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635bff] text-xs font-bold mb-2">
                  <Building2 className="w-4 h-4 text-[#635bff]" />
                  <span>98 Federal Departments Profiled</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
                  Department Procurement Intelligence
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Select a department card to view historical spending trends, active contracts, and buyer profiles.
                </p>
              </div>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEPARTMENT_STATS.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className="bg-white rounded-2xl p-6 border border-[#e6ebf1] shadow-stripe-sm hover:shadow-stripe transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-[#635bff] text-xs font-bold font-mono border border-indigo-100">
                        {dept.code}
                      </span>
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                        {dept.expiringCount30Days} expiring soon
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#0a2540] group-hover:text-[#635bff] transition-colors">
                      {dept.name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[42px]">
                      {dept.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Total Value</span>
                        <span className="text-base font-extrabold text-[#0a2540]">{dept.totalValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Active Contracts</span>
                        <span className="text-base font-extrabold text-[#0a2540]">{dept.activeContracts}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400">Primary Vendor:</span>
                      <span className="font-bold text-[#0a2540]">{dept.topSupplier}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#635bff]">
                    <span>View Spending & Active Contracts</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
