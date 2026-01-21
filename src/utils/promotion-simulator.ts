
export type SimulationInput = {
    products: { id: string; price: number; baseline_daily_sales: number }[];
    discount_percent: number;
    duration_days: number;
    elasticity?: number; // Price Elasticity of Demand (default -2.0 for promos)
};

export type SimulationOutput = {
    projected_revenue: { min: number; max: number };
    projected_units: { min: number; max: number };
    cost_of_discount: number;
    net_profit_impact: { min: number; max: number };
    roi: number;
    confidence: number;
};

export function simulatePromotion(input: SimulationInput): SimulationOutput {
    const { products, discount_percent, duration_days, elasticity = 2.5 } = input;

    let total_baseline_revenue = 0;
    let total_projected_revenue_min = 0;
    let total_projected_revenue_max = 0;
    let total_baseline_units = 0;
    let total_projected_units_min = 0;
    let total_projected_units_max = 0;
    let total_cost_of_discount = 0;

    // Elasticity Logic: % Change in Qty = Elasticity * % Change in Price
    // If discount is 20%, price drops 20%.
    // Qty Lift = 2.5 * 20% = 50% increase.

    const price_drop_percent = discount_percent / 100;
    const lift_percent = elasticity * price_drop_percent;

    // Add some uncertainty (confidence interval)
    const lift_min = lift_percent * 0.8;
    const lift_max = lift_percent * 1.2;

    products.forEach(p => {
        const baseline_units = p.baseline_daily_sales * duration_days;
        const baseline_rev = baseline_units * p.price;

        // Projected Units
        const units_min = baseline_units * (1 + lift_min);
        const units_max = baseline_units * (1 + lift_max);

        // Discounted Price
        const discounted_price = p.price * (1 - price_drop_percent);

        // Projected Revenue
        const rev_min = units_min * discounted_price;
        const rev_max = units_max * discounted_price;

        // Cost of Discount (Revenue lost due to price drop on ALL units sold)
        // Cost = (Original Price - Discounted Price) * Units Sold
        // Wait, cost is usually just the discount amount given away.
        const cost_min = (p.price - discounted_price) * units_min;
        const cost_max = (p.price - discounted_price) * units_max;
        const avg_cost = (cost_min + cost_max) / 2;

        total_baseline_revenue += baseline_rev;
        total_baseline_units += baseline_units;

        total_projected_revenue_min += rev_min;
        total_projected_revenue_max += rev_max;

        total_projected_units_min += units_min;
        total_projected_units_max += units_max;

        total_cost_of_discount += avg_cost;
    });

    // ROI = (Net Profit from Promo - Baseline Profit) / Cost of Promo
    // Simplified ROI for Retail: (Incremental Revenue) / Cost of Discount
    // Or better: (Projected Revenue - Baseline Revenue) / Cost of Discount
    // Actually, standard Retail ROI is often: (Gross Margin Lift - Marketing Cost) / Marketing Cost.
    // Let's use: (Revenue Lift) / Cost of Discount for simplicity in this view, 
    // or just "Revenue / Cost" ratio (ROAS).

    const avg_rev = (total_projected_revenue_min + total_projected_revenue_max) / 2;
    const revenue_lift = avg_rev - total_baseline_revenue;

    // Avoid division by zero
    const roi = total_cost_of_discount > 0 ? (revenue_lift / total_cost_of_discount) : 0;

    // Net Profit Impact (assuming 40% margin on original price)
    // Baseline Profit = Baseline Rev * 0.4
    // Promo Profit = (Projected Rev) - (Cost of Goods Sold)
    // COGS = Units * (Original Price * 0.6)
    const margin_percent = 0.4;
    const cogs_per_unit = products.length > 0 ? products[0].price * (1 - margin_percent) : 0; // Simplified

    const profit_min = total_projected_revenue_min - (total_projected_units_min * cogs_per_unit);
    const profit_max = total_projected_revenue_max - (total_projected_units_max * cogs_per_unit);

    return {
        projected_revenue: { min: Math.round(total_projected_revenue_min), max: Math.round(total_projected_revenue_max) },
        projected_units: { min: Math.round(total_projected_units_min), max: Math.round(total_projected_units_max) },
        cost_of_discount: Math.round(total_cost_of_discount),
        net_profit_impact: { min: Math.round(profit_min), max: Math.round(profit_max) },
        roi: parseFloat(roi.toFixed(2)),
        confidence: 78 // Mocked confidence based on model accuracy
    };
}
