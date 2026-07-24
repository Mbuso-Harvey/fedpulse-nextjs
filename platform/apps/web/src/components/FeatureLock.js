'use client';
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export function FeatureLock({ featureName, description, features = [], children }) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    let timer;
    if (isPreview) {
      timer = setTimeout(() => setIsPreview(false), 10000);
    }
    return () => clearTimeout(timer);
  }, [isPreview]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className={` ${!isPreview ? '' : ''}`}>
        {children}
      </div>
      
      {!isPreview && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="p-4">
              <Lock className="w-6 h-6 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{featureName}</h2>
            <p className="p-4">{description}</p>
            
            <ul className="space-y-3">
              {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600">
                  <span className="p-4">✓</span> {feat}
                </li>
              ))}
            </ul>
            
            <div className="flex gap-4 mt-8">
              <Link href="/dashboard/billing" className={`btn btn-primary `}>
                Unlock with Professional — $199/mo
              </Link>
              <Link href="/dashboard/billing" className={`btn btn-secondary `}>
                Start Free Trial
              </Link>
            </div>
            <button 
              className="p-4"
              onClick={() => setIsPreview(true)}
            >
              Preview for 10 seconds
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
