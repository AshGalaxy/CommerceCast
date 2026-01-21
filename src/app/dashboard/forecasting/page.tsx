'use client';

import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Bot, Loader2, Database, Wand2, Download } from 'lucide-react';
import {
  forecastDemand,
  type ForecastDemandInput,
  type ForecastDemandOutput,
  recommendModel,
  type ForecastModel,
} from '@/ai/flows/ai-powered-demand-forecasting';
import { getPythonForecast, compareModels, type ComparisonResult } from '@/actions/forecast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import useLocalStorage from '@/hooks/use-local-storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
2024-01-10,305,prod_B,Clothing,South
2024-01-11,320,prod_A,Electronics,North
2024-01-12,315,prod_B,Clothing,South
2024-01-13,330,prod_C,Groceries,West
2024-01-14,340,prod_A,Electronics,East
2024-01-15,350,prod_B,Clothing,South
2024-01-16,360,prod_A,Electronics,North
2024-01-17,355,prod_C,Groceries,West
2024-01-18,370,prod_B,Clothing,South
2024-01-19,380,prod_A,Electronics,East
2024-01-20,375,prod_C,Groceries,West
2024-01-21,390,prod_A,Electronics,North
2024-01-22,400,prod_B,Clothing,South
2024-01-23,410,prod_C,Groceries,West
2024-01-24,420,prod_A,Electronics,East
2024-01-25,415,prod_B,Clothing,South
2024-01-26,430,prod_A,Electronics,North
2024-01-27,440,prod_C,Groceries,West
2024-01-28,450,prod_B,Clothing,South
2024-01-29,460,prod_A,Electronics,East
2024-01-30,455,prod_C,Groceries,West
2024-01-31,470,prod_A,Electronics,North
2024-02-01,480,prod_B,Clothing,South
2024-02-02,490,prod_C,Groceries,West
2024-02-03,500,prod_A,Electronics,East
2024-02-04,510,prod_B,Clothing,South
2024-02-05,520,prod_A,Electronics,North
2024-02-06,530,prod_C,Groceries,West
2024-02-07,540,prod_B,Clothing,South
2024-02-08,550,prod_A,Electronics,East
2024-02-09,560,prod_C,Groceries,West
2024-02-10,570,prod_A,Electronics,North
2024-02-11,580,prod_B,Clothing,South
2024-02-12,590,prod_C,Groceries,West
2024-02-13,600,prod_A,Electronics,East
2024-02-14,610,prod_B,Clothing,South
2024-02-15,620,prod_A,Electronics,North
2024-02-16,630,prod_C,Groceries,West
2024-02-17,640,prod_B,Clothing,South
2024-02-18,650,prod_A,Electronics,East
2024-02-19,660,prod_C,Groceries,West
2024-02-20,670,prod_A,Electronics,North
2024-02-21,680,prod_B,Clothing,South
2024-02-22,690,prod_C,Groceries,West
2024-02-23,700,prod_A,Electronics,East
2024-02-24,710,prod_B,Clothing,South
2024-02-25,720,prod_A,Electronics,North
2024-02-26,730,prod_C,Groceries,West
2024-02-27,740,prod_B,Clothing,South
2024-02-28,750,prod_A,Electronics,East
2024-02-29,760,prod_C,Groceries,West
2024-03-01,770,prod_A,Electronics,North
2024-03-02,780,prod_B,Clothing,South
2024-03-03,790,prod_C,Groceries,West
2024-03-04,800,prod_A,Electronics,East
2024-03-05,810,prod_B,Clothing,South
2024-03-06,820,prod_A,Electronics,North
2024-03-07,830,prod_C,Groceries,West
2024-03-08,840,prod_B,Clothing,South
2024-03-09,850,prod_A,Electronics,East
2024-03-10,860,prod_C,Groceries,West`;

type SalesRecord = {
  date: string;
  sales?: number;
  predicted_sales?: number;
  quantity?: number;
  [key: string]: any;
};

type SalesDataStorage = {
  currentData: string;
  history: any[];
};

type ForecastDataStorage = {
  forecastData: string;
}


function parseCsvToJson(csv: string): SalesRecord[] {
  if (!csv) return [];
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  let headerIndex = 0;
  // Check for metadata row (e.g., "Company Name: ...")
  const firstLine = lines[0].trim();
  if (firstLine.toLowerCase().startsWith('company') || !firstLine.includes(',')) {
    headerIndex = 1;
  }

  if (lines.length < headerIndex + 2) return [];

  const headers = lines[headerIndex].split(',').map((h) => h.trim());

  return lines
    .slice(headerIndex + 1)
    .map((line) => {
      if (!line.trim()) return null;
      const values = line.split(',');
      const obj: SalesRecord = { date: '' };
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, '_');
        const value = values[index]?.trim() || '';
        if (
          key === 'sales' ||
          key === 'quantity' ||
          key === 'predicted_sales' ||
          key === 'revenue' ||
          key === 'unit_cost' ||
          key === 'stock_level'
        ) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) obj[key] = numValue;
          else if (key === 'stock_level') obj[key] = 0; // Default stock to 0 if invalid
        } else {
          obj[key] = value;
        }
      });
      return obj.date ? obj : null;
    })
    .filter((item): item is SalesRecord => item !== null && !!item.date);
}


function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return format(date, 'yyyy-MM-dd');
  }
  // Try parsing DD-MM-YYYY manually
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    // Assume DD-MM-YYYY if first part > 12 or if year is last
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      // Simple heuristic: if year is last (4 digits), assume DD-MM-YYYY or MM-DD-YYYY
      if (parts[2].length === 4) {
        const dateObj = new Date(y, m - 1, d);
        if (!isNaN(dateObj.getTime())) return format(dateObj, 'yyyy-MM-dd');
      }
    }
  }
  return dateStr; // Fallback
}

function aggregateData(data: SalesRecord[], periodInDays: number): SalesRecord[] {
  // Always normalize first
  const normalizedData = data.map(d => ({ ...d, date: normalizeDate(d.date) })).filter(d => d.date);

  if (periodInDays <= 1) {
    // If daily, just sum up sales for the same day (handles duplicate dates)
    const dailyAggregated: Record<string, SalesRecord> = {};
    normalizedData.forEach((record) => {
      const key = record.date;
      if (!dailyAggregated[key]) {
        dailyAggregated[key] = { ...record, sales: 0 };
      }
      dailyAggregated[key].sales! += record.sales || record.quantity || 0;
    });

    // Fill in missing dates with 0 sales
    const sortedDates = Object.keys(dailyAggregated).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    if (sortedDates.length > 0) {
      const startDate = new Date(sortedDates[0]);
      const endDate = new Date(sortedDates[sortedDates.length - 1]);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = format(d, 'yyyy-MM-dd');
        if (!dailyAggregated[dateStr]) {
          dailyAggregated[dateStr] = { date: dateStr, sales: 0 };
        }
      }
    }

    return Object.values(dailyAggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  if (normalizedData.length === 0) return [];

  const sortedData = normalizedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const aggregated: Record<string, SalesRecord> = {};
  const firstDate = new Date(sortedData[0].date);

  sortedData.forEach((record) => {
    try {
      const d = new Date(record.date);
      if (isNaN(d.getTime())) return;

      const timeDiff = d.getTime() - firstDate.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      const periodIndex = Math.floor(dayDiff / periodInDays);

      const periodStartDate = new Date(firstDate);
      periodStartDate.setDate(firstDate.getDate() + periodIndex * periodInDays);

      const key = format(periodStartDate, 'yyyy-MM-dd');

      if (!aggregated[key]) {
        aggregated[key] = {
          date: key,
          sales: 0,
        };
      }
      aggregated[key].sales! += record.sales || record.quantity || 0;
    } catch (e) {
      console.warn(`Could not parse date for record:`, record);
    }
  });

  return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


// Basic Markdown to HTML renderer
function Markdown({ content }: { content: string }) {
  if (!content) return null;
  const processLists = (text: string) => {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    for (const line of lines) {
      const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      if (isListItem) {
        if (!inList) {
          html += '<ul class="list-disc pl-5 space-y-1">';
          inList = true;
        }
        html += `<li>${line.trim().substring(2)}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        // Only wrap non-empty lines in paragraphs
        if (line.trim()) {
          html += `<p>${line}</p>`;
        }
      }
    }
    if (inList) {
      html += '</ul>';
    }
    return html;
  };

  let html = processLists(content);
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics

  return <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: html }} />;
}


