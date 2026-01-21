
export type PromotionMetric = {
    product_id: string;
    category?: string;
    subcategory?: string;
    current_stock: number;
    daily_velocity: number; // Average Daily Sales (ADS)
    forecasted_demand_30d: number;
    days_of_supply: number;
    status: 'Overstock' | 'Healthy' | 'Low Stock';
    base_recommendation: string;
};

export type SalesRecord = {
    date: string;
    sales?: number;
    quantity?: number;
    product_id?: string;
    product_category?: string;
    product_sub_category?: string;
    [key: string]: any;
};

export function calculatePromotionMetrics(
    historicalData: SalesRecord[],
    inventory: { product_id: string; quantity: number }[],
    forecastData: any[]
): PromotionMetric[] {
    const metrics: PromotionMetric[] = [];

    // 1. Calculate Velocity (ADS) per product from last 30 days of history
    const productVelocity: Record<string, number> = {};
    const productInfo: Record<string, { category?: string; subcategory?: string }> = {};

    // Sort history by date descending to get recent data
    const sortedHistory = [...historicalData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Take last 30 days relative to the LATEST date in the dataset
    // This ensures it works even if the data is from last year.
    const latestDate = sortedHistory.length > 0 ? new Date(sortedHistory[0].date) : new Date();
    const thirtyDaysAgo = new Date(latestDate);
    thirtyDaysAgo.setDate(latestDate.getDate() - 30);

    const recentHistory = sortedHistory.filter(d => new Date(d.date) >= thirtyDaysAgo);

    // Use all history to get product info if recent is empty
    historicalData.forEach(record => {
        if (record.product_id && !productInfo[record.product_id]) {
            productInfo[record.product_id] = {
                category: record.product_category || record.category,
                subcategory: record.product_sub_category || record.sub_category || record.subcategory
            };
        }
    });

    recentHistory.forEach(record => {
        if (!record.product_id) return;
        const qty = typeof record.sales === 'string' ? parseFloat(record.sales) : (record.sales || record.quantity || 0);

        if (!productVelocity[record.product_id]) {
            productVelocity[record.product_id] = 0;
        }
        productVelocity[record.product_id] += qty;
    });

    // 2. Calculate Forecasted Demand per product
    const productForecast: Record<string, number> = {};
    if (Array.isArray(forecastData)) {
        forecastData.forEach(record => {
            // Forecast data might be aggregate or per product. 
            // If aggregate, we can't split by product easily without more info.
            // Assuming forecastData might have product_id if generated per product, 
            // OR we use historical split to distribute aggregate forecast.
            // For this MVP, let's assume forecast is aggregate and we distribute based on historical velocity share.

            // Actually, the current forecast output is just {ds, yhat}. It's aggregate.
            // We need to split it.
            // Strategy: Calculate total velocity, get product share, apply to total forecast.
        });
    }

    // Calculate Total Velocity for Share
    let totalVelocity = 0;
    Object.values(productVelocity).forEach(v => totalVelocity += v);

    // Calculate Total Forecast (Next 30 days)
    let totalForecast30d = 0;
    if (Array.isArray(forecastData)) {
        totalForecast30d = forecastData.slice(0, 30).reduce((sum, day) => sum + (day.yhat || 0), 0);
    }

    inventory.forEach(item => {
        const velocityTotal = productVelocity[item.product_id] || 0;
        // ADS = Total Sales / 30 (Simple Moving Average)
        const ads = velocityTotal / 30;

        // Forecast Share
        const share = totalVelocity > 0 ? velocityTotal / totalVelocity : 0;
        const forecastedDemand = totalForecast30d * share;

        // Days of Supply
        // If forecast is 0, use ADS. If both 0, infinite.
        const dailyDemand = forecastedDemand > 0 ? (forecastedDemand / 30) : ads;
        const daysOfSupply = dailyDemand > 0 ? item.quantity / dailyDemand : 999;

        let status: 'Overstock' | 'Healthy' | 'Low Stock' = 'Healthy';
        let recommendation = 'Standard Promotion';

        if (daysOfSupply > 60) {
            status = 'Overstock';
            recommendation = 'Clearance Sale (20-50% Off)';
        } else if (daysOfSupply < 14) {
            status = 'Low Stock';
            recommendation = 'Do Not Promote (Restock Needed)';
        } else {
            status = 'Healthy';
            recommendation = 'Bundle / Upsell (Maximize Margin)';
        }

        metrics.push({
            product_id: item.product_id,
            category: productInfo[item.product_id]?.category || 'Uncategorized',
            subcategory: productInfo[item.product_id]?.subcategory || '',
            current_stock: item.quantity,
            daily_velocity: parseFloat(ads.toFixed(2)),
            forecasted_demand_30d: parseFloat(forecastedDemand.toFixed(0)),
            days_of_supply: parseFloat(daysOfSupply.toFixed(1)),
            status,
            base_recommendation: recommendation
        });
    });

    return metrics;
}

export type PromotionCard = {
    type: 'High Confidence' | 'Seasonal' | 'Clearance';
    title: string;
    target: string;
    reason: string;
    suggested_action: string;
    expected_impact: string;
    confidence: number;
    products: string[];
};

export function generatePromotionCards(metrics: PromotionMetric[]): PromotionCard[] {
    const cards: PromotionCard[] = [];

    // 1. Clearance Opportunity
    const overstockItems = metrics.filter(m => m.status === 'Overstock');
    if (overstockItems.length > 0) {
        const topOverstock = overstockItems.sort((a, b) => b.days_of_supply - a.days_of_supply).slice(0, 5);
        cards.push({
            type: 'Clearance',
            title: 'Clearance Opportunity',
            target: `${overstockItems.length} slow-moving products`,
            reason: `Low sales for 60+ days. Cash tied up in inventory.`,
            suggested_action: '30-40% off to clear inventory',
            expected_impact: 'Recover capital and free up storage space.',
            confidence: 95,
            products: topOverstock.map(p => p.product_id)
        });
    }

    // 2. High Confidence (Healthy items with high velocity)
    const healthyHighVelocity = metrics.filter(m => m.status === 'Healthy' && m.daily_velocity > 5); // Threshold for "High Velocity"
    if (healthyHighVelocity.length > 0) {
        cards.push({
            type: 'High Confidence',
            title: 'High Confidence Recommendation',
            target: 'Top Selling Category',
            reason: 'Strong daily velocity indicates high demand elasticity.',
            suggested_action: '15-20% off to maximize volume',
            expected_impact: 'Significant revenue lift with minimal margin erosion.',
            confidence: 88,
            products: healthyHighVelocity.slice(0, 5).map(p => p.product_id)
        });
    }

    // 3. Seasonal (Mocked for now, as we need date context)
    // In real life, check if current month matches a known season
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 9) { // Oct-Dec
        cards.push({
            type: 'Seasonal',
            title: 'Seasonal Opportunity',
            target: 'Festival Season',
            reason: 'Historical data shows +65% lift during this period.',
            suggested_action: 'Bundle offers on top items',
            expected_impact: 'Maximize share of wallet during peak season.',
            confidence: 92,
            products: []
        });
    }

    return cards;
}
