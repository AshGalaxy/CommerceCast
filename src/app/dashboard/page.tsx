'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { DollarSign, ShoppingCart, Users, Activity, Filter, PieChart, TrendingUp, CreditCard, MapPin, RefreshCw, Database, Scale, Download } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { SalesOverTime } from '@/components/dashboard/sales-over-time';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { AIInsights } from '@/components/dashboard/ai-insights';
import useLocalStorage from '@/hooks/use-local-storage';
import { salesData as defaultSalesData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesByRegion } from '@/components/dashboard/sales-by-region';
import { SalesByAge } from '@/components/dashboard/sales-by-age';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { KPIDetailsDialog, KPIDetailData } from '@/components/dashboard/kpi-details-dialog';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';


export type SalesDataRow = {
  date: string;
  sales: number;
  revenue: number;
  product_id: string;
  product_category: string;
  product_subcategory: string;
  customer_id: string;
  region: string;
  sub_region: string;
  payment_method: string;
  unit_cost: number;
  promotion_id: string;
  customer_age: number;
  customer_gender: string;
  stock_level?: number;
  reorder_point?: number;
  [key: string]: any;
};

type SalesDataStorage = {
  currentData: string;
  history: any[];
};

const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const defaultSalesDataRows: SalesDataRow[] = defaultSalesData.map(d => ({
  ...d,
  date: new Date(2024, (allMonths.indexOf(d.name)), 1).toISOString().split('T')[0],
  product_id: 'default_prod',
  product_category: 'Default',
  product_subcategory: 'Default',
  customer_id: 'default_cust',
  region: 'Default',
  sub_region: 'Default',
  payment_method: 'Card',
  unit_cost: 0,
  promotion_id: 'N/A',
  customer_age: 0,
  customer_gender: 'N/A',
  stock_level: 100,
  reorder_point: 20
}));


function parseCsv(csv: string): { data: SalesDataRow[], companyName: string | null } {
  if (!csv) return { data: [], companyName: null };
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return { data: [], companyName: null };

  let companyName = null;
  let headerLineIndex = 0;

  // Check if first line is metadata (e.g. "Company Name: XYZ")
  const firstLine = lines[0].trim();
  // Simple heuristic: if it doesn't look like a header row (no commas or specific keywords)
  // or explicitly starts with "Company"
  if (firstLine.toLowerCase().startsWith('company') || !firstLine.includes(',')) {
    const parts = firstLine.split(':');
    if (parts.length > 1) {
      companyName = parts[1].trim();
    } else {
      companyName = firstLine.trim();
    }
    headerLineIndex = 1;
  }

  if (lines.length < headerLineIndex + 2) return { data: [], companyName };

  const headers = lines[headerLineIndex].split(',').map(h => h.trim().toLowerCase());
  const requiredHeaders = ['date', 'product_id'];
  const hasSales = headers.includes('sales') || headers.includes('quantity');

  if (!requiredHeaders.every(h => headers.includes(h)) || !hasSales) {
    console.warn("CSV headers are missing required columns (date, product_id, sales/quantity). Using default data.");
    return { data: [], companyName };
  }

  const salesHeader = headers.includes('sales') ? 'sales' : 'quantity';
  const unitPriceHeader = headers.find(h => h.includes('price')) || 'unit_price';


  const parsedData = lines.slice(headerLineIndex + 1).map(line => {
    if (!line.trim()) return null;
    const values = line.split(',');
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    const sales = parseFloat(row[salesHeader]) || 0;
    const revenue = parseFloat(row.revenue) || 0;
    const unitPrice = parseFloat(row[unitPriceHeader]) || 0;
    const stockLevel = parseFloat(row.stock_level || row.stock) || 0;
    const reorderPoint = parseFloat(row.reorder_point) || 0;

    return {
      date: row.date,
      sales: sales,
      revenue: revenue > 0 ? revenue : (sales * unitPrice),
      product_id: row.product_id,
      product_category: row.product_category || 'N/A',
      product_subcategory: row.product_subcategory || 'N/A',
      customer_id: row.customer_id || 'N/A',
      region: row.region || 'N/A',
      sub_region: row.sub_region || 'N/A',
      payment_method: row.payment_method || 'N/A',
      unit_cost: parseFloat(row.unit_cost) || 0,
      promotion_id: row.promotion_id || 'N/A',
      customer_age: parseInt(row.customer_age) || 0,
      customer_gender: row.customer_gender || 'N/A',
      stock_level: stockLevel,
      reorder_point: reorderPoint,
    };
  }).filter(item => item !== null && item.date && !isNaN(new Date(item.date).getTime())) as SalesDataRow[];

  return { data: parsedData, companyName };
}


