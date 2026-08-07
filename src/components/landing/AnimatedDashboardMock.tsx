'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, DollarSign, ShoppingCart, Activity, Users, MousePointer2 } from 'lucide-react';

const KPIS = [
  { id: 'revenue', title: "Total Revenue", value: "₹24,590,200", trend: "+14.2%", positive: true, icon: <DollarSign className="w-4 h-4 text-blue-500" /> },
  { id: 'sales', title: "Total Sales", value: "84,392", trend: "+8.1%", positive: true, icon: <ShoppingCart className="w-4 h-4 text-indigo-500" /> },
  { id: 'aov', title: "Avg. Sale Value", value: "₹2,910", trend: "-2.4%", positive: false, icon: <Activity className="w-4 h-4 text-amber-500" /> },
  { id: 'customers', title: "Active Customers", value: "12,403", trend: "+18.9%", positive: true, icon: <Users className="w-4 h-4 text-emerald-500" /> },
];

const CHART_PATHS = {
  revenue: {
    solid: "M0,100 C10,95 20,80 30,70 C40,60 50,70 60,40 C70,10 80,30 90,10 C95,0 100,0 100,0",
    fill: "M0,100 C10,95 20,80 30,70 C40,60 50,70 60,40 C70,10 80,30 90,10 C95,0 100,0 100,0 L100,120 L0,120 Z",
    dashed: "M100,0 C110,0 120,20 130,5"
  },
  sales: {
    solid: "M0,90 C15,85 25,60 40,70 C55,80 65,40 80,20 C85,15 95,5 100,10",
    fill: "M0,90 C15,85 25,60 40,70 C55,80 65,40 80,20 C85,15 95,5 100,10 L100,120 L0,120 Z",
    dashed: "M100,10 C110,15 120,5 130,15"
  },
  aov: {
    solid: "M0,50 C20,60 30,40 50,45 C70,50 80,30 100,35",
    fill: "M0,50 C20,60 30,40 50,45 C70,50 80,30 100,35 L100,120 L0,120 Z",
    dashed: "M100,35 C110,38 120,25 130,30"
  },
  customers: {
    solid: "M0,80 C10,75 25,70 35,50 C45,30 60,20 75,10 C85,5 95,15 100,0",
    fill: "M0,80 C10,75 25,70 35,50 C45,30 60,20 75,10 C85,5 95,15 100,0 L100,120 L0,120 Z",
    dashed: "M100,0 C110,-10 120,5 130,-5"
  }
};

const CATEGORIES = {
  revenue: [
    { name: "Electronics", pct: "85%" },
    { name: "Apparel", pct: "65%" },
    { name: "Home & Garden", pct: "40%" },
  ],
  sales: [
    { name: "Apparel", pct: "75%" },
    { name: "Electronics", pct: "60%" },
    { name: "Beauty", pct: "45%" },
  ],
  aov: [
    { name: "Jewelry", pct: "90%" },
    { name: "Electronics", pct: "80%" },
    { name: "Furniture", pct: "60%" },
  ],
  customers: [
    { name: "New", pct: "55%" },
    { name: "Returning", pct: "45%" },
    { name: "VIP", pct: "15%" },
  ]
};

// Cursor keyframes to move across the KPIs
const cursorVariants = {
  initial: { x: 50, y: 300, opacity: 0 },
  animate: {
    x: [50, 150, 450, 750, 200, 50],
    y: [300, 180, 180, 180, 120, 300],
    opacity: [0, 1, 1, 1, 1, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      times: [0, 0.15, 0.45, 0.75, 0.9, 1]
    }
  }
};

export function AnimatedDashboardMock() {
  const [activeKpi, setActiveKpi] = useState('revenue');

  // Sync cursor movement with active KPI highlight
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      if (step === 0) setActiveKpi('revenue');
      else if (step === 1) setActiveKpi('sales');
      else if (step === 2) setActiveKpi('aov');
      else if (step === 3) setActiveKpi('customers');
    }, 3750); // 15s total / 4 states roughly aligns with cursor movement

    return () => clearInterval(interval);
  }, []);

  const activePaths = CHART_PATHS[activeKpi as keyof typeof CHART_PATHS];
  const activeCategories = CATEGORIES[activeKpi as keyof typeof CATEGORIES];

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative">
      
      {/* Animated Cursor */}
      <motion.div
        variants={cursorVariants}
        initial="initial"
        animate="animate"
        className="absolute z-50 pointer-events-none flex flex-col items-center drop-shadow-md"
      >
        <MousePointer2 className="w-5 h-5 text-black dark:text-white fill-white dark:fill-black -rotate-12" strokeWidth={1.5} />
        <div className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm ml-4 mt-1 border border-indigo-400">
          Alex (AI)
        </div>
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-end pl-1 md:pl-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight text-foreground">Overview</h2>
          <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Synced with Shopify Live Data
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors cursor-pointer">
            Last 30 Days
          </div>
          <div className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => {
          const isActive = activeKpi === kpi.id;
          return (
            <motion.div 
              key={kpi.id} 
              animate={{
                scale: isActive ? 1.02 : 1,
                borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)'
              }}
              className={`rounded-xl border bg-background/80 p-4 flex flex-col gap-3 shadow-sm transition-colors duration-500 ${isActive ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`}>
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-muted/50'}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">{kpi.value}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${kpi.positive ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50'}`}>
                  {kpi.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="flex gap-4 flex-1">
        {/* Main Line Chart */}
        <div className="flex-[2] rounded-xl border border-border/50 bg-background/80 p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground capitalize">{activeKpi} Forecast</span>
              <span className="text-xs text-muted-foreground mt-0.5">Real-time predictive modeling</span>
            </div>
            <span className="text-xs font-medium text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 shadow-sm backdrop-blur-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse" />
              AI Predicted
            </span>
          </div>
          
          <div className="flex-1 relative w-full mt-4 z-10">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full border-b border-foreground/50 border-dashed" />
              ))}
            </div>

            <svg className="absolute inset-0 w-full h-full text-indigo-500 overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={false}
                animate={{ d: activePaths.solid }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" 
              />
              <motion.path 
                initial={false}
                animate={{ d: activePaths.fill }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                fill="url(#chart-grad2)" 
              />
              {/* Dotted prediction line */}
              <motion.path 
                initial={false}
                animate={{ d: activePaths.dashed }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>
        
        {/* Secondary Sidebar Chart */}
        <div className="flex-[1] hidden md:flex rounded-xl border border-border/50 bg-background/80 p-5 shadow-sm flex-col gap-4">
          <span className="text-sm font-semibold text-foreground">Top Drivers</span>
          <div className="flex flex-col gap-4 mt-2">
            <AnimatePresence mode="popLayout">
              {activeCategories.map((item, i) => (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground">{item.pct}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: item.pct }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
