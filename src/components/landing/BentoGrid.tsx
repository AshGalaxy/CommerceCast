'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, Package, Zap, BarChart3, Globe, ShieldCheck,
  Smartphone, Webhook, RefreshCw
} from 'lucide-react';

const cards = [
  {
    id: 'dashboard',
    icon: BarChart3,
    title: 'Unified dashboard',
    desc: 'Every KPI your ops team needs — forecasts, inventory health, and promo performance — in one clean view.',
    size: 'large',
    gradient: 'from-blue-500/10 to-indigo-500/5',
    iconColor: 'text-blue-500',
    border: 'border-blue-500/15',
  },
  {
    id: 'alerts',
    icon: RefreshCw,
    title: 'Smart alerts',
    desc: 'Get notified before stockouts happen, not after.',
    size: 'small',
    gradient: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-500',
    border: 'border-amber-500/15',
  },
  {
    id: 'api',
    icon: Webhook,
    title: 'REST API & webhooks',
    desc: 'Plug CommerceCast into your stack via our OpenAPI-compliant REST API.',
    size: 'small',
    gradient: 'from-violet-500/10 to-purple-500/5',
    iconColor: 'text-violet-500',
    border: 'border-violet-500/15',
  },
  {
    id: 'multichannel',
    icon: Globe,
    title: 'Multi-channel aggregation',
    desc: 'Shopify, Amazon, WooCommerce, Flipkart — demand unified across every channel.',
    size: 'medium',
    gradient: 'from-emerald-500/10 to-green-500/5',
    iconColor: 'text-emerald-500',
    border: 'border-emerald-500/15',
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    title: 'SOC 2 Type II',
    desc: 'Enterprise-grade security out of the box. Your data is yours.',
    size: 'small',
    gradient: 'from-slate-500/10 to-slate-600/5',
    iconColor: 'text-slate-400',
    border: 'border-slate-500/15',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile-ready',
    desc: 'Full dashboard on any device — iOS & Android app coming Q3.',
    size: 'small',
    gradient: 'from-pink-500/10 to-rose-500/5',
    iconColor: 'text-pink-500',
    border: 'border-pink-500/15',
  },
] as const;

type CardSize = 'large' | 'medium' | 'small';

const sizeClasses: Record<CardSize, string> = {
  large: 'md:col-span-2 md:row-span-2',
  medium: 'md:col-span-2',
  small: 'md:col-span-1',
};

export function BentoGrid() {
  return (
    <section className="relative w-full py-24 bg-background overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-5">
            Everything included
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline leading-[1.06]">
            The full picture, in one place
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 auto-rows-[180px]">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} overflow-hidden cursor-default ${sizeClasses[card.size as CardSize]}`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-background/50 border border-border/40 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="text-base font-bold font-headline mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
