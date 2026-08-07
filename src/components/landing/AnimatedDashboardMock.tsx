'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, DollarSign, ShoppingCart, Activity, Users, MousePointer2, TrendingUp } from 'lucide-react';

const KPIS = [
  { id: 'revenue', title: "Total Revenue", value: "₹24,590,200", trend: "+14.2%", positive: true, icon: <DollarSign className="w-4 h-4 text-blue-500" /> },
  { id: 'sales', title: "Total Sales", value: "84,392", trend: "+8.1%", positive: true, icon: <ShoppingCart className="w-4 h-4 text-indigo-500" /> },
  { id: 'aov', title: "Avg. Sale Value", value: "₹2,910", trend: "-2.4%", positive: false, icon: <Activity className="w-4 h-4 text-amber-500" /> },
  { id: 'customers', title: "Active Customers", value: "12,403", trend: "+18.9%", positive: true, icon: <Users className="w-4 h-4 text-emerald-500" /> },
];

// Wide paths covering viewBox 0 0 400 100
const CHART_PATHS = {
  revenue: {
    solid: "M0,90 C40,85 80,60 120,70 C160,80 200,40 240,45 C280,50 320,15 360,25 C380,30 390,10 400,0",
    fill: "M0,90 C40,85 80,60 120,70 C160,80 200,40 240,45 C280,50 320,15 360,25 C380,30 390,10 400,0 L400,120 L0,120 Z",
    dashed: "M400,0 C420,-10 440,15 460,5"
  },
  sales: {
    solid: "M0,80 C50,75 100,50 150,65 C200,80 250,30 300,40 C350,50 380,20 400,10",
    fill: "M0,80 C50,75 100,50 150,65 C200,80 250,30 300,40 C350,50 380,20 400,10 L400,120 L0,120 Z",
    dashed: "M400,10 C420,5 440,25 460,15"
  },
  aov: {
    solid: "M0,50 C60,60 120,30 180,45 C240,60 300,20 360,35 C380,40 390,25 400,20",
    fill: "M0,50 C60,60 120,30 180,45 C240,60 300,20 360,35 C380,40 390,25 400,20 L400,120 L0,120 Z",
    dashed: "M400,20 C420,15 440,30 460,25"
  },
  customers: {
    solid: "M0,70 C40,60 80,80 120,50 C160,20 200,30 240,15 C280,0 320,25 360,10 C380,5 390,-5 400,0",
    fill: "M0,70 C40,60 80,80 120,50 C160,20 200,30 240,15 C280,0 320,25 360,10 C380,5 390,-5 400,0 L400,120 L0,120 Z",
    dashed: "M400,0 C420,5 440,-10 460,0"
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

// Advanced Cursor Animation Sequence
// X and Y coords mapped to relative container positions (assuming approx 1000x500 container)
const cursorSequence = {
  x: [
    100, // start
    850, // move to Filters button
    850, // click wait
    350, // move to Sales KPI
    350, // click wait
    600, // move to Chart line hover
    650, // slide across chart
    100, // move to Revenue KPI
    100, // click wait
  ],
  y: [
    400, // start
    30,  // Filters button
    30,  // click wait
    150, // Sales KPI
    150, // click wait
    300, // Chart line hover
    280, // slide across chart
    150, // Revenue KPI
    150, // click wait
  ],
  opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
  scale:   [1, 1, 0.8, 1, 0.8, 1, 1, 1, 0.8, 1], // simulate clicks
  transition: {
    duration: 16,
    repeat: Infinity,
    times: [0, 0.1, 0.15, 0.3, 0.35, 0.5, 0.65, 0.8, 0.85, 1],
    ease: "easeInOut"
  }
};

export function AnimatedDashboardMock() {
  const [activeKpi, setActiveKpi] = useState('revenue');
  const [showTooltip, setShowTooltip] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  // Sync state changes with the cursor's timeline (16s total)
  useEffect(() => {
    const syncState = () => {
      setTimeout(() => setFilterActive(true), 1600);   // @10% - cursor hits Filter
      setTimeout(() => setFilterActive(false), 3000); 
      setTimeout(() => setActiveKpi('sales'), 4800);   // @30% - cursor hits Sales KPI
      setTimeout(() => setShowTooltip(true), 8000);    // @50% - cursor hovers Chart
      setTimeout(() => setShowTooltip(false), 10400);  // @65% - cursor leaves Chart
      setTimeout(() => setActiveKpi('revenue'), 12800);// @80% - cursor hits Revenue KPI
    };

    syncState();
    const interval = setInterval(syncState, 16000);
    return () => clearInterval(interval);
  }, []);

  const activePaths = CHART_PATHS[activeKpi as keyof typeof CHART_PATHS];
  const activeCategories = CATEGORIES[activeKpi as keyof typeof CATEGORIES];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative">
      
      {/* Animated Cursor */}
      <motion.div
        animate={{
          x: cursorSequence.x,
          y: cursorSequence.y,
          opacity: cursorSequence.opacity,
          scale: cursorSequence.scale
        }}
        transition={cursorSequence.transition}
        className="absolute z-50 pointer-events-none flex flex-col items-center drop-shadow-xl"
      >
        <MousePointer2 className="w-6 h-6 text-black dark:text-white fill-white dark:fill-black -rotate-12" strokeWidth={1.5} />
        <div className="bg-indigo-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-md ml-6 mt-1 border border-indigo-400">
          Alex (AI)
        </div>
      </motion.div>

      {/* Header - Fixed Alignment */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-foreground">Overview</h2>
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Synced with Shopify Live Data
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <motion.div 
            animate={{ backgroundColor: filterActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}
            className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors cursor-pointer"
          >
            Last 30 Days
          </motion.div>
          <motion.div 
            animate={{ 
              backgroundColor: filterActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderColor: filterActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)' 
            }}
            className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </motion.div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const isActive = activeKpi === kpi.id;
          return (
            <motion.div 
              key={kpi.id} 
              animate={{
                scale: isActive ? 1.02 : 1,
                borderColor: isActive ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0,0,0,0.2)'
              }}
              className="rounded-xl border p-5 flex flex-col gap-4 shadow-sm transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${isActive ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-indigo-500/20' : 'bg-muted/50'}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">{kpi.value}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${kpi.positive ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50'}`}>
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
        <div className="flex-[2] rounded-xl border border-border/50 bg-background/50 p-6 shadow-sm flex flex-col gap-6 relative overflow-visible">
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col items-start gap-1">
              <span className="text-base font-bold text-foreground capitalize">{activeKpi} Forecast</span>
              <span className="text-sm text-muted-foreground">Real-time AI predictive modeling</span>
            </div>
            <span className="text-xs font-bold tracking-wide text-indigo-500 bg-indigo-500/10 px-2.5 py-1.5 rounded-md border border-indigo-500/20 shadow-sm backdrop-blur-sm flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse" />
              AI Predicted
            </span>
          </div>
          
          <div className="flex-1 relative w-full mt-2 z-10 overflow-visible">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full border-b border-foreground/50 border-dashed" />
              ))}
            </div>
            
            {/* Interactive Chart Tooltip (Hover Simulation) */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1, x: 250 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-[20%] left-0 z-20 bg-background/90 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl"
                >
                  <div className="text-xs text-muted-foreground font-medium mb-1">Nov 14, 2024</div>
                  <div className="text-lg font-bold text-foreground">
                    {activeKpi === 'sales' ? '1,492 Units' : '₹492,100'}
                  </div>
                  <div className="text-[10px] text-indigo-500 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> AI +12% Confidence
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <svg className="absolute inset-0 w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={false}
                animate={{ d: activePaths.solid }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" 
              />
              <motion.path 
                initial={false}
                animate={{ d: activePaths.fill }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                fill="url(#chart-grad2)" 
              />
              {/* Dotted prediction line */}
              <motion.path 
                initial={false}
                animate={{ d: activePaths.dashed }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>
        
        {/* Secondary Sidebar Chart */}
        <div className="flex-[1] hidden md:flex rounded-xl border border-border/50 bg-background/50 p-6 shadow-sm flex-col gap-6">
          <span className="text-base font-bold text-foreground">Top Drivers</span>
          <div className="flex flex-col gap-5 mt-2">
            <AnimatePresence mode="popLayout">
              {activeCategories.map((item) => (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground">{item.pct}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-indigo-500 rounded-full" 
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
