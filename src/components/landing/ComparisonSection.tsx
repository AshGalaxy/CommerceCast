'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const rows = [
  {
    feature: 'Forecast Accuracy',
    us: '90–95% (ML Ensemble)',
    them: '55–70% (Moving avg.)',
    usGood: true,
  },
  {
    feature: 'Time to First Insight',
    us: 'Under 10 minutes',
    them: '3–6 months setup',
    usGood: true,
  },
  {
    feature: 'Real-time Data Sync',
    us: 'Millisecond latency',
    them: 'Daily batch jobs',
    usGood: true,
  },
  {
    feature: 'Promotion Simulation',
    us: 'Built-in A/B engine',
    them: 'Not available',
    usGood: true,
  },
  {
    feature: 'Pricing',
    us: 'Transparent & scalable',
    them: 'Opaque enterprise deals',
    usGood: true,
  },
];

export function ComparisonSection() {
  return (
    <section className="relative w-full py-28 bg-background overflow-hidden">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            The difference
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline mb-3">
            Why teams leave legacy tools
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Old analytics platforms were built for another era. CommerceCast is built for right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border/50 bg-muted/10 backdrop-blur-sm"
        >
          {/* Table header */}
          <div className="grid grid-cols-3 bg-muted/30 border-b border-border/40">
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Feature
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2 border-l border-border/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              CommerceCast
            </div>
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-l border-border/40">
              Legacy Tools
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="p-4 text-sm font-medium text-foreground/70 flex items-center">
                  {row.feature}
                </div>
                <div className="p-4 border-l border-border/30 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-foreground">{row.us}</span>
                </div>
                <div className="p-4 border-l border-border/30 flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  <span className="text-sm text-muted-foreground">{row.them}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
