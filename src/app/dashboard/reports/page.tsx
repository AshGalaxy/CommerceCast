'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { ReportTemplate } from '@/components/reports/ReportTemplate';
import { ExportActions } from '@/components/reports/ExportActions';
import { generateReportData, ReportConfig, ReportSection } from '@/utils/report-engine';
import { FileText, Download, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { DateRange } from 'react-day-picker';

export default function ReportsPage() {
  const { toast } = useToast();
  const [salesStorage] = useLocalStorage<any>('sales-data', { currentData: '', history: [] });
  // Inventory is stored as 'inventory-data' which is an array of items
  const [inventoryStorage] = useLocalStorage<any>('inventory-data', []);
  const [forecastStorage] = useLocalStorage<any>('forecast-data', { forecastData: '' });
  const [pastPromotions] = useLocalStorage<any[]>('past-promotions', []);

  // --- State ---
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const [sections, setSections] = useState<Record<ReportSection, boolean>>({
    executive_summary: true,
    sales: true,
    inventory: true,
    promotions: false,
    comparison: false,
    forecast: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // --- Data Processing ---
  const reportData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return {};

    // Parse CSV data from storage if needed
    const parseCsv = (csv: string) => {
      if (!csv) return [];
      const lines = csv.trim().split('\n');
      // Handle potential metadata lines
      let headerIndex = 0;
      if (lines[0].toLowerCase().startsWith('company') || !lines[0].includes(',')) {
        headerIndex = 1;
      }
      if (lines.length < headerIndex + 2) return [];

      const headers = lines[headerIndex].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));
      return lines.slice(headerIndex + 1).map(line => {
        if (!line.trim()) return null;
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || line.split(',');
        const row: any = {};
        headers.forEach((h, i) => row[h] = values[i]?.trim().replace(/^"|"$/g, ''));
        return row;
      }).filter(Boolean);
    };

    const sales = salesStorage.currentData ? parseCsv(salesStorage.currentData).map((row: any) => ({
      ...row,
      revenue: parseFloat(row.revenue || '0'),
      sales: parseFloat(row.sales || row.quantity || '0')
    })) : [];

    const inventory = Array.isArray(inventoryStorage) ? inventoryStorage : [];

    // Parse Forecast Data
    const forecastRaw = forecastStorage.forecastData ? parseCsv(forecastStorage.forecastData) : [];
    const forecast = forecastRaw.map((row: any) => ({
      ...row,
      yhat: parseFloat(row.yhat || row.predicted_sales || '0')
    }));

    // Map Promotions Data
    const promotions = pastPromotions.map(p => ({
      ...p,
      lift: p.revenue_lift || 0,
      revenue: p.revenue_lift || 0 // Using lift as revenue proxy if direct revenue missing
    }));

    return generateReportData(
      sales,
      inventory,
      promotions,
      forecast,
      {
        sections,
        dateRange: { from: dateRange.from, to: dateRange.to },
        title: 'CommerceCast Executive Report'
      }
    );
  }, [salesStorage, inventoryStorage, forecastStorage, pastPromotions, sections, dateRange]);

  // --- Handlers ---
  const toggleSection = (section: ReportSection) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('CommerceCast_Report.pdf');
      toast({ title: 'Success', description: 'Report downloaded successfully.' });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate PDF.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-headline font-bold">Reports & Export Hub</h1>
        <p className="text-muted-foreground">Generate professional PDF reports and export raw data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Builder</CardTitle>
              <CardDescription>Select sections to include</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Report Period</Label>
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <Label>Content Sections</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exec"
                      checked={sections.executive_summary}
                      onCheckedChange={() => toggleSection('executive_summary')}
                    />
                    <Label htmlFor="exec">Executive Summary (AI)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sales"
                      checked={sections.sales}
                      onCheckedChange={() => toggleSection('sales')}
                    />
                    <Label htmlFor="sales">Sales Performance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inv"
                      checked={sections.inventory}
                      onCheckedChange={() => toggleSection('inventory')}
                    />
                    <Label htmlFor="inv">Inventory Health</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promo"
                      checked={sections.promotions}
                      onCheckedChange={() => toggleSection('promotions')}
                    />
                    <Label htmlFor="promo">Promotions Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="comp"
                      checked={sections.comparison}
                      onCheckedChange={() => toggleSection('comparison')}
                    />
                    <Label htmlFor="comp">Comparison Insights</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="forecast"
                      checked={sections.forecast}
                      onCheckedChange={() => toggleSection('forecast')}
                    />
                    <Label htmlFor="forecast">Forecast Outlook</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleDownloadPDF} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download raw data for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportActions data={reportData} />
            </CardContent>
          </Card>
        </div>

        {/* Live Preview (Scaled Down) */}
        <div className="lg:col-span-2 bg-slate-100 p-8 rounded-xl overflow-auto max-h-[800px] border shadow-inner">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold text-slate-500">Live Preview (A4 Layout)</h3>
            <span className="text-xs text-slate-400">This is exactly how your PDF will look</span>
          </div>

          {/* The actual report template is rendered here. 
                        We use a transform to scale it down slightly for preview if needed, 
                        but for PDF generation we capture this exact element. 
                    */}
          <div className="origin-top transform scale-90">
            <ReportTemplate
              ref={reportRef}
              data={reportData}
              config={{
                sections,
                dateRange: { from: dateRange!.from!, to: dateRange!.to! },
                title: 'CommerceCast Executive Report'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
