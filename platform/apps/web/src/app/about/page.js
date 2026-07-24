import Link from 'next/link';
import { Database, Network, ShieldCheck, Search, Shield, Zap } from 'lucide-react';

export const metadata = {
  title: 'About - Procurement Intelligence Network',
  description: 'Making federal procurement transparent and accessible through data and AI.',
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="flex flex-col gap-3 mb-8">
        <div className={`container `}>
          <Link href="/" className="p-4">
            Procurement Intelligence Network
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/#products" className="btn btn-ghost">Product</Link>
            <Link href="/pricing" className="btn btn-ghost">Pricing</Link>
            <Link href="/about" className="btn btn-ghost">About</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="btn btn-ghost">Sign In</Link>
            <Link href="/signup" className="btn btn-primary">Start Free Trial</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">About Procurement Intelligence Network</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Making federal procurement transparent, predictable, and accessible. We believe that better intelligence leads to better competition and value for everyone.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Methodology</h2>
              <p className="p-4">
                We aggregate fragmented public data from SAM.gov, departmental disclosures, and our own proprietary FOI requests. This raw data is often messy, unstructured, and disconnected.
              </p>
              <p className="p-4">
                Using advanced entity resolution and our proprietary Knowledge Graph, we clean and connect this data, mapping the complex relationships between departments, historical contracts, active suppliers, and upcoming renewals.
              </p>
            </div>
            <div className="p-4">
              <div className={`card `}>
                <Database className="p-4" />
                <h3>Data Pipeline</h3>
                <p>Continuous ingestion from 98+ federal sources, normalized into our unified data model.</p>
              </div>
              <div className={`card `}>
                <Network className="p-4" />
                <h3>Knowledge Graph</h3>
                <p>Connecting millions of entities to surface hidden relationships and historical precedents.</p>
              </div>
              <div className={`card `}>
                <Zap className="p-4" />
                <h3>AI Scoring</h3>
                <p>Predictive models that assess complexity, win probability, and renewal likelihood.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Quality Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="p-4">Data Quality Standards</h2>
          <p className="p-4">Not all data is created equal. We classify our intelligence into three confidence tiers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)'}}>Gold Tier</div>
              <h3>Verified Records</h3>
              <p>Directly extracted from primary sources (e.g., SAM.gov) with full structured metadata and high confidence scores. 100% human-auditable.</p>
            </div>
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--text-secondary)', borderColor: 'var(--border-primary)'}}>Silver Tier</div>
              <h3>Derived Intelligence</h3>
              <p>Inferred relationships based on historical patterns, corporate hierarchies, and entity resolution models. Confidence &gt; 90%.</p>
            </div>
            <div className={`card bg-white border border-slate-200 rounded-2xl p-8`}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4" style={{color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)'}}>Bronze Tier</div>
              <h3>Predictive Insights</h3>
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
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Security Posture</h2>
              <p className="p-4">
                We understand that your pursuit strategies, search history, and saved opportunities are highly sensitive competitive intelligence.
              </p>
              <p className="p-4">
                Our architecture ensures strict tenant isolation. Your private annotations, pipeline data, and agent interactions are never used to train our shared foundational models. We treat your strategy with the same security rigor as the federal departments you sell to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-950 text-white text-center">
        <div className="container text-center">
          <h2>Experience the platform</h2>
          <p>Stop guessing. Start winning with data-driven intelligence.</p>
          <div className="p-4">
            <Link href="/dashboard" className="btn btn-primary btn-lg">Start exploring the data</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 text-center text-slate-500">
        <div className="container">
          <div className="p-4">
            <p>&copy; 2026 Procurement Intelligence Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
