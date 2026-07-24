'use client';
import { Children, useState } from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export function RowBlur({ visibleRows = 3, totalRows = 10, children }) {
  const [isPreview, setIsPreview] = useState(false);
  const items = Children.toArray(children);
  
  if (isPreview || items.length <= visibleRows) {
    return <>{children}</>;
  }

  const visibleItems = items.slice(0, visibleRows);
  const blurredItems = items.slice(visibleRows, visibleRows + 2);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {visibleItems}
      <div className="p-4">
        <div className="p-4"></div>
        {blurredItems.map((item, i) => (
          <div key={i} className="p-4">
            {item}
          </div>
        ))}
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <Lock className="w-6 h-6 text-indigo-500" />
            <h3>Unlock Full Results</h3>
            <p>You're viewing {visibleRows} of {totalRows} results. Upgrade to see everything.</p>
            <Link href="/dashboard/billing" className="btn btn-primary">Unlock All Data — $199/mo</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsPreview(true)}>
              Preview Full List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
