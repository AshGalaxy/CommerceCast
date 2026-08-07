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
  return (
    <div className="w-full h-full flex flex-col bg-card border border-border/60 shadow-xl overflow-hidden relative">
      {/* Top Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-xs">Demand Projection</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded">Q4 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 p-4 relative flex flex-col">
        {/* Grid lines */}
        <div className="absolute inset-0 p-4 pb-8 flex flex-col justify-between pointer-events-none opacity-20">
          {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-dashed border-border" />)}
        </div>
        
        {/* Crisp Line Chart */}
        <div className="flex-1 relative mt-2">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Historical Data (Solid) */}
            <path d="M 0 35 L 20 25 L 40 28 L 60 15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="text-muted-foreground" />
            {/* Forecast Data (Blue, Dashed/Solid) */}
            <path d="M 60 15 L 80 8 L 100 2" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="2 2" />
            
            {/* Data Points */}
            <circle cx="20" cy="25" r="1.5" fill="currentColor" className="text-muted-foreground" />
            <circle cx="40" cy="28" r="1.5" fill="currentColor" className="text-muted-foreground" />
            <circle cx="60" cy="15" r="2" fill="currentColor" />
            <circle cx="80" cy="8" r="1.5" fill="#3b82f6" />
            <circle cx="100" cy="2" r="2" fill="#3b82f6" />
            
            {/* Confidence Interval Polygon */}
            <polygon points="60,15 80,4 100,-2 100,6 80,12 60,15" fill="#3b82f6" opacity="0.1" />
          </svg>
        </div>

        {/* Axis Labels */}
        <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-2">
          <span>OCT</span><span>NOV</span><span>DEC</span>
        </div>
      </div>

      {/* Dense Metrics Footer */}
      <div className="grid grid-cols-3 border-t border-border/50 divide-x divide-border/50 bg-muted/10">
        {[
          { label: 'ACCURACY', val: '95.2%', delta: '+1.2%' },
          { label: 'MAPE', val: '4.1%', delta: '-0.3%' },
          { label: 'VARIANCE', val: '±2.4k', delta: '' },
        ].map(m => (
          <div key={m.label} className="p-3 flex flex-col gap-1">
            <span className="text-[9px] font-medium text-muted-foreground">{m.label}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xs font-semibold">{m.val}</span>
              {m.delta && <span className={`text-[8px] font-semibold ${m.delta.startsWith('+') ? 'text-emerald-500' : 'text-emerald-500'}`}>{m.delta}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VisualInventory = () => {
  const skus = [
    { id: 'SKU-892', name: 'Classic Tee — Blk', stock: 1240, max: 2000, status: 'Healthy', color: 'bg-emerald-500' },
    { id: 'SKU-114', name: 'Denim Jacket — M', stock: 12, max: 200, status: 'Reorder', color: 'bg-red-500' },
    { id: 'SKU-441', name: 'Canvas Tote', stock: 450, max: 600, status: 'Healthy', color: 'bg-emerald-500' },
    { id: 'SKU-099', name: 'Hoodie — Slate', stock: 88, max: 300, status: 'Low', color: 'bg-amber-500' },
  ];
  return (
    <div className="w-full h-full flex flex-col bg-card border border-border/60 shadow-xl overflow-hidden relative">
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Box className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-xs">Inventory Optimization</span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
        </span>
      </div>
      
      <div className="flex-1 p-0 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/30 text-[9px] font-semibold text-muted-foreground bg-muted/5">
          <div className="col-span-3">SKU ID</div>
          <div className="col-span-5">PRODUCT</div>
          <div className="col-span-4 text-right">STOCK</div>
        </div>
        {/* Table Rows */}
        <div className="flex-1 flex flex-col divide-y divide-border/30">
          {skus.map(sku => (
            <div key={sku.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/10 transition-colors">
              <div className="col-span-3 font-mono text-[9px] text-muted-foreground">{sku.id}</div>
              <div className="col-span-5 text-[11px] font-medium truncate pr-2">{sku.name}</div>
              <div className="col-span-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline text-[9px]">
                  <span className={sku.status === 'Reorder' ? 'text-red-500 font-bold' : ''}>{sku.stock.toLocaleString()}</span>
                  <span className="text-muted-foreground font-mono">/ {sku.max}</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${sku.color}`} style={{ width: `${(sku.stock/sku.max)*100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VisualPromotion = () => {
  return (
    <div className="w-full h-full flex flex-col bg-card border border-border/60 shadow-xl overflow-hidden relative">
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Percent className="w-3.5 h-3.5 text-purple-500" />
          <span className="font-semibold text-xs">A/B Scenario Simulator</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded">2 VARIANTS</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Scenario A */}
        <div className="border border-border/50 rounded-md p-3 relative bg-muted/5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-mono text-[9px] text-muted-foreground mb-1">SCENARIO A</div>
              <div className="text-xs font-semibold">20% Off Storewide</div>
            </div>
            <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">-12% Margin</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="w-full bg-muted h-1.5 rounded-sm overflow-hidden flex">
              <div className="h-full bg-blue-500" style={{ width: '45%' }} />
            </div>
            <span className="font-mono text-[10px] font-medium whitespace-nowrap">+45% Vol</span>
          </div>
        </div>

        {/* Scenario B (Winner) */}
        <div className="border border-purple-500/30 rounded-md p-3 relative bg-purple-500/5 shadow-inner">
          <div className="absolute -top-2.5 right-3 bg-purple-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-sm">
            RECOMMENDED
          </div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-mono text-[9px] text-purple-500/70 mb-1">SCENARIO B</div>
              <div className="text-xs font-semibold">BOGO 50% Off</div>
            </div>
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+2% Margin</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="w-full bg-muted h-1.5 rounded-sm overflow-hidden flex">
              <div className="h-full bg-purple-500" style={{ width: '65%' }} />
            </div>
            <span className="font-mono text-[10px] whitespace-nowrap text-purple-600 dark:text-purple-400 font-bold">+65% Vol</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Impact */}
      <div className="bg-emerald-500/10 border-t border-emerald-500/20 p-3 flex justify-between items-center">
        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Net Revenue Delta (Est.)</span>
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">+$14,200</span>
      </div>
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
