'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileCheck, ListChecks, AlertTriangle, Shield, Bell } from 'lucide-react';

export default function CompliancePage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compliance Workspace</h1>
        </div>
        <p className="text-slate-500 text-lg">Automated compliance matrices and obligation tracking</p>
        <div className="p-4">
          <Bell size={16} />
          Coming Q4 2026
        </div>
      </header>

      <div className="p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4">
            <h3>Compliance Workspace is in development</h3>
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
            <table className="p-4">
              <thead>
                <tr>
                  <th>RFP Section</th>
                  <th>Requirement</th>
                  <th>Status</th>
                  <th>Assignee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>L.4.2</td>
                  <td>Must provide 3 past performance references...</td>
                  <td><span className="p-4">In Progress</span></td>
                  <td>Sarah J.</td>
                </tr>
                <tr>
                  <td>M.1.1</td>
                  <td>ISO 9001:2015 certification required...</td>
                  <td><span className={'' + ' ' + ''}>Compliant</span></td>
                  <td>Compliance Team</td>
                </tr>
                <tr>
                  <td>L.5.3</td>
                  <td>Key personnel resumes limit 2 pages...</td>
                  <td><span className={'' + ' ' + ''}>Pending Review</span></td>
                  <td>HR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xl font-semibold text-slate-900 mb-4">What you'll get</div>
          <div className="p-4">
            <div className="p-4">
              <div className="p-4"><FileCheck size={24} /></div>
              <div className="p-4">Compliance Matrix</div>
              <div className="p-4">Auto-generated requirement-to-response mapping</div>
            </div>
            <div className="p-4">
              <div className="p-4"><ListChecks size={24} /></div>
              <div className="p-4">Obligation Tracker</div>
              <div className="p-4">Track every mandatory requirement with status</div>
            </div>
            <div className="p-4">
              <div className="p-4"><AlertTriangle size={24} /></div>
              <div className="p-4">Gap Analysis</div>
              <div className="p-4">Identify compliance gaps before submission</div>
            </div>
            <div className="p-4">
              <div className="p-4"><Shield size={24} /></div>
              <div className="p-4">Certification Check</div>
              <div className="p-4">Verify required certifications and clearances</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
