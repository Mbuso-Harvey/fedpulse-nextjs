'use client';

import { useState, useEffect } from 'react';
import { fetchRenewals, fetchRenewalStats, fetchRenewalDepartments } from '@/lib/api';
import { formatCurrency, formatNumber, formatDate, getDaysUrgency } from '@/lib/format';
import { TierGate } from '@/components/TierGate';
import { FileText, DollarSign, Building, BarChart2, Search, ArrowUp, ArrowDown, SearchX, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function RenewalWatch() {
  const [stats, setStats] = useState(null);
  const [departmentsList, setDepartmentsList] = useState([]);
  
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('days_until_end');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [filters, setFilters] = useState({
    department: '',
    supplier_name: '',
    commodity_type: '',
    min_value: '',
    max_value: '',
    days_until_end: 'All'
  });

  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadTableData();
  }, [page, sortBy, sortOrder, activeFilters]);

  async function loadInitialData() {
    try {
      const [statsRes, depsRes] = await Promise.all([
        fetchRenewalStats(),
        fetchRenewalDepartments()
      ]);
      
      if (!statsRes.error) setStats(statsRes);
      if (!depsRes.error) setDepartmentsList(depsRes.departments || []);
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  }

  async function loadTableData() {
    setLoading(true);
    try {
      const apiFilters = {};
      if (activeFilters.department) apiFilters.department = activeFilters.department;
      if (activeFilters.supplier_name) apiFilters.supplier_name = activeFilters.supplier_name;
      if (activeFilters.commodity_type) apiFilters.commodity_type = activeFilters.commodity_type;
      if (activeFilters.min_value) apiFilters.min_value = parseFloat(activeFilters.min_value);
      if (activeFilters.max_value) apiFilters.max_value = parseFloat(activeFilters.max_value);
      if (activeFilters.days_until_end && activeFilters.days_until_end !== 'All') {
        apiFilters.max_days_until_end = parseInt(activeFilters.days_until_end, 10);
      }

      const res = await fetchRenewals({
        filters: apiFilters,
        sortBy,
        sortOrder,
        page,
        pageSize: 25
      });

      if (!res.error) {
        setData(res.data || []);
        setTotalItems(res.total || 0);
      } else {
        setData([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Failed to load table data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const applyFilters = () => {
    setActiveFilters({ ...filters });
    setPage(1);
  };

  const clearFilters = () => {
    const empty = {
      department: '',
      supplier_name: '',
      commodity_type: '',
      min_value: '',
      max_value: '',
      days_until_end: 'All'
    };
    setFilters(empty);
    setActiveFilters(empty);
    setPage(1);
  };

  const getBadgeClasses = (days) => {
    const urgency = getDaysUrgency(days);
    if (urgency === 'critical') return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (urgency === 'warning') return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    if (urgency === 'attention') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  };

  const getBadgeText = (days) => {
    const urgency = getDaysUrgency(days);
    if (urgency === 'critical') return 'URGENT';
    if (urgency === 'warning') return 'EXPIRING SOON';
    if (urgency === 'attention') return 'WATCH';
    return 'TRACKED';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          Renewal Watch
        </h1>
        <p className="text-muted-foreground text-lg ml-12">Track and analyze expiring federal contracts in real-time.</p>
      </header>

      {/* TOP ROW: F-Pattern Hooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-premium transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Candidates</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">
            {stats ? formatNumber(stats.total_candidates) : <div className="h-9 w-20 bg-muted rounded animate-pulse" />}
          </div>
        </div>

        <div className="glass-card bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-premium transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Value</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-primary">
            {stats ? formatCurrency(stats.total_value) : <div className="h-9 w-28 bg-muted rounded animate-pulse" />}
          </div>
        </div>

        <div className="glass-card bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-premium transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Departments</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">
            {stats ? formatNumber(stats.unique_departments) : <div className="h-9 w-16 bg-muted rounded animate-pulse" />}
          </div>
        </div>

        <div className="glass-card bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-premium transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Suppliers</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">
            {stats ? formatNumber(stats.unique_suppliers) : <div className="h-9 w-20 bg-muted rounded animate-pulse" />}
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="glass-card bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department</label>
            <select 
              className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm"
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              {departmentsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Supplier</label>
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full bg-background border border-border text-foreground rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm" 
                placeholder="Search supplier..."
                value={filters.supplier_name}
                onChange={(e) => setFilters({...filters, supplier_name: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</label>
            <select 
              className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm"
              value={filters.commodity_type}
              onChange={(e) => setFilters({...filters, commodity_type: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Goods">Goods</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Min Value</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm" 
              placeholder="Min $"
              value={filters.min_value}
              onChange={(e) => setFilters({...filters, min_value: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max Value</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm" 
              placeholder="Max $"
              value={filters.max_value}
              onChange={(e) => setFilters({...filters, max_value: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Days Until Expiry</label>
            <select 
              className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-shadow font-medium text-sm"
              value={filters.days_until_end}
              onChange={(e) => setFilters({...filters, days_until_end: e.target.value})}
            >
              <option value="All">All Time</option>
              <option value="30">&lt; 30 Days</option>
              <option value="60">&lt; 60 Days</option>
              <option value="90">&lt; 90 Days</option>
              <option value="180">&lt; 180 Days</option>
              <option value="365">&lt; 1 Year</option>
            </select>
          </div>

          <div className="flex items-end gap-3 lg:col-span-2">
            <button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-4 py-2.5 transition-all active:scale-95 shadow-sm"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button 
              className="px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-all active:scale-95 border border-border"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE (Progressive Disclosure) */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {[
                  { key: 'contract_title', label: 'Contract Title' },
                  { key: 'supplier_name', label: 'Supplier' },
                  { key: 'value', label: 'Value' },
                  { key: 'days_until_end', label: 'Status' },
                ].map((col) => (
                  <th 
                    key={col.key} 
                    className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px] cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        {sortBy === col.key ? (sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />) : null}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-card">
                    <td colSpan="5" className="px-6 py-5">
                      <div className="h-4 bg-muted rounded w-full max-w-2xl"></div>
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <SearchX className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">No candidates found</h3>
                      <p className="text-muted-foreground text-sm">Try adjusting your filters to see more results.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-muted/30 transition-all duration-200 group cursor-pointer hover:-translate-y-[1px]">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground max-w-xs lg:max-w-md truncate group-hover:text-primary transition-colors" title={item.contract_title}>
                        {item.contract_title}
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">{item.department} • {item.reference_number || 'No Ref'}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{item.supplier_name}</td>
                    <td className="px-6 py-4 font-bold text-primary font-mono">{formatCurrency(item.value)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border ${getBadgeClasses(item.days_until_end)}`}>
                          {getBadgeText(item.days_until_end)}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{item.days_until_end} days left</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/opportunities/${item.id || '#'}`} className="inline-flex items-center justify-center p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/20 gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold font-mono">{(page - 1) * 25 + 1}</span> to <span className="text-foreground font-bold font-mono">{Math.min(page * 25, totalItems)}</span> of <span className="text-foreground font-bold font-mono">{totalItems}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 text-sm font-bold rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 text-sm font-bold rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                disabled={page * 25 >= totalItems}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        <TierGate requires="professional" fallback={
          <div className="relative overflow-hidden border-t border-border bg-gradient-to-b from-card to-primary/5 p-10 text-center flex flex-col items-center justify-center">
            <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-bold text-foreground mb-3">Unlock Full Renewal Pipeline</h3>
              <p className="text-muted-foreground mb-6">
                You are viewing a limited sample of <strong className="text-foreground font-mono">{totalItems}</strong> total renewals. Upgrade to Professional to analyze the entire dataset and uncover hidden opportunities.
              </p>
              <a href="/dashboard/billing" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-premium transition-all hover:scale-105 active:scale-95">
                Upgrade to Professional
              </a>
            </div>
          </div>
        }>
        </TierGate>
      </div>
    </div>
  );
}
