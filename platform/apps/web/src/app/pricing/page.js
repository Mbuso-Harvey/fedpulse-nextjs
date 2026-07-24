import Link from 'next/link';
import { Check } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Pricing - FedPulse',
  description: 'Simple, transparent pricing for federal procurement intelligence.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FedPulse
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/#products" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="/pricing" className="text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
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

      <main className="flex-1">
        <section className="py-24 md:py-32 px-6 flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-8 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl text-[#0a2540]">
            The intelligence layer for federal procurement.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-16">
            Predictable pricing. Uncompromising power. Scale your capture strategy with data-driven precision.
          </p>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl items-start text-left">
            {/* Starter */}
            <Card className="flex flex-col h-full shadow-stripe">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Essential intelligence for individual capture managers.</CardDescription>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Weekly market intelligence digest</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 5 specialized queries per day</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Access top 10 upcoming renewals</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Departmental spending overviews</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  Get Started
                </Link>
              </CardFooter>
            </Card>

            {/* Professional */}
            <Card className="flex flex-col h-full border-primary shadow-stripe relative md:-translate-y-4 overflow-visible">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1 uppercase tracking-wider text-xs">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <CardDescription>Advanced analytics for modern capture teams.</CardDescription>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3 font-semibold"><Check className="h-4 w-4 text-primary" /> Everything in Starter</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Unrestricted renewal database access</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Unlimited semantic search & filtering</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Full intelligence product suite</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> AI-powered capture analyst</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> One-click CSV & PDF exports</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className={buttonVariants({ className: "w-full" })}>
                  Start Free Trial
                </Link>
              </CardFooter>
            </Card>

            {/* Enterprise */}
            <Card className="flex flex-col h-full shadow-stripe">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>Uncompromising scale for enterprise integrators.</CardDescription>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3 font-semibold"><Check className="h-4 w-4 text-primary" /> Everything in Professional</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Custom team deployment (5+ seats)</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Unlimited programmatic API access</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Custom CRM & pipeline integrations</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Dedicated deployment engineering</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  Contact Sales
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
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
