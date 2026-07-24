'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="p-4">
          <div className="p-4">Procurement Intelligence Network</div>
        </div>

        {!success ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset your password</h1>
            <p className="text-slate-500 text-lg">Enter your email and we'll send you a reset link</p>

            <form className="p-4" onSubmit={handleSubmit}>
              <div className="p-4">
                <Mail className="p-4" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  className="p-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary `}
                disabled={loading}
              >
                {loading ? <Loader2 className="p-4" size={20} /> : 'Send Reset Link'}
              </button>
            </form>
            
            <div className="p-4">
              <Link href="/login" className="p-4">Back to sign in</Link>
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="p-4">
              <CheckCircle size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Check your inbox</h1>
            <p className="text-slate-500 text-lg">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            
            <div style={{ marginTop: 'var(--space-6)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Didn't receive it? <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}>Resend</button>
              </p>
              <Link href="/login" className="p-4">Back to sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
