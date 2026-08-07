'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { TrendingUp, Package, Zap, ArrowRight, Activity, Box, Percent } from 'lucide-react';

const features = [
  {
    title: "AI-Powered Forecasting",
    description: "Our ensemble models predict future demand with up to 95% accuracy by analyzing historical data, seasonality, and market trends.",
    icon: TrendingUp,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
    id: "forecasting"
  },
  {
    title: "Smart Inventory Optimization",
    description: "Never overstock or stock out again. CommerceCast dynamically sets safety thresholds and reorder points based on real-time velocity.",
    icon: Package,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500",
    id: "inventory"
  },
  {
    title: "Real-time Promotion Simulator",
    description: "Test your next big sale before it goes live. We simulate margin impact, conversion lift, and inventory drain instantly.",
    icon: Zap,
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-500",
    id: "promotion"
  }
];

// Highly detailed, non-generic UI mockups for each feature
const VisualForecasting = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-background to-muted/20 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        <span className="font-semibold text-sm">Demand Projection (Q4)</span>
      </div>
      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">95% Confidence</span>
    </div>
    
    <div className="flex-1 relative flex items-end justify-between gap-2 pb-4">
      {/* Animated Bar Chart */}
      {[40, 55, 45, 70, 60, 85, 100].map((height, i) => (
        <div key={i} className="w-full relative flex flex-col justify-end h-full group">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
            className={`w-full rounded-t-sm ${i >= 5 ? 'bg-blue-500' : 'bg-muted-foreground/20'}`}
          />
          {i >= 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + (i * 0.1) }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded"
            >
              Predicted
            </motion.div>
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

const VisualInventory = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-background to-muted/20 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Box className="w-5 h-5 text-emerald-500" />
        <span className="font-semibold text-sm">SKU Health & Safety Stock</span>
      </div>
    </div>

    <div className="space-y-4">
      {[
        { name: "Classic Tee - Black", stock: 1240, status: "Healthy", color: "bg-emerald-500" },
        { name: "Denim Jacket - M", stock: 12, status: "Reorder Alert", color: "bg-red-500" },
        { name: "Canvas Tote", stock: 450, status: "Healthy", color: "bg-emerald-500" },
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{item.stock} units</span>
            <span className={`text-[10px] px-2 py-1 rounded font-bold ${item.color === 'bg-red-500' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {item.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const VisualPromotion = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-background to-muted/20 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400" />
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Percent className="w-5 h-5 text-purple-500" />
        <span className="font-semibold text-sm">A/B Promo Simulator</span>
      </div>
    </div>

    <div className="flex gap-4 h-full">
      {/* Scenario A */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col"
      >
        <div className="text-xs text-muted-foreground mb-1">Scenario A</div>
        <div className="font-bold text-lg mb-4">20% Off Storewide</div>
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Vol. Lift</span>
            <span className="text-green-400 font-bold">+45%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Margin Impact</span>
            <span className="text-red-400 font-bold">-12%</span>
          </div>
        </div>
      </motion.div>

      {/* Scenario B */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      >
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">WINNER</div>
        <div className="text-xs text-purple-300 mb-1">Scenario B</div>
        <div className="font-bold text-lg mb-4 text-purple-50">BOGO 50% Off</div>
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Vol. Lift</span>
            <span className="text-green-400 font-bold">+65%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Margin Impact</span>
            <span className="text-green-400 font-bold">+2%</span>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

function FeatureBlock({ feature, isActive }: { feature: typeof features[0], isActive: boolean }) {
  return (
    <div className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'} flex flex-col justify-center h-screen max-h-[800px] max-w-lg mx-auto px-4`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10 bg-gradient-to-br ${feature.color} shadow-lg`}>
        <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold font-headline mb-4 tracking-tight">
        {feature.title}
      </h3>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export function StickyFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  // We use standard React intersection observers to detect which text block is active
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.feature-text-block');
      let current = 0;
      let minDistance = window.innerHeight;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // Distance from the center of the screen
        const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (distance < minDistance) {
          minDistance = distance;
          current = index;
        }
      });

      setActiveIndex(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visuals = [
    <VisualForecasting key="forecasting" />,
    <VisualInventory key="inventory" />,
    <VisualPromotion key="promotion" />
  ];

  return (
    <section className="relative w-full bg-background border-y border-white/5">
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row w-full">
          
          {/* Left Side: Scrolling Text */}
          <div className="w-full md:w-1/2 py-[20vh] md:py-[30vh]">
            {features.map((feature, index) => (
              <div key={feature.id} className="feature-text-block">
                <FeatureBlock feature={feature} isActive={activeIndex === index} />
              </div>
            ))}
          </div>

          {/* Right Side: Sticky Visual Asset */}
          <div className="hidden md:flex w-full md:w-1/2 sticky top-0 h-screen items-center justify-center p-8 lg:p-16">
            <div className="relative w-full max-w-lg aspect-square">
              <AnimatePresence mode="wait">
                {visuals[activeIndex]}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
