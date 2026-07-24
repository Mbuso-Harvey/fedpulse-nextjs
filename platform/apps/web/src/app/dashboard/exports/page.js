'use client';

import React from 'react';
import { Download, FileDown, FileSpreadsheet, FileText, Lock, Plus } from 'lucide-react';

export default function ExportCenterPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Download className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Export Center</h1>
        </div>
        <p className="text-slate-500 text-lg">Generate reports and download intelligence data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4">
          <section className="p-4">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Export</h2>
              <span className="p-4"><Lock size={12} /> Professional</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="p-4">
                <label>Dataset</label>
                <select className="p-4" disabled>
                  <option>Current Search Results</option>
                  <option>Saved Search: Cloud Infrastructure</option>
                  <option>Watchlist: All Contracts</option>
                </select>
              </div>
              <div className="p-4">
                <button className="p-4" disabled>
                  <FileSpreadsheet size={20} />
                  <span>Export to CSV</span>
                </button>
                <button className="p-4" disabled>
                  <FileSpreadsheet size={20} />
                  <span>Export to XLSX</span>
                </button>
                <button className="p-4" disabled>
                  <FileText size={20} />
                  <span>Export to PDF</span>
                </button>
              </div>
            </div>
          </section>

          <section className="p-4">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Report Builder</h2>
            </div>
            <div className="p-4">
              <div className="p-4">
                <Plus size={24} className="p-4" />
              </div>
              <h3>Create Custom Report</h3>
              <p>Build a tailored report with custom charts, intelligence summaries, and selective data inclusion.</p>
              <button className="p-4" disabled>Build Report</button>
            </div>
          </section>
        </div>

        <div className="p-4">
          <section className="p-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Export History</h2>
            <div className="p-4">
              <div className="p-4">
                <FileDown size={32} className="p-4" />
                <p>No recent exports.</p>
                <span className="p-4">Your generated files will appear here for 7 days.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
