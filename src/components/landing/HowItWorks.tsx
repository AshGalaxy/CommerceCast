'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Database, BrainCircuit, LineChart } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Database,
    title: 'Connect your store',
    description:
      'One-click integrations with Shopify, Amazon, WooCommerce, and more. Your data is synced in seconds — no engineering tickets, no waiting.',
  },
  {
    step: '02',
    icon: BrainCircuit,
    title: 'Models learn your business',
    description:
      'Our ensemble engine ingests your full sales history and identifies seasonality, promotions, and anomalies automatically.',
  },
  {
    step: '03',
    icon: LineChart,
    title: 'Act on live intelligence',
    description:
      'Get daily demand forecasts, smart reorder alerts, and margin-safe promotion plans delivered straight to your dashboard.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-background overflow-hidden border-y border-border/30">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-4">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter font-headline">
            From data to decisions in minutes
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto" ref={containerRef}>
          {/* Animated SVG Connector line (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-12 -z-10 pointer-events-none">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <motion.path
                d="M 0 12 C 30 12, 70 12, 100 12"
                fill="none"
                stroke="url(#gradientLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                style={{ pathLength, opacity }}
              />
              <defs>
                <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-16 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon badge */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center shadow-lg group-hover:border-primary/40 group-hover:shadow-[0_0_32px_rgba(59,130,246,0.15)] group-hover:-translate-y-1 transition-all duration-300">
                    <step.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 text-[10px] font-bold text-white bg-primary rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-headline mb-3 tracking-tight">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
