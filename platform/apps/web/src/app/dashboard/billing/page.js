'use client';

import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createCheckoutSession } from '@/lib/api';

export default function BillingPage() {
  const { user } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async (priceId) => {
    setIsUpgrading(true);
    try {
      const response = await createCheckoutSession({
        priceId: priceId,
        successUrl: window.location.origin + '/dashboard/billing?success=true',
        cancelUrl: window.location.origin + '/dashboard/billing?canceled=true',
        customerEmail: user?.email
      });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        alert(response.error || 'Failed to initiate checkout');
        setIsUpgrading(false);
      }
    } catch (err) {
      alert('Error connecting to billing provider');
      setIsUpgrading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-indigo-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
        </div>
      </header>

      <section className="p-4">
        <div className="p-4">
          <div className="p-4">
            <div>
              <h2 className="p-4">Professional (Trial)</h2>
              <p className="p-4">
                <AlertCircle size={16} /> 14 days remaining in trial
              </p>
            </div>
            <button className="p-4" onClick={() => handleUpgrade('price_1TwSDuAKaJMeiE9B8Db05r78')} disabled={isUpgrading}>
              {isUpgrading ? <Loader2 size={16} className="p-4" /> : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </section>

      <section className="p-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Available Plans</h3>
        <div className="p-4">
          {/* Starter Plan */}
          <div className="p-4">
            <div className="p-4">Starter</div>
            <div className="p-4">$0<span>/mo</span></div>
            <p className="p-4">Basic search and discovery capabilities.</p>
            <button className="p-4">Downgrade</button>
            <ul className="space-y-3">
              <li><Check size={16} className="p-4" /> Basic Search</li>
              <li><Check size={16} className="p-4" /> 3 Saved Searches</li>
              <li><Check size={16} className="p-4" /> Standard Support</li>
            </ul>
          </div>

          {/* Professional Plan (Active) */}
          <div className={'' + ' ' + ''}>
            <div className="p-4">Current Trial</div>
            <h3 className="p-4">Intelligence Pro</h3>
            <div className="p-4">$299<span>/month</span></div>
            <p className="p-4">Full intelligence suite for capture teams.</p>
            <button className="p-4" onClick={() => handleUpgrade('price_1TwSDuAKaJMeiE9B8Db05r78')} disabled={isUpgrading}>
              {isUpgrading ? <Loader2 size={16} className="p-4" /> : 'Upgrade Now'}
            </button>
            <ul className="space-y-3">
              <li><Check size={16} className="p-4" /> Everything in Starter</li>
              <li><Check size={16} className="p-4" /> Unlimited Saved Searches</li>
              <li><Check size={16} className="p-4" /> Export Center Access</li>
              <li><Check size={16} className="p-4" /> Early Access Features</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="p-4">
            <h3 className="p-4">Intelligence Team</h3>
            <div className="p-4">$999<span>/month</span></div>
            <p className="p-4">Dedicated solutions for large organizations.</p>
            <button className="p-4" onClick={() => handleUpgrade('price_1TwSHMAKaJMeiE9BSDux5gnr')} disabled={isUpgrading}>
              {isUpgrading ? <Loader2 size={16} className="p-4" /> : 'Upgrade Now'}
            </button>
            <ul className="space-y-3">
              <li><Check size={16} className="p-4" /> Everything in Pro</li>
              <li><Check size={16} className="p-4" /> API Access</li>
              <li><Check size={16} className="p-4" /> Custom Integrations</li>
              <li><Check size={16} className="p-4" /> Dedicated Success Manager</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Payment Method</h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <p>No payment method added yet.</p>
            <button className="p-4">Add Payment Method</button>
          </div>
        </div>
      </section>

      <section className="p-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Billing History</h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <p>No billing history available.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
