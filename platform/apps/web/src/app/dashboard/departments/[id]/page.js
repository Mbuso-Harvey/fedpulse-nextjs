'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  ArrowLeft,
  Settings
} from 'lucide-react';

export default function DepartmentDetailPage({ params }) {
  const { id } = params;

  // Mock data
  const department = {
    id,
    name: 'Information Technology',
    head: 'Sarah Connor',
    budget: '$12.5M',
    spend: '$8.2M',
    headcount: 145,
    status: 'Active'
  };

  const topCategories = [
    { name: 'Software Licenses', spend: '$3.4M' },
    { name: 'Hardware', spend: '$2.1M' },
    { name: 'IT Services', spend: '$1.5M' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <Link href="/dashboard/departments" className="p-4">
        <ArrowLeft size={16} />
        Back to Departments
      </Link>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{department.name}</h1>
          <div className="text-slate-500 text-lg">
            <span className="badge badge-success">{department.status}</span>
            <span>Department Head: {department.head}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="btn btn-secondary">
            <Settings size={16} className="p-4" />
            Manage
          </button>
          <button className="btn btn-primary">
            View Reports
          </button>
        </div>
      </div>

      <div className="grid-4">
        <div className="card stat-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-4">
            <span className="p-4"><Briefcase size={18}/> Total Budget</span>
          </div>
          <div className="p-4">{department.budget}</div>
          <div className="p-4">Annual Allocation</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="p-4">
            <span className="p-4"><TrendingUp size={18}/> YTD Spend</span>
          </div>
          <div className="p-4">{department.spend}</div>
          <div className="p-4">65% of budget used</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-4">
            <span className="p-4"><Users size={18}/> Headcount</span>
          </div>
          <div className="p-4">{department.headcount}</div>
          <div className="p-4">Active Employees</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-4">
            <span className="p-4"><FileText size={18}/> Active Contracts</span>
          </div>
          <div className="p-4">42</div>
          <div className="p-4">Across 15 suppliers</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card fade-in" style={{ animationDelay: '0.5s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Top Spend Categories</h3>
          </div>
          <div className="p-4">
            {topCategories.map((cat, i) => (
              <div key={i} className="p-4">
                <div className="p-4">
                  <div className="p-4">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className="p-4">{cat.name}</div>
                    <div className="p-4">IT Category</div>
                  </div>
                </div>
                <div className="p-4">{cat.spend}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card fade-in" style={{ animationDelay: '0.6s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Recent Activity</h3>
          </div>
          <div className="p-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4">
                <div className="p-4">
                  <div className="p-4" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="p-4">Contract Renewal Approved</div>
                    <div className="p-4">Microsoft Enterprise Agreement</div>
                  </div>
                </div>
                <div className="p-4">2d ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
