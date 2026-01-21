'use server';

type ForecastData = {
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
};

export async function getPythonForecast(model: string, salesData: any[], periods: number): Promise<ForecastData[]> {
    try {
        const response = await fetch('http://localhost:8000/forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: salesData.map(d => ({
                    ds: d.date,
                    y: typeof d.sales === 'number' ? d.sales : parseFloat(d.sales) || 0,
                    promotion_id: d.promotion_id ? String(d.promotion_id) : null,
                    stock_level: typeof d.stock_level === 'number' ? d.stock_level : (parseFloat(d.stock_level) || 0)
                })),
                periods,
                model,
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python API Error: ${response.status} ${errorText}`);
        }

        return response.json();
    } catch (error: any) {
        console.error("Forecast error:", error);
        // Return empty array or rethrow depending on how we want to handle it in UI
        throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
}

export type ComparisonResult = {
    dates: string[];
    actuals: number[];
    models: {
        [key: string]: {
            metrics: {
                mae: number;
                rmse: number;
                mape: number;
            };
            forecast: number[];
            error?: string;
        };
    };
};

export async function compareModels(models: string[], salesData: any[], periods: number): Promise<ComparisonResult> {
    try {
        const response = await fetch('http://localhost:8000/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: salesData.map(d => ({
                    ds: d.date,
                    y: typeof d.sales === 'number' ? d.sales : parseFloat(d.sales) || 0
                })),
                periods,
                models,
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python API Error: ${response.status} ${errorText}`);
        }

        return response.json();
    } catch (error: any) {
        console.error("Comparison error:", error);
        throw new Error(`Failed to compare models: ${error.message}`);
    }
}
