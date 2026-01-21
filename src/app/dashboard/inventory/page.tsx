'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package, AlertCircle, TrendingUp, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import useLocalStorage from '@/hooks/use-local-storage';
import { SalesDataRow } from '../page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type InventoryItem = {
    product_id: string;
    product_name: string; // Using category/subcategory as proxy if name not avail
    category: string;
    stock_level: number;
    reorder_point: number;
    unit_cost: number;
    total_sales_90d: number;
    daily_sales_velocity: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    is_overstocked: boolean;
    stock_to_sales_ratio: number;
};

type SalesDataStorage = {
    currentData: string;
    history: any[];
};

export default function InventoryPage() {
    const [salesStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
    const [visibleCount, setVisibleCount] = useState(10);

    // Helper to format currency (INR)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    useEffect(() => {
        if (!salesStorage.currentData) return;

        // Parse CSV with robust regex for quotes
        const lines = salesStorage.currentData.trim().split('\n');
        let headerIndex = 0;
        const firstLine = lines[0].trim();
        if (firstLine.toLowerCase().startsWith('company') || !firstLine.includes(',')) {
            headerIndex = 1;
        }

        if (lines.length < headerIndex + 2) return;

        const headers = lines[headerIndex].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));

        // Map headers to indices
        const idx = {
            id: headers.indexOf('product_id'),
            cat: headers.indexOf('product_category'),
            stock: headers.findIndex(h => h === 'stock_level' || h === 'stock'),
            reorder: headers.indexOf('reorder_point'),
            cost: headers.indexOf('unit_cost'),
            date: headers.indexOf('date'),
            sales: headers.findIndex(h => h === 'sales' || h === 'quantity'),
            revenue: headers.indexOf('revenue')
        };

        if (idx.id === -1) return; // Need product IDs

        const productMap = new Map<string, {
            stock: number;
            reorder: number;
            cost: number;
            cat: string;
            sales_90d: number;
            revenue_90d: number;
            latest_date: number;
        }>();

        // 1. First pass: Find the latest date in the dataset
        let maxDate = 0;
        lines.slice(headerIndex + 1).forEach(line => {
            if (!line.trim()) return;
            // Robust split
            const vals = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
            const dateStr = vals[idx.date]?.trim().replace(/^"|"$/g, '');
            if (dateStr) {
                const t = new Date(dateStr).getTime();
                if (!isNaN(t) && t > maxDate) maxDate = t;
            }
        });

        const latestDateObj = maxDate > 0 ? new Date(maxDate) : new Date();
        const ninetyDaysAgo = new Date(latestDateObj);
        ninetyDaysAgo.setDate(latestDateObj.getDate() - 90);

        // 2. Second pass: Process data
        lines.slice(headerIndex + 1).forEach(line => {
            if (!line.trim()) return;
            // Robust split
            const vals = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');

            // Helper to clean values
            const getVal = (i: number) => vals[i]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"');

            const pid = getVal(idx.id);
            if (!pid) return;

            const dateStr = getVal(idx.date);
            const date = dateStr ? new Date(dateStr).getTime() : 0;
            const sales = parseFloat(getVal(idx.sales)) || 0;
            const revenue = parseFloat(getVal(idx.revenue)) || 0;

            const current = productMap.get(pid) || {
                stock: 0, reorder: 0, cost: 0, cat: 'Unknown', sales_90d: 0, revenue_90d: 0, latest_date: 0
            };

            const rowStock = parseFloat(getVal(idx.stock));
            const rowReorder = parseFloat(getVal(idx.reorder));
            const rowCost = parseFloat(getVal(idx.cost));
            const rowCat = getVal(idx.cat);

            if (date >= current.latest_date) {
                if (!isNaN(rowStock)) current.stock = rowStock;
                if (!isNaN(rowReorder)) current.reorder = rowReorder;
                if (!isNaN(rowCost)) current.cost = rowCost;
                if (rowCat) current.cat = rowCat;
                current.latest_date = date;
            }

            // Aggregate sales for velocity calculation (Relative to dataset end)
            if (date >= ninetyDaysAgo.getTime()) {
                current.sales_90d += sales;
                current.revenue_90d += revenue;
            }

            productMap.set(pid, current);
        });

        const items: InventoryItem[] = Array.from(productMap.entries()).map(([pid, data]) => {
            const dailySales = data.sales_90d / 90;
            // Overstock logic: If stock > 90 days of supply
            const daysSupply = dailySales > 0 ? data.stock / dailySales : 999;
            const isOverstocked = daysSupply > 90 && data.stock > 0;

            // Stock to Sales Ratio: Avg Inventory Value / Net Sales
            // Simplified: Current Inventory Value / (90-day Sales Revenue * 4 for annualized)
            // Or just for the period: (Stock * Cost) / Revenue_90d
            const stockValue = data.stock * data.cost;
            const ratio = data.revenue_90d > 0 ? (stockValue / data.revenue_90d) : 0;

            let status: InventoryItem['status'] = 'In Stock';
            if (data.stock <= 0) status = 'Out of Stock';
            else if (data.stock <= data.reorder) status = 'Low Stock';

            return {
                product_id: pid,
                product_name: pid, // Could map to a name if available
                category: data.cat,
                stock_level: data.stock,
                reorder_point: data.reorder,
                unit_cost: data.cost,
                total_sales_90d: data.sales_90d,
                daily_sales_velocity: dailySales,
                status,
                is_overstocked: isOverstocked,
                stock_to_sales_ratio: ratio
            };
        });

        setInventoryData(items);

    }, [salesStorage]);

    const filteredItems = useMemo(() => {
        let items = inventoryData.filter(item => {
            const matchesSearch = item.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());

            // Strict Status Logic
            if (statusFilter === 'all') return matchesSearch;
            if (statusFilter === 'overstock') return matchesSearch && item.is_overstocked;

            // For standard statuses, match exact string
            // 'In Stock', 'Low Stock', 'Out of Stock'
            const normalizedStatus = item.status.toLowerCase().replace(/\s+/g, '-');
            return matchesSearch && normalizedStatus === statusFilter;
        });

        if (sortConfig) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return items;
    }, [inventoryData, searchTerm, statusFilter, sortConfig]);

    const handleSort = (key: keyof InventoryItem) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const SortIcon = ({ column }: { column: keyof InventoryItem }) => {
        if (sortConfig?.key !== column) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="ml-2 h-4 w-4 text-primary" />
            : <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
    };

    const metrics = useMemo(() => {
        const lowStock = inventoryData.filter(i => i.status === 'Low Stock').length;
        const outOfStock = inventoryData.filter(i => i.status === 'Out of Stock').length;
        const overstock = inventoryData.filter(i => i.is_overstocked).length;

        // Avg Stock to Sales Ratio
        const totalStockValue = inventoryData.reduce((acc, i) => acc + (i.stock_level * i.unit_cost), 0);
        const totalRevenue90d = inventoryData.reduce((acc, i) => acc + (i.unit_cost * i.total_sales_90d * 1.5), 0); // Approx revenue if not available
        // Better to use the ratio average or aggregate ratio? Aggregate is safer.
        // Let's just average the non-zero ratios for a "typical" product health metric
        const validRatios = inventoryData.filter(i => i.stock_to_sales_ratio > 0);
        const avgRatio = validRatios.length > 0
            ? validRatios.reduce((acc, i) => acc + i.stock_to_sales_ratio, 0) / validRatios.length
            : 0;

        return { lowStock, outOfStock, overstock, avgRatio };
    }, [inventoryData]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold md:text-3xl font-headline">Inventory & Stock Alerts</h1>
                <p className="text-muted-foreground">Monitor stock levels, identify risks, and optimize inventory health.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.lowStock}</div>
                        <p className="text-xs text-muted-foreground">Items below reorder point</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.outOfStock}</div>
                        <p className="text-xs text-muted-foreground">Items with 0 quantity</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overstock Alerts</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.overstock}</div>
                        <p className="text-xs text-muted-foreground">Excess inventory (&gt;90 days supply)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Stock-to-Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.avgRatio.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Efficiency ratio (Lower is better)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Detailed view of all products and their current health.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Items</SelectItem>
                                <SelectItem value="low-stock">Low Stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                <SelectItem value="in-stock">In Stock</SelectItem>
                                <SelectItem value="overstock">Overstocked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('stock_level')}>
                                        <div className="flex items-center justify-end">Stock Level <SortIcon column="stock_level" /></div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('reorder_point')}>
                                        <div className="flex items-center justify-end">Reorder Point <SortIcon column="reorder_point" /></div>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('daily_sales_velocity')}>
                                        <div className="flex items-center justify-end">Days Supply <SortIcon column="daily_sales_velocity" /></div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('stock_to_sales_ratio')}>
                                        <div className="flex items-center justify-end">Stock/Sales Ratio <SortIcon column="stock_to_sales_ratio" /></div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.slice(0, visibleCount).map((item) => (
                                        <TableRow key={item.product_id}>
                                            <TableCell className="font-medium">{item.product_id}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="text-right">{item.stock_level}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{item.reorder_point}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    item.status === 'Out of Stock' ? 'destructive' :
                                                        item.status === 'Low Stock' ? 'secondary' : // Using secondary (often yellow/gray) for warning, or custom class
                                                            'outline'
                                                } className={item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}>
                                                    {item.status}
                                                </Badge>
                                                {item.is_overstocked && (
                                                    <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700 bg-blue-50">
                                                        Overstock
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.daily_sales_velocity > 0
                                                    ? (item.stock_level / item.daily_sales_velocity).toFixed(0)
                                                    : '>999'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.stock_to_sales_ratio.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No products found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredItems.length > visibleCount && (
                        <div className="flex justify-center gap-4 mt-4">
                            <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 20)}>
                                View More <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="ghost" onClick={() => setVisibleCount(filteredItems.length)}>
                                View All ({filteredItems.length})
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
