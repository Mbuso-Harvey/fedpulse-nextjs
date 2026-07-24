'use client';

import React, { useState } from 'react';
import { DollarSign, History, LineChart, AlertOctagon, TrendingUp, Bell } from 'lucide-react';

export default function PricingStrategyPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing Strategy</h1>
        </div>
        <p className="text-slate-500 text-lg">AI-powered pricing analysis and price-to-win intelligence</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Pricing Strategy is in development</h3>
            <p>Get early access when this feature launches.</p>
            <button 
              className="p-4"
              onClick={() => setNotified(true)}
            >
              {notified ? '✓ You will be notified' : 'Notify me when available'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="p-4">
            <div className="p-4">
              <div className="p-4">Price-to-Win Analysis</div>
              <div className="p-4">High Confidence</div>
            </div>
            <div className="p-4">
              <div className="p-4">
                <span className="p-4">Target Price Range:</span>
                <span className="p-4">$14.2M - $15.5M</span>
              </div>
              <div className="p-4">
                {/* Visual placeholder for a chart */}
                <div className="p-4" style={{width: '60%', background: 'var(--accent-blue)'}}></div>
                <div className="p-4" style={{width: '80%', background: 'var(--accent-blue-glow)'}}></div>
                <div className="p-4" style={{width: '45%', background: 'var(--bg-secondary)'}}></div>
              </div>
            </div>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><History size={24} /></div>
              <div className="p-4">Historical Pricing</div>
              <div className="p-4">Benchmark against past award values</div>
            </div>
            <div className="p-4">
              <div className="p-4"><LineChart size={24} /></div>
              <div className="p-4">Margin Analysis</div>
              <div className="p-4">Balance competitiveness with profitability</div>
            </div>
            <div className="p-4">
              <div className="p-4"><AlertOctagon size={24} /></div>
              <div className="p-4">Risk Assessment</div>
              <div className="p-4">Flag pricing risks and control recommendations</div>
            </div>
            <div className="p-4">
              <div className="p-4"><TrendingUp size={24} /></div>
              <div className="p-4">Price-to-Win</div>
              <div className="p-4">Data-driven optimal pricing for maximum win probability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
