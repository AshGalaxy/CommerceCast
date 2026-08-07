'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { TrendingUp, Package, Zap, Activity, Box, Percent, MousePointer2 } from 'lucide-react';
import { useState } from 'react';

// ─── Feature data ─────────────────────────────────────────────────────────────

const features = [
  {
    id: 'forecasting',
    title: 'AI-Powered\nForecasting',
    description:
      'Ensemble models predict future demand with up to 95% accuracy — analysing historical data, seasonality, and live market signals in real time.',
    icon: TrendingUp,
    accentFrom: 'from-blue-500/20',
    accentTo: 'to-blue-600/5',
    iconColor: 'text-blue-500',
    topBar: 'from-blue-400 to-cyan-400',
    badge: '95% confidence',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  },
  {
    id: 'inventory',
    title: 'Smart Inventory\nOptimisation',
    description:
      'Never overstock or stock out again. CommerceCast dynamically sets safety thresholds and reorder points based on real-time velocity across all SKUs.',
    icon: Package,
    accentFrom: 'from-emerald-500/20',
    accentTo: 'to-emerald-600/5',
    iconColor: 'text-emerald-500',
    topBar: 'from-emerald-400 to-green-300',
    badge: 'Live sync',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'promotion',
    title: 'Real-time Promotion\nSimulator',
    description:
      'Test your next big sale before it goes live. Simulate margin impact, conversion lift, and inventory drain — all in seconds, before a single dollar is spent.',
    icon: Zap,
    accentFrom: 'from-purple-500/20',
    accentTo: 'to-purple-600/5',
    iconColor: 'text-purple-500',
    topBar: 'from-purple-500 to-pink-400',
    badge: '2 variants',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  },
];

// ─── Visuals ──────────────────────────────────────────────────────────────────

