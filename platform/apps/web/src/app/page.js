import Link from 'next/link';
import { ArrowRight, BarChart3, Database, BrainCircuit, Search, Building2, Users, Target, Network, MessageCircleQuestion, GitCompare, Radio, Bot, ShieldCheck, Crosshair, DollarSign, FileText, Handshake, Briefcase, Trophy, CheckCircle2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      
      {/* Premium Light Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-all shadow-sm">
        <div className="container flex h-16 max-w-7xl mx-auto px-6 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[#0a2540]">
              FedPulse
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
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

      <main className="flex-1 flex flex-col items-center">
        
        {/* Crisp Light Hero Section */}
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
            <Badge variant="secondary" className="mb-8 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The Intelligence Layer for Federal Procurement
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-[1.1] text-[#0a2540]">
              Track <span className="text-primary">$22.4 billion</span> in contract renewals across 98 departments.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
              Know who buys, who wins, and what expires — before anyone else. Powered by verified federal data and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base shadow-stripe" })}>
                Explore the Data <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-base bg-white shadow-sm" })}>
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

        {/* Live Intelligence Mockup */}
        <section className="relative w-full max-w-6xl mx-auto px-6 -mt-10 mb-32 z-20">
          <Card className="p-2 md:p-4 shadow-stripe bg-white">
            <div className="bg-[#f6f9fc] rounded-xl border border-border overflow-hidden">
              {/* Mockup Header */}
              <div className="h-12 border-b border-border bg-white flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs text-muted-foreground font-medium">FedPulse Live Environment</div>
              </div>
              {/* Mockup Body */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-[#0a2540]">Live Intelligence</h3>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Real-time Data</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Renewal Candidates", value: "4,050", icon: Radio, color: "text-blue-600" },
                    { label: "Tracked Value", value: "$22.4B", icon: DollarSign, color: "text-emerald-600" },
                    { label: "Federal Departments", value: "98", icon: Building2, color: "text-purple-600" },
                    { label: "Active Suppliers", value: "2,273", icon: Users, color: "text-amber-600" }
                  ].map((stat, i) => (
                    <Card key={i} className="shadow-sm border-border bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          <span className="text-muted-foreground font-medium text-sm">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight text-[#0a2540]">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Mock Table */}
                <Card className="overflow-hidden shadow-sm border-border bg-white relative">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f6f9fc] hover:bg-[#f6f9fc]">
                        <TableHead className="font-semibold text-[#0a2540]">Contract</TableHead>
                        <TableHead className="font-semibold text-[#0a2540]">Department</TableHead>
                        <TableHead className="font-semibold text-[#0a2540]">Supplier</TableHead>
                        <TableHead className="font-semibold text-[#0a2540]">Value</TableHead>
                        <TableHead className="font-semibold text-[#0a2540] text-right">Days Left</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold text-primary">IT Services Master...</TableCell>
                        <TableCell>Shared Services Canada</TableCell>
                        <TableCell>IBM Canada</TableCell>
                        <TableCell className="font-medium">$14.2M</TableCell>
                        <TableCell className="text-right text-red-600 font-bold">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-primary">Cloud Migration Ph...</TableCell>
                        <TableCell>National Defence</TableCell>
                        <TableCell>AWS Public Sector</TableCell>
                        <TableCell className="font-medium">$8.5M</TableCell>
                        <TableCell className="text-right text-amber-600 font-bold">45</TableCell>
                      </TableRow>
                      <TableRow className="blur-[2px] opacity-60">
                        <TableCell>Cybersecurity Asses...</TableCell>
                        <TableCell>Health Canada</TableCell>
                        <TableCell>Deloitte Inc.</TableCell>
                        <TableCell className="font-medium">$3.1M</TableCell>
                        <TableCell className="text-right font-medium">88</TableCell>
                      </TableRow>
                      <TableRow className="blur-[4px] opacity-40">
                        <TableCell>Data Center Support...</TableCell>
                        <TableCell>Transport Canada</TableCell>
                        <TableCell>CGI Group</TableCell>
                        <TableCell className="font-medium">$12.4M</TableCell>
                        <TableCell className="text-right font-medium">120</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <Link href="/signup" className={buttonVariants({ size: "lg", className: "shadow-stripe" })}>
                      Unlock All 4,050 Renewals
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        {/* Intelligence Suite Grid */}
        <section id="products" className="w-full py-24 relative bg-[#f6f9fc] border-y border-border">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0a2540] tracking-tight">Complete Intelligence Suite</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">9 AI-powered products designed to give you an unfair advantage in federal procurement.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Radio, name: "Renewal Watch", desc: "Track $22.4B in expiring contracts before they go to tender." },
                { icon: Building2, name: "Department Intelligence", desc: "Profile 98 federal buyers, their spending habits, and budgets." },
                { icon: Users, name: "Supplier Intelligence", desc: "Analyze 2,273 competitors and their incumbent advantages." },
                { icon: Bot, name: "AI Analyst", desc: "Instant bid/no-bid recommendations based on your capabilities." },
                { icon: Target, name: "Opportunity Intelligence", desc: "Score contract complexity and calculate win probability." },
                { icon: Search, name: "Semantic Search", desc: "Graph-powered natural language procurement search." },
                { icon: MessageCircleQuestion, name: "Question Answering", desc: "Ask anything about federal procurement in plain English." },
                { icon: GitCompare, name: "Similar Opportunities", desc: "Find historical precedents to guide your pricing strategy." },
                { icon: Network, name: "Knowledge Graph", desc: "Visualize hidden buyer-supplier relationships and networks." }
              ].map((prod, i) => (
                <Card key={i} className="group shadow-sm hover:shadow-stripe transition-shadow border-border bg-white">
                  <CardContent className="p-8">
                    <prod.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-3 text-[#0a2540]">{prod.name}</h3>
                    <p className="text-muted-foreground font-medium">{prod.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Agents */}
        <section className="w-full py-24 relative overflow-hidden bg-white">
          <div className="container max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0a2540] tracking-tight">AI Agents That Work For You</h2>
                <p className="text-muted-foreground text-lg max-w-xl font-medium">Fully autonomous workflows that handle the heavy lifting of capture and proposal management.</p>
              </div>
              <Badge variant="outline" className="text-primary bg-primary/5 py-1.5 px-4 font-semibold text-sm">
                Coming Q4 2026
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Crosshair, name: "Capture Manager", desc: "Automated capture planning with AI-generated win strategies and competitor mapping." },
                { icon: ShieldCheck, name: "Compliance Agent", desc: "Extracts obligations, builds compliance matrices, and flags gaps instantly." },
                { icon: DollarSign, name: "Pricing Strategy", desc: "Evaluates historical pricing and calculates optimal price-to-win." },
                { icon: FileText, name: "Proposal Strategy", desc: "Generates annotated outlines and maps win themes to evaluation criteria." }
              ].map((agent, i) => (
                <Card key={i} className="shadow-sm border-border bg-white">
                  <CardContent className="p-8">
                    <agent.icon className="w-8 h-8 text-primary mb-6" />
                    <h3 className="text-lg font-bold mb-3 text-[#0a2540]">{agent.name}</h3>
                    <p className="text-muted-foreground text-sm font-medium">{agent.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-32 bg-[#f6f9fc] border-t border-border">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0a2540] tracking-tight">How It Works</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-border"></div>
              
              {[
                { num: "01", icon: Search, title: "Discover", desc: "Search across 98 departments and $22.4B in contracts" },
                { num: "02", icon: Bot, title: "Analyze", desc: "AI scores opportunities, profiles buyers, maps competitors" },
                { num: "03", icon: Target, title: "Decide", desc: "Get bid/no-bid recommendations backed by evidence" },
                { num: "04", icon: Trophy, title: "Win", desc: "Enter bids with superior intelligence and preparation" }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full bg-white border border-border shadow-sm flex items-center justify-center mb-6 relative group-hover:border-primary/50 group-hover:shadow-md transition-all">
                    <Badge className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold p-0">{step.num}</Badge>
                    <step.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#0a2540]">{step.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-border bg-white pt-20 pb-10">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-bold tracking-tight text-[#0a2540] mb-6 block">FedPulse</span>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs font-medium">The intelligence layer for federal procurement. Built on verified data, powered by AI.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#0a2540] mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><Link href="#" className="hover:text-[#0a2540] transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-[#0a2540] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[#0a2540] transition-colors">Agent Workspaces</Link></li>
                <li><Link href="#" className="hover:text-[#0a2540] transition-colors">Knowledge Graph</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#0a2540] mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><Link href="/about" className="hover:text-[#0a2540] transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-[#0a2540] transition-colors">Methodology</Link></li>
                <li><Link href="/contact" className="hover:text-[#0a2540] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#0a2540] mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><Link href="/terms" className="hover:text-[#0a2540] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#0a2540] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#0a2540] transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
            <p>© 2026 Procurement Intelligence Network. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
