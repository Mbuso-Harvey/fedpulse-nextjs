'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  PieChart, 
  TrendingDown, 
  Building2,
  ArrowLeft,
  Plus
} from 'lucide-react';

export default function CategoryDetailPage({ params }) {
  const { id } = params;

  // Mock data
  const category = {
    id,
    name: 'Professional Services',
    totalSpend: '$8.5M',
    supplierCount: 24,
    trend: '-3.2%',
    status: 'Managed',
    lead: 'Michael Chang'
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <Link href="/dashboard/categories" className="p-4">
        <ArrowLeft size={16} />
        Back to Categories
      </Link>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{category.name}</h1>
          <div className="text-slate-500 text-lg">
            <span className="badge badge-success">{category.status}</span>
            <span className="p-4">Category Lead: {category.lead}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="btn btn-secondary">
            View Analytics
          </button>
          <button className="btn btn-primary">
            <Plus size={16} className="p-4" />
            Add Supplier
          </button>
        </div>
      </div>

      <div className="grid-4">
        <div className="card stat-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-4">
            <span className="p-4"><PieChart size={18}/> Total Spend</span>
          </div>
          <div className="p-4">{category.totalSpend}</div>
          <div className="p-4">YTD</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="p-4">
            <span className="p-4"><Building2 size={18}/> Suppliers</span>
          </div>
          <div className="p-4">{category.supplierCount}</div>
          <div className="p-4">Active vendors</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-4">
            <span className="p-4"><TrendingDown size={18}/> Spend Trend</span>
          </div>
          <div className="p-4" style={{ color: 'var(--accent-emerald)' }}>{category.trend}</div>
          <div className="p-4">vs previous period</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-4">
            <span className="p-4"><FolderTree size={18}/> Sub-categories</span>
          </div>
          <div className="p-4">6</div>
          <div className="p-4">Configured</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card fade-in" style={{ animationDelay: '0.5s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Top Suppliers</h3>
          </div>
          <div className="p-4">
            {[
              { name: 'Deloitte', spend: '$2.1M' },
              { name: 'McKinsey & Co', spend: '$1.8M' },
              { name: 'Accenture', spend: '$1.2M' }
            ].map((sup, i) => (
              <div key={i} className="p-4">
                <div className="p-4">
                  <div className="p-4">
                    <Building2 size={16} />
                  </div>
                  <div className="p-4">{sup.name}</div>
                </div>
                <div className="p-4">{sup.spend}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card fade-in" style={{ animationDelay: '0.6s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Sub-category Breakdown</h3>
          </div>
          <div className="p-4">
            {[
              { name: 'Consulting', pct: '45%' },
              { name: 'Legal Services', pct: '25%' },
              { name: 'Auditing', pct: '20%' },
              { name: 'Recruiting', pct: '10%' }
            ].map((sub, i) => (
              <div key={i} className="p-4">
                <div className="p-4">
                  <div className="p-4" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                    <PieChart size={16} />
                  </div>
                  <div className="p-4">{sub.name}</div>
                </div>
                <div className="p-4">{sub.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
