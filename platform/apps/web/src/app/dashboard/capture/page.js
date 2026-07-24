'use client';

import React, { useState } from 'react';
import { Crosshair, Target, Users, CheckSquare, Presentation, Bell } from 'lucide-react';

export default function CaptureManagerPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Crosshair className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Capture Manager</h1>
        </div>
        <p className="text-slate-500 text-lg">Automated capture planning with AI-generated win strategies</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Capture Manager is in development</h3>
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
              <div className="p-4">Opportunity: AI Infrastructure Modernization</div>
              <div className="p-4">Win Prob: 68%</div>
            </div>
            <div className="p-4">
              <div className="p-4">
                <h4>Primary Win Themes</h4>
                <ul>
                  <li>Leveraging existing cloud investments for rapid deployment</li>
                  <li>Security-first architecture exceeding FedRAMP High</li>
                  <li>Cost-optimized scaling model saving 30% YoY</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><Target size={24} /></div>
              <div className="p-4">Win Strategy Generation</div>
              <div className="p-4">AI analyzes opportunity and generates targeted win themes</div>
            </div>
            <div className="p-4">
              <div className="p-4"><Users size={24} /></div>
              <div className="p-4">Competitive Assessment</div>
              <div className="p-4">Map competitor strengths and weaknesses</div>
            </div>
            <div className="p-4">
              <div className="p-4"><CheckSquare size={24} /></div>
              <div className="p-4">Action Plan Builder</div>
              <div className="p-4">Prioritized capture actions with deadlines</div>
            </div>
            <div className="p-4">
              <div className="p-4"><Presentation size={24} /></div>
              <div className="p-4">Gate Review Prep</div>
              <div className="p-4">Automated bid/no-bid decision packages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