export default function ForecastingPage() {
  const [salesStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
  const [, setForecastStorage] = useLocalStorage<ForecastDataStorage>('forecast-data', { forecastData: '' });
  const [allData, setAllData] = useState<SalesRecord[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRecord[]>([]);

  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [model, setModel] = useState<ForecastModel>('dynamic');
  const [aggregationPeriod, setAggregationPeriod] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<(ForecastDemandOutput & { reasoning?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataSourceStatus, setDataSourceStatus] = useState<'sample' | 'synced'>('sample');

  const [horizonError, setHorizonError] = useState<string | null>(null);
  const [aggregationError, setAggregationError] = useState<string | null>(null);

  const [chartData, setChartData] = useState<any[]>([]);

  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [recommendedModel, setRecommendedModel] = useState<ForecastModel | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  // Comparison State
  const [selectedComparisonModels, setSelectedComparisonModels] = useState<string[]>(['prophet', 'arima', 'xgboost']);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);


  useEffect(() => {
    const dataToParse = salesStorage.currentData || sampleSalesData;
    const parsedData = parseCsvToJson(dataToParse);
    setAllData(parsedData);
    if (salesStorage.currentData) {
      setDataSourceStatus('synced');
    } else {
      setDataSourceStatus('sample');
    }
  }, [salesStorage]);

  const handleRecommendModel = async () => {
    if (allData.length > 0) {
      setIsRecommending(true);
      setRecommendedModel(null);
      setRecommendationReason(null);
      setError(null);
      try {
        const recommendation = await recommendModel({ dataSample: JSON.stringify(allData.slice(0, 50)) });
        setRecommendedModel(recommendation.recommendedModel);
        setRecommendationReason(recommendation.reasoning);
        setModel(recommendation.recommendedModel);
      } catch (e) {
        console.error("Failed to get model recommendation:", e);
        setError("Could not get a model recommendation at this time.");
      } finally {
        setIsRecommending(false);
      }
    }
  };

  useEffect(() => {
    let data = allData;
    if (regionFilter !== 'all') {
      data = data.filter((d) => d.region === regionFilter);
    }
    if (categoryFilter !== 'all') {
      data = data.filter((d) => d.product_category === categoryFilter);
    }
    setFilteredData(data);
  }, [regionFilter, categoryFilter, allData]);

  const { regions, categories } = useMemo(() => {
    const regionSet = new Set<string>();
    const categorySet = new Set<string>();
    allData.forEach((d) => {
      if (d.region && d.region !== 'N/A') regionSet.add(d.region);
      if (d.product_category && d.product_category !== 'N/A') categorySet.add(d.product_category);
    });
    return {
      regions: ['all', ...Array.from(regionSet)],
      categories: ['all', ...Array.from(categorySet)],
    };
  }, [allData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setChartData([]);

    try {
      const dataForApi = aggregateData(filteredData, aggregationPeriod);
      if (dataForApi.length === 0) {
        setError("Not enough data to generate a forecast with the current filters. Please broaden your criteria.");
        setIsLoading(false);
        return;
      }

      const aggregationLevel = aggregationPeriod === 1 ? 'daily' : `${aggregationPeriod}-day`;

      let response;
      let isPythonModel = model.endsWith('-python') || model === 'ensemble';
      let backendModelName = model.replace('-python', '');

      if (isPythonModel) {
        try {
          const pythonResult = await getPythonForecast(backendModelName, dataForApi, forecastHorizon);
          // Convert python result to match the structure expected by the UI
          const forecastDataStr = JSON.stringify(pythonResult.map(d => ({
            date: d.ds,
            predicted_sales: d.yhat,
            sales: undefined // Ensure no conflict
          })));

          response = {
            forecastData: forecastDataStr,
            recommendations: `### Forecast generated using ${backendModelName.toUpperCase()} (Python)\n\nThis forecast was generated using a dedicated Python backend running the ${backendModelName} algorithm.`,
            reasoning: "User selected Python model."
          };
        } catch (pyError: any) {
          console.error("Python forecast failed", pyError);
          setError(`Failed to connect to Python backend for ${backendModelName}. Ensure 'python main.py' is running in the 'python-backend' folder.`);
          // Fallback or just return
          setIsLoading(false);
          return;
        }
      } else {
        response = await forecastDemand({
          historicalData: JSON.stringify(dataForApi),
          forecastHorizon,
          model,
          aggregationLevel: aggregationLevel,
        });
      }

      setResult(response);
      setForecastStorage({ forecastData: response.forecastData });

      const originalParsed: SalesRecord[] = dataForApi.map((d) => ({ date: d.date, sales: d.sales || d.quantity }));

      let forecastParsed: SalesRecord[] = [];
      try {
        forecastParsed = JSON.parse(response.forecastData);
        forecastParsed = forecastParsed.map((d) => ({ ...d, predicted_sales: d.sales || d.predicted_sales }));
      } catch (jsonErr) {
        console.error('Failed to parse forecast JSON:', jsonErr);
        setError('The AI returned an invalid forecast format. Please try again.');
        setIsLoading(false);
        return;
      }

      const combinedData = [...originalParsed, ...forecastParsed].map((d) => {
        const item: any = { date: d.date };
        if (d.sales !== undefined) item.sales = d.sales;
        if (d.predicted_sales !== undefined) item.predicted_sales = d.predicted_sales;
        return item;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(combinedData);
    } catch (err) {
      console.error(err);
      setError('Failed to generate forecast. The AI model may be temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHorizonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setForecastHorizon(1);
      setHorizonError(null);
      return;
    }
    setForecastHorizon(value);
    if (value > 365) {
      setHorizonError("Horizon cannot exceed 365 days.");
    } else {
      setHorizonError(null);
    }
  };

  const handleAggregationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setAggregationPeriod(1);
      setAggregationError(null);
      return;
    }
    setAggregationPeriod(value);
    if (value > 180) {
      setAggregationError("Aggregation period cannot exceed 180 days.");
    } else {
      setAggregationError(null);
    }
  };

  const handleCompareModels = async () => {
    if (selectedComparisonModels.length === 0) {
      setComparisonError("Please select at least one model to compare.");
      return;
    }
    setIsComparing(true);
    setComparisonError(null);
    setComparisonResult(null);

    try {
      const dataForApi = aggregateData(filteredData, aggregationPeriod);
      if (dataForApi.length < 20) {
        setComparisonError("Not enough data points for comparison. Need at least 20.");
        setIsComparing(false);
        return;
      }

      const result = await compareModels(selectedComparisonModels, dataForApi, forecastHorizon);
      setComparisonResult(result);
    } catch (err: any) {
      console.error("Comparison failed", err);
      setComparisonError(err.message || "Failed to compare models.");
    } finally {
      setIsComparing(false);
    }
  };

  const toggleComparisonModel = (model: string) => {
    setSelectedComparisonModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const hasErrors = !!horizonError || !!aggregationError;

  const handleExportForecast = () => {
    if (!chartData || chartData.length === 0) return;

    // Prepare data for export
    const exportData = chartData.map(row => ({
      Date: row.date,
      'Historical Sales': row.sales !== undefined ? row.sales : '',
      'Predicted Sales': row.predicted_sales !== undefined ? row.predicted_sales : ''
    }));

    // Use centralized export utility
    import('@/utils/export-utils').then(({ exportToCSV }) => {
      exportToCSV(exportData, `forecast_export_${model}_${new Date().toISOString().split('T')[0]}`);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold md:text-3xl font-headline">AI-Powered Demand Forecasting</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Data Status:</span>
            <span className={`font-semibold ${dataSourceStatus === 'synced' ? 'text-green-600' : 'text-amber-600'}`}>
              {dataSourceStatus === 'synced' ? 'Synced with uploaded data' : 'Showing sample data'}
            </span>
          </div>
        </div>
      </div>
      <Alert>
        <Wand2 className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>
          This tool uses AI to predict future sales. Filter your data, choose an aggregation period and forecasting model, and set how far into the future you want to predict. The AI can also recommend the best model for your data.
        </AlertDescription>
      </Alert>



      <Card>
        <CardHeader>
          <CardTitle>Generate Forecast</CardTitle>
          <CardDescription>
            Configure your parameters, filter data, and select a forecasting model to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
              <div className="grid gap-2">
                <Label htmlFor="forecast-horizon">Forecast Horizon (Days)</Label>
                <Input
                  id="forecast-horizon"
                  type="number"
                  value={forecastHorizon}
                  onChange={handleHorizonChange}
                  min="1"
                  max="365"
                  className={horizonError ? 'border-destructive' : ''}
                />
                {horizonError ? (
                  <p className='text-xs text-destructive'>{horizonError}</p>
                ) : (
                  <p className='text-xs text-muted-foreground'>e.g., 30 for a month, 365 for a year</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aggregation-period">Aggregation Period (Days)</Label>
                <Input
                  id="aggregation-period"
                  type="number"
                  value={aggregationPeriod}
                  onChange={handleAggregationChange}
                  min="1"
                  max="180"
                  className={aggregationError ? 'border-destructive' : ''}
                />
                {aggregationError ? (
                  <p className='text-xs text-destructive'>{aggregationError}</p>
                ) : (
                  <p className='text-xs text-muted-foreground'>1 for daily, 7 for weekly, etc.</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region-filter">Region</Label>
                <Select value={regionFilter} onValueChange={setRegionFilter} disabled={regions.length <= 2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by region..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r === 'all' ? 'All Regions' : r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-filter">Product Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  disabled={categories.length <= 2}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === 'all' ? 'All Categories' : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model-select">Forecasting Model</Label>
                <Select value={model} onValueChange={(value: string) => setModel(value as ForecastModel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic Ensemble (AI)</SelectItem>
                    <SelectItem value="ses">Simple Exponential Smoothing</SelectItem>
                    <SelectItem value="des">Double Exponential Smoothing</SelectItem>
                    <SelectItem value="arima">ARIMA (AI-Assisted)</SelectItem>
                    <SelectItem value="prophet">Prophet (AI-Assisted)</SelectItem>
                    <SelectItem value="xgboost">XGBoost (AI-Assisted)</SelectItem>
                    <SelectItem value="prophet-python">Prophet (Python Native)</SelectItem>
                    <SelectItem value="xgboost-python">XGBoost (Python Native)</SelectItem>
                    <SelectItem value="arima-python">ARIMA (Python Native)</SelectItem>
                    <SelectItem value="ensemble">Ensemble (Average)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recommendedModel && recommendationReason && (
              <Alert className="mt-4 text-sm">
                <Wand2 className="h-4 w-4" />
                <AlertTitle>AI Recommendation</AlertTitle>
                <AlertDescription>
                  Based on your data, the recommended model is <span className='capitalize font-semibold'>{recommendedModel}</span>. Reason: {recommendationReason}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={isLoading || hasErrors}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    <AreaChart className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleRecommendModel} disabled={isRecommending || isLoading || hasErrors}>
                {isRecommending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Recommend Model
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Forecast Visualization</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportForecast}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="h-[400px] min-w-[800px]">
                  <ChartContainer
                    config={{
                      sales: { label: 'Historical Sales', color: 'hsl(var(--chart-1))' },
                      predicted_sales: { label: 'Forecasted Sales', color: 'hsl(var(--chart-2))' },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer>
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          label={{ value: 'Sales / Quantity', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Legend verticalAlign="top" height={36} />
                        <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={{ r: 2 }} />
                        <Line
                          type="monotone"
                          dataKey="predicted_sales"
                          stroke="var(--color-predicted_sales)"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={{ r: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown content={result.recommendations} />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Model Comparison & Accuracy</CardTitle>
          <CardDescription>
            Compare the performance of different Python-native models by backtesting them on your recent data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <Label>Select Models to Compare</Label>
            <div className="flex flex-wrap gap-4">
              {['prophet', 'arima', 'xgboost', 'ensemble'].map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <Checkbox
                    id={`compare-${m}`}
                    checked={selectedComparisonModels.includes(m)}
                    onCheckedChange={() => toggleComparisonModel(m)}
                  />
                  <Label htmlFor={`compare-${m}`} className="capitalize">{m}</Label>
                </div>
              ))}
            </div>
            <Button onClick={handleCompareModels} disabled={isComparing || isLoading} className="w-fit">
              {isComparing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Comparing...
                </>
              ) : (
                "Compare Models"
              )}
            </Button>
          </div>

          {comparisonError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{comparisonError}</AlertDescription>
            </Alert>
          )}

          {comparisonResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>MAE (Mean Abs Error)</TableHead>
                      <TableHead>RMSE (Root Mean Sq Error)</TableHead>
                      <TableHead>WMAPE (Weighted MAPE)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(comparisonResult.models).map(([name, data]) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium capitalize">{name}</TableCell>
                        <TableCell>{data.metrics.mae.toFixed(2)}</TableCell>
                        <TableCell>{data.metrics.rmse.toFixed(2)}</TableCell>
                        <TableCell>{(data.metrics.mape * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="h-[500px] w-full border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Backtest Comparison (Actual vs Predicted)</h3>
                <ChartContainer
                  config={{
                    actual: { label: 'Actual', color: 'hsl(var(--foreground))' },
                    prophet: { label: 'Prophet', color: 'hsl(var(--chart-1))' },
                    arima: { label: 'ARIMA', color: 'hsl(var(--chart-2))' },
                    xgboost: { label: 'XGBoost', color: 'hsl(var(--chart-3))' },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer>
                    <LineChart data={comparisonResult.dates.map((date, i) => {
                      const point: any = { date, actual: comparisonResult.actuals[i] };
                      Object.entries(comparisonResult.models).forEach(([name, data]) => {
                        if (data.forecast[i] !== undefined) {
                          point[name] = data.forecast[i];
                        }
                      });
                      return point;
                    })} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        label={{ value: 'Sales', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} dot={{ r: 3 }} />
                      {selectedComparisonModels.map((m, idx) => (
                        <Line
                          key={m}
                          type="monotone"
                          dataKey={m}
                          stroke={`var(--color-${m})`}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

            </div >
          )
          }
        </CardContent >
      </Card >

      <Card>
        <CardHeader>
          <CardTitle>Model Information & Methodology</CardTitle>
          <CardDescription>Understanding the different forecasting models and accuracy metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="models">
              <AccordionTrigger>Forecasting Models Explained</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">AI-Assisted Models (Cloud)</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Dynamic Ensemble (AI):</strong> Our most advanced option. It uses a Large Language Model (LLM) to analyze your data's context and combines multiple statistical approaches to generate a balanced forecast.</li>
                      <li><strong>ARIMA (AI-Assisted):</strong> Auto-Regressive Integrated Moving Average. Best for data with trends but no clear seasonality. The AI tunes the parameters for you.</li>
                      <li><strong>Prophet (AI-Assisted):</strong> Developed by Meta. Excellent for data with strong seasonal patterns (daily, weekly, yearly) and holiday effects.</li>
                      <li><strong>XGBoost (AI-Assisted):</strong> Extreme Gradient Boosting. A powerful machine learning model that captures complex, non-linear relationships in your data.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Python Native Models (Local)</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Prophet (Python Native):</strong> Runs locally on your machine. Enhanced with automatic Indian holiday detection and robust seasonality settings (Daily, Weekly, Yearly).</li>
                      <li><strong>ARIMA (Python Native):</strong> Uses a grid-search algorithm to automatically find the best (p,d,q) parameters for your specific dataset, ensuring optimal fit.</li>
                      <li><strong>XGBoost (Python Native):</strong> Uses advanced feature engineering (day of week, month, quarter) to predict future sales based on time-based patterns.</li>
                      <li><strong>Ensemble (Average):</strong> Combines ARIMA and XGBoost predictions. Averaging two strong models often cancels out individual errors, leading to better accuracy.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Statistical Models (Browser)</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Simple Exponential Smoothing (SES):</strong> Best for data with no clear trend or seasonality. It gives more weight to recent observations.</li>
                      <li><strong>Double Exponential Smoothing (DES):</strong> Also known as Holt's Linear Trend method. Best for data with a trend but no seasonality.</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="metrics">
              <AccordionTrigger>Accuracy Metrics Explained</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>We use "Backtesting" to calculate accuracy. We hide the last portion of your data (the test set), train the model on the rest, and then compare the model's predictions to the actual hidden values.</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li><strong>MAE (Mean Absolute Error):</strong> The average absolute difference between predicted and actual values. <em>Lower is better.</em> If MAE is 10, the model is off by 10 units on average.</li>
                    <li><strong>RMSE (Root Mean Squared Error):</strong> Similar to MAE but penalizes large errors more heavily. <em>Lower is better.</em> Useful if you want to avoid big surprises.</li>
                    <li><strong>WMAPE (Weighted MAPE):</strong> The weighted average error as a percentage. <em>Lower is better.</em> This handles days with zero sales correctly, unlike standard MAPE.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div >
  );
}
