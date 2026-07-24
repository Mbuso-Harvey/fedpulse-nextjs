'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MailCheck, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simulate clicking the email link
  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/onboarding');
    }, 1000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="p-4">
          <div className="p-4">Procurement Intelligence Network</div>
        </div>

        <div className="p-4">
          <div className="p-4">
            <MailCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Check your inbox</h1>
          <p className="text-slate-500 text-lg">
            We sent a verification link to your email
          </p>
          
          <button 
            className={`btn btn-primary `}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? <Loader2 className="p-4" size={20} /> : 'Simulate Verification (Dev only)'}
          </button>
          
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Didn't receive it? <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}>Resend verification email</button>
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Wrong email? <Link href="/signup" className="p-4">Back to signup</Link>
            </p>
            <p className="p-4">
              Don't forget to check your spam folder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
