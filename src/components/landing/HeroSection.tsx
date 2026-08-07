'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, BarChart2, Package, TrendingUp, ShoppingBag, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const BRANDS = ['Shopify', 'Amazon', 'WooCommerce', 'Magento', 'BigCommerce'];

const PHRASES = [
  'Forecast demand.',
  'Prevent stockouts.',
  'Simulate promotions.',
  'Optimize inventory.',
];

function Typewriter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-grid w-[240px] text-left">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="col-start-1 row-start-1 font-bold text-foreground"
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const ECommerceIcon = () => (
  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0 mx-1 md:mx-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 animate-float shadow-[0_0_20px_rgba(59,130,246,0.15)]">
    <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" strokeWidth={1.5} />
  </div>
);

const BrainIcon = () => (
  <div 
    className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0 mx-1 md:mx-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    style={{ animationDuration: '4s' }}
  >
    <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" strokeWidth={1.5} />
  </div>
);



export function HeroSection() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);

  return (
    <section className="relative w-full flex flex-col items-center pt-28 pb-10 overflow-hidden min-h-[110svh]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Aurora Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen opacity-50 dark:opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen opacity-50 dark:opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen opacity-30 dark:opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Subtle dot-grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="container relative z-10 flex flex-col items-center text-center gap-8 px-4"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 dark:border-blue-400/20 bg-blue-500/5 dark:bg-blue-500/10 px-4 py-1.5 text-[13px] font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-xl shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8),_0_4px_20px_rgba(59,130,246,0.15)] dark:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.1),_0_4px_20px_rgba(59,130,246,0.25)] ring-1 ring-black/5 dark:ring-white/5 cursor-default hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9),_0_6px_25px_rgba(59,130,246,0.25)] transition-all duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
          AI Forecasting Engine B2.0 is now live — We are now in Beta
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="flex flex-col items-center justify-center max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tighter font-headline leading-[1.04]"
        >
          <span className="inline-flex items-center flex-wrap justify-center md:flex-nowrap">
            The <ECommerceIcon /> e-commerce brain <BrainIcon />
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-500 via-primary to-indigo-600 mt-2">
            that never sleeps.
          </span>
        </motion.h1>

        {/* Sub-headline with Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-2 text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          <span>Connect your store in minutes.</span>
          <Typewriter />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-2"
        >
          <Button asChild size="lg" className="font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <Link href="/signup">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-medium text-foreground bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-all duration-200 shadow-sm">
            <Link href="/login">Book a demo</Link>
          </Button>
        </motion.div>

        {/* Dashboard Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full max-w-5xl relative"
        >
          {/* Edge glow */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[24px] blur-xl opacity-20 pointer-events-none" />
          
          <div className="relative w-full rounded-t-[20px] border border-border/50 bg-background/40 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col h-[380px]"
            style={{ maskImage: 'linear-gradient(to bottom, white 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, white 70%, transparent 100%)' }}
          >
            {/* Top Bar */}
            <div className="w-full h-12 border-b border-border/40 flex items-center px-4 gap-2 bg-muted/20">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="flex-1" />
              <div className="h-6 w-48 rounded-md bg-muted/40 border border-border/30" />
            </div>

            {/* Dashboard Content Mock */}
            <div className="flex-1 p-6 flex gap-6">
              {/* Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-3">
                <div className="h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center px-3 gap-3">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  <div className="w-16 h-2 rounded bg-primary/50" />
                </div>
                <div className="h-8 rounded-md bg-muted/30 flex items-center px-3 gap-3">
                  <Package className="w-4 h-4 text-muted-foreground/50" />
                  <div className="w-20 h-2 rounded bg-muted-foreground/30" />
                </div>
                <div className="h-8 rounded-md bg-muted/30 flex items-center px-3 gap-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground/50" />
                  <div className="w-14 h-2 rounded bg-muted-foreground/30" />
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Top stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-xl border border-border/40 bg-muted/10 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm">
                        <span className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-16 h-3 rounded-full bg-muted-foreground/30" />
                        <div className="w-8 h-2 rounded-full bg-emerald-500/50" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 rounded-xl border border-border/40 bg-muted/10 p-4 relative overflow-hidden">
                  <svg className="w-full h-full text-primary opacity-30 drop-shadow-md" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 C20,20 40,30 50,15 C60,0 80,10 100,5 L100,30 L0,30 Z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M0,25 C20,20 40,30 50,15 C60,0 80,10 100,5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
