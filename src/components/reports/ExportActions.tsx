import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download } from 'lucide-react';
import { ReportData } from '@/utils/report-engine';

interface ExportActionsProps {
    data: ReportData;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ data }) => {

    const handleExportSales = () => {
        if (!data.sales?.revenueTrend) return;

        import('@/utils/export-utils').then(({ exportToCSV }) => {
            const exportData = data.sales!.revenueTrend.map(d => ({
                Date: d.date,
                Revenue: d.value
            }));
            exportToCSV(exportData, 'sales_report');
        });
    };

    const handleExportInventory = () => {
        if (!data.inventory?.topLowStock) return;

        import('@/utils/export-utils').then(({ exportToCSV }) => {
            const exportData = data.inventory!.topLowStock.map(d => ({
                'Product Name': d.name,
                'Stock Level': d.stock
            }));
            exportToCSV(exportData, 'inventory_low_stock');
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleExportSales} disabled={!data.sales}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                Export Sales Data (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleExportInventory} disabled={!data.inventory}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-amber-600" />
                Export Inventory Health (CSV)
            </Button>
            {/* Add more export buttons as needed */}
        </div>
    );
};
