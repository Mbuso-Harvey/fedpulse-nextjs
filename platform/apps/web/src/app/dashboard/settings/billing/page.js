'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';

export default function BillingPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => setIsUpgrading(false), 2000); // Mock upgrade
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 ">Billing & Subscription</h2>
          <p className="text-sm text-gray-500  mt-1">Manage your plan, payment methods, and billing history.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm mb-3">
              <Zap size={14} className="text-yellow-300" />
              Professional Trial
            </span>
            <h3 className="text-2xl font-bold mb-1">Intelligence Pro</h3>
            <p className="text-indigo-100 flex items-center gap-2">
              <AlertCircle size={16} /> 14 days remaining in your trial
            </p>
          </div>
          <button 
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="px-6 py-3 bg-white text-indigo-600 hover:bg-gray-50 font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 min-w-[160px]"
          >
            {isUpgrading ? <Loader2 className="animate-spin" size={20} /> : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Starter Plan */}
        <div className="border border-gray-200  rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white  flex flex-col">
          <h4 className="text-lg font-semibold text-gray-900  mb-2">Starter</h4>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900 ">$0</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <p className="text-sm text-gray-500  mb-6 flex-1">Basic search and discovery capabilities.</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-emerald-500" /> Basic Search</li>
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-emerald-500" /> 3 Saved Searches</li>
          </ul>
          <button className="w-full py-2.5 px-4 border border-gray-200  rounded-xl text-gray-600  font-medium hover:bg-gray-50  transition-colors">
            Downgrade
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-indigo-500 rounded-2xl p-6 shadow-xl shadow-indigo-500/10 bg-white  flex flex-col relative transform md:-translate-y-2">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Recommended
          </div>
          <h4 className="text-lg font-semibold text-gray-900  mb-2">Intelligence Pro</h4>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900 ">$299</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <p className="text-sm text-gray-500  mb-6 flex-1">Full intelligence suite for capture teams.</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-indigo-500" /> Unlimited Saved Searches</li>
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-indigo-500" /> Export Center Access</li>
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-indigo-500" /> Early Access Features</li>
          </ul>
          <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-indigo-500/20 active:scale-95">
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border border-gray-200  rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white  flex flex-col">
          <h4 className="text-lg font-semibold text-gray-900  mb-2">Enterprise</h4>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900 ">$999</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <p className="text-sm text-gray-500  mb-6 flex-1">Dedicated solutions for large organizations.</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-gray-400" /> API Access</li>
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-gray-400" /> Custom Integrations</li>
            <li className="flex items-center gap-2 text-sm text-gray-600 "><CheckCircle2 size={18} className="text-gray-400" /> Dedicated Success Manager</li>
          </ul>
          <button className="w-full py-2.5 px-4 border border-gray-200  rounded-xl text-gray-600  font-medium hover:bg-gray-50  transition-colors">
            Contact Sales
          </button>
        </div>
      </div>

      <div className="border border-gray-100  rounded-2xl p-6 bg-gray-50/50 ">
        <h3 className="text-lg font-medium text-gray-900  mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-white  border border-gray-200  rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center p-1 shadow-inner">
              <CreditCard className="text-white opacity-80" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 ">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2026</p>
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700   transition-colors">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

