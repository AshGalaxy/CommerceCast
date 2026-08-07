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
  const pts = [28, 44, 36, 60, 52, 74, 88, 102, 94, 116, 130, 148, 140, 160, 175];
  const W = 480, H = 220;
  const max = Math.max(...pts), min = Math.min(...pts);
  const sy = (v: number) => H - ((v - min) / (max - min)) * H * 0.75 - H * 0.1;
  const sx = (i: number) => (i / (pts.length - 1)) * W;
  const linePath = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(v)}`).join(' ');
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 bg-card border border-border/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-t-2xl" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-sm sm:text-base">Demand Projection — Q4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-mono bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-md font-semibold border border-blue-500/20">
            95% Confidence Interval
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        </div>
      </div>
      <div className="relative flex-1 mb-6 border border-border/40 rounded-xl bg-muted/10 p-2 sm:p-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="fg-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fg-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <motion.path d={areaPath} fill="url(#fg-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} />
          <motion.path
            d={linePath} fill="none" stroke="url(#fg-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <motion.circle cx={sx(pts.length - 1)} cy={sy(pts[pts.length - 1])} r="6" fill="#22d3ee" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring' }} />
        </svg>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="absolute right-4 top-4 text-[10px] sm:text-xs font-bold text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 px-2 sm:px-3 py-1 rounded-md backdrop-blur-sm">
          +42% Surge Expected ↑
        </motion.div>
        {/* Fake Live Cursor */}
        <motion.div
          initial={{ opacity: 0, x: sx(pts.length - 5), y: sy(pts[pts.length - 5]) + 30 }}
          animate={{ opacity: 1, x: sx(pts.length - 1) + 15, y: sy(pts[pts.length - 1]) + 15 }}
          transition={{ delay: 1.6, duration: 1.4, ease: 'easeOut' }}
          className="absolute z-10 drop-shadow-lg text-emerald-400"
        >
          <MousePointer2 className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-500/20" />
          <div className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md mt-1 shadow-md">
            AI Auto-Adjusted
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Avg Accuracy', value: '95.2%', delta: '+1.4%', color: 'text-blue-500' },
          { label: 'MAPE', value: '3.1%', delta: '-0.4%', color: 'text-foreground' },
          { label: 'SKUs Tracked', value: '3,140', delta: '+120', color: 'text-blue-500' },
          { label: 'Lost Sales Prevented', value: '$42.5k', delta: '+12%', color: 'text-emerald-500' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-xl border border-border/50 bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors">
            <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-1.5">
              <div className={`text-sm sm:text-base font-extrabold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-emerald-500">{kpi.delta}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VisualInventory = () => {
  const skus = [
    { name: 'Classic Tee — Black', stock: 1240, max: 2000, status: 'Healthy', dos: '45 Days', barClass: 'from-emerald-500 to-green-400', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Denim Jacket — M', stock: 12, max: 200, status: 'Reorder Alert', dos: '1.5 Days', barClass: 'from-red-500 to-orange-500', dotClass: 'bg-red-500', textClass: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { name: 'Canvas Tote', stock: 450, max: 600, status: 'Healthy', dos: '32 Days', barClass: 'from-emerald-500 to-green-400', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Hoodie — Slate', stock: 88, max: 300, status: 'Low Stock', dos: '8 Days', barClass: 'from-amber-500 to-yellow-400', dotClass: 'bg-amber-500', textClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'Beanie — Navy', stock: 950, max: 1000, status: 'Overstock', dos: '120+ Days', barClass: 'from-blue-500 to-cyan-400', dotClass: 'bg-blue-500', textClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  ];
  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 bg-card border border-border/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 rounded-t-2xl" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-sm sm:text-base">SKU Health Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-md font-semibold border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE SYNC
          </span>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <div className="col-span-5 sm:col-span-4">Product</div>
        <div className="col-span-3 hidden sm:block">Status</div>
        <div className="col-span-3">Stock / DOS</div>
        <div className="col-span-4 sm:col-span-2 text-right">Fill %</div>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        {skus.map((sku, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.1, type: 'spring' }}
            className="grid grid-cols-12 gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors items-center">
            
            {/* Product Name */}
            <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${sku.dotClass} shadow-sm shrink-0`} />
              <span className="text-xs sm:text-sm font-semibold truncate">{sku.name}</span>
            </div>
            
            {/* Status Badge */}
            <div className="col-span-3 hidden sm:flex items-center">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sku.textClass}`}>{sku.status}</span>
            </div>

            {/* Stock / DOS */}
            <div className="col-span-3 flex flex-col justify-center">
              <span className="text-xs sm:text-sm font-bold">{sku.stock.toLocaleString()} <span className="text-[10px] text-muted-foreground font-medium">/ {sku.max}</span></span>
              <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">{sku.dos}</span>
            </div>

            {/* Progress Bar */}
            <div className="col-span-4 sm:col-span-2 flex flex-col justify-center gap-1.5">
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold">
                <span className={sku.status === 'Reorder Alert' ? 'text-red-500' : 'text-muted-foreground'}>{Math.round((sku.stock / sku.max) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <motion.div className={`h-full rounded-full bg-gradient-to-r ${sku.barClass}`}
                  initial={{ width: 0 }} animate={{ width: `${(sku.stock / sku.max) * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VisualPromotion = () => {
  const scenarios = [
    { label: 'Scenario A (Control)', title: '20% Off Storewide', volLift: 45, convLift: 12, margin: -12, cac: 18, volBar: 'from-blue-500 to-blue-400', marginBar: 'from-red-500 to-red-400', isWinner: false },
    { label: 'Scenario B (Variant)', title: 'BOGO 50% Off (Select SKUs)', volLift: 68, convLift: 24, margin: 4, cac: 12, volBar: 'from-purple-500 to-pink-500', marginBar: 'from-emerald-500 to-green-400', isWinner: true },
  ];
  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 bg-card border border-border/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-t-2xl" />
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-purple-500" />
          <span className="font-bold text-sm sm:text-base">A/B Promo Simulator</span>
        </div>
        <span className="text-[10px] sm:text-xs bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-md font-bold border border-purple-500/20">2 Variants Tested</span>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {scenarios.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.15 + 0.15, type: 'spring' }}
            className={`flex-1 rounded-xl border p-4 sm:p-5 relative flex flex-col justify-center transition-all ${s.isWinner ? 'border-purple-500/50 bg-purple-500/5 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]' : 'border-border/50 bg-muted/20'}`}>
            
            {s.isWinner && (
              <div className="absolute top-0 right-4 bg-gradient-to-b from-purple-500 to-pink-500 text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-b-md shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3 fill-white" /> AI RECOMMENDED
              </div>
            )}
            
            <div className="text-[10px] sm:text-xs font-mono font-semibold text-muted-foreground mb-1">{s.label}</div>
            <div className={`font-extrabold text-base sm:text-lg mb-4 ${s.isWinner ? 'text-purple-600 dark:text-purple-400' : ''}`}>{s.title}</div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Volume & Conversion Column */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold mb-1.5">
                    <span className="text-muted-foreground">Volume Lift</span>
                    <span className="text-emerald-500">+{s.volLift}%</span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 rounded-full bg-border overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.volBar}`}
                      initial={{ width: 0 }} animate={{ width: `${s.volLift}%` }}
                      transition={{ delay: i * 0.15 + 0.4, duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Conv. Rate</span>
                  <span className="text-xs sm:text-sm font-bold">+{s.convLift}%</span>
                </div>
              </div>
              
              {/* Margin & CAC Column */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold mb-1.5">
                    <span className="text-muted-foreground">Margin Impact</span>
                    <span className={s.margin >= 0 ? 'text-emerald-500' : 'text-red-500'}>{s.margin >= 0 ? '+' : ''}{s.margin}%</span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 rounded-full bg-border overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.marginBar}`}
                      initial={{ width: 0 }} animate={{ width: `${Math.abs(s.margin) * 4}%` }}
                      transition={{ delay: i * 0.15 + 0.6, duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Est. CAC</span>
                  <span className="text-xs sm:text-sm font-bold">${s.cac}.00</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
        className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">Net Revenue Delta (Est. 30 Days)</span>
        <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">+$24,850</span>
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

export function StickyFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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
      style={{ height: `${features.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-14 h-screen overflow-hidden flex flex-col">
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

        {/* 
          Responsive layout:
          Mobile: Stacked. Text takes top 40%, Visual takes bottom 60%.
          Desktop: Side-by-side. Text takes 40%, Visual takes 60%.
        */}
        <div className="h-full flex flex-col lg:flex-row pt-12 lg:pt-0 pb-16 lg:pb-0">
          
          {/* LEFT — Text panel */}
          <div className="w-full lg:w-[45%] flex items-center justify-center px-6 md:px-12 lg:px-20 relative overflow-visible flex-shrink-0 mb-4 lg:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col max-w-lg w-full"
              >
                <div className="text-[10px] sm:text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4 sm:mb-6">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                </div>
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-border/50 bg-gradient-to-br ${feat.accentFrom} ${feat.accentTo} shadow-xl`}>
                  <feat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${feat.iconColor}`} />
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline mb-4 sm:mb-6 tracking-tight leading-[1.1] whitespace-pre-line">
                  {feat.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Visual panel */}
          <div className="w-full lg:w-[55%] flex items-center justify-center px-4 sm:px-10 lg:px-12 xl:px-16 relative overflow-hidden flex-1 pb-10 lg:pb-0">
            {/* The wrapper dictates the responsive size of the cards. We want them HUGE on desktop. */}
            <div className="w-full h-full max-h-[450px] lg:max-h-[600px] max-w-[500px] lg:max-w-[720px] mx-auto flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feat.id + '-visual'}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/11]"
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
