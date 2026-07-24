"use client";
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Settings, User, Bell, Key, CreditCard, ShieldCheck, Check, Save, Copy
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, isAuthenticated } = useAuth() as any;
  const [activeTab, setActiveTab] = useState<'profile' | 'alerts' | 'api' | 'billing'>('profile');

  // Form states
  const [userName, setUserName] = useState(user?.name || 'Federal Contracting Officer');
  const [userEmail, setUserEmail] = useState(user?.email || 'officer@defense.gc.ca');
  const [company, setCompany] = useState(user?.company || 'Defense Tech Solutions Inc.');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState(60);
  const [savedMsg, setSavedMsg] = useState(false);

  const [apiKey] = useState('fp_live_89a42e119b48c20892f391a92e8');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm mb-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#635bff]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0a2540]">
              Account & Intelligence Configuration
            </h1>
            <p className="text-xs text-slate-500">
              Manage your company profile, automated tender alert triggers, and API keys.
            </p>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-[#e6ebf1] mb-6 space-x-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'profile'
                ? 'border-[#635bff] text-[#635bff]'
                : 'border-transparent text-slate-500 hover:text-[#0a2540]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Organization</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'alerts'
                ? 'border-[#635bff] text-[#635bff]'
                : 'border-transparent text-slate-500 hover:text-[#0a2540]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Renewal Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'api'
                ? 'border-[#635bff] text-[#635bff]'
                : 'border-transparent text-slate-500 hover:text-[#0a2540]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API & Webhooks</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'billing'
                ? 'border-[#635bff] text-[#635bff]'
                : 'border-transparent text-slate-500 hover:text-[#0a2540]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Plan</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe">
          {savedMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs max-w-xl">
              <div>
                <label className="block font-bold text-[#0a2540] mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#e6ebf1] rounded-xl text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0a2540] mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#e6ebf1] rounded-xl text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0a2540] mb-1">Organization / Enterprise</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#e6ebf1] rounded-xl text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#635bff] hover:bg-[#5469d4] text-white font-bold rounded-xl shadow-stripe-sm cursor-pointer transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4 text-xs max-w-xl">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-[#0a2540]">Automated Email Digest</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Receive weekly summaries of expiring contracts in your key categories.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#635bff] rounded accent-[#635bff] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0a2540] mb-1">Default Expiry Trigger Window</label>
                <select
                  value={daysBeforeExpiry}
                  onChange={(e) => setDaysBeforeExpiry(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-[#e6ebf1] rounded-xl text-[#0a2540] font-medium outline-none cursor-pointer"
                >
                  <option value={30}>30 Days Before Expiry</option>
                  <option value={60}>60 Days Before Expiry</option>
                  <option value={90}>90 Days Before Expiry (Recommended for Capture)</option>
                  <option value={120}>120 Days Before Expiry</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#635bff] hover:bg-[#5469d4] text-white font-bold rounded-xl shadow-stripe-sm cursor-pointer transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Alert Triggers</span>
              </button>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4 text-xs max-w-xl">
              <div>
                <label className="block font-bold text-[#0a2540] mb-1">FedPulse Procurement API Secret Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 p-2.5 bg-slate-100 border border-[#e6ebf1] rounded-xl text-[#0a2540] font-mono text-xs select-all"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Use this key to query live contract renewal streams via REST API.</p>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs max-w-xl">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#635bff] uppercase tracking-wider block">Active Plan</span>
                  <div className="text-xl font-extrabold text-[#0a2540]">FedPulse Professional Tier</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Unlimited access to 4,050 active tenders & Gemini AI strategy engine.</p>
                </div>
                <span className="px-3 py-1 bg-[#635bff] text-white rounded-full font-bold text-xs shadow-stripe-sm">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
