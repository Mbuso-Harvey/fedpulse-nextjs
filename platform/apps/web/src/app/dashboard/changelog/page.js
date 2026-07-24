'use client';

import React from 'react';
import { ScrollText, Sparkles, Database, ShieldCheck } from 'lucide-react';

export default function ChangelogPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <ScrollText className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Changelog</h1>
        </div>
        <p className="text-slate-500 text-lg">New features and updates to the platform</p>
      </header>

      <div className="p-4">
        {/* Entry 1 */}
        <div className="p-4">
          <div className="p-4">
            <div className="p-4"><Sparkles size={16} /></div>
          </div>
          <div className="p-4">
            <div className="p-4">
              <span className="p-4">v1.0</span>
              <span className="p-4">Upcoming</span>
            </div>
            <h2 className="p-4">Intelligence Engine Launch</h2>
            <ul className="p-4">
              <li>Full semantic search across federal opportunities.</li>
              <li>Agent workspaces activated (Capture, Compliance, Pricing).</li>
              <li>Automated risk scoring on solicitations.</li>
            </ul>
          </div>
        </div>

        {/* Entry 2 */}
        <div className="p-4">
          <div className="p-4">
            <div className="p-4"><Database size={16} /></div>
          </div>
          <div className="p-4">
            <div className="p-4">
              <span className="p-4">v0.9</span>
              <span className="p-4">July 2026</span>
            </div>
            <h2 className="p-4">Knowledge Graph Built</h2>
            <ul className="p-4">
              <li>SAM.gov integration complete.</li>
              <li>Contract history and awardee relationships mapped.</li>
              <li>Basic search interface deployed for internal testing.</li>
            </ul>
          </div>
        </div>

        {/* Entry 3 */}
        <div className="p-4">
          <div className="p-4">
            <div className="p-4"><ShieldCheck size={16} /></div>
          </div>
          <div className="p-4">
            <div className="p-4">
              <span className="p-4">v0.8</span>
              <span className="p-4">June 2026</span>
            </div>
            <h2 className="p-4">Data Pipeline Certified</h2>
            <ul className="p-4">
              <li>Secure ingestion pipelines finalized.</li>
              <li>Authentication and user management integrated.</li>
              <li>Base dashboard UI shell completed.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
