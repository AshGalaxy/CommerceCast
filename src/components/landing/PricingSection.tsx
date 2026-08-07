'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Starter',
    tagline: 'For growing brands getting started with data.',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Up to 1,000 SKUs',
      'Daily demand forecasts',
      'Basic reporting & exports',
      'Shopify + Amazon integrations',
      'Email support',
    ],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Pro',
    tagline: 'For scaling brands that need every edge.',
    monthlyPrice: 299,
    annualPrice: 239,
    features: [
      'Up to 10,000 SKUs',
      'Hourly real-time sync',
      'Promotion Simulator (A/B)',
      'ABC inventory analysis',
      'Priority support + Slack',
      'Custom integrations via API',
    ],
    cta: 'Start Pro trial',
    popular: true,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="relative w-full py-24 bg-background overflow-hidden">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline mb-3">
            Simple, honest pricing
          </h2>
          <p className="text-muted-foreground text-base">
            No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <span className={cn('text-sm font-medium transition-colors', !isAnnual ? 'text-foreground' : 'text-muted-foreground')}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing period"
            className="relative w-12 h-6 bg-muted rounded-full flex items-center px-1 transition-colors hover:bg-muted-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <motion.div
              className="w-4 h-4 bg-primary rounded-full shadow-sm"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 35 }}
            />
          </button>
          <span className={cn('text-sm font-medium transition-colors flex items-center gap-2', isAnnual ? 'text-foreground' : 'text-muted-foreground')}>
            Annually
            {isAnnual && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative flex flex-col p-7 rounded-2xl border transition-all duration-300',
                tier.popular
                  ? 'border-primary/40 bg-primary/[0.04] shadow-[0_0_40px_rgba(59,130,246,0.08)]'
                  : 'border-border/50 bg-muted/10 hover:border-border'
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    <Zap className="w-3 h-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold font-headline">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tier.tagline}</p>
              </div>

              <div className="mb-7 flex items-end gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-extrabold tracking-tight"
                  >
                    ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-muted-foreground text-sm mb-1.5">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', tier.popular ? 'bg-primary/15' : 'bg-muted')}>
                      <Check className={cn('w-2.5 h-2.5', tier.popular ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="default"
                variant={tier.popular ? 'default' : 'outline'}
                className="w-full h-10 text-sm font-semibold"
              >
                <Link href="/signup">{tier.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Need more than 10,000 SKUs?{' '}
          <Link href="/login" className="text-primary hover:underline underline-offset-2">
            Talk to us about an Enterprise plan →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
