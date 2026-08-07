'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, BarChart2, Package, TrendingUp } from 'lucide-react';
import { PiShoppingBagDuotone, PiBrainDuotone } from 'react-icons/pi';
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
  <PiShoppingBagDuotone 
    className="inline-block w-[1.1em] h-[1.1em] -mt-[0.1em] mx-[0.1em] text-blue-500 drop-shadow-md animate-float" 
  />
);

const BrainIcon = () => (
  <PiBrainDuotone 
    className="inline-block w-[1.15em] h-[1.15em] -mt-[0.1em] mx-[0.1em] text-indigo-500 drop-shadow-md animate-pulse" 
    style={{ animationDuration: '4s' }}
  />
);



export function HeroSection() {

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
          className="mt-16 w-full max-w-5xl relative z-20 group"
        >
          {/* Subtle surrounding glow */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
          
          <div 
            className="relative w-full h-[500px] sm:h-[700px] rounded-t-2xl border-t border-l border-r border-white/10 dark:border-white/5 bg-background/50 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex flex-col"
            style={{ 
              maskImage: 'linear-gradient(to bottom, white 50%, transparent 100%)', 
              WebkitMaskImage: 'linear-gradient(to bottom, white 50%, transparent 100%)' 
            }}
          >
            
            {/* Minimalist Mac Header */}
            <div className="w-full h-10 border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-2 bg-muted/10 dark:bg-muted/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-4 w-32 rounded-md bg-black/5 dark:bg-white/5" />
              </div>
              <div className="w-10" /> {/* Spacer to balance header */}
            </div>

            {/* High-Fidelity Dashboard Mock */}
            <div className="flex-1 p-4 sm:p-6 flex gap-6 bg-gradient-to-br from-transparent to-muted/10">
              
              {/* Premium Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-1.5">
                <div className="h-7 w-20 rounded bg-primary/10 mb-4" />
                <div className="h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center px-3 gap-3 text-primary">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <div className="w-16 h-1.5 rounded-full bg-primary/50" />
                </div>
                <div className="h-8 rounded-lg hover:bg-muted/30 transition-colors flex items-center px-3 gap-3">
                  <Package className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <div className="w-20 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="h-8 rounded-lg hover:bg-muted/30 transition-colors flex items-center px-3 gap-3">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <div className="w-14 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { color: "bg-blue-500", label: "w-16", value: "w-10" },
                    { color: "bg-indigo-500", label: "w-20", value: "w-12" },
                    { color: "bg-emerald-500", label: "w-14", value: "w-8", hidden: true }
                  ].map((card, i) => (
                    <div key={i} className={`h-20 sm:h-24 rounded-xl border border-black/5 dark:border-white/5 bg-background/50 p-3 sm:p-4 flex flex-col justify-between shadow-sm ${card.hidden ? 'hidden sm:flex' : 'flex'}`}>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${card.color}/10 border border-${card.color}/20 flex items-center justify-center`}>
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${card.color}`} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className={`${card.label} h-2 rounded-full bg-muted-foreground/30`} />
                        <div className={`${card.value} h-1.5 rounded-full ${card.color}/70`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sleek Chart Area */}
                <div className="flex-1 rounded-xl border border-black/5 dark:border-white/5 bg-background/50 p-4 relative overflow-hidden flex flex-col gap-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-2 rounded-full bg-muted-foreground/40" />
                    <div className="flex gap-2">
                      <div className="w-8 h-4 rounded bg-muted-foreground/20" />
                      <div className="w-8 h-4 rounded bg-muted-foreground/10" />
                    </div>
                  </div>
                  <div className="flex-1 relative w-full mt-2">
                    {/* Minimalist Line Chart */}
                    <svg className="absolute inset-0 w-full h-full text-blue-500 overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,100 C10,95 20,60 30,70 C40,80 50,20 60,40 C70,60 80,10 90,30 C95,40 100,5 100,5" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M0,100 C10,95 20,60 30,70 C40,80 50,20 60,40 C70,60 80,10 90,30 C95,40 100,5 100,5 L100,120 L0,120 Z" fill="url(#chart-grad)" />
                    </svg>
                  </div>
                </div>

                {/* Second Row of Mock Components (to fill the extra height smoothly) */}
                <div className="flex gap-4 opacity-50">
                   <div className="flex-1 h-32 rounded-xl border border-black/5 dark:border-white/5 bg-background/30 p-4 shadow-sm flex flex-col gap-3">
                      <div className="w-32 h-2 rounded-full bg-muted-foreground/30" />
                      <div className="w-full h-1.5 rounded-full bg-muted-foreground/10 mt-4" />
                      <div className="w-3/4 h-1.5 rounded-full bg-muted-foreground/10" />
                      <div className="w-5/6 h-1.5 rounded-full bg-muted-foreground/10" />
                   </div>
                   <div className="w-1/3 h-32 rounded-xl border border-black/5 dark:border-white/5 bg-background/30 p-4 shadow-sm flex flex-col gap-3 hidden sm:flex">
                      <div className="w-20 h-2 rounded-full bg-muted-foreground/30" />
                      <div className="w-full flex-1 rounded-lg bg-blue-500/5 mt-2" />
                   </div>
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