function aggregateMonthly(data: SalesDataRow[]) {
  const monthlyData: Record<string, { name: string, sales: number, revenue: number }> = {};
  allMonths.forEach(month => {
    monthlyData[month] = { name: month, sales: 0, revenue: 0 };
  });

  data.forEach(item => {
    try {
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return;
      const month = allMonths[d.getUTCMonth()];
      if (monthlyData[month]) {
        monthlyData[month].sales += item.sales || 0;
        monthlyData[month].revenue += item.revenue || 0;
      }
    } catch (e) {
      // Ignore invalid dates
    }
  });

  return Object.values(monthlyData);
}

function aggregateSalesByGeneric(data: SalesDataRow[], key: keyof SalesDataRow) {
  if (!data || data.length === 0) return [];
  const regionSales = data.reduce((acc, item) => {
    const itemKey = item[key];
    if (itemKey && itemKey !== 'N/A') {
      if (!acc[itemKey]) {
        acc[itemKey] = { name: itemKey, value: 0 };
      }
      acc[itemKey].value += item.sales || 0;
    }
    return acc;
  }, {} as Record<string, { name: string, value: number }>);

  return Object.values(regionSales).sort((a, b) => b.value - a.value);
}


function getRecentSales(data: SalesDataRow[]) {
  if (!data || data.length === 0) return [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 500)
    .map((sale, index) => {
      const customerName = sale.customer_id && sale.customer_id !== 'N/A' ? sale.customer_id : 'Anonymous';
      // simple hash to get a unique number for picsum seed
      const seed = customerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
      return {
        name: customerName,
        gender: sale.customer_gender,
        age: sale.customer_age,
        category: sale.product_category,
        region: sale.region,
        date: sale.date,
        amount: formatCurrency(sale.revenue || 0),
        avatar: `https://picsum.photos/seed/${seed}/40/40`,
      }
    });
}


