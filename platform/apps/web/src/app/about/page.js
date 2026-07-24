import Link from 'next/link';
import { Database, Network, ShieldCheck, Search, Shield, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0a2540] mb-8">The definitive intelligence network for B2G.</h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          We engineer federal procurement to be transparent, predictable, and actionable. Superior intelligence drives uncompromising competitive advantage.
        </p>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-slate-50 border-y border-border/50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">The Intelligence Engine</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We process fragmented public data from SAM.gov, departmental disclosures, and proprietary FOI pipelines. Raw federal data is unstructured and chaotic.
              </p>
              <p className="text-lg text-muted-foreground">
                Through advanced entity resolution and our proprietary Knowledge Graph, we synthesize this chaos into signal. We map the complex topology of departments, historical awards, active vendors, and hidden renewal cycles.
              </p>
            </div>
            <div className="grid gap-6">
              <Card className="shadow-sm border-transparent hover:border-border transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <Database className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Data Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Continuous, high-throughput ingestion from 98+ federal endpoints, mapped directly to a unified schema.</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-transparent hover:border-border transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <Network className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Relational Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Deep entity resolution linking millions of records to expose hidden procurement patterns and vendor histories.</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-transparent hover:border-border transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <Zap className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Predictive AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Proprietary scoring models forecasting agency complexity, win probability, and latent renewal cycles.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data Quality Section */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0a2540] mb-4">Data Fidelity Standards</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Precision is non-negotiable. We classify intelligence across three rigid confidence tiers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <Card className="shadow-stripe flex flex-col items-start border-[#e6ebf1]">
              <CardHeader>
                <Badge variant="outline" className="mb-4 bg-amber-50 text-amber-700 border-amber-200">Gold Tier</Badge>
                <CardTitle>Verified Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Directly extracted from primary sources (e.g., SAM.gov) with full structured metadata and high confidence scores. 100% human-auditable.</p>
              </CardContent>
            </Card>
            <Card className="shadow-stripe flex flex-col items-start border-[#e6ebf1]">
              <CardHeader>
                <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">Silver Tier</Badge>
                <CardTitle>Inferred Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Inferred relationships based on historical patterns, corporate hierarchies, and entity resolution models. Confidence &gt; 90%.</p>
              </CardContent>
            </Card>
            <Card className="shadow-stripe flex flex-col items-start border-[#e6ebf1]">
              <CardHeader>
                <Badge variant="outline" className="mb-4 bg-orange-50 text-orange-700 border-orange-200">Bronze Tier</Badge>
                <CardTitle>Forward Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">AI-generated forecasts for unannounced renewals or estimated contract values based on departmental spending trends.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-slate-50 border-t border-border/50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid gap-6 order-2 md:order-1">
              <Card className="shadow-sm border-transparent bg-white">
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">AES-256 encryption at rest and TLS 1.3 in transit. Bank-grade security for all user interactions.</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-transparent bg-white">
                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fully compliant with PIPEDA. We are currently executing our SOC 2 Type II compliance roadmap.</p>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Enterprise Security Posture</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your pursuit strategy, search analytics, and pipeline are highly sensitive competitive intelligence. We protect it accordingly.
              </p>
              <p className="text-lg text-muted-foreground">
                Our infrastructure enforces strict, zero-trust tenant isolation. Your private annotations, pipeline signals, and agent interactions are explicitly walled off from our foundational models. We deploy the same security rigor as the federal agencies you sell to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 flex flex-col items-center justify-center bg-[#0a2540] text-white">
        <div className="container max-w-4xl text-center px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Command your pipeline.</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Stop guessing. Outmaneuver the competition with decisive, data-driven intelligence.</p>
          <Link href="/signup" className={buttonVariants({ variant: "secondary", size: "lg", className: "bg-white text-[#0a2540] hover:bg-slate-100 hover:text-[#0a2540] font-semibold px-8 h-12 text-base shadow-lg" })}>
            Deploy FedPulse
          </Link>
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
