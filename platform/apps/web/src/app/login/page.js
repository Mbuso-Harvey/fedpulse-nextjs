'use client';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hover:opacity-80 transition-opacity">
            FedPulse
          </Link>
        </div>

        {/* Glassmorphism Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl bg-slate-900/60 relative overflow-hidden">
          {/* Edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Sign in to FedPulse</h1>
            <p className="text-slate-400 text-sm">Enter your details to access your intelligence hub</p>
          </div>

          <div className="space-y-4">
            <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium transition-all hover:border-white/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium transition-all hover:border-white/20">
              <svg viewBox="0 0 21 21" className="w-5 h-5"><path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/></svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-medium tracking-wider rounded-full">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input type="email" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all" placeholder="you@company.com" />
              </div>
            </div>

            <Link href="/dashboard" className="btn-premium w-full h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Send Magic Link
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
