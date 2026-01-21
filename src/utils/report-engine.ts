import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

// --- Types ---

export type ReportSection = 'executive_summary' | 'sales' | 'inventory' | 'promotions' | 'comparison' | 'forecast';

export type ReportConfig = {
    sections: Record<ReportSection, boolean>;
    dateRange: { from: Date; to: Date };
    title: string;
};

export type ReportData = {
    sales?: {
        totalRevenue: number;
        totalUnits: number;
        revenueTrend: { date: string; value: number }[];
        topProducts: { name: string; revenue: number }[];
    };
    inventory?: {
        totalStockValue: number;
        lowStockCount: number;
        outOfStockCount: number;
        topLowStock: { name: string; stock: number }[];
    };
    promotions?: {
        activeCampaigns: number;
        totalLift: number;
        promoRevenue: number;
    };
    comparison?: {
        periodA: string;
        periodB: string;
        revenueChange: number;
    };
    forecast?: {
        predictedRevenue: number;
        confidence: number;
        growthRate?: number;
    };
    summary?: string;
};

// --- Aggregation Logic ---

export const generateReportData = (
    salesData: any[],
    inventoryData: any[],
    promoData: any[],
    forecastData: any[],
    config: ReportConfig
): ReportData => {
    const { from, to } = config.dateRange;
    const report: ReportData = {};

    // 1. Sales Data
    if (config.sections.sales && salesData.length > 0) {
        const filteredSales = salesData.filter(d => isWithinInterval(new Date(d.date), { start: from, end: to }));
        const totalRevenue = filteredSales.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0);
        const totalUnits = filteredSales.reduce((sum, d) => sum + (Number(d.sales) || 0), 0);

        // Group by product for top products
        const productMap = new Map<string, number>();
        filteredSales.forEach(d => {
            const current = productMap.get(d.product_id) || 0;
            productMap.set(d.product_id, current + (Number(d.revenue) || 0));
        });
        const topProducts = Array.from(productMap.entries())
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Daily trend
        const trendMap = new Map<string, number>();
        filteredSales.forEach(d => {
            const current = trendMap.get(d.date) || 0;
            trendMap.set(d.date, current + (Number(d.revenue) || 0));
        });
        const revenueTrend = Array.from(trendMap.entries())
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        report.sales = { totalRevenue, totalUnits, topProducts, revenueTrend };
    }

    // 2. Inventory Data
    if (config.sections.inventory && inventoryData.length > 0) {
        // Inventory is usually a snapshot, so we take current state
        const totalStockValue = inventoryData.reduce((sum, d) => sum + ((Number(d.stock_level) || 0) * (Number(d.unit_price) || 0)), 0);
        const lowStockCount = inventoryData.filter(d => (Number(d.stock_level) || 0) < (Number(d.reorder_point) || 10)).length;
        const outOfStockCount = inventoryData.filter(d => (Number(d.stock_level) || 0) === 0).length;
        const topLowStock = inventoryData
            .filter(d => (Number(d.stock_level) || 0) < (Number(d.reorder_point) || 10))
            .sort((a, b) => (Number(a.stock_level) || 0) - (Number(b.stock_level) || 0))
            .slice(0, 5)
            .map(d => ({ name: d.product_name || d.product_id, stock: Number(d.stock_level) || 0 }));

        report.inventory = { totalStockValue, lowStockCount, outOfStockCount, topLowStock };
    }

    // 3. Promotions Data
    if (config.sections.promotions && promoData.length > 0) {
        // Assuming promoData has 'lift' and 'revenue' fields
        const activeCampaigns = promoData.length; // Simplified
        const totalLift = promoData.reduce((sum, d) => sum + (Number(d.lift) || 0), 0);
        const promoRevenue = promoData.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0);

        report.promotions = { activeCampaigns, totalLift, promoRevenue };
    }

    // 4. Comparison (Simplified for now - compares selected period vs previous period)
    if (config.sections.comparison && salesData.length > 0) {
        const currentSales = salesData.filter(d => isWithinInterval(new Date(d.date), { start: from, end: to }));
        const currentRevenue = currentSales.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0);

        const duration = to.getTime() - from.getTime();
        const prevFrom = new Date(from.getTime() - duration);
        const prevTo = new Date(to.getTime() - duration);

        const prevSales = salesData.filter(d => isWithinInterval(new Date(d.date), { start: prevFrom, end: prevTo }));
        const prevRevenue = prevSales.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0);

        const revenueChange = prevRevenue !== 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

        report.comparison = {
            periodA: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,
            periodB: `${prevFrom.toLocaleDateString()} - ${prevTo.toLocaleDateString()}`,
            revenueChange
        };
    }

    // 5. Forecast Data
    if (config.sections.forecast && forecastData.length > 0) {
        const predictedRevenue = forecastData.reduce((sum, d) => sum + (Number(d.yhat) || 0), 0);
        // Calculate growth rate if current revenue is available
        let growthRate = 0;
        if (report.sales?.totalRevenue) {
            growthRate = ((predictedRevenue - report.sales.totalRevenue) / report.sales.totalRevenue) * 100;
        }

        report.forecast = {
            predictedRevenue,
            confidence: 0.85,
            growthRate
        };
    }

    // 6. Executive Summary (Deterministic for robustness)
    if (config.sections.executive_summary) {
        const lines = [];
        if (report.sales) {
            lines.push(`Total revenue for the period was ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(report.sales.totalRevenue)}.`);
            lines.push(`Top performing product was ${report.sales.topProducts[0]?.name || 'N/A'}.`);
        }
        if (report.comparison) {
            lines.push(`Revenue ${report.comparison.revenueChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(report.comparison.revenueChange).toFixed(1)}% compared to the previous period.`);
        }
        if (report.inventory) {
            lines.push(`Inventory health check shows ${report.inventory.lowStockCount} items below reorder point.`);
        }
        if (report.forecast && report.forecast.growthRate) {
            lines.push(`Forecast models predict a ${report.forecast.growthRate >= 0 ? 'positive' : 'negative'} trend of ${Math.abs(report.forecast.growthRate).toFixed(1)}% for the next period.`);
        }
        report.summary = lines.join(' ');
    }

    return report;
};
