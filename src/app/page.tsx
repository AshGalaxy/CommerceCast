'use client';

import Link from 'next/link';
import { ArrowRight, BarChart2, Brain, CheckCircle, LineChart, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

function LandingPageContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold font-headline tracking-tight">CommerceCast</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          {isUserLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  New: AI Forecasting Engine v2.0
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-600 dark:from-white dark:via-primary dark:to-gray-400">
                  Predict Trends.<br />Optimize Inventory.<br />Scale Faster.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The intelligent analytics suite that transforms raw e-commerce data into actionable growth strategies. Stop guessing and start forecasting.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/signup">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                  <Link href="/login">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Powering Modern E-commerce</h2>
              <p className="mt-4 text-gray-500 md:text-lg dark:text-gray-400 max-w-2xl mx-auto">
                Our hybrid ensemble engine combines AI and statistical models to give you the competitive edge.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">AI Forecasting</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Predict sales up to 90 days out using Prophet, XGBoost, and ARIMA. Account for seasonality and holidays automatically.
                  </p>
                </CardContent>
              </Card>
              {/* Feature 2 */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Inventory Intelligence</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Automated ABC analysis and smart reorder points. Never run out of best-sellers or hold dead stock again.
                  </p>
                </CardContent>
              </Card>
              {/* Feature 3 */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Promotion Simulator</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    A/B test discount strategies before launch. calculate ROI, margin impact, and volume lift with precision.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Advanced Values */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  Real-time Analytics
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                  Executive Insights at a Glance
                </h2>
                <p className="text-gray-500 md:text-lg dark:text-gray-400">
                  The dashboard aggregates data from multiple sources to track vital KPIs like Revenue, Gross Margin, and Customer Lifetime Value (CLV).
                </p>
                <div className="space-y-2">
                  {['Real-time Revenue Monitoring', 'Churn Rate Analysis', 'Customer Segmentation'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border bg-muted/50 p-4 lg:p-10 shadow-sm">
                {/* Abstract visual representation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 bg-background p-4 rounded-lg shadow-sm">
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-8 w-full bg-primary/20 rounded animate-pulse"></div>
                    <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 bg-background p-4 rounded-lg shadow-sm">
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-8 w-full bg-green-500/20 rounded animate-pulse"></div>
                    <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="col-span-2 space-y-2 bg-background p-4 rounded-lg shadow-sm">
                    <div className="h-40 w-full bg-gradient-to-t from-primary/5 to-transparent rounded flex items-end justify-around pb-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="w-4 bg-primary rounded-t" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-white">
              Ready to Scale Your Business?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mt-4">
              Join forward-thinking retailers using CommerceCast to make data-driven decisions.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
                <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 CommerceCast. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/guide">
            User Guide
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <LandingPageContent />
    </Suspense>
  );
}
