'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BellRing, Plus, Save, Clock, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

export default function AlertCenterPage() {
  const [activeTab, setActiveTab] = useState('alerts');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            <BellRing className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">Alert Center</h1>
        </div>
        <p className="text-slate-500  text-lg">Configure alerts and manage saved searches.</p>
      </header>

      <div className="flex space-x-1 bg-slate-100  p-1 rounded-xl w-fit">
        <button 
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'alerts' ? 'bg-white  text-slate-900  shadow-sm ring-1 ring-slate-200 ' : 'text-slate-600  hover:text-slate-900  hover:bg-slate-200/50 '}`}
          onClick={() => setActiveTab('alerts')}
        >
          Active Alerts
        </button>
        <button 
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'searches' ? 'bg-white  text-slate-900  shadow-sm ring-1 ring-slate-200 ' : 'text-slate-600  hover:text-slate-900  hover:bg-slate-200/50 '}`}
          onClick={() => setActiveTab('searches')}
        >
          Saved Searches
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'alerts' && (
          <div className="space-y-8">
            <div className="bg-indigo-50  border border-indigo-100  rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white  rounded-full flex items-center justify-center shadow-sm mb-4 text-indigo-500">
                <BellRing size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900  mb-2">No active alerts</h3>
              <p className="text-slate-600  max-w-md mx-auto mb-6">You haven't set up any alerts yet. Create an alert to get notified when opportunities matching your criteria are posted.</p>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95">
                <Plus size={18} /> Create your first alert
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900  mb-4">Example Alerts</h3>
              <div className="space-y-4">
                <div className="bg-white  border border-slate-200  rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-slate-900  text-lg mb-1">Cybersecurity - Dept of Defense</h4>
                    <div className="flex items-center flex-wrap gap-2 text-sm text-slate-500 ">
                      <span className="bg-slate-100  px-2.5 py-1 rounded-md">Value &gt; $5M</span>
                      <span>•</span>
                      <span className="bg-slate-100  px-2.5 py-1 rounded-md">Daily</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-indigo-600  font-medium">
                        <Clock size={14} /> Last triggered: 2 hours ago
                      </span>
                    </div>
                  </div>
                  <ToggleRight size={36} className="text-indigo-600  cursor-pointer" />
                </div>

                <div className="bg-white  border border-slate-200  rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow opacity-75 grayscale-[0.2]">
                  <div>
                    <h4 className="font-bold text-slate-900  text-lg mb-1">Small Business Set-Aside - HHS</h4>
                    <div className="flex items-center flex-wrap gap-2 text-sm text-slate-500 ">
                      <span className="bg-slate-100  px-2.5 py-1 rounded-md">Any new posting</span>
                      <span>•</span>
                      <span className="bg-slate-100  px-2.5 py-1 rounded-md">Real-time</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock size={14} /> Last triggered: 1 day ago
                      </span>
                    </div>
                  </div>
                  <ToggleLeft size={36} className="text-slate-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'searches' && (
          <div className="space-y-8">
            <div className="bg-blue-50  border border-blue-100  rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white  rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-500">
                <Save size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900  mb-2">No saved searches</h3>
              <p className="text-slate-600  max-w-md mx-auto mb-6">Save frequently used search queries to quickly access them later without re-entering criteria.</p>
              <Link href="/dashboard/renewal-watch" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95">
                Save a search from Renewal Watch
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900  mb-4">Example Saved Searches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white  border border-slate-200  rounded-2xl p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-slate-900  text-lg">Cloud Infrastructure - Upcoming</h4>
                    <span className="bg-emerald-100 text-emerald-700   text-xs font-bold px-2.5 py-1 rounded-full">142 results</span>
                  </div>
                  <p className="text-sm text-slate-500  mb-6 bg-slate-50  p-3 rounded-xl border border-slate-100 ">
                    <span className="font-semibold block mb-1">Filters:</span>
                    NAICS 541512, Dept of Energy, Expiring in 6-12 months
                  </p>
                  <button className="w-full py-2.5 bg-slate-100 hover:bg-indigo-50   text-slate-700 hover:text-indigo-600   font-medium rounded-xl transition-colors border border-slate-200   flex items-center justify-center gap-2">
                    <Search size={16} /> Run Search
                  </button>
                </div>
                
                <div className="bg-white  border border-slate-200  rounded-2xl p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-slate-900  text-lg">AI/ML Research Grants</h4>
                    <span className="bg-emerald-100 text-emerald-700   text-xs font-bold px-2.5 py-1 rounded-full">38 results</span>
                  </div>
                  <p className="text-sm text-slate-500  mb-6 bg-slate-50  p-3 rounded-xl border border-slate-100 ">
                    <span className="font-semibold block mb-1">Filters:</span>
                    Keywords [AI, Machine Learning], Grant Type, NSF
                  </p>
                  <button className="w-full py-2.5 bg-slate-100 hover:bg-indigo-50   text-slate-700 hover:text-indigo-600   font-medium rounded-xl transition-colors border border-slate-200   flex items-center justify-center gap-2">
                    <Search size={16} /> Run Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

