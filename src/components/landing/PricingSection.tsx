'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const freeFeatures = [
  'Unlimited SKUs (beta)',
  'Daily demand forecasts',
  'Real-time inventory health',
  'Shopify, Amazon, WooCommerce',
  'Basic analytics & exports',
  'Email support',
];

const proFeatures = [
  'Everything in Free',
  'Hourly real-time sync',
  'Promotion Simulator (A/B)',
  'Advanced AI demand signals',
  'ABC inventory analysis',
  'Priority Slack support',
  'Custom integrations via API',
  'Multi-store management',
];

export function PricingSection() {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="pricing" className="relative w-full py-24 bg-background overflow-hidden">
      {/* Subtle radial glow behind cards */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,hsl(var(--primary)/0.04),transparent)] pointer-events-none" />

      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-5">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline mb-4 leading-[1.06]">
            Start free. Scale when ready.
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            CommerceCast is completely free during our beta. Pro is in development — join the waitlist.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">

          {/* Free card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-7 rounded-2xl border border-border/50 bg-muted/10 hover:border-border transition-all duration-300"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold font-headline">Free</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Everything you need, no card required.</p>
            </div>

            <div className="mb-7">
              <span className="text-5xl font-extrabold tracking-tight">₹0</span>
              <span className="text-muted-foreground text-sm ml-2">/ month, always</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="default" variant="outline" className="w-full font-semibold">
              <Link href="/signup">Get started free →</Link>
            </Button>
          </motion.div>

          {/* Pro card — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col p-7 rounded-2xl border border-primary/30 bg-primary/[0.03] shadow-[0_0_48px_rgba(59,130,246,0.07)] overflow-hidden"
          >
            {/* Coming soon ribbon */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                <Lock className="w-2.5 h-2.5" />
                In development
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold font-headline">Pro</h3>
              </div>
              <p className="text-sm text-muted-foreground">For brands that need every edge.</p>
            </div>

            <div className="mb-7">
              <span className="text-3xl font-extrabold tracking-tight text-foreground/40">Coming soon</span>
            </div>

            {/* Locked feature list */}
            <ul className="space-y-3 mb-8 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {f === 'Everything in Free'
                      ? <Check className="w-2.5 h-2.5 text-primary" />
                      : <Lock className="w-2 h-2 text-primary/50" />
                    }
                  </div>
                  <span className={cn('text-foreground/80', f !== 'Everything in Free' && 'text-muted-foreground/60')}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* Notify me form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2 text-sm text-emerald-400 font-medium"
              >
                <Bell className="w-3.5 h-3.5" />
                You&apos;re on the waitlist!
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-border/50 bg-muted/40 px-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <Button
                  onClick={() => { if (notifyEmail) setSubmitted(true); }}
                  size="default"
                  className="font-semibold shrink-0"
                >
                  Notify me
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/50 mt-8"
        >
          No credit card required. Cancel anytime.{' '}
          <Link href="/login" className="text-primary/70 hover:text-primary transition-colors underline underline-offset-2">
            Enterprise enquiries →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
