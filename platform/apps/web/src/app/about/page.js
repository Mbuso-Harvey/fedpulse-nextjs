import Link from 'next/link';
import { Database, Network, ShieldCheck, Search, Shield, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'About - Procurement Intelligence Network',
  description: 'Making federal procurement transparent and accessible through data and AI.',
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full bg-white/80">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-6">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold tracking-tight text-xl text-[#0a2540]">
              FedPulse
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/#products" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="/pricing" className="text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
              Sign In
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "default" })}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">The definitive intelligence network for B2G.</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We engineer federal procurement to be transparent, predictable, and actionable. Superior intelligence drives uncompromising competitive advantage.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">The Intelligence Engine</h2>
              <p className="p-4">
                We process fragmented public data from SAM.gov, departmental disclosures, and proprietary FOI pipelines. Raw federal data is unstructured and chaotic.
              </p>
              <p className="p-4">
                Through advanced entity resolution and our proprietary Knowledge Graph, we synthesize this chaos into signal. We map the complex topology of departments, historical awards, active vendors, and hidden renewal cycles.
              </p>
            </div>
            <div className="p-4">
              <div className={`card `}>
                <Database className="p-4" />
                <h3>Data Infrastructure</h3>
                <p>Continuous, high-throughput ingestion from 98+ federal endpoints, mapped directly to a unified schema.</p>
              </div>
              <div className={`card `}>
                <Network className="p-4" />
                <h3>Relational Graph</h3>
                <p>Deep entity resolution linking millions of records to expose hidden procurement patterns and vendor histories.</p>
              </div>
              <div className={`card `}>
                <Zap className="p-4" />
                <h3>Predictive AI</h3>
                <p>Proprietary scoring models forecasting agency complexity, win probability, and latent renewal cycles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Quality Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="p-4">Data Fidelity Standards</h2>
          <p className="p-4">Precision is non-negotiable. We classify intelligence across three rigid confidence tiers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)'}}>Gold Tier</div>
              <h3>Verified Records</h3>
              <p>Directly extracted from primary sources (e.g., SAM.gov) with full structured metadata and high confidence scores. 100% human-auditable.</p>
            </div>
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--text-secondary)', borderColor: 'var(--border-primary)'}}>Silver Tier</div>
              <h3>Inferred Intelligence</h3>
              <p>Inferred relationships based on historical patterns, corporate hierarchies, and entity resolution models. Confidence &gt; 90%.</p>
            </div>
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)'}}>Bronze Tier</div>
              <h3>Forward Analytics</h3>
              <p>AI-generated forecasts for unannounced renewals or estimated contract values based on departmental spending trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16">
        <div className="container">
          <div className="p-4">
            <div className="p-4">
              <div className={`card glass `}>
                <Shield className="p-4" />
                <h3>Encryption</h3>
                <p>AES-256 encryption at rest and TLS 1.3 in transit. Bank-grade security for all user interactions.</p>
              </div>
              <div className={`card glass `}>
                <ShieldCheck className="p-4" />
                <h3>Compliance</h3>
                <p>Fully compliant with PIPEDA. We are currently executing our SOC 2 Type II compliance roadmap.</p>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Enterprise Security Posture</h2>
              <p className="p-4">
                Your pursuit strategy, search analytics, and pipeline are highly sensitive competitive intelligence. We protect it accordingly.
              </p>
              <p className="p-4">
                Our infrastructure enforces strict, zero-trust tenant isolation. Your private annotations, pipeline signals, and agent interactions are explicitly walled off from our foundational models. We deploy the same security rigor as the federal agencies you sell to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-950 text-white text-center">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Command your pipeline.</h2>
          <p className="text-xl mb-8">Stop guessing. Outmaneuver the competition with decisive, data-driven intelligence.</p>
          <div className="p-4">
            <Link href="/dashboard" className="btn btn-primary btn-lg">Deploy FedPulse</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8 mt-auto">
        <div className="container max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 FedPulse. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
