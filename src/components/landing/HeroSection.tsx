'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

const BRANDS = ['Shopify', 'Amazon', 'WooCommerce', 'Magento', 'BigCommerce'];

export function HeroSection() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100svh - 3.5rem)' }}>
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(59,130,246,0.13),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_80%,rgba(99,102,241,0.07),transparent)]" />

      {/* Subtle dot-grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main content — fades + lifts on scroll */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="container relative z-10 flex flex-col items-center text-center gap-8 px-4 py-24"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI Forecasting Engine v2.0 — Now live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-extrabold tracking-tighter font-headline leading-[1.04]"
        >
          The e-commerce brain
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-primary to-blue-600">
            that never sleeps.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Demand forecasting, inventory optimisation, and promotion simulation — unified in one intelligent platform. Built for brands that move fast.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Button asChild size="lg" className="h-11 px-8 text-sm font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <Link href="/signup">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-11 px-8 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-all duration-200">
            <Link href="/login">Book a demo</Link>
          </Button>
        </motion.div>

        {/* Social proof / integrations strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col items-center gap-4 pt-2"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
            Integrates with
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-sm font-semibold text-muted-foreground/35 hover:text-muted-foreground/60 transition-colors duration-200 cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/30"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Bottom fade-out into next section */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }}
      />
    </section>
  );
}
