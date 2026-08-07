'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, BarChart2, Package, TrendingUp, Filter, DollarSign, ShoppingCart, Activity, Users } from 'lucide-react';
import { PiShoppingBagDuotone, PiBrainDuotone } from 'react-icons/pi';
import { AnimatedDashboardMock } from './AnimatedDashboardMock';
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
    className="inline-block w-[1.15em] h-[1.15em] -mt-[0.1em] mx-[0.1em] text-indigo-500 drop-shadow-md animate-float" 
    style={{ animationDuration: '6s', animationDelay: '1s' }}
  />
);



import { useRef } from 'react';

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  
  // Dashboard expansions
  const mockWidth = useTransform(scrollYProgress, [0, 0.2], ["1024px", "100vw"]);
  const mockHeight = useTransform(scrollYProgress, [0, 0.2], ["550px", "100vh"]);
  const mockBorderRadiusTop = useTransform(scrollYProgress, [0, 0.2], ["20px", "0px"]);
  const mockBorderRadiusBottom = useTransform(scrollYProgress, [0.8, 1], ["0px", "20px"]); // Maybe for exit? Let's just keep it 0px
  const mockY = useTransform(scrollYProgress, [0, 0.2], [0, -180]);
  const mockMaskOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-background">
      
      <div className="sticky top-0 h-screen w-full flex flex-col items-center pt-28 overflow-hidden">
        
        {/* Background layers */}
        <div className="absolute inset-0 bg-background -z-10" />
        
        {/* Aurora Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen opacity-50 dark:opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen opacity-50 dark:opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen opacity-30 dark:opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        {/* Subtle dot-grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none -z-10"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main content - Fades out on scroll */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="container relative z-10 flex flex-col items-center text-center gap-8 px-4"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 dark:border-blue-400/20 bg-blue-500/5 dark:bg-blue-500/10 px-4 py-1.5 text-[13px] font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-xl shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8),_0_4px_20px_rgba(59,130,246,0.15)] dark:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.1),_0_4px_20px_rgba(59,130,246,0.25)] ring-1 ring-black/5 dark:ring-white/5 cursor-default transition-all duration-300"
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
        </motion.div>

        {/* Expanding Dashboard Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: mockWidth, height: mockHeight, y: mockY }}
          className="mt-16 relative z-20 flex flex-col"
        >
          {/* Edge glow */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[24px] blur-xl opacity-25 dark:opacity-40 pointer-events-none" />
          
          <motion.div 
            style={{ 
              borderTopLeftRadius: mockBorderRadiusTop,
              borderTopRightRadius: mockBorderRadiusTop,
              borderBottomLeftRadius: mockBorderRadiusTop,
              borderBottomRightRadius: mockBorderRadiusTop,
            }}
            className="relative w-full h-full border border-border/60 bg-background/60 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* We apply a mask that fades out based on scroll so it loses the bottom fade when full screen */}
            <motion.div 
              className="absolute inset-0 z-50 pointer-events-none bg-background" 
              style={{ 
                opacity: mockMaskOpacity,
                maskImage: 'linear-gradient(to top, black 0%, transparent 40%)', 
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 40%)' 
              }} 
            />

            {/* Top Bar */}
            <div className="w-full h-12 border-b border-border/40 flex items-center px-4 gap-2 bg-muted/30 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
              <div className="flex-1 flex justify-center">
                <div className="h-6 w-64 rounded-md bg-muted/50 border border-border/40 text-[11px] flex items-center justify-center text-muted-foreground font-medium tracking-wide">
                  app.commercecast.ai/dashboard
                </div>
              </div>
              <div className="w-16" />
            </div>

            <AnimatedDashboardMock scrollProgress={scrollYProgress} />
          </motion.div>
        </motion.div>

        {/* Bouncing scroll indicator */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
