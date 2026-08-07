'use client';

import Link from 'next/link';
import { Sparkles, Loader2, Sun, Moon, Menu, X, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useUser } from '@/firebase';
import { useTheme } from '@/contexts/theme-context';
import { Suspense, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

import { HeroSection } from '@/components/landing/HeroSection';
import { PainSection } from '@/components/landing/PainSection';
import { StickyFeatures } from '@/components/landing/StickyFeatures';
import { MetricsBar } from '@/components/landing/MetricsBar';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { Testimonials } from '@/components/landing/Testimonials';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQ } from '@/components/landing/FAQ';
import { PreFooterCTA } from '@/components/landing/PreFooterCTA';

// ─── Grain ────────────────────────────────────────────────────────────────────

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-1"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
    </Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, isUserLoading } = useUser();

  const isDark = resolvedTheme === 'dark';

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 20));

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 h-14 flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container px-4 flex items-center gap-8 w-full">

          {/* Logo Container with Premium Material Styling */}
          <div className="flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent backdrop-blur-md shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-white/10 dark:ring-white/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
            <Logo className="w-5 h-5 text-primary drop-shadow-sm" />
            <span className="text-[14px] font-bold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">CommerceCast</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle colour mode"
              className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Auth */}
            {isUserLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <Button asChild size="sm" className="h-8 text-xs font-semibold px-4">
                <Link href="/dashboard">Dashboard →</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">Sign in</Link>
                </Button>

                {/* Premium Global CTA */}
                <Button
                  asChild
                  size="sm"
                  className="relative h-8 text-xs font-semibold px-5 overflow-hidden group border-0"
                >
                  <Link href="/signup">
                    <span className="relative z-10">Get started</span>
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent z-20" />
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Open menu"
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all ml-1"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-14 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-xl md:hidden"
          >
            <nav className="container px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <NavLink key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>
                  <span className="block py-2 text-base font-medium">{l.label}</span>
                </NavLink>
              ))}
              <div className="h-px bg-border/50 my-3" />
              {!user && (
                <>
                  <Button asChild variant="ghost" className="justify-start h-10 px-0 text-muted-foreground">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild className="mt-1 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>Get started →</Link>
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
      { label: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/guide' },
      { label: 'API Reference', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/20">
      <div className="container px-4 pt-14 pb-8">

        {/* Top — logo col + link cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <Logo className="w-7 h-7 text-primary group-hover:scale-105 transition-transform" />
              <span className="text-[15px] font-bold font-headline tracking-tight">CommerceCast</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              The e-commerce brain that never sleeps.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>

            {/* Status indicator */}
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-0.5"
                    >
                      {link.label}
                      <span className="absolute inset-x-0 -bottom-px h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground/40">
            © 2026 CommerceCast Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/30">
            Built with Next.js · Framer Motion · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LandingPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">

      {/* Global grain texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px' }}
      />

      <Navbar />
      <div className="h-14" />

      <main className="flex-1">
        {/* 1. Hook */}
        <HeroSection />

        {/* 2. Problem — cost of guessing */}
        <PainSection />

        {/* 3. Solution — sticky feature walkthrough */}
        <div id="features">
          <StickyFeatures />
        </div>

        {/* 4. Trust signal — metrics */}
        <MetricsBar />

        {/* 5. How it works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* 6. Everything included — bento */}
        <BentoGrid />

        {/* 7. Social proof */}
        <Testimonials />

        {/* 8. Proof vs. competition */}
        <ComparisonSection />

        {/* 9. Pricing */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* 10. FAQ */}
        <div id="faq">
          <FAQ />
        </div>

        {/* 11. Final CTA */}
        <PreFooterCTA />
      </main>

      <Footer />
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
