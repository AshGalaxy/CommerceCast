'use client';

import { useState, useMemo, useEffect } from 'react';
import { Upload, FileText, Plus, X, ArrowRight, TrendingUp, TrendingDown, Minus, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// --- Types ---
type SalesDataRow = {
    date: string;
    sales: number;
    revenue: number;
    product_id: string;
    product_category: string;
    region: string;
    [key: string]: any;
};

type SalesDataStorage = {
    currentData: string;
    history: any[];
};

type ComparisonMetric = {
    label: string;
    valueA: number;
    valueB: number;
    change: number; // Absolute change
    percentChange: number;
    format: 'currency' | 'number' | 'percent';
};

// --- Helper Functions ---
const parseCsv = (csv: string): SalesDataRow[] => {
    const lines = csv.trim().split('\n');
    let headerIndex = 0;
    if (lines[0].toLowerCase().startsWith('company') || !lines[0].includes(',')) {
        headerIndex = 1;
    }
    if (lines.length < headerIndex + 2) return [];

    const headers = lines[headerIndex].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));

    return lines.slice(headerIndex + 1).map(line => {
        if (!line.trim()) return null;
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || line.split(',');
        const getVal = (i: number) => values[i]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"');

        const row: any = {};
        headers.forEach((h, i) => row[h] = getVal(i));

        return {
            date: row.date,
            sales: parseFloat(row.sales || row.quantity || '0'),
            revenue: parseFloat(row.revenue || '0'),
            product_id: row.product_id || 'unknown',
            product_category: row.product_category || row.category || 'Uncategorized',
            region: row.region || 'Unknown',
            unit_cost: parseFloat(row.unit_cost || '0'),
        } as SalesDataRow;
    }).filter(d => d !== null && !isNaN(d.sales)) as SalesDataRow[];
};

