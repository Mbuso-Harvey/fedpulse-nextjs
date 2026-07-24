'use client';

import React, { useState } from 'react';
import { FileText, LayoutTemplate, Link as LinkIcon, Users, Library, Bell } from 'lucide-react';

export default function ProposalStrategyPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proposal Strategy</h1>
        </div>
        <p className="text-slate-500 text-lg">Transform intelligence into winning proposal outlines</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Proposal Strategy is in development</h3>
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
              <div className="p-4">Volume I: Technical Proposal</div>
              <div className="p-4">Outline Generated</div>
            </div>
            <div className="p-4">
              <div className="p-4">
                <span className="p-4">1.0 Executive Summary</span>
                <span className="p-4">Assigned: Rachel K.</span>
              </div>
              <div className="p-4">
                <span className="p-4">2.0 Technical Approach</span>
                <span className="p-4">Assigned: Engineering Team</span>
              </div>
              <div className="p-4 pl-8">
                <span className="p-4">2.1 Architecture Design</span>
                <span className="p-4">Theme: Secure by Design</span>
              </div>
              <div className="p-4 pl-8">
                <span className="p-4">2.2 Implementation Plan</span>
                <span className="p-4">Theme: Rapid Deployment</span>
              </div>
            </div>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><LayoutTemplate size={24} /></div>
              <div className="p-4">Proposal Outline</div>
              <div className="p-4">AI-generated section structure and volume plans</div>
            </div>
            <div className="p-4">
              <div className="p-4"><LinkIcon size={24} /></div>
              <div className="p-4">Win Theme Mapping</div>
              <div className="p-4">Align win themes to evaluation criteria</div>
            </div>
            <div className="p-4">
              <div className="p-4"><Users size={24} /></div>
              <div className="p-4">Writing Assignments</div>
              <div className="p-4">Auto-assign sections to team members</div>
            </div>
            <div className="p-4">
              <div className="p-4"><Library size={24} /></div>
              <div className="p-4">Reuse Library</div>
              <div className="p-4">Find relevant past proposal content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
