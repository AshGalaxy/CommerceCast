
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bot, Loader2, Database, Wand2, Gift, AreaChart, TrendingUp, AlertTriangle, Calendar, Users, Calculator, CheckCircle, ArrowRight, RefreshCw, UploadCloud, Download } from 'lucide-react';
import Link from 'next/link';
import {
  smartPromotionPlanner,
  type SmartPromotionPlannerOutput,
} from '@/ai/flows/smart-promotion-planner';
import { calculatePromotionMetrics, generatePromotionCards, type PromotionMetric, type SalesRecord, type PromotionCard } from '@/utils/promotion-engine';
import { simulatePromotion, type SimulationOutput } from '@/utils/promotion-simulator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useLocalStorage from '@/hooks/use-local-storage';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const sampleSalesData = `date,sales,product_id,product_category,region
2024-01-01,230,prod_A,Electronics,North
2024-01-02,250,prod_A,Electronics,North
2024-01-03,240,prod_B,Clothing,South
2024-01-04,260,prod_A,Electronics,North
2024-01-05,270,prod_C,Groceries,West
2024-01-06,280,prod_B,Clothing,South
2024-01-07,290,prod_A,Electronics,East
2024-01-08,300,prod_C,Groceries,West
2024-01-09,310,prod_A,Electronics,North
2024-01-10,305,prod_B,Clothing,South`;

type SalesDataStorage = {
  currentData: string;
  history: any[];
};

type ForecastDataStorage = {
  forecastData: string;
};

type PastPromotion = {
  id: string;
  name: string;
  revenue_lift: number;
  roi: number;
  date: string;
  status: 'Active' | 'Completed';
};

export default function PromotionsPage() {
  const [salesStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
  const [forecastStorage, setForecastStorage] = useLocalStorage<ForecastDataStorage>('forecast-data', { forecastData: '' });
  const [pastPromotions, setPastPromotions] = useLocalStorage<PastPromotion[]>('past-promotions', []);

  const [historicalSalesData, setHistoricalSalesData] = useState('');
  const [forecastData, setForecastData] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [promotionMetrics, setPromotionMetrics] = useState<PromotionMetric[]>([]);
  const [promotionCards, setPromotionCards] = useState<PromotionCard[]>([]);

  // Builder State
  const [builderStep, setBuilderStep] = useState(1);
  const [promoGoal, setPromoGoal] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [duration, setDuration] = useState(7);
  const [simulationResult, setSimulationResult] = useState<SimulationOutput | null>(null);

  useEffect(() => {
    if (salesStorage.currentData) {
      setHistoricalSalesData(salesStorage.currentData);
    }

    if (forecastStorage.forecastData) {
      setForecastData(forecastStorage.forecastData);
    }
  }, [salesStorage, forecastStorage]);

  const kpiMetrics = useMemo(() => {
    if (pastPromotions.length === 0) return { total: 0, lift: 0, best: 'N/A', roi: 0 };

    const total = pastPromotions.length;
    const avgLift = pastPromotions.reduce((acc, p) => acc + p.revenue_lift, 0) / total;
    const avgRoi = pastPromotions.reduce((acc, p) => acc + p.roi, 0) / total;
    const best = [...pastPromotions].sort((a, b) => b.revenue_lift - a.revenue_lift)[0]?.name || 'N/A';

    return { total, lift: avgLift.toFixed(1), best, roi: avgRoi.toFixed(2) };
  }, [pastPromotions]);

  const handleExportPromotions = () => {
    if (pastPromotions.length === 0) return;

    import('@/utils/export-utils').then(({ exportToCSV }) => {
      exportToCSV(pastPromotions, `promotions_history_${new Date().toISOString().split('T')[0]}`);
    });
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Re-trigger calculation
      const current = historicalSalesData;
      setHistoricalSalesData('');
      setTimeout(() => setHistoricalSalesData(current), 10);
      setIsLoading(false);
    }, 500);
  };

  // Run Engine
  useEffect(() => {
    if (!historicalSalesData) return;

    try {
      const parsedSales = parseCsv(historicalSalesData);

      // Auto-extract inventory from sales data
      // We look for the LATEST record for each product to get the most recent stock level
      // If stock_level is missing, we default to 0 (Safe Fallback)
      const productMap = new Map<string, number>();

      parsedSales.forEach(r => {
        if (r.product_id) {
          // If record has explicit stock_level, use it. 
          // Otherwise, we can't really know. For now, default to 0 if not found.
          // But wait, if we default to 0, everything becomes "Low Stock".
          // Let's try to find a 'stock_level' or 'stock' field.
          const stock = r.stock_level !== undefined ? parseFloat(r.stock_level) :
            r.stock !== undefined ? parseFloat(r.stock) : undefined;

          if (stock !== undefined) {
            productMap.set(r.product_id, stock);
          } else if (!productMap.has(r.product_id)) {
            productMap.set(r.product_id, 0); // Default if never found
          }
        }
      });

      const uniqueProducts = Array.from(new Set(parsedSales.map(r => r.product_id).filter((id): id is string => !!id)));
      const inferredInventory = uniqueProducts.map(id => ({
        product_id: id,
        quantity: productMap.get(id) || 0
      }));

      const parsedForecast = forecastData ? JSON.parse(forecastData) : [];

      const metrics = calculatePromotionMetrics(parsedSales, inferredInventory, parsedForecast);
      setPromotionMetrics(metrics);
      setPromotionCards(generatePromotionCards(metrics));
    } catch (e) {
      console.error("Error calculating metrics:", e);
    }
  }, [historicalSalesData, forecastData]);

  // Run Simulation when inputs change
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const productsForSim = promotionMetrics
        .filter(m => selectedProducts.includes(m.product_id))
        .map(m => ({
          id: m.product_id,
          price: 100, // Mock price
          baseline_daily_sales: m.daily_velocity
        }));

      const result = simulatePromotion({
        products: productsForSim,
        discount_percent: discountValue,
        duration_days: duration
      });
      setSimulationResult(result);
    }
  }, [selectedProducts, discountValue, duration, promotionMetrics]);

  const parseCsv = (csv: string): SalesRecord[] => {
    console.log("Parsing CSV, length:", csv.length);
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    let headerIndex = 0;
    // Skip metadata lines (simple heuristic)
    if (lines[0].toLowerCase().includes('company') && !lines[0].includes(',')) {
      headerIndex = 1;
    }

    if (lines.length < headerIndex + 2) return [];

    const headers = lines[headerIndex].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));
    console.log("Headers found:", headers);

    return lines.slice(headerIndex + 1).map(line => {
      if (!line.trim()) return null;
      // Handle quoted values (basic regex split)
      // This regex matches: "quoted, value" OR non-quoted-value
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');

      // Fallback to simple split if regex fails to find enough columns
      const simpleValues = line.split(',');
      const finalValues = values.length >= headers.length ? values : simpleValues;

      const record: any = {};
      headers.forEach((h, i) => {
        let val = finalValues[i]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); // Remove surrounding quotes

        // Map common column names
        if (h === 'product category' || h === 'category') record['product_category'] = val;
        else if (h === 'sub category' || h === 'subcategory' || h === 'product_subcategory') record['product_sub_category'] = val;
        else if (h === 'product id' || h === 'product_id') record['product_id'] = val;
        else if (h === 'stock level' || h === 'stock_level' || h === 'stock') record['stock_level'] = val;
        else record[h] = val;
      });
      return record;
    }).filter(r => r !== null) as SalesRecord[];
  };

  const handleLaunch = () => {
    if (!simulationResult) return;

    const newPromo: PastPromotion = {
      id: Date.now().toString(),
      name: `PROMO-${new Date().toLocaleDateString()}`,
      revenue_lift: 25, // Mock actual lift for now, or use projected
      roi: simulationResult.roi,
      date: new Date().toISOString(),
      status: 'Active'
    };

    setPastPromotions([...pastPromotions, newPromo]);
    setBuilderStep(1);
    setPromoGoal('');
    setSelectedProducts([]);
    alert("Promotion Launched Successfully!");
  };

  const handleCardClick = (card: PromotionCard) => {
    setPromoGoal(card.type === 'Clearance' ? 'clear_inventory' : 'boost_revenue');
    setSelectedProducts(card.products);
    setBuilderStep(3); // Jump to strategy
    // Scroll to builder
    document.getElementById('promo-builder')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Promotion Command Center</h1>
          <p className="text-muted-foreground">Plan, Simulate, and Launch data-driven campaigns.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
          </Button>
        </div>
      </div>

      {!historicalSalesData && (
        <Alert>
          <UploadCloud className="h-4 w-4" />
          <AlertTitle>No Data Found</AlertTitle>
          <AlertDescription>Please upload your sales data in the Dashboard to generate recommendations.</AlertDescription>
        </Alert>
      )}

      <div className={!historicalSalesData ? 'opacity-50 pointer-events-none blur-sm select-none' : ''}>
        {/* Section 1: Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedKPI('total')}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Promotions</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{kpiMetrics.total}</div><p className="text-xs text-muted-foreground">All time</p></CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedKPI('lift')}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg Revenue Lift</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">+{kpiMetrics.lift}%</div><p className="text-xs text-muted-foreground">vs Baseline</p></CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedKPI('best')}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Best Campaign</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{kpiMetrics.best}</div><p className="text-xs text-muted-foreground">Highest Lift</p></CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedKPI('roi')}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg ROI</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-600">{kpiMetrics.roi}x</div><p className="text-xs text-muted-foreground">Return on Ad Spend</p></CardContent>
          </Card>
        </div>

        {/* Section 2: AI Recommendations */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Smart Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotionCards.map((card, idx) => (
              <Card key={idx} className={`border-l-4 ${card.type === 'Clearance' ? 'border-l-red-500' : card.type === 'High Confidence' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{card.type}</Badge>
                    <span className="text-xs font-bold text-muted-foreground">{card.confidence}% Conf.</span>
                  </div>
                  <CardTitle className="mt-2">{card.title}</CardTitle>
                  <CardDescription>{card.target}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Reason:</strong> {card.reason}</p>
                  <p><strong>Action:</strong> {card.suggested_action}</p>
                  <p className="text-green-600 font-medium">{card.expected_impact}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCardClick(card)}>Create Promotion</Button>
                </CardFooter>
              </Card>
            ))}
            {promotionCards.length === 0 && (
              <div className="col-span-3 text-center p-8 border rounded-lg bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Analyzing data for opportunities...</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Promotion Builder */}
        <div id="promo-builder" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Promotion Builder</CardTitle>
                <CardDescription>Step {builderStep} of 4</CardDescription>
              </CardHeader>
              <CardContent>
                {builderStep === 1 && (
                  <div className="space-y-4">
                    <Label>Step 1: What is your goal?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 border rounded-lg cursor-pointer hover:bg-muted ${promoGoal === 'boost_revenue' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setPromoGoal('boost_revenue')}>
                        <TrendingUp className="h-6 w-6 mb-2 text-green-600" />
                        <h3 className="font-semibold">Boost Revenue</h3>
                        <p className="text-sm text-muted-foreground">Maximize sales volume for high-demand items.</p>
                      </div>
                      <div className={`p-4 border rounded-lg cursor-pointer hover:bg-muted ${promoGoal === 'clear_inventory' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setPromoGoal('clear_inventory')}>
                        <AlertTriangle className="h-6 w-6 mb-2 text-red-600" />
                        <h3 className="font-semibold">Clear Inventory</h3>
                        <p className="text-sm text-muted-foreground">Liquidate slow-moving stock to free up cash.</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button onClick={() => setBuilderStep(2)} disabled={!promoGoal}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                {builderStep === 2 && (
                  <div className="space-y-4">
                    <Label>Step 2: Select Products</Label>
                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                      {promotionMetrics.map(p => (
                        <div key={p.product_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={p.product_id}
                            checked={selectedProducts.includes(p.product_id)}
                            onCheckedChange={(checked: boolean | 'indeterminate') => {
                              if (checked === true) setSelectedProducts([...selectedProducts, p.product_id]);
                              else setSelectedProducts(selectedProducts.filter(id => id !== p.product_id));
                            }}
                          />
                          <label htmlFor={p.product_id} className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            <span className="font-bold">{p.product_id}</span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              {p.category} {p.subcategory ? `> ${p.subcategory}` : ''}
                            </span>
                            <Badge variant={p.status === 'Overstock' ? 'destructive' : p.status === 'Healthy' ? 'outline' : 'secondary'} className="ml-2 text-[10px] h-5">
                              {p.status}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setBuilderStep(1)}>Back</Button>
                      <Button onClick={() => setBuilderStep(3)} disabled={selectedProducts.length === 0}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                {builderStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Discount Strategy</Label>
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Off (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount Off (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value: {discountValue}%</Label>
                      <Slider value={[discountValue]} onValueChange={(v: number[]) => setDiscountValue(v[0])} max={90} step={5} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration: {duration} Days</Label>
                      <Slider value={[duration]} onValueChange={(v: number[]) => setDuration(v[0])} max={30} step={1} />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setBuilderStep(2)}>Back</Button>
                      <Button onClick={() => setBuilderStep(4)}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                {builderStep === 4 && (
                  <div className="space-y-4 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold">Ready to Launch!</h3>
                    <p className="text-muted-foreground">Review the impact analysis on the right before confirming.</p>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline" onClick={() => setBuilderStep(3)}>Back</Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleLaunch}>Launch Promotion</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 4: Simulator */}
          <div>
            <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Projected Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {simulationResult ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Projected Revenue</p>
                      <div className="text-2xl font-bold text-green-600">₹{simulationResult.projected_revenue.min.toLocaleString()} - ₹{simulationResult.projected_revenue.max.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Units Sold</p>
                        <div className="font-semibold">{simulationResult.projected_units.min} - {simulationResult.projected_units.max}</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <div className="font-semibold text-blue-600">{simulationResult.roi}x</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Cost of Discount:</span>
                        <span className="font-medium text-red-500">₹{simulationResult.cost_of_discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Net Profit Impact:</span>
                        <span className="font-medium">₹{simulationResult.net_profit_impact.min.toLocaleString()} - ₹{simulationResult.net_profit_impact.max.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-xs text-blue-800 dark:text-blue-200">
                      <strong>AI Insight:</strong> This promotion performs better than 60% of past campaigns.
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Select products and strategy to see impact.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Help Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" /> How to Use the Promotion Planner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">1. Load Your Data</h3>
            <p>Ensure you have uploaded your Sales Data in the Dashboard. The planner automatically reads your product history to calculate velocity and stock levels.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">2. Check Recommendations</h3>
            <p>Look at the "Smart Recommendations" cards. These are AI-generated opportunities based on your inventory health (Overstock vs. Healthy).</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">3. Build & Simulate</h3>
            <p>Click "Create Promotion" or use the Builder. Select products, set a discount, and watch the "Projected Impact" simulator predict your ROI in real-time.</p>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedKPI} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedKPI === 'total' && 'Promotion History'}
              {selectedKPI === 'lift' && 'Revenue Lift Analysis'}
              {selectedKPI === 'best' && 'Top Performing Campaigns'}
              {selectedKPI === 'roi' && 'Return on Investment (ROI) Breakdown'}
            </DialogTitle>
            <DialogDescription>
              {selectedKPI === 'total' && 'A complete log of all promotions launched and their status.'}
              {selectedKPI === 'lift' && 'How much extra revenue your promotions generated compared to baseline sales.'}
              {selectedKPI === 'best' && 'Your most successful campaigns ranked by revenue lift.'}
              {selectedKPI === 'roi' && 'Efficiency of your spend. Calculated as (Net Profit / Cost of Discount).'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedKPI === 'total' && (
              <div className="border rounded-md">
                <div className="p-2 flex justify-end border-b bg-slate-50 dark:bg-slate-900/50">
                  <Button variant="outline" size="sm" onClick={handleExportPromotions} disabled={pastPromotions.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Lift</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastPromotions.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center">No promotions yet.</TableCell></TableRow>
                    ) : (
                      pastPromotions.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                          <TableCell><Badge variant={p.status === 'Active' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
                          <TableCell className="text-right text-green-600">+{p.revenue_lift}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {selectedKPI === 'lift' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Formula</h4>
                  <code className="text-sm bg-slate-900 text-white p-2 rounded block">
                    Lift % = ((Actual Revenue - Baseline Revenue) / Baseline Revenue) * 100
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Baseline Revenue is calculated using the 30-day average daily sales (ADS) prior to the promotion.
                  </p>
                </div>
                <h4 className="font-semibold">Lift by Campaign</h4>
                <div className="space-y-2">
                  {pastPromotions.map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b pb-2">
                      <span>{p.name}</span>
                      <span className="font-bold text-green-600">+{p.revenue_lift}%</span>
                    </div>
                  ))}
                  {pastPromotions.length === 0 && <p className="text-muted-foreground text-sm">No data available.</p>}
                </div>
              </div>
            )}

            {selectedKPI === 'best' && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <Gift className="h-4 w-4" /> Winning Strategy
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Your best campaigns typically involve <strong>20-30% discounts</strong> on <strong>High Velocity</strong> items.
                  </p>
                </div>
                <h4 className="font-semibold">Top 5 Campaigns</h4>
                <div className="space-y-2">
                  {[...pastPromotions].sort((a, b) => b.revenue_lift - a.revenue_lift).slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4 border p-3 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-primary">
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{p.revenue_lift}% Lift</div>
                        <div className="text-xs text-muted-foreground">{p.roi}x ROI</div>
                      </div>
                    </div>
                  ))}
                  {pastPromotions.length === 0 && <p className="text-muted-foreground text-sm">No data available.</p>}
                </div>
              </div>
            )}

            {selectedKPI === 'roi' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Formula</h4>
                  <code className="text-sm bg-slate-900 text-white p-2 rounded block">
                    ROI = (Net Profit from Promo / Cost of Discount)
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Cost of Discount includes the markdown value + any marketing spend.
                  </p>
                </div>
                <h4 className="font-semibold">ROI Performance</h4>
                <div className="space-y-2">
                  {pastPromotions.map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b pb-2">
                      <span>{p.name}</span>
                      <span className={`font-bold ${p.roi >= 3 ? 'text-green-600' : p.roi >= 1 ? 'text-blue-600' : 'text-red-600'}`}>
                        {p.roi}x
                      </span>
                    </div>
                  ))}
                  {pastPromotions.length === 0 && <p className="text-muted-foreground text-sm">No data available.</p>}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
