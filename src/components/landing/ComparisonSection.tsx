'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

type CellValue = true | false | string | null;

const rows: { feature: string; category: string; us: CellValue; inventoryPlanner: CellValue; extensiv: CellValue; sheets: CellValue }[] = [
  // Forecasting
  { category: 'Forecasting', feature: 'Forecast accuracy', us: '90–95% (ML Ensemble)', inventoryPlanner: '70–80% (rule-based)', extensiv: '65–75% (basic)', sheets: 'Variable / manual' },
  { category: 'Forecasting', feature: 'AI/ML demand signals', us: true, inventoryPlanner: false, extensiv: false, sheets: false },
  { category: 'Forecasting', feature: 'Seasonality auto-detection', us: true, inventoryPlanner: 'Partial', extensiv: false, sheets: false },
  { category: 'Forecasting', feature: 'New product cold-start', us: 'Category transfer learning', inventoryPlanner: false, extensiv: false, sheets: false },
  { category: 'Forecasting', feature: 'Multi-channel aggregation', us: true, inventoryPlanner: 'Partial', extensiv: true, sheets: false },
  // Inventory
  { category: 'Inventory', feature: 'Dynamic safety stock', us: true, inventoryPlanner: true, extensiv: 'Partial', sheets: false },
  { category: 'Inventory', feature: 'Auto reorder triggers', us: true, inventoryPlanner: true, extensiv: true, sheets: false },
  { category: 'Inventory', feature: 'Real-time sync latency', us: 'Millisecond', inventoryPlanner: 'Daily batch', extensiv: 'Daily batch', sheets: 'Manual' },
  { category: 'Inventory', feature: 'SKU-level granularity', us: true, inventoryPlanner: true, extensiv: true, sheets: 'Limited' },
  { category: 'Inventory', feature: 'Dead stock identification', us: true, inventoryPlanner: 'Partial', extensiv: false, sheets: false },
  // Promotions
  { category: 'Promotions', feature: 'Promotion simulator (A/B)', us: 'Built-in', inventoryPlanner: false, extensiv: false, sheets: false },
  { category: 'Promotions', feature: 'Margin impact preview', us: true, inventoryPlanner: false, extensiv: false, sheets: false },
  { category: 'Promotions', feature: 'Cross-category cannibalization', us: true, inventoryPlanner: false, extensiv: false, sheets: false },
  { category: 'Promotions', feature: 'Historical elasticity at SKU level', us: true, inventoryPlanner: false, extensiv: false, sheets: false },
  // Setup & UX
  { category: 'Setup & UX', feature: 'Time to first insight', us: '< 12 min', inventoryPlanner: '2–4 weeks', extensiv: '3–6 months', sheets: 'Ongoing' },
  { category: 'Setup & UX', feature: '1-click integrations', us: true, inventoryPlanner: 'Partial', extensiv: false, sheets: false },
  { category: 'Setup & UX', feature: 'No engineering required', us: true, inventoryPlanner: 'Partial', extensiv: false, sheets: true },
  { category: 'Setup & UX', feature: 'Mobile-ready dashboard', us: true, inventoryPlanner: false, extensiv: false, sheets: 'Partial' },
  // Pricing & Scale
  { category: 'Pricing', feature: 'Transparent pricing', us: true, inventoryPlanner: 'Partial', extensiv: false, sheets: true },
  { category: 'Pricing', feature: 'Free tier available', us: true, inventoryPlanner: false, extensiv: false, sheets: true },
  { category: 'Pricing', feature: 'SOC 2 compliance', us: true, inventoryPlanner: true, extensiv: true, sheets: false },
  { category: 'Pricing', feature: 'API access', us: true, inventoryPlanner: 'Paid add-on', extensiv: true, sheets: false },
];

const columns = [
  { key: 'us', label: 'CommerceCast', highlight: true },
  { key: 'inventoryPlanner', label: 'Inventory Planner', highlight: false },
  { key: 'extensiv', label: 'Extensiv', highlight: false },
  { key: 'sheets', label: 'Spreadsheets', highlight: false },
] as const;

function Cell({ value }: { value: CellValue }) {
  if (value === true)
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/60">
        <X className="w-3.5 h-3.5 text-muted-foreground/40" />
      </span>
    );
  if (value === null)
    return (
      <span className="inline-flex items-center justify-center w-6 h-6">
        <Minus className="w-3.5 h-3.5 text-muted-foreground/30" />
      </span>
    );
  return <span className="text-xs font-medium text-foreground/80 leading-snug">{value}</span>;
}

// Group rows by category
const grouped = rows.reduce(
  (acc, row) => {
    if (!acc[row.category]) acc[row.category] = [];
    acc[row.category].push(row);
    return acc;
  },
  {} as Record<string, typeof rows>
);

export function ComparisonSection() {
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
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-5">
            The difference
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline mb-4 leading-[1.06]">
            Why teams leave legacy tools
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            A side-by-side breakdown across forecasting, inventory, promotions, UX, and pricing.
          </p>
        </motion.div>

        {/* Table — horizontally scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-5xl mx-auto overflow-x-auto rounded-2xl border border-border/50"
        >
          <table className="w-full min-w-[700px] text-sm border-collapse">
            {/* Column headers */}
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground w-[30%]">
                  Feature
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`p-4 text-center text-xs font-semibold uppercase tracking-widest border-l border-border/40 ${
                      col.highlight ? 'text-primary bg-primary/[0.04]' : 'text-muted-foreground'
                    }`}
                  >
                    {col.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block mr-2 mb-0.5" />
                    )}
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.entries(grouped).map(([category, catRows]) => (
                <>
                  {/* Category header row */}
                  <tr key={`cat-${category}`} className="border-b border-border/30 bg-muted/10">
                    <td
                      colSpan={5}
                      className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60"
                    >
                      {category}
                    </td>
                  </tr>

                  {/* Data rows */}
                  {catRows.map((row, i) => (
                    <motion.tr
                      key={`${category}-${i}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-sm text-foreground/70 font-medium">{row.feature}</td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`p-4 text-center border-l border-border/20 ${
                            col.highlight ? 'bg-primary/[0.03]' : ''
                          }`}
                        >
                          <Cell value={row[col.key]} />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/50 mt-6"
        >
          Based on publicly available documentation and user reviews. Last updated Aug 2026.
        </motion.p>
      </div>
    </section>
  );
}