export default function DashboardPage() {
  const [salesStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
  const [dataSourceStatus, setDataSourceStatus] = useState<'sample' | 'synced'>('sample');
  const [companyName, setCompanyName] = useState<string | null>(null);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const [allData, setAllData] = useState<SalesDataRow[]>(defaultSalesDataRows);
  const [filteredData, setFilteredData] = useState<SalesDataRow[]>(defaultSalesDataRows);

  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [regionFilter, setRegionFilter] = useState('all');
  const [subregionFilter, setSubregionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  const [selectedKPI, setSelectedKPI] = useState<KPIDetailData | null>(null);
  const [isKPIDialogOpen, setIsKPIDialogOpen] = useState(false);

  // Customer Insights Calculations
  const [marketingSpend, setMarketingSpend] = useState<number>(0);
  const [fixedCosts, setFixedCosts] = useState<number>(0);



  const refreshData = useCallback((force: boolean = false) => {
    let currentData = salesStorage?.currentData;

    if (force) {
      try {
        const item = window.localStorage.getItem('sales-data');
        if (item) {
          const parsed = JSON.parse(item);
          currentData = parsed.currentData;
        }
      } catch (e) {
        console.error("Error forcing reload from local storage", e);
      }
    }

    let parsedData: SalesDataRow[] = [];
    let parsedCompanyName: string | null = null;
    if (currentData) {
      try {
        const result = parseCsv(currentData);
        parsedData = result.data;
        parsedCompanyName = result.companyName;
      } catch (error) {
        console.error("Failed to parse CSV data:", error);
        parsedData = [];
      }
    }

    if (parsedData.length > 0) {
      setAllData(parsedData);
      setDataSourceStatus('synced');
      setCompanyName(parsedCompanyName);
    } else {
      setAllData(defaultSalesDataRows);
      setDataSourceStatus('sample');
      setCompanyName(null);
    }
    setRegionFilter('all');
    setSubregionFilter('all');
    setCategoryFilter('all');
    setSubcategoryFilter('all');
    setPaymentMethodFilter('all');
    setTimeRangeFilter('all');
  }, [salesStorage]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    let data = allData;

    if (timeRangeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (timeRangeFilter === 'custom' && dateRange?.from && dateRange?.to) {
        data = data.filter(d => {
          const date = new Date(d.date);
          return date >= dateRange.from! && date <= dateRange.to!;
        });
      } else if (timeRangeFilter !== 'custom') {
        const days = parseInt(timeRangeFilter);
        filterDate.setDate(now.getDate() - days);
        data = data.filter(d => new Date(d.date) >= filterDate);
      }
    }

    if (regionFilter !== 'all') {
      data = data.filter(d => d.region === regionFilter);
    }
    if (subregionFilter !== 'all') {
      data = data.filter(d => d.sub_region === subregionFilter);
    }
    if (categoryFilter !== 'all') {
      data = data.filter(d => d.product_category === categoryFilter);
    }
    if (subcategoryFilter !== 'all') {
      data = data.filter(d => d.product_subcategory === subcategoryFilter);
    }
    if (paymentMethodFilter !== 'all') {
      data = data.filter(d => d.payment_method === paymentMethodFilter);
    }
    setFilteredData(data);
  }, [regionFilter, subregionFilter, categoryFilter, subcategoryFilter, paymentMethodFilter, timeRangeFilter, dateRange?.from, dateRange?.to, allData]);

  const { regions, subregions, categories, subcategories, paymentMethods } = useMemo(() => {
    const regionSet = new Set<string>();
    const subregionSet = new Set<string>();
    const categorySet = new Set<string>();
    const subcategorySet = new Set<string>();
    const paymentMethodSet = new Set<string>();

    allData.forEach(d => {
      if (d.region && d.region !== 'N/A') regionSet.add(d.region);
      if (d.sub_region && d.sub_region !== 'N/A') subregionSet.add(d.sub_region);
      if (d.product_category && d.product_category !== 'N/A') categorySet.add(d.product_category);
      if (d.product_subcategory && d.product_subcategory !== 'N/A') subcategorySet.add(d.product_subcategory);
      if (d.payment_method && d.payment_method !== 'N/A') paymentMethodSet.add(d.payment_method);
    });
    return {
      regions: ['all', ...Array.from(regionSet)],
      subregions: ['all', ...Array.from(subregionSet)],
      categories: ['all', ...Array.from(categorySet)],
      subcategories: ['all', ...Array.from(subcategorySet)],
      paymentMethods: ['all', ...Array.from(paymentMethodSet)]
    };
  }, [allData]);

  const { totalRevenue, totalSales, customerIds, transactionCount } = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      acc.totalRevenue += item.revenue || 0;
      acc.totalSales += item.sales || 0;
      if (item.customer_id && item.customer_id !== 'N/A') acc.customerIds.add(item.customer_id);
      acc.transactionCount += 1;
      return acc;
    }, { totalRevenue: 0, totalSales: 0, customerIds: new Set() as Set<string>, transactionCount: 0 });
  }, [filteredData]);

  const newCustomers = customerIds.size;
  const averageSaleValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;

  const salesOverTimeData = useMemo(() => aggregateMonthly(filteredData), [filteredData]);
  const salesByRegionData = useMemo(() => aggregateSalesByGeneric(filteredData, 'region'), [filteredData]);
  const salesBySubRegionData = useMemo(() => aggregateSalesByGeneric(filteredData, 'sub_region'), [filteredData]);
  const paymentMethodData = useMemo(() => aggregateSalesByGeneric(filteredData, 'payment_method'), [filteredData]);
  const recentSales = useMemo(() => getRecentSales(filteredData), [filteredData]);

  const salesByGenderData = useMemo(() => aggregateSalesByGeneric(filteredData, 'customer_gender'), [filteredData]);

  const salesByAgeGroupData = useMemo(() => {
    if (filteredData.length === 0) return [];

    const ageGroups: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '55+': 0
    };

    filteredData.forEach(item => {
      const age = item.customer_age;
      if (age) {
        if (age >= 18 && age <= 25) ageGroups['18-25'] += item.sales || 0;
        else if (age >= 26 && age <= 35) ageGroups['26-35'] += item.sales || 0;
        else if (age >= 36 && age <= 45) ageGroups['36-45'] += item.sales || 0;
        else if (age >= 46 && age <= 55) ageGroups['46-55'] += item.sales || 0;
        else if (age > 55) ageGroups['55+'] += item.sales || 0;
      }
    });

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const customerInsights = useMemo(() => {
    if (filteredData.length === 0) return { clv: 0, repeatRate: 0, churnRate: 0, frequency: 0, cac: 0 };

    const uniqueCustomers = new Set(filteredData.map(d => d.customer_id));
    const totalCustomers = uniqueCustomers.size;

    // CLV
    const clv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Repeat Rate & Frequency
    const customerCounts = filteredData.reduce((acc, curr) => {
      acc[curr.customer_id] = (acc[curr.customer_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    const frequency = totalCustomers > 0 ? filteredData.length / totalCustomers : 0;

    // Churn Rate (Simplified: Active in last 90 days but not last 30)
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const activeRecent = new Set(filteredData.filter(d => new Date(d.date) >= thirtyDaysAgo).map(d => d.customer_id));
    const inactiveCount = totalCustomers - activeRecent.size;
    const churnRate = totalCustomers > 0 ? (inactiveCount / totalCustomers) * 100 : 0;

    // CAC
    const newCustomers = filteredData.filter(d => {
      const date = new Date(d.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    }).map(d => d.customer_id).filter((v, i, a) => a.indexOf(v) === i).length;

    const cac = newCustomers > 0 ? marketingSpend / newCustomers : 0;

    return { clv, repeatRate, frequency, churnRate, cac };
  }, [filteredData, totalRevenue, marketingSpend]);

  const handleKPIClick = (kpi: string) => {
    let data: KPIDetailData | null = null;

    // Helper to get growth
    const getGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    if (kpi === 'revenue') {
      const topProducts = aggregateSalesByGeneric(filteredData, 'product_id').slice(0, 5);
      const bottomProducts = aggregateSalesByGeneric(filteredData, 'product_id').reverse().slice(0, 5);
      const topCategories = aggregateSalesByGeneric(filteredData, 'product_category').slice(0, 5);

      data = {
        title: 'Total Revenue',
        value: formatCurrency(totalRevenue),
        formula: 'Sum of (Sales * Unit Price) for all records in the selected period.',
        sections: [
          {
            title: 'Top 5 Products by Revenue',
            items: topProducts.map(p => ({ label: p.name, value: formatCurrency(p.value), trend: 'up' }))
          },
          {
            title: 'Top 5 Categories by Revenue',
            items: topCategories.map(c => ({ label: c.name, value: formatCurrency(c.value), trend: 'up' }))
          },
          {
            title: 'Bottom 5 Products (Needs Attention)',
            items: bottomProducts.map(p => ({ label: p.name, value: formatCurrency(p.value), trend: 'down' }))
          }
        ]
      };
    } else if (kpi === 'sales') {
      const topRegions = aggregateSalesByGeneric(filteredData, 'region').slice(0, 5);
      const topProducts = aggregateSalesByGeneric(filteredData, 'product_id').slice(0, 5);

      data = {
        title: 'Total Sales',
        value: `+${totalSales.toLocaleString()}`,
        formula: 'Sum of Sales Quantity for all records in the selected period.',
        sections: [
          {
            title: 'Top 5 Regions by Sales',
            items: topRegions.map(r => ({ label: r.name, value: `${r.value} units`, trend: 'up' }))
          },
          {
            title: 'Top 5 Products by Volume',
            items: topProducts.map(p => ({ label: p.name, value: `${p.value} units`, trend: 'up' }))
          }
        ]
      };
    } else if (kpi === 'customers') {
      const topRegions = aggregateSalesByGeneric(filteredData, 'region').slice(0, 5);

      data = {
        title: 'New Customers',
        value: `+${newCustomers.toLocaleString()}`,
        formula: 'Count of unique Customer IDs in the selected period.',
        sections: [
          {
            title: 'Top Regions by Customer Activity',
            items: topRegions.map(r => ({ label: r.name, value: `${r.value} sales`, trend: 'up' }))
          }
        ]
      };
    } else if (kpi === 'avg_sale') {
      const topCategories = categories.slice(1).map(c => {
        const catData = filteredData.filter(d => d.product_category === c);
        const rev = catData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
        return { label: c, value: rev };
      }).sort((a, b) => b.value - a.value).slice(0, 5);

      data = {
        title: 'Avg. Sale Value',
        value: formatCurrency(averageSaleValue),
        formula: 'Total Revenue / Total Number of Transactions.',
        sections: [
          {
            title: 'Revenue by Category',
            items: topCategories.map(c => ({ label: c.label, value: formatCurrency(c.value) }))
          }
        ]
      };
    } else if (kpi === 'transactions') {
      const topMethods = aggregateSalesByGeneric(filteredData, 'payment_method');
      const methodCounts = filteredData.reduce((acc, item) => {
        const method = item.payment_method || 'Unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedMethods = Object.entries(methodCounts)
        .map(([k, v]) => ({ label: k, value: `${v}` }))
        .sort((a, b) => parseInt(b.value) - parseInt(a.value));

      data = {
        title: 'Total Transactions',
        value: `${transactionCount.toLocaleString()}`,
        formula: 'Count of total rows/records in the dataset.',
        sections: [
          {
            title: 'Transactions by Payment Method',
            items: sortedMethods
          }
        ]
      };
    } else if (kpi === 'clv') {
      data = {
        title: 'Customer Lifetime Value (CLV)',
        value: formatCurrency(customerInsights.clv),
        formula: 'Total Revenue / Total Unique Customers',
        sections: [
          {
            title: 'Insight',
            items: [{ label: 'Average Revenue per Customer', value: formatCurrency(customerInsights.clv) }]
          }
        ]
      };
    } else if (kpi === 'repeat_rate') {
      data = {
        title: 'Repeat Customer Rate',
        value: `${customerInsights.repeatRate.toFixed(1)}%`,
        formula: '(Customers with > 1 Purchase / Total Customers) * 100',
        sections: [
          {
            title: 'Insight',
            items: [{ label: 'Returning Customers', value: `${customerInsights.repeatRate.toFixed(1)}%` }]
          }
        ]
      };
    } else if (kpi === 'frequency') {
      data = {
        title: 'Order Frequency',
        value: customerInsights.frequency.toFixed(2),
        formula: 'Total Transactions / Total Unique Customers',
        sections: [
          {
            title: 'Insight',
            items: [{ label: 'Avg Orders per Customer', value: customerInsights.frequency.toFixed(2) }]
          }
        ]
      };
    } else if (kpi === 'churn') {
      data = {
        title: 'Churn Rate (30d)',
        value: `${customerInsights.churnRate.toFixed(1)}%`,
        formula: '(Inactive Customers (last 30d) / Total Customers) * 100',
        sections: [
          {
            title: 'Insight',
            items: [{ label: 'Inactive Customers', value: `${customerInsights.churnRate.toFixed(1)}%` }]
          }
        ]
      };
    } else if (kpi === 'cac') {
      data = {
        title: 'Customer Acquisition Cost (CAC)',
        value: formatCurrency(customerInsights.cac),
        formula: 'Marketing Spend / New Customers',
        sections: [
          {
            title: 'Inputs',
            items: [
              { label: 'Marketing Spend', value: formatCurrency(marketingSpend) },
              { label: 'New Customers', value: `${newCustomers}` }
            ]
          }
        ]
      };
    } else if (kpi === 'gross_margin') {
      const totalCost = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
      const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
      data = {
        title: 'Gross Profit Margin',
        value: `${margin.toFixed(1)}%`,
        formula: '((Total Revenue - Total Cost) / Total Revenue) * 100',
        sections: [
          {
            title: 'Breakdown',
            items: [
              { label: 'Total Revenue', value: formatCurrency(totalRevenue) },
              { label: 'Total Cost (COGS)', value: formatCurrency(totalCost) }
            ]
          }
        ]
      };
    } else if (kpi === 'cogs') {
      const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
      data = {
        title: 'Cost of Goods Sold (COGS)',
        value: formatCurrency(cogs),
        formula: 'Sum of (Quantity Sold * Unit Cost)',
        sections: [
          {
            title: 'Insight',
            items: [{ label: 'Total Product Cost', value: formatCurrency(cogs) }]
          }
        ]
      };
    } else if (kpi === 'gross_profit') {
      const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
      data = {
        title: 'Gross Profit',
        value: formatCurrency(totalRevenue - cogs),
        formula: 'Total Revenue - COGS',
        sections: [
          {
            title: 'Breakdown',
            items: [
              { label: 'Revenue', value: formatCurrency(totalRevenue) },
              { label: 'COGS', value: formatCurrency(cogs) }
            ]
          }
        ]
      };
    } else if (kpi === 'net_profit') {
      const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
      const grossProfit = totalRevenue - cogs;
      const netProfit = grossProfit - marketingSpend - fixedCosts;
      data = {
        title: 'Net Profit',
        value: formatCurrency(netProfit),
        formula: 'Gross Profit - Marketing Spend - Fixed Costs',
        sections: [
          {
            title: 'Waterfall',
            items: [
              { label: 'Gross Profit', value: formatCurrency(grossProfit) },
              { label: 'Marketing Spend', value: `-${formatCurrency(marketingSpend)}` },
              { label: 'Fixed Costs', value: `-${formatCurrency(fixedCosts)}` }
            ]
          }
        ]
      };
    } else if (kpi === 'break_even') {
      const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
      const grossMargin = totalRevenue > 0 ? (totalRevenue - cogs) / totalRevenue : 0;
      const totalFixed = marketingSpend + fixedCosts;
      const breakEvenRevenue = grossMargin > 0 ? totalFixed / grossMargin : 0;
      data = {
        title: 'Break-Even Revenue',
        value: formatCurrency(breakEvenRevenue),
        formula: '(Fixed Costs + Marketing Spend) / Gross Margin %',
        sections: [
          {
            title: 'Inputs',
            items: [
              { label: 'Total Fixed Expenses', value: formatCurrency(totalFixed) },
              { label: 'Gross Margin', value: `${(grossMargin * 100).toFixed(1)}%` }
            ]
          }
        ]
      };
    }

    if (data) {
      setSelectedKPI(data);
      setIsKPIDialogOpen(true);
    }
  };

  const handleExportDashboardData = () => {
    if (!filteredData || filteredData.length === 0) return;

    // Use centralized export utility
    import('@/utils/export-utils').then(({ exportToCSV }) => {
      exportToCSV(filteredData, `dashboard_export_${new Date().toISOString().split('T')[0]}`);
    });
  };




  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className='flex flex-col'>
          <h1 className="text-2xl font-semibold md:text-3xl font-headline">
            {companyName ? `${companyName} Dashboard` : 'Dashboard'}
          </h1>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Database className="h-4 w-4" />
            <span>Data Status:</span>
            <span className={`font-semibold ${dataSourceStatus === 'synced' ? 'text-green-600' : 'text-amber-600'}`}>
              {dataSourceStatus === 'synced' ? 'Synced with uploaded data' : 'Showing sample data'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportDashboardData}>
            <Download className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => refreshData(true)}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
          <AIInsights dashboardData={filteredData} />
        </div>
      </div>

      <Card>
        <div className="p-4 flex flex-col md:flex-row items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filters
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full'>
            <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by time..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 365 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {timeRangeFilter === 'custom' && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-2">
                <DateRangePicker date={dateRange} setDate={setDateRange} className="w-full" />
              </div>
            )}
            <Select value={regionFilter} onValueChange={setRegionFilter} disabled={regions.length <= 2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by region..." />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'All Regions' : r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subregionFilter} onValueChange={setSubregionFilter} disabled={subregions.length <= 2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by sub-region..." />
              </SelectTrigger>
              <SelectContent>
                {subregions.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'All Sub-regions' : r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categories.length <= 2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter} disabled={subcategories.length <= 2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by sub-category..." />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Sub-categories' : c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter} disabled={paymentMethods.length <= 2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by payment..." />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Payment Methods' : c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total Revenue"
          value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
          description="+20.1% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          onClick={() => handleKPIClick('revenue')}
        />
        <KpiCard
          title="Total Sales"
          value={`+${totalSales.toLocaleString()}`}
          description="+180.1% from last month"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          onClick={() => handleKPIClick('sales')}
        />
        <KpiCard
          title="New Customers"
          value={`+${newCustomers.toLocaleString()}`}
          description="+201 since last month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          onClick={() => handleKPIClick('customers')}
        />
        <KpiCard
          title="Avg. Sale Value"
          value={`₹${averageSaleValue.toFixed(2)}`}
          description="Average value per transaction"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          onClick={() => handleKPIClick('avg_sale')}
        />
        <KpiCard
          title="Total Transactions"
          value={`${transactionCount.toLocaleString()}`}
          description="Total number of sales transactions"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          onClick={() => handleKPIClick('transactions')}
        />
      </div>



      {/* Customer Insights Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Deep dive into customer behavior and value.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => handleKPIClick('clv')}>
                <span className="text-sm font-medium text-muted-foreground">Lifetime Value (CLV)</span>
                <span className="text-2xl font-bold">{formatCurrency(customerInsights.clv)}</span>
                <span className="text-xs text-muted-foreground">Avg revenue per customer</span>
              </div>
              <div className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => handleKPIClick('repeat_rate')}>
                <span className="text-sm font-medium text-muted-foreground">Repeat Rate</span>
                <span className="text-2xl font-bold">{customerInsights.repeatRate.toFixed(1)}%</span>
                <span className="text-xs text-muted-foreground">Returning customers</span>
              </div>
              <div className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => handleKPIClick('frequency')}>
                <span className="text-sm font-medium text-muted-foreground">Order Frequency</span>
                <span className="text-2xl font-bold">{customerInsights.frequency.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">Orders per customer</span>
              </div>
              <div className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => handleKPIClick('churn')}>
                <span className="text-sm font-medium text-muted-foreground">Churn Rate (30d)</span>
                <span className="text-2xl font-bold">{customerInsights.churnRate.toFixed(1)}%</span>
                <span className="text-xs text-muted-foreground">Inactive in last 30 days</span>
              </div>
              <div className="flex flex-col space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => handleKPIClick('cac')}>
                <span className="text-sm font-medium text-muted-foreground">Acquisition Cost (CAC)</span>
                <span className="text-2xl font-bold">{formatCurrency(customerInsights.cac)}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    type="number"
                    placeholder="Mktg Spend"
                    className="h-6 w-24 text-xs"
                    value={marketingSpend || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketingSpend(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-muted-foreground">Input Spend</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleKPIClick('gross_margin')}>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Profitability and inventory efficiency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Gross Profit Margin</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const totalCost = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
                      const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
                      return `${margin.toFixed(1)}%`;
                    })()}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-700" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Calculated as (Revenue - Cost) / Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Slow Moving Inventory</CardTitle>
            <CardDescription>Items with high stock but NO sales in the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                // 1. Get latest stock for all products
                const productStock = new Map<string, number>();
                allData.forEach(item => {
                  if (item.stock_level !== undefined) {
                    productStock.set(item.product_id, item.stock_level);
                  }
                });

                // 2. Get sales in current period
                const productSales = new Set<string>();
                filteredData.forEach(item => productSales.add(item.product_id));

                // 3. Find slow moving (Stock > 0 AND Not in Sales)
                const slowMoving: { id: string, stock: number }[] = [];
                productStock.forEach((stock, id) => {
                  if (stock > 0 && !productSales.has(id)) {
                    slowMoving.push({ id, stock });
                  }
                });

                const topSlow = slowMoving.sort((a, b) => b.stock - a.stock).slice(0, 5);

                if (topSlow.length === 0) {
                  return <p className="text-sm text-muted-foreground">No slow-moving items found in this period.</p>;
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {topSlow.map(item => (
                      <div key={item.id} className="flex flex-col p-3 border rounded-lg bg-muted/50">
                        <span className="font-medium text-sm truncate" title={item.id}>{item.id}</span>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-xs text-muted-foreground">Stock</span>
                          <span className="font-bold text-amber-600">{item.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleKPIClick('cogs')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COGS</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
                return formatCurrency(cogs);
              })()}
            </div>
            <p className="text-xs text-muted-foreground">Cost of Goods Sold</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleKPIClick('gross_profit')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
                return formatCurrency(totalRevenue - cogs);
              })()}
            </div>
            <p className="text-xs text-muted-foreground">Revenue - COGS</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleKPIClick('net_profit')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
                const grossProfit = totalRevenue - cogs;
                const netProfit = grossProfit - marketingSpend - fixedCosts;
                return formatCurrency(netProfit);
              })()}
            </div>
            <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
              <Input
                type="number"
                placeholder="Fixed Costs"
                className="h-6 w-24 text-xs"
                value={fixedCosts || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFixedCosts(parseFloat(e.target.value) || 0)}
              />
              <span className="text-[10px] text-muted-foreground">Fixed Costs</span>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleKPIClick('break_even')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break-Even</CardTitle>
            <Scale className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {(() => {
                const cogs = filteredData.reduce((acc, item) => acc + (item.sales * (item.unit_cost || 0)), 0);
                const grossMargin = totalRevenue > 0 ? (totalRevenue - cogs) / totalRevenue : 0;
                const totalFixed = marketingSpend + fixedCosts;

                if (grossMargin <= 0) return "Negative Margin";
                if (totalFixed <= 0) return "No Fixed Costs";

                const breakEvenRevenue = totalFixed / grossMargin;
                return `Need ${formatCurrency(breakEvenRevenue)} Rev`;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">To cover all costs</p>
          </CardContent>
        </Card>
      </div>

      <KPIDetailsDialog
        isOpen={isKPIDialogOpen}
        onClose={() => setIsKPIDialogOpen(false)}
        data={selectedKPI}
      />
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesOverTime
            title="Sales & Revenue Over Time"
            description="Aggregated from your data"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            data={salesOverTimeData}
          />
        </div>
        <div className="lg:col-span-3">
          {salesByRegionData.length > 0 ? (
            <SalesByRegion
              title="Sales by Region"
              description="This month's sales distribution by region."
              icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
              data={salesByRegionData}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
                <CardDescription>No regional data available to display.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[250px]">
                <p className="text-muted-foreground">No data</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {salesBySubRegionData.length > 0 ? (
          <SalesByRegion
            title="Sales by Sub-Region"
            description="Distribution of sales by sub-region."
            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            data={salesBySubRegionData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sales by Sub-Region</CardTitle>
            </CardHeader>
            <CardContent className='flex items-center justify-center min-h-[200px]'>
              <p className="text-muted-foreground">No sub-region data to display.</p>
            </CardContent>
          </Card>
        )}
        {paymentMethodData.length > 0 ? (
          <SalesByRegion
            title="Sales by Payment Method"
            description="Distribution of sales by payment method."
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            data={paymentMethodData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No payment method data to display.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {salesByGenderData.length > 0 ? (
          <SalesByRegion
            title="Sales by Gender"
            description="Distribution of sales by customer gender."
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            data={salesByGenderData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sales by Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No gender data available.</p>
            </CardContent>
          </Card>
        )}

        {salesByAgeGroupData.length > 0 ? (
          <SalesByAge
            title="Sales by Age Group"
            description="Distribution of sales across age groups."
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            data={salesByAgeGroupData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sales by Age Group</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No age data available.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6">
        {recentSales && recentSales.length > 0 ? (
          <RecentSales
            title="Recent Sales"
            description={`Your last ${recentSales.length} transactions.`}
            data={recentSales}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent sales data to display.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Calculations</CardTitle>
          <CardDescription>How your dashboard metrics are calculated from the uploaded data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Main KPIs</AccordionTrigger>
              <AccordionContent>
                <ul className='list-disc space-y-2 pl-4 text-muted-foreground'>
                  <li><strong>Total Revenue:</strong> The sum of all values in the `revenue` column. If not present, it's calculated by multiplying `sales`/`quantity` by `unit_price`.</li>
                  <li><strong>Total Sales:</strong> The sum of all values in the `sales` or `quantity` column.</li>
                  <li><strong>New Customers:</strong> A count of unique `customer_id` values found in your data.</li>
                  <li><strong>Avg. Sale Value:</strong> Calculated as `Total Revenue` divided by the total number of sales records (transactions).</li>
                  <li><strong>Total Transactions:</strong> The total count of rows or sales records in your data.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Customer Insights</AccordionTrigger>
              <AccordionContent>
                <ul className='list-disc space-y-2 pl-4 text-muted-foreground'>
                  <li><strong>Lifetime Value (CLV):</strong> Total Revenue divided by the total number of unique customers. Represents the average revenue generated per customer.</li>
                  <li><strong>Repeat Rate:</strong> The percentage of customers who have made more than one purchase. Calculated as (Customers with &gt; 1 transaction / Total Customers) * 100.</li>
                  <li><strong>Order Frequency:</strong> The average number of orders per customer. Calculated as Total Transactions / Total Customers.</li>
                  <li><strong>Churn Rate (30d):</strong> The percentage of customers who haven't made a purchase in the last 30 days.</li>
                  <li><strong>Acquisition Cost (CAC):</strong> Marketing Spend (input by you) divided by the number of New Customers.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Product Performance</AccordionTrigger>
              <AccordionContent>
                <ul className='list-disc space-y-2 pl-4 text-muted-foreground'>
                  <li><strong>Gross Profit Margin:</strong> The percentage of revenue that exceeds the Cost of Goods Sold (COGS). Calculated as ((Revenue - COGS) / Revenue) * 100.</li>
                  <li><strong>Slow Moving Inventory:</strong> Identifies products that have stock remaining (`stock_level` &gt; 0) but have recorded NO sales in the selected time period.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Financial Health</AccordionTrigger>
              <AccordionContent>
                <ul className='list-disc space-y-2 pl-4 text-muted-foreground'>
                  <li><strong>COGS (Cost of Goods Sold):</strong> The total direct costs of producing the goods sold. Calculated as Sum of (Sales Quantity * Unit Cost).</li>
                  <li><strong>Gross Profit:</strong> Total Revenue minus COGS. Represents the profit made before deducting overheads.</li>
                  <li><strong>Net Profit:</strong> Gross Profit minus Marketing Spend and Fixed Costs (input by you). The actual profit after all expenses.</li>
                  <li><strong>Break-Even Point:</strong> The amount of revenue needed to cover all fixed costs (Marketing + Fixed Costs). Calculated as Total Fixed Costs / Gross Margin %.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Charts and Graphs</AccordionTrigger>
              <AccordionContent>
                <ul className='list-disc space-y-2 pl-4 text-muted-foreground'>
                  <li><strong>Sales & Revenue Over Time:</strong> Data is grouped by month. `Sales` is the sum of units sold per month, and `Revenue` is the sum of revenue per month.</li>
                  <li><strong>Sales by Region / Sub-Region:</strong> Sales are grouped by the `region` or `sub_region` column and summed up to show distribution.</li>
                  <li><strong>Sales by Gender:</strong> Shows the distribution of total sales volume across different customer genders (`customer_gender`).</li>
                  <li><strong>Sales by Age Group:</strong> Aggregates sales into age brackets (18-25, 26-35, 36-45, 46-55, 55+) based on `customer_age`.</li>
                  <li><strong>Sales by Payment Method:</strong> Sales are grouped by the `payment_method` column and summed up to show distribution.</li>
                  <li><strong>Recent Sales:</strong> A list of the latest transactions, showing customer details, amount, and other metadata. You can view up to the top 500 recent sales.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div >
  );
}
