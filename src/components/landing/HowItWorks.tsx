'use client';

import { motion } from 'framer-motion';
import { Database, BrainCircuit, LineChart, ArrowRight } from 'lucide-react';

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
  return (
    <section className="relative w-full py-28 bg-muted/20 border-y border-border/40 overflow-hidden">
      {/* Subtle top gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">
            From data to decisions in minutes
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.6%+28px)] right-[calc(16.6%+28px)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-start md:items-center md:text-center group"
              >
                {/* Icon badge */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border/60 flex items-center justify-center shadow-sm group-hover:border-primary/40 group-hover:shadow-[0_0_24px_rgba(59,130,246,0.12)] transition-all duration-300">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-primary/60 bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-headline mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
