"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Contract } from '@/lib/types';
import { DEPARTMENT_STATS } from '@/lib/mockData';
import { 
  Search, Filter, ArrowUpDown, Sparkles, Building2, Radio, 
  ChevronRight, FileSpreadsheet, Loader2, ChevronLeft, ChevronRight as ChevronRightIcon,
  AlertCircle, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';

interface DataExplorerViewProps {
  onSelectContract: (contract: Contract) => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({
  onSelectContract,
  onRunAiAnalyst,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [sortBy, setSortBy] = useState<'days' | 'value' | 'winProbability'>('days');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalValueFormatted: '$22.4B', avgDaysLeft: 84 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch contracts from backend
  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        dept: selectedDept,
        risk: selectedRisk,
        sortBy,
        order: sortOrder,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/contracts?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: Failed to load contracts`);
      }

      const data = await res.json();
      setContracts(data.contracts || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error connecting to procurement dataset server');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedDept, selectedRisk, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // CSV Export trigger
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        dept: selectedDept,
        risk: selectedRisk,
      });

      const exportUrl = `/api/contracts/export?${queryParams.toString()}`;
      const response = await fetch(exportUrl);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `fedpulse-renewals-${selectedDept === 'ALL' ? 'all' : selectedDept.toLowerCase().replace(/\s+/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert('Failed to generate CSV export: ' + err?.message);
    } finally {
      setExporting(false);
    }
  };

  const handleSortToggle = (field: 'days' | 'value' | 'winProbability') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  return (
    <div className="py-10 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#635bff] mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Live Procurement Server Engine • {total.toLocaleString()} Matching Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">
              Federal Contract Renewal Explorer
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track upcoming contract expirations across 98 federal departments before tenders release.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="px-4 py-2.5 rounded-xl border border-[#e6ebf1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0a2540] flex items-center space-x-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 text-[#635bff] animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              )}
              <span>{exporting ? 'Generating CSV...' : 'Export Filtered CSV'}</span>
            </button>
          </div>
        </div>

        {/* Quick Aggregation Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#e6ebf1] shadow-stripe-sm">
            <span className="text-xs text-slate-400 font-medium block">Total Matching Renewals</span>
            <span className="text-xl font-black text-[#0a2540]">{total.toLocaleString()}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e6ebf1] shadow-stripe-sm">
            <span className="text-xs text-slate-400 font-medium block">Aggregated Contract Value</span>
            <span className="text-xl font-black text-[#635bff]">{stats.totalValueFormatted}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e6ebf1] shadow-stripe-sm">
            <span className="text-xs text-slate-400 font-medium block">Average Expiry Window</span>
            <span className="text-xl font-black text-[#0a2540]">{stats.avgDaysLeft} days</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e6ebf1] shadow-stripe-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Current Page</span>
              <span className="text-xl font-black text-[#0a2540]">{page} / {totalPages}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Page Size</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs font-bold bg-slate-100 p-1 rounded border border-slate-200 outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, vendor, category, RFP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6ebf1] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none shadow-stripe-sm placeholder-slate-400"
            />
          </div>

          {/* Department Selector */}
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6ebf1] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none shadow-stripe-sm appearance-none font-medium cursor-pointer"
            >
              <option value="ALL">All Departments (98)</option>
              {DEPARTMENT_STATS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6ebf1] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none shadow-stripe-sm appearance-none font-medium cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Incumbent Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Incumbent Lock-in</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'days' | 'value' | 'winProbability');
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6ebf1] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none shadow-stripe-sm appearance-none font-medium cursor-pointer"
            >
              <option value="days">Sort by Days Remaining</option>
              <option value="value">Sort by Contract Value</option>
              <option value="winProbability">Sort by Win Score</option>
            </select>
          </div>
        </div>

        {/* Main Contract Renewal Table */}
        <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-stripe overflow-hidden">
          {error ? (
            <div className="p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-[#0a2540]">Failed to Load Procurement Records</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => fetchContracts()}
                className="px-4 py-2 bg-[#635bff] text-white text-xs font-bold rounded-lg shadow-stripe-sm"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-[#e6ebf1] text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-4 px-5">Contract Opportunity</th>
                    <th className="py-4 px-5">Department</th>
                    <th className="py-4 px-5">Incumbent Vendor</th>
                    <th 
                      onClick={() => handleSortToggle('value')}
                      className="py-4 px-5 cursor-pointer hover:text-[#635bff] transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Value</span>
                        {sortBy === 'value' && (
                          sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSortToggle('days')}
                      className="py-4 px-5 cursor-pointer hover:text-[#635bff] transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Expiry Timeline</span>
                        {sortBy === 'days' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSortToggle('winProbability')}
                      className="py-4 px-5 text-center cursor-pointer hover:text-[#635bff] transition-colors"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>AI Win Score</span>
                        {sortBy === 'winProbability' && (
                          sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6ebf1]">
                  {loading ? (
                    // Skeleton Table Loader
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-5">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                        </td>
                        <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                        <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                        <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="py-4 px-5 text-center"><div className="h-6 bg-slate-200 rounded-full w-12 mx-auto"></div></td>
                        <td className="py-4 px-5 text-right"><div className="h-8 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : contracts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <div className="font-bold text-slate-700 text-sm mb-1">No contracts matched your search criteria</div>
                        <p className="text-xs text-slate-400">Try clearing or adjusting filters.</p>
                      </td>
                    </tr>
                  ) : (
                    contracts.map((c) => {
                      const isUrgent = c.daysLeft <= 30;
                      const isWarning = c.daysLeft > 30 && c.daysLeft <= 60;

                      return (
                        <tr
                          key={c.id}
                          className="hover:bg-indigo-50/20 transition-colors group"
                        >
                          {/* Title & Ref */}
                          <td className="py-4 px-5">
                            <div 
                              onClick={() => onSelectContract(c)}
                              className="font-bold text-[#0a2540] group-hover:text-[#635bff] cursor-pointer flex items-center space-x-1.5"
                            >
                              <span className="text-sm">{c.title}</span>
                              <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[11px] font-mono text-slate-400">{c.rfpReference}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                {c.category}
                              </span>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-4 px-5 font-medium text-slate-700">
                            {c.department}
                          </td>

                          {/* Incumbent */}
                          <td className="py-4 px-5 font-semibold text-[#0a2540]">
                            {c.supplier}
                          </td>

                          {/* Value */}
                          <td className="py-4 px-5 font-black text-[#0a2540] text-sm">
                            {c.value}
                          </td>

                          {/* Expiry Badge */}
                          <td className="py-4 px-5">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                  isUrgent
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                    : isWarning
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {c.daysLeft} days left
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                ({c.expiryDate})
                              </span>
                            </div>
                          </td>

                          {/* AI Win Probability Score */}
                          <td className="py-4 px-5 text-center">
                            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 text-[#635bff] text-xs font-bold border border-indigo-100">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{c.winProbability}%</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => onRunAiAnalyst(c)}
                                className="px-3 py-1.5 rounded-lg bg-[#635bff] hover:bg-[#5469d4] text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition-all cursor-pointer"
                                title="Run AI Analyst Bid/No-Bid Strategy"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>AI Strategy</span>
                              </button>

                              <button
                                onClick={() => onSelectContract(c)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Server Pagination Footer */}
          <div className="p-4 bg-slate-50/80 border-t border-[#e6ebf1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing <strong className="text-[#0a2540]">{contracts.length > 0 ? (page - 1) * limit + 1 : 0}</strong> to <strong className="text-[#0a2540]">{Math.min(page * limit, total)}</strong> of <strong className="text-[#0a2540]">{total.toLocaleString()}</strong> contracts
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-all flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-1 font-bold text-[#0a2540] bg-white border border-slate-200 rounded-lg">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-all flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <span>Next</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
