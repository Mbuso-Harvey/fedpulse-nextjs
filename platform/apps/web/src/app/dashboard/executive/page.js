'use client';

import React, { useState } from 'react';
import { Briefcase, FileSpreadsheet, GitPullRequest, AlertTriangle, ScrollText, Bell } from 'lucide-react';

export default function ExecutiveDecisionPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Decision Center</h1>
        </div>
        <p className="text-slate-500 text-lg">Unified bid/no-bid intelligence for C-suite decision making</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Executive Decision Center is in development</h3>
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
              <div className="p-4">Gate 3 Review: Project Zephyr</div>
              <div className="p-4">Awaiting Decision</div>
            </div>
            <div className="p-4">
              <div className="p-4">
                <div className="p-4">
                  <div className="p-4">Est. Value</div>
                  <div className="p-4">$45M</div>
                </div>
                <div className="p-4">
                  <div className="p-4">Win Prob.</div>
                  <div className="p-4">72%</div>
                </div>
                <div className="p-4">
                  <div className="p-4">Margin</div>
                  <div className="p-4">18%</div>
                </div>
                <div className="p-4">
                  <div className="p-4">Risk Level</div>
                  <div className="p-4" style={{color: 'var(--accent-amber)'}}>Medium</div>
                </div>
              </div>
              <div className="p-4">
                <button className={'' + ' ' + ''}>Approve Bid</button>
                <button className={'' + ' ' + ''}>No Bid</button>
              </div>
            </div>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><FileSpreadsheet size={24} /></div>
              <div className="p-4">Decision Brief</div>
              <div className="p-4">One-page executive summary with all intelligence</div>
            </div>
            <div className="p-4">
              <div className="p-4"><GitPullRequest size={24} /></div>
              <div className="p-4">Condition Matrix</div>
              <div className="p-4">Go/No-Go conditions with status tracking</div>
            </div>
            <div className="p-4">
              <div className="p-4"><AlertTriangle size={24} /></div>
              <div className="p-4">Risk Escalation</div>
              <div className="p-4">Automated risk escalation to leadership</div>
            </div>
            <div className="p-4">
              <div className="p-4"><ScrollText size={24} /></div>
              <div className="p-4">Decision Audit Trail</div>
              <div className="p-4">Complete history of pursuit decisions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
