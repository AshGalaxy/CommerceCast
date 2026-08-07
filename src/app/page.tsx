'use client';

import Link from 'next/link';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import { HeroSection } from '@/components/landing/HeroSection';
import { StickyFeatures } from '@/components/landing/StickyFeatures';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQ } from '@/components/landing/FAQ';
import { PreFooterCTA } from '@/components/landing/PreFooterCTA';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

// Animated underline link used in navbar + footer
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
    </Link>
  );
}

// Global SVG grain overlay (real fractal noise, not gradient)
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function LandingPageContent() {
  const { user, isUserLoading } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative">

      {/* ── Global subtle grain ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px' }}
      />

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 h-14 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container px-4 flex items-center gap-8 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-primary/30">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-bold font-headline tracking-tight">CommerceCast</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3">
            {isUserLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <Button asChild size="sm" className="h-8 text-xs font-semibold px-4">
                <Link href="/dashboard">Dashboard →</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-medium hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="h-8 text-xs font-semibold px-4 shadow-md shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-px transition-all">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Page offset for fixed header ── */}
      <div className="h-14" />

      {/* ── Sections ── */}
      <main className="flex-1">
        <HeroSection />
        <StickyFeatures />
        <HowItWorks />
        <ComparisonSection />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <PreFooterCTA />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/40 bg-background">
        <div className="container px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">CommerceCast</span>
          </Link>

          <p className="text-xs text-muted-foreground/60 order-last sm:order-none">
            © 2026 CommerceCast Inc. All rights reserved.
          </p>

          <nav className="flex items-center gap-6">
            <NavLink href="/guide">Docs</NavLink>
            <NavLink href="#">Terms</NavLink>
            <NavLink href="#">Privacy</NavLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LandingPageContent />
    </Suspense>
  );
}
