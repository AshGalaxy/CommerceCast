'use client';

import Link from 'next/link';
import { Sparkles, Loader2, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useTheme } from '@/contexts/theme-context';
import { Suspense, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

import { HeroSection } from '@/components/landing/HeroSection';
import { StickyFeatures } from '@/components/landing/StickyFeatures';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
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
      className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-1"
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
  const { theme, setTheme } = useTheme();
  const { user, isUserLoading } = useUser();

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md shadow-primary/30">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold font-headline tracking-tight">CommerceCast</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">

            {/* Light / Dark toggle */}
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
                <Button
                  asChild
                  size="sm"
                  className="h-8 text-xs font-semibold px-4 shadow-md shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-px transition-all duration-200"
                >
                  <Link href="/signup">Get started</Link>
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
                  <Button asChild className="mt-1 h-10">
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
        <HeroSection />

        <div id="features">
          <StickyFeatures />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <ComparisonSection />
        <Testimonials />

        <div id="pricing">
          <PricingSection />
        </div>

        <div id="faq">
          <FAQ />
        </div>

        <PreFooterCTA />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-background">
        <div className="h-px bg-border/20" />
        <div className="container px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">CommerceCast</span>
          </Link>

          <p className="text-xs text-muted-foreground/50 order-last sm:order-none">
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
