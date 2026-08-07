'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, MotionValue, useTransform, useMotionValue } from 'framer-motion';
import { Filter, DollarSign, ShoppingCart, Activity, Users, MousePointer2, TrendingUp, Loader2, Database, LayoutDashboard, Target } from 'lucide-react';

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

export function AnimatedDashboardMock({ scrollProgress }: { scrollProgress?: MotionValue<number> }) {
  const [activeKpi, setActiveKpi] = useState('revenue');
  const [showTooltip, setShowTooltip] = useState(false);
  const [dateActive, setDateActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  
  // New States for "scrollytelling" UI panels
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [showDataSelection, setShowDataSelection] = useState(false);

  // Fallback to 0 if not provided
  const fallbackProgress = useMotionValue(0);
  const progress = scrollProgress || fallbackProgress;

  useMotionValueEvent(progress, "change", (latest) => {
    // 0.2 to 0.3: loading data input mock
    setShowDataSelection(latest > 0.22 && latest < 0.28);
    setShowLoadingOverlay(latest > 0.28 && latest < 0.33);
    
    // Sidebar slides in at 0.75
    setShowSidebar(latest > 0.75);
    
    // Timeline conversions for interactions
    setDateActive(latest > 0.35 && latest < 0.42);
    setFilterActive(latest > 0.45 && latest < 0.52);
    
    if (latest > 0.55 && latest < 0.8) {
      setActiveKpi('sales');
    } else {
      setActiveKpi('revenue');
    }
    
    setShowTooltip(latest > 0.65 && latest < 0.72);
  });

  // Cursor transforms mapped to scroll domain [0.2, 0.9]
  const cursorX = useTransform(
     progress, 
     [0.34, 0.36, 0.4, 0.44, 0.46, 0.5, 0.54, 0.65, 0.7, 0.8, 0.82],
     [100,  750,  750, 850,  850,  350, 350,  600,  650, 100, 100]
  );
  
  const cursorY = useTransform(
     progress, 
     [0.34, 0.36, 0.4, 0.44, 0.46, 0.5, 0.54, 0.65, 0.7, 0.8, 0.82],
     [400,  30,   100, 30,   100,  150, 150,  300,  280, 150, 150]
  );
  
  const cursorOpacity = useTransform(
     progress,
     [0, 0.33, 0.34, 0.85, 0.86, 1],
     [0, 0,    1,    1,    0,    0]
  );
  
  const cursorScale = useTransform(
     progress,
     [0.36, 0.37, 0.38, 0.46, 0.47, 0.48, 0.54, 0.55, 0.56, 0.82, 0.83, 0.84],
     [1,    0.8,  1,    1,    0.8,  1,    1,    0.8,  1,    1,    0.8,  1]
  );

  const activePaths = CHART_PATHS[activeKpi as keyof typeof CHART_PATHS];
  const activeCategories = CATEGORIES[activeKpi as keyof typeof CATEGORIES];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative">
      
      {/* Animated Cursor */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          opacity: cursorOpacity,
          scale: cursorScale
        }}
        className="absolute z-50 pointer-events-none flex flex-col items-center drop-shadow-xl"
      >
        <MousePointer2 className="w-6 h-6 text-black dark:text-white fill-white dark:fill-black -rotate-12" strokeWidth={1.5} />
        <div className="bg-indigo-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-md ml-6 mt-1 border border-indigo-400">
          Kavya
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
          {/* Date Range Dropdown Component */}
          <div className="relative">
            <motion.div 
              animate={{ 
                backgroundColor: dateActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderColor: dateActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)'
              }}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors cursor-pointer"
            >
              Last 30 Days
            </motion.div>
            <AnimatePresence>
              {dateActive && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1.5 right-0 w-36 bg-background border border-border rounded-lg shadow-lg z-30 p-1 flex flex-col"
                >
                  <div className="px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors">Last 7 Days</div>
                  <div className="px-2 py-1.5 text-left text-xs text-indigo-500 font-medium bg-indigo-500/10 rounded-md cursor-pointer transition-colors flex items-center justify-between">
                    Last 30 Days
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </div>
                  <div className="px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors">Year to Date</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Dropdown Component */}
          <div className="relative">
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
            <AnimatePresence>
              {filterActive && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1.5 right-0 w-44 bg-background border border-border rounded-lg shadow-lg z-30 p-2 flex flex-col gap-2"
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">Channels</span>
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Online Store</span>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xs font-medium text-foreground">Point of Sale</span>
                  </div>
                  <div className="flex items-center gap-2 px-1 opacity-50">
                    <div className="w-3 h-3 rounded-sm border border-border" />
                    <span className="text-xs font-medium text-foreground">Wholesale</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.03)' : 'transparent'
              }}
              className="rounded-xl border p-4 xl:p-5 flex flex-col gap-3 shadow-sm transition-all duration-300 bg-background/50"
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs xl:text-sm font-semibold ${isActive ? 'text-indigo-500' : 'text-foreground'}`}>
                  {kpi.title}
                </span>
                <div className={`w-7 h-7 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-indigo-500/20' : 'bg-muted/30'}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg xl:text-xl font-extrabold text-foreground tracking-tight leading-none">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none flex items-center ${kpi.positive ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50'}`}>
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
        <div className="flex-[2] rounded-xl border border-border/50 bg-background/50 p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
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
          
          <div className="flex-1 relative w-full mt-2 z-10 overflow-hidden rounded-b-xl">
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

            <svg className="absolute inset-0 w-full h-full text-indigo-500 overflow-hidden" viewBox="0 0 400 120" preserveAspectRatio="none">
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
      {/* Scrollytelling Overlays */}
      <AnimatePresence>
        {showDataSelection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-background border border-border p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4 max-w-md text-center">
              <Database className="w-12 h-12 text-indigo-500 mb-2" />
              <h3 className="text-xl font-bold">Connecting Data Sources</h3>
              <p className="text-muted-foreground text-sm">Selecting historical sales, inventory levels, and upcoming promotion schedules to build the forecasting model.</p>
              <div className="w-full h-1.5 bg-muted mt-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-background/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex items-center gap-3 bg-background border border-border px-6 py-4 rounded-full shadow-xl">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium">Generating Forecasts...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forecasting Sidebar Menu (slides in) */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: showSidebar ? 0 : '100%', opacity: showSidebar ? 1 : 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
        className="absolute top-0 right-0 h-full w-64 bg-background border-l border-border/50 shadow-2xl z-30 p-6 flex flex-col gap-6"
      >
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Forecasting</h4>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 text-indigo-500 cursor-pointer">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-semibold">Overview</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Demand Planner</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Inventory Simulator</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