const VisualForecasting = () => {
  const pts = [28, 44, 36, 60, 52, 74, 88, 102, 94, 116, 130, 148];
  const W = 320, H = 160;
  const max = Math.max(...pts), min = Math.min(...pts);
  const sy = (v: number) => H - ((v - min) / (max - min)) * H * 0.82 - H * 0.06;
  const sx = (i: number) => (i / (pts.length - 1)) * W;
  const linePath = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(v)}`).join(' ');
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="w-full h-full flex flex-col p-5 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t-2xl" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-sm">Demand Projection — Q4</span>
        </div>
        <span className="text-xs bg-blue-500/15 text-blue-400 px-2.5 py-1 rounded-full font-medium border border-blue-500/20">
          95% confidence
        </span>
      </div>
      <div className="relative flex-1 mb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="fg-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fg-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <motion.path d={areaPath} fill="url(#fg-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} />
          <motion.path
            d={linePath} fill="none" stroke="url(#fg-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.0, ease: 'easeOut' }}
          />
          <motion.circle cx={sx(pts.length - 1)} cy={sy(pts[pts.length - 1])} r="5" fill="#22d3ee"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.0, type: 'spring' }} />
        </svg>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="absolute right-0 top-0 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
          Forecast ↑
        </motion.div>
        {/* Fake Live Cursor */}
        <motion.div
          initial={{ opacity: 0, x: sx(pts.length - 4), y: sy(pts[pts.length - 4]) + 20 }}
          animate={{ opacity: 1, x: sx(pts.length - 1) + 10, y: sy(pts[pts.length - 1]) + 10 }}
          transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' }}
          className="absolute z-10 drop-shadow-md text-emerald-400"
        >
          <MousePointer2 className="w-5 h-5 fill-emerald-500/20" />
          <div className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-sm">
            AI Auto-Adjust
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Avg Accuracy', value: '94.8%', color: 'text-blue-400' },
          { label: 'MAPE', value: '3.2%', color: 'text-foreground' },
          { label: 'SKUs Tracked', value: '2,840', color: 'text-blue-400' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-lg bg-muted/60 px-3 py-2">
            <div className="text-[10px] text-muted-foreground mb-0.5">{kpi.label}</div>
            <div className={`text-sm font-bold ${kpi.color}`}>{kpi.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VisualInventory = () => {
  const skus = [
    { name: 'Classic Tee — Black', stock: 1240, max: 2000, status: 'Healthy', barClass: 'from-emerald-400 to-green-300', dotClass: 'bg-emerald-400', textClass: 'text-emerald-400' },
    { name: 'Denim Jacket — M', stock: 12, max: 200, status: 'Reorder Alert', barClass: 'from-red-500 to-orange-400', dotClass: 'bg-red-400', textClass: 'text-red-400' },
    { name: 'Canvas Tote', stock: 450, max: 600, status: 'Healthy', barClass: 'from-emerald-400 to-green-300', dotClass: 'bg-emerald-400', textClass: 'text-emerald-400' },
    { name: 'Hoodie — Slate', stock: 88, max: 300, status: 'Low Stock', barClass: 'from-amber-400 to-yellow-300', dotClass: 'bg-amber-400', textClass: 'text-amber-400' },
  ];
  return (
    <div className="w-full h-full flex flex-col p-5 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-300 rounded-t-2xl" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-sm">SKU Health Dashboard</span>
        </div>
        <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">Live sync</span>
      </div>
      <div className="space-y-3 flex-1">
        {skus.map((sku, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.1 }}
            className="rounded-xl border border-border/50 bg-muted/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sku.dotClass} animate-pulse`} />
                <span className="text-xs font-medium">{sku.name}</span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border border-current/20 ${sku.textClass}`}>{sku.status}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${sku.barClass}`}
                initial={{ width: 0 }} animate={{ width: `${(sku.stock / sku.max) * 100}%` }}
                transition={{ delay: i * 0.1 + 0.25, duration: 0.65, ease: 'easeOut' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">{sku.stock.toLocaleString()} units</span>
              <span className="text-[9px] text-muted-foreground">/ {sku.max.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VisualPromotion = () => {
  const scenarios = [
    { label: 'Scenario A', title: '20% Off Storewide', volLift: 45, margin: -12, volBar: 'from-blue-400 to-blue-300', marginBar: 'from-red-400 to-red-300', isWinner: false },
    { label: 'Scenario B', title: 'BOGO 50% Off', volLift: 65, margin: 2, volBar: 'from-purple-400 to-pink-300', marginBar: 'from-emerald-400 to-green-300', isWinner: true },
  ];
  return (
    <div className="w-full h-full flex flex-col p-5 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-400 rounded-t-2xl" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-purple-500" />
          <span className="font-semibold text-sm">A/B Promo Simulator</span>
        </div>
        <span className="text-xs bg-purple-500/15 text-purple-400 px-2.5 py-1 rounded-full font-medium border border-purple-500/20">2 variants</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {scenarios.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 + 0.15 }}
            className={`flex-1 rounded-xl border p-3.5 relative overflow-hidden ${s.isWinner ? 'border-purple-500/40 bg-purple-500/5' : 'border-border/50 bg-muted/40'}`}>
            {s.isWinner && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[8px] font-bold px-2.5 py-1 rounded-bl-xl">WINNER</div>
            )}
            <div className="text-[10px] text-muted-foreground mb-0.5">{s.label}</div>
            <div className={`font-bold text-sm mb-3 ${s.isWinner ? 'text-purple-300' : ''}`}>{s.title}</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Volume Lift</span>
                  <span className="text-green-400 font-bold">+{s.volLift}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.volBar}`}
                    initial={{ width: 0 }} animate={{ width: `${s.volLift}%` }}
                    transition={{ delay: i * 0.15 + 0.4, duration: 0.6, ease: 'easeOut' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Margin Impact</span>
                  <span className={`font-bold ${s.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.margin >= 0 ? '+' : ''}{s.margin}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.marginBar}`}
                    initial={{ width: 0 }} animate={{ width: `${Math.abs(s.margin) * 4}%` }}
                    transition={{ delay: i * 0.15 + 0.6, duration: 0.6, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="mt-3 rounded-lg bg-muted/60 px-3.5 py-2.5 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">Net Revenue Delta (BOGO vs. Flat)</span>
        <span className="text-sm font-bold text-emerald-400">+$14,200 est.</span>
      </motion.div>
    </div>
  );
};

const VISUALS = [
  <VisualForecasting key="forecasting" />,
  <VisualInventory key="inventory" />,
  <VisualPromotion key="promotion" />,
];

// ─── Main section ─────────────────────────────────────────────────────────────
// Architecture: outer container is features.length × 100vh tall, giving the
// page scroll budget. Inside is a single sticky panel (100vh minus navbar)
// that never moves. useScroll maps that scroll budget to an activeIndex, which
// drives BOTH the left text swap and the right visual swap simultaneously.

export function StickyFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress → feature index (0, 1, 2)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(
      features.length - 1,
      Math.floor(v * features.length)
    );
    setActiveIndex(idx);
  });

  const feat = features[activeIndex];

  return (
    <section
      id="features"
      ref={containerRef}
      // Total scroll budget = one viewport per feature
      style={{ height: `${features.length * 100}vh` }}
      className="relative"
    >
      {/* ── Sticky container — the whole visible panel ── */}
      <div className="sticky top-14 h-screen overflow-hidden">

        {/* Section label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-primary' : 'w-3 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Two-column layout — both halves update in sync */}
        <div className="h-full flex flex-col md:flex-row">

          {/* LEFT — text panel */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-12 lg:px-20 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col max-w-lg"
              >
                {/* Step indicator */}
                <div className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest mb-5">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-7 border border-border/50 bg-gradient-to-br ${feat.accentFrom} ${feat.accentTo} shadow-lg`}>
                  <feat.icon className={`h-6 w-6 ${feat.iconColor}`} />
                </div>

                {/* Title — respects \n in data */}
                <h3 className="text-4xl md:text-5xl font-extrabold font-headline mb-5 tracking-tight leading-[1.08] whitespace-pre-line">
                  {feat.title}
                </h3>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — visual panel */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-10 lg:px-16 relative overflow-hidden">
            <div className="w-full max-w-[440px] aspect-square">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feat.id + '-visual'}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  {VISUALS[activeIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Bottom section scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground/30 tracking-wide font-medium"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          {activeIndex < features.length - 1 ? 'Scroll to explore' : 'Continue ↓'}
        </motion.div>
      </div>
    </section>
  );
}
