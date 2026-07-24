'use client';
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export function UsageMeter({ feature, limit = 5, children }) {
  const [usageCount, setUsageCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_${feature}_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    setUsageCount(count);
  }, [feature]);

  const incrementUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_${feature}_${today}`;
    const newCount = usageCount + 1;
    localStorage.setItem(key, newCount.toString());
    setUsageCount(newCount);
  };

  if (!mounted) return null;

  const isLimitReached = usageCount >= limit;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div className="p-4">
          <span className={isLimitReached ? '' : ''}>
            {usageCount} of {limit} daily {feature} used
          </span>
        </div>
      </div>
      
      {isLimitReached ? (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <Lock className="w-6 h-6 text-indigo-500" />
            <h2>Limit Reached</h2>
            <p>You've used all {limit} daily {feature}. Professional users get unlimited access.</p>
            <button className="btn btn-primary" onClick={() => setUsageCount(0)}>
              Upgrade to Professional
            </button>
            <p className="p-4">Resets in 12 hours</p>
          </div>
        </div>
      ) : (
        <div onClick={incrementUsage}>
          {children}
        </div>
      )}
    </div>
  );
}
