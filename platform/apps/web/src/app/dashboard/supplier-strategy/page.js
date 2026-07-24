'use client';

import React, { useState } from 'react';
import { Handshake, Target, AlertCircle, UserPlus, TrendingUp, Bell } from 'lucide-react';

export default function SupplierStrategyPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Handshake className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Supplier Strategy</h1>
        </div>
        <p className="text-slate-500 text-lg">Optimize teaming arrangements and supply chain positioning</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Supplier Strategy is in development</h3>
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
              <div className="p-4">Teaming Recommendation</div>
              <div className="p-4">92% Match</div>
            </div>
            <div className="p-4">
              <div className="p-4">
                <div className="p-4"><UserPlus size={32} /></div>
                <div className="p-4">
                  <div className="p-4">Apex Technologies Inc.</div>
                  <div className="p-4">
                    <span>Cybersecurity</span>
                    <span>Cleared Staff</span>
                    <span>Small Business</span>
                  </div>
                </div>
              </div>
              <p className="p-4">
                Fills critical gap in Section C.4.2 (Zero Trust Architecture). Past performance together on 2 previous awards.
              </p>
            </div>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><Target size={24} /></div>
              <div className="p-4">Readiness Assessment</div>
              <div className="p-4">Score supplier capability against requirements</div>
            </div>
            <div className="p-4">
              <div className="p-4"><AlertCircle size={24} /></div>
              <div className="p-4">Gap Identification</div>
              <div className="p-4">Find capability gaps requiring teaming partners</div>
            </div>
            <div className="p-4">
              <div className="p-4"><UserPlus size={24} /></div>
              <div className="p-4">Teaming Recommendations</div>
              <div className="p-4">AI-suggested teaming partners</div>
            </div>
            <div className="p-4">
              <div className="p-4"><TrendingUp size={24} /></div>
              <div className="p-4">Improvement Plans</div>
              <div className="p-4">Actionable supplier development roadmaps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
