'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, BarChart2, Package, TrendingUp } from 'lucide-react';
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
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="inline-block w-14 h-14 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] -mt-2 md:-mt-4 mx-2 text-blue-500 drop-shadow-[0_8px_16px_rgba(59,130,246,0.3)] animate-float"
  >
    <defs>
      <linearGradient id="ecommerce-base" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="ecommerce-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </linearGradient>
      <filter id="ecommerce-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Base Platform / Grid */}
    <path d="M50 85 L20 68 L50 51 L80 68 Z" fill="url(#ecommerce-base)" />
    <path d="M50 85 L20 68 L50 51 L80 68 Z" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M35 76.5 L65 59.5 M65 76.5 L35 59.5" stroke="#60a5fa" strokeWidth="0.5" strokeOpacity="0.3" />

    {/* Front Left Face */}
    <path d="M20 68 L20 48 L50 65 L50 85 Z" fill="url(#ecommerce-base)" opacity="0.7" />
    <path d="M20 68 L20 48 L50 65 L50 85 Z" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.3" />

    {/* Front Right Face */}
    <path d="M80 68 L80 48 L50 65 L50 85 Z" fill="url(#ecommerce-base)" opacity="0.4" />

    {/* Top Box / Package */}
    <path d="M50 55 L30 43 L50 31 L70 43 Z" fill="url(#ecommerce-highlight)" filter="url(#ecommerce-glow)" opacity="0.9" />
    <path d="M50 55 L30 43 L50 31 L70 43 Z" stroke="#eff6ff" strokeWidth="1.5" />
    
    {/* Box Ribbons / Data lines */}
    <path d="M40 37 L60 49 M60 37 L40 49" stroke="#bfdbfe" strokeWidth="2" opacity="0.8" />
    <path d="M50 55 L50 43" stroke="#eff6ff" strokeWidth="1.5" />

    {/* Left Panel of Box */}
    <path d="M30 43 L30 25 L50 37 L50 55 Z" fill="url(#ecommerce-base)" />
    
    {/* Right Panel of Box */}
    <path d="M70 43 L70 25 L50 37 L50 55 Z" fill="#1d4ed8" opacity="0.6" />

    {/* Floating Data Nodes (Items) */}
    <circle cx="50" cy="15" r="4" fill="#60a5fa" filter="url(#ecommerce-glow)" />
    <path d="M50 21 L50 31" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
    
    <circle cx="22" cy="30" r="3" fill="#3b82f6" />
    <path d="M22 34 L28 41" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />

    <circle cx="78" cy="30" r="3" fill="#3b82f6" />
    <path d="M78 34 L72 41" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

const BrainIcon = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="inline-block w-14 h-14 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] -mt-2 md:-mt-4 mx-2 text-indigo-500 drop-shadow-[0_8px_16px_rgba(99,102,241,0.3)] animate-pulse" 
    style={{ animationDuration: '4s' }}
  >
    <defs>
      <linearGradient id="brain-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="50%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
      <linearGradient id="brain-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
      <filter id="brain-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Brain Outer Silhouette */}
    <path 
      d="M50 85 C30 85 15 70 15 50 C15 35 25 22 40 18 C45 16 55 16 60 18 C75 22 85 35 85 50 C85 70 70 85 50 85 Z" 
      stroke="url(#brain-grad-1)" 
      strokeWidth="2" 
      strokeDasharray="4 4"
      opacity="0.3"
      fill="url(#brain-grad-2)"
      fillOpacity="0.05"
    />
    
    {/* Left Hemisphere Core Circuitry */}
    <path d="M50 20 C40 20 30 28 30 40 C30 55 40 65 50 70 M50 20 L50 70" stroke="url(#brain-grad-1)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    <path d="M30 40 C20 40 22 55 30 60" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M40 30 C35 30 35 40 40 45" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
    
    {/* Right Hemisphere Core Circuitry */}
    <path d="M50 20 C60 20 70 28 70 40 C70 55 60 65 50 70" stroke="url(#brain-grad-2)" strokeWidth="3" strokeLinecap="round" filter="url(#brain-glow)" />
    <path d="M70 40 C80 40 78 55 70 60" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M60 30 C65 30 65 40 60 45" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

    {/* Neural Interconnections (Synapses) */}
    <path d="M40 45 L50 50 L60 45" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M35 55 L50 60 L65 55" stroke="#c7d2fe" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M45 25 L50 30 L55 25" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />

    {/* Synaptic Nodes */}
    <circle cx="40" cy="45" r="3" fill="#e0e7ff" filter="url(#brain-glow)" />
    <circle cx="60" cy="45" r="3" fill="#e0e7ff" filter="url(#brain-glow)" />
    <circle cx="50" cy="50" r="3.5" fill="#fff" filter="url(#brain-glow)" />
    
    <circle cx="35" cy="55" r="2" fill="#c7d2fe" />
    <circle cx="65" cy="55" r="2" fill="#c7d2fe" />
    <circle cx="50" cy="60" r="2.5" fill="#e0e7ff" />
    
    <circle cx="45" cy="25" r="2" fill="#a5b4fc" />
    <circle cx="55" cy="25" r="2" fill="#a5b4fc" />
    <circle cx="50" cy="30" r="2" fill="#e0e7ff" />
    
    {/* Floating thought nodes */}
    <circle cx="25" cy="25" r="1.5" fill="#818cf8" opacity="0.6" />
    <circle cx="75" cy="20" r="2" fill="#818cf8" opacity="0.8" filter="url(#brain-glow)" />
    <circle cx="85" cy="40" r="1" fill="#6366f1" opacity="0.5" />
    <circle cx="15" cy="45" r="1.5" fill="#818cf8" opacity="0.4" />
  </svg>
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
          className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tighter font-headline leading-[1.04]"
        >
          The <ECommerceIcon /> e-commerce brain <BrainIcon />
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-500 via-primary to-indigo-600">
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
