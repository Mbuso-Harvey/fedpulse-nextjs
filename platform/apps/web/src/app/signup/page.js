'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { isAuthEnabled } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (!isAuthEnabled()) {
        setTimeout(() => {
          setLoading(false);
          setMessage('Check your email for the magic link!');
        }, 1000);
        return;
      }
      
      // Simulate magic link sending
      setTimeout(() => {
        setLoading(false);
        setMessage('Check your email for the magic link!');
      }, 1000);
      
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    router.push('/onboarding');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            FedPulse
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">Join FedPulse and start tracking contracts</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={() => handleSocialSignup('microsoft')} className="flex items-center justify-center gap-3 w-full h-11 px-4 bg-background border border-input rounded-md hover:bg-muted/50 transition-colors font-medium text-sm">
            <svg viewBox="0 0 21 21" className="w-5 h-5"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
            Continue with Microsoft
          </button>
          <button onClick={() => handleSocialSignup('google')} className="flex items-center justify-center gap-3 w-full h-11 px-4 bg-background border border-input rounded-md hover:bg-muted/50 transition-colors font-medium text-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button onClick={() => handleSocialSignup('linkedin')} className="flex items-center justify-center gap-3 w-full h-11 px-4 bg-background border border-input rounded-md hover:bg-muted/50 transition-colors font-medium text-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Continue with LinkedIn
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Company Email"
                className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 h-11 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 transition-colors" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Magic Link'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By continuing, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
          </p>

          {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
          {message && <p className="text-sm text-emerald-600 text-center mt-2">{message}</p>}
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