export default function ComparisonPage() {
    const { toast } = useToast();
    const [salesStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });

    // --- State ---
    const [comparisonMode, setComparisonMode] = useState<'internal' | 'external'>('internal');

    // Internal Mode: Date Ranges
    const [periodA, setPeriodA] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    });
    const [periodB, setPeriodB] = useState<DateRange | undefined>({
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1))
    });

    // External Mode: Second Dataset
    const [externalData, setExternalData] = useState<SalesDataRow[]>([]);
    const [externalName, setExternalName] = useState<string>('Competitor');

    // Main Data
    const [mainData, setMainData] = useState<SalesDataRow[]>([]);

    // Load Main Data
    useEffect(() => {
        if (salesStorage.currentData) {
            setMainData(parseCsv(salesStorage.currentData));
        }
    }, [salesStorage]);

    // Handle External File Upload
    const handleExternalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const parsed = parseCsv(text);
            if (parsed.length > 0) {
                setExternalData(parsed);
                setExternalName(file.name.replace('.csv', ''));
                toast({ title: 'Competitor Data Loaded', description: `Loaded ${parsed.length} records.` });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not parse CSV.' });
            }
        };
        reader.readAsText(file);
    };

    // --- Metrics Calculation ---
    const metrics = useMemo(() => {
        let dataA: SalesDataRow[] = [];
        let dataB: SalesDataRow[] = [];

        if (comparisonMode === 'internal') {
            if (!periodA?.from || !periodA?.to || !periodB?.from || !periodB?.to) return null;

            dataA = mainData.filter(d => {
                const date = new Date(d.date);
                return date >= periodA.from! && date <= periodA.to!;
            });
            dataB = mainData.filter(d => {
                const date = new Date(d.date);
                return date >= periodB.from! && date <= periodB.to!;
            });
        } else {
            // External Mode: Period A is Main Data (filtered by Period A range), Period B is External Data
            // Usually external comparison matches the same time period, so we filter both by Period A's range
            // OR we just take the whole external dataset if it's pre-prepared.
            // Let's filter both by Period A's range for consistency if dates exist.
            if (!periodA?.from || !periodA?.to) return null;

            dataA = mainData.filter(d => {
                const date = new Date(d.date);
                return date >= periodA.from! && date <= periodA.to!;
            });

            // For external, we try to match the same dates if possible
            dataB = externalData.filter(d => {
                const date = new Date(d.date);
                return date >= periodA.from! && date <= periodA.to!;
            });

            // Fallback: If external data has no matching dates (e.g. different year), maybe we shouldn't filter?
            // For now, strict date matching.
        }

        const calc = (data: SalesDataRow[]) => {
            const revenue = data.reduce((sum, r) => sum + r.revenue, 0);
            const sales = data.reduce((sum, r) => sum + r.sales, 0);
            const txns = data.length;
            const aov = txns > 0 ? revenue / txns : 0;
            return { revenue, sales, txns, aov };
        };

        const resA = calc(dataA);
        const resB = calc(dataB);

        const createMetric = (label: string, valA: number, valB: number, fmt: 'currency' | 'number'): ComparisonMetric => {
            const change = valA - valB;
            const percentChange = valB !== 0 ? (change / valB) * 100 : (valA > 0 ? 100 : 0);
            return { label, valueA: valA, valueB: valB, change, percentChange, format: fmt };
        };

        return [
            createMetric('Total Revenue', resA.revenue, resB.revenue, 'currency'),
            createMetric('Units Sold', resA.sales, resB.sales, 'number'),
            createMetric('Transactions', resA.txns, resB.txns, 'number'),
            createMetric('Avg Order Value', resA.aov, resB.aov, 'currency'),
        ];
    }, [mainData, externalData, comparisonMode, periodA, periodB]);

    // --- Chart Data Preparation ---
    const chartData = useMemo(() => {
        if (!periodA?.from || !periodA?.to) return { barData: [], lineData: [] };

        // 1. Bar Chart Data (Totals)
        // We already have this in metrics, but let's format it for Recharts
        // We need a single object with keys for Period A and Period B
        const barData = metrics ? [
            { name: 'Revenue', A: metrics[0].valueA, B: metrics[0].valueB },
            { name: 'Units', A: metrics[1].valueA, B: metrics[1].valueB },
        ] : [];

        // 2. Line Chart Data (Daily Trend Overlay)
        // We need to map dates to "Day 1, Day 2..." or "Week 1..."
        // Strategy: Create a map of DayIndex -> { A: val, B: val }

        const getDayIndex = (date: Date, start: Date) => {
            const diffTime = Math.abs(date.getTime() - start.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        };

        const dailyMap = new Map<number, { day: number, A: number, B: number }>();

        const processDaily = (data: SalesDataRow[], periodStart: Date, key: 'A' | 'B') => {
            data.forEach(d => {
                const date = new Date(d.date);
                const dayIdx = getDayIndex(date, periodStart);
                if (!dailyMap.has(dayIdx)) dailyMap.set(dayIdx, { day: dayIdx, A: 0, B: 0 });
                const entry = dailyMap.get(dayIdx)!;
                entry[key] += d.revenue;
            });
        };

        // Filter data again (duplication, but cleaner than passing huge props)
        // Optimization: We could memoize filtered data in the parent
        const dataA = comparisonMode === 'internal'
            ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! }))
            : mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! }));

        const dataB = comparisonMode === 'internal'
            ? (periodB?.from && periodB?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodB.from!, end: periodB.to! })) : [])
            : externalData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! }));

        if (periodA.from) processDaily(dataA, periodA.from, 'A');
        if (comparisonMode === 'internal' && periodB?.from) processDaily(dataB, periodB.from, 'B');
        if (comparisonMode === 'external' && periodA.from) processDaily(dataB, periodA.from, 'B'); // External usually aligns with Period A start

        const lineData = Array.from(dailyMap.values()).sort((a, b) => a.day - b.day);

        return { barData, lineData };
    }, [metrics, mainData, externalData, comparisonMode, periodA, periodB]);

    const formatValue = (val: number, fmt: 'currency' | 'number' | 'percent') => {
        if (fmt === 'currency') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
        if (fmt === 'percent') return `${val.toFixed(1)}%`;
        return val.toLocaleString();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Sales Comparison</h1>
                    <p className="text-muted-foreground">Analyze performance across periods or benchmarks.</p>
                </div>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={comparisonMode === 'internal' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setComparisonMode('internal')}
                    >
                        Internal (Time)
                    </Button>
                    <Button
                        variant={comparisonMode === 'external' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setComparisonMode('external')}
                    >
                        External (Benchmark)
                    </Button>
                </div>
            </div>

            {/* Setup Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Comparison Setup</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="space-y-2 flex-1">
                        <Label>Period A (Primary)</Label>
                        <DateRangePicker date={periodA} setDate={setPeriodA} />
                    </div>

                    <div className="flex items-center justify-center pt-8">
                        <div className="bg-muted rounded-full p-2">
                            <span className="font-bold text-muted-foreground">VS</span>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        <Label>Period B ({comparisonMode === 'internal' ? 'Comparison' : 'Benchmark'})</Label>
                        {comparisonMode === 'internal' ? (
                            <DateRangePicker date={periodB} setDate={setPeriodB} />
                        ) : (
                            <div className="flex gap-2">
                                <Input type="file" accept=".csv" onChange={handleExternalUpload} />
                                {externalData.length > 0 && <span className="text-sm text-green-600 flex items-center">✓ Loaded</span>}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* KPI Grid */}
            {metrics && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((m, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${m.percentChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {m.percentChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {Math.abs(m.percentChange).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold mb-1">{formatValue(m.valueA, m.format)}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        vs {formatValue(m.valueB, m.format)}
                                        <span className="text-muted-foreground/50">({comparisonMode === 'internal' ? 'Period B' : externalName})</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* AI Insights */}
                    <AIInsights metrics={metrics} />
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trend Overlay */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Revenue Trend</CardTitle>
                        <CardDescription>Comparing daily performance (Day 1 to Day N)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    label={{ value: 'Day of Period', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis tickFormatter={(val) => `₹${val / 1000}k`} width={60} />
                                <Tooltip
                                    formatter={(value: number) => formatValue(value, 'currency')}
                                    labelFormatter={(label) => `Day ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="A"
                                    name="Period A (Primary)"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="B"
                                    name={comparisonMode === 'internal' ? 'Period B' : externalName}
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue Comparison Chart */}
                <Card className="col-span-1 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                        <CardDescription>Period A vs Period B</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[chartData.barData[0]]} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis orientation="left" stroke="#2563eb" width={60} tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(val)} />
                                <Tooltip shared={false} cursor={{ fill: 'transparent' }} formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)} />
                                <Legend />
                                <Bar dataKey="A" name="Period A" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={60} />
                                <Bar dataKey="B" name="Period B" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Volume Comparison Chart */}
                <Card className="col-span-1 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Volume (Units)</CardTitle>
                        <CardDescription>Period A vs Period B</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[chartData.barData[1]]} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis orientation="left" stroke="#16a34a" width={60} tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(val)} />
                                <Tooltip shared={false} cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="A" name="Period A" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={60} />
                                <Bar dataKey="B" name="Period B" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analysis Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                    <CardDescription>Breakdown by Product, Region, and Category</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="product">
                        <TabsList>
                            <TabsTrigger value="product">Products</TabsTrigger>
                            <TabsTrigger value="region">Regions</TabsTrigger>
                            <TabsTrigger value="category">Categories</TabsTrigger>
                        </TabsList>

                        <TabsContent value="product" className="mt-4">
                            <ComparisonTable
                                type="product"
                                dataA={comparisonMode === 'internal'
                                    ? (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])
                                    : (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                dataB={comparisonMode === 'internal'
                                    ? (periodB?.from && periodB?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodB.from!, end: periodB.to! })) : [])
                                    : (periodA?.from && periodA?.to ? externalData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                formatValue={formatValue}
                            />
                        </TabsContent>
                        <TabsContent value="region" className="mt-4">
                            <ComparisonTable
                                type="region"
                                dataA={comparisonMode === 'internal'
                                    ? (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])
                                    : (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                dataB={comparisonMode === 'internal'
                                    ? (periodB?.from && periodB?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodB.from!, end: periodB.to! })) : [])
                                    : (periodA?.from && periodA?.to ? externalData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                formatValue={formatValue}
                            />
                        </TabsContent>
                        <TabsContent value="category" className="mt-4">
                            <ComparisonTable
                                type="category"
                                dataA={comparisonMode === 'internal'
                                    ? (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])
                                    : (periodA?.from && periodA?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                dataB={comparisonMode === 'internal'
                                    ? (periodB?.from && periodB?.to ? mainData.filter(d => isWithinInterval(new Date(d.date), { start: periodB.from!, end: periodB.to! })) : [])
                                    : (periodA?.from && periodA?.to ? externalData.filter(d => isWithinInterval(new Date(d.date), { start: periodA.from!, end: periodA.to! })) : [])}
                                formatValue={formatValue}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Sub-components ---

function ComparisonTable({ type, dataA, dataB, formatValue }: {
    type: 'product' | 'region' | 'category',
    dataA: SalesDataRow[],
    dataB: SalesDataRow[],
    formatValue: (val: number, fmt: 'currency' | 'number' | 'percent') => string
}) {
    const [sortKey, setSortKey] = useState<'revenueA' | 'revenueB' | 'change'>('change');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const aggregated = useMemo(() => {
        const map = new Map<string, { id: string, name: string, revenueA: number, revenueB: number }>();

        const getKey = (row: SalesDataRow) => {
            if (type === 'product') return row.product_id;
            if (type === 'region') return row.region;
            return row.product_category;
        };

        const getName = (row: SalesDataRow) => {
            if (type === 'product') return row.product_id; // Or product name if available
            if (type === 'region') return row.region;
            return row.product_category;
        };

        dataA.forEach(row => {
            const key = getKey(row);
            if (!map.has(key)) map.set(key, { id: key, name: getName(row), revenueA: 0, revenueB: 0 });
            map.get(key)!.revenueA += row.revenue;
        });

        dataB.forEach(row => {
            const key = getKey(row);
            if (!map.has(key)) map.set(key, { id: key, name: getName(row), revenueA: 0, revenueB: 0 });
            map.get(key)!.revenueB += row.revenue;
        });

        return Array.from(map.values()).map(item => ({
            ...item,
            change: item.revenueA - item.revenueB,
            percentChange: item.revenueB !== 0 ? ((item.revenueA - item.revenueB) / item.revenueB) * 100 : (item.revenueA > 0 ? 100 : 0)
        }));
    }, [dataA, dataB, type]);

    const sorted = useMemo(() => {
        return [...aggregated].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });
    }, [aggregated, sortKey, sortDir]);

    const handleSort = (key: 'revenueA' | 'revenueB' | 'change') => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };


    const [limit, setLimit] = useState<number>(10);

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] capitalize">{type}</TableHead>
                            <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('revenueA')}>
                                Rev A {sortKey === 'revenueA' && (sortDir === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('revenueB')}>
                                Rev B {sortKey === 'revenueB' && (sortDir === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('change')}>
                                Change {sortKey === 'change' && (sortDir === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="text-right">% Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.slice(0, limit).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">{formatValue(item.revenueA, 'currency')}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{formatValue(item.revenueB, 'currency')}</TableCell>
                                <TableCell className={`text-right font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.change > 0 ? '+' : ''}{formatValue(item.change, 'currency')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.percentChange >= 0 ? 'outline' : 'destructive'} className={item.percentChange >= 0 ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                                        {item.percentChange > 0 ? '+' : ''}{item.percentChange.toFixed(1)}%
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sorted.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No data available for this comparison.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {sorted.length > 10 && (
                <div className="flex justify-center gap-2">
                    {limit < sorted.length && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => setLimit(prev => Math.min(prev + 10, sorted.length))}>
                                View More
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setLimit(sorted.length)}>
                                Show All
                            </Button>
                        </>
                    )}
                    {limit > 10 && (
                        <Button variant="ghost" size="sm" onClick={() => setLimit(10)}>
                            Show Less
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

function AIInsights({ metrics }: { metrics: ComparisonMetric[] }) {
    if (!metrics) return null;

    const revenue = metrics.find(m => m.label === 'Total Revenue');
    const sales = metrics.find(m => m.label === 'Units Sold');

    if (!revenue || !sales) return null;

    const isPositive = revenue.percentChange >= 0;
    const direction = isPositive ? 'increased' : 'decreased';

    return (
        <Card className="bg-muted/50 border-none">
            <CardContent className="pt-6 flex items-start gap-4">
                <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Performance Insight</h3>
                    <p className="text-muted-foreground">
                        Your revenue {direction} by <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(revenue.percentChange).toFixed(1)}%</span>
                        (from {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue.valueB)} to
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue.valueA)}),
                        while transaction volume {sales.percentChange >= 0 ? 'grew' : 'shrank'} by {Math.abs(sales.percentChange).toFixed(1)}%.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
