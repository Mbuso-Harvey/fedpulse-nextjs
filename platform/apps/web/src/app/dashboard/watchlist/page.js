'use client';

import React, { useState } from 'react';
import { Eye, FileText, Building2, Briefcase, Star } from 'lucide-react';

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState('contracts');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Watchlist</h1>
        </div>
        <p className="text-slate-500 text-lg">Track the contracts, departments, and suppliers that matter to you</p>
      </header>

      <div className="p-4">
        <button 
          className={activeTab === 'contracts' ? '' : ''}
          onClick={() => setActiveTab('contracts')}
        >
          <FileText size={18} /> Contracts
        </button>
        <button 
          className={activeTab === 'departments' ? '' : ''}
          onClick={() => setActiveTab('departments')}
        >
          <Building2 size={18} /> Departments
        </button>
        <button 
          className={activeTab === 'suppliers' ? '' : ''}
          onClick={() => setActiveTab('suppliers')}
        >
          <Briefcase size={18} /> Suppliers
        </button>
      </div>

      <div className="mt-8">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <Star size={48} className="text-slate-400 mb-4" />
          <h3>Your watchlist is empty</h3>
          <p>Add items from any page using the ★ icon to track updates, renewals, and activity in one place.</p>
        </div>
        
        <div className="text-xl font-semibold text-slate-900 mb-4">Example Watchlist Items</div>
        <div className="p-4">
          {activeTab === 'contracts' && (
            <>
              <div className="p-4">
                <div className="p-4">
                  <h4>Enterprise IT Services (EITS)</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">Dept of Defense • Expires in 18 months • $1.2B Value</div>
              </div>
              <div className="p-4">
                <div className="p-4">
                  <h4>Cloud Computing Support</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">Dept of Energy • Follow-on Opportunity • $350M Value</div>
              </div>
            </>
          )}

          {activeTab === 'departments' && (
            <>
              <div className="p-4">
                <div className="p-4">
                  <h4>Department of Veterans Affairs (VA)</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">142 Active Contracts • 12 Upcoming Renewals</div>
              </div>
              <div className="p-4">
                <div className="p-4">
                  <h4>Defense Health Agency (DHA)</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">89 Active Contracts • 5 Upcoming Renewals</div>
              </div>
            </>
          )}

          {activeTab === 'suppliers' && (
            <>
              <div className="p-4">
                <div className="p-4">
                  <h4>Lockheed Martin Corporation</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">Tier 1 Competitor • Recent Win: F-35 Sustainment</div>
              </div>
              <div className="p-4">
                <div className="p-4">
                  <h4>Palantir Technologies</h4>
                  <Star size={20} className="p-4" fill="currentColor" />
                </div>
                <div className="p-4">Teaming Partner • Recent Win: Titan Ground System</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
