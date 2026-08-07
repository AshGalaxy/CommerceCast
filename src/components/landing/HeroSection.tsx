'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

const BRANDS = ['Shopify', 'Amazon', 'WooCommerce', 'Magento', 'BigCommerce'];

export function HeroSection() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep background gradient */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="container relative z-10 flex flex-col items-center text-center gap-8 px-4"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI Forecasting Engine v2.0 — Now live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tighter font-headline leading-[1.05]"
        >
          The e-commerce brain
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-primary to-blue-600">
            that never sleeps.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Demand forecasting, inventory optimization, and promotion simulation — unified in one intelligent platform. Built for brands that move fast.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Button asChild size="lg" className="h-11 px-7 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
            <Link href="/signup">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-11 px-7 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <Link href="/login">Book a demo →</Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-4 pt-4"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">
            Integrates with
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
