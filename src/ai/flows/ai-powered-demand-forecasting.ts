'use server';
/**
 * @fileOverview An AI-powered demand forecasting flow.
 *
 * - forecastDemand - A function that uses historical data to predict future sales.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { simpleExponentialSmoothing, doubleExponentialSmoothing } from '@/services/forecasting-service';

const ForecastModelSchema = z.enum([
  'dynamic',
  'arima',
  'prophet',
  'xgboost',
  'ses',
  'des',
  'ensemble'
]);
export type ForecastModel = z.infer<typeof ForecastModelSchema>;


const ForecastDemandInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical sales data in JSON format. Must be an array of objects with keys like date, sales, product_category, region, etc.'
    ),
  forecastHorizon: z
    .number()
    .describe(
      'The number of periods (days, weeks, months) into the future to forecast demand for.'
    ),
  aggregationLevel: z.string().describe('The aggregation level of the historical data (e.g., "daily", "7-day", "monthly").'),
  model: ForecastModelSchema.describe('The forecasting model to use.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const ForecastDemandOutputSchema = z.object({
  forecastData: z
    .string()
    .describe(
      'Forecasted sales data in JSON format, with columns for date and predicted_sales.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for inventory management and resource allocation based on the forecast. Format this as a Markdown list.'
    ),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: { schema: ForecastDemandInputSchema },
  output: { schema: ForecastDemandOutputSchema },
  prompt: `You are an expert in demand forecasting for e-commerce. Analyze the historical sales data provided and predict future sales for the next {{{forecastHorizon}}} days. The data is rich, containing information about product categories, regions, and more. Use these details to provide a more accurate forecast.

The data provided has been aggregated at a {{{aggregationLevel}}} level. Your forecast should be at the same level of aggregation.

The user has selected the '{{{model}}}' forecasting approach. If 'dynamic', use an ensemble of methods. If 'arima', focus on autoregressive patterns. If 'prophet', focus on seasonality and holidays. If 'xgboost', focus on complex relationships. Tailor your analysis and recommendations accordingly.

Historical Data (JSON format):
{{{historicalData}}}

Forecast Horizon: {{{forecastHorizon}}} days

Provide the forecast in JSON format with keys for "date" and "predicted_sales". Also, provide detailed, actionable recommendations for inventory management, marketing strategies, and resource allocation based on the forecast. Format the recommendations as a Markdown list.`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async (input) => {
    const historicalData = JSON.parse(input.historicalData);
    const salesData = historicalData.map((d: any) => d.sales || d.quantity || 0);
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const aggregationDays = parseInt(input.aggregationLevel.split('-')[0]) || 1;

    let forecastValues: number[] = [];
    let recommendations = '';

    if (input.model === 'ses' || input.model === 'des') {
      if (input.model === 'ses') {
        forecastValues = simpleExponentialSmoothing(salesData, input.forecastHorizon);
        recommendations = `- The forecast was generated using the **Simple Exponential Smoothing (SES)** model.
- This is a traditional statistical model that is effective for short-term predictions on data without a strong trend or seasonality.
- It calculates forecasts by assigning exponentially decreasing weights to past observations.
- Review the forecast chart to understand the projected sales path. Consider adjusting inventory based on this baseline prediction.`;
      } else if (input.model === 'des') {
        forecastValues = doubleExponentialSmoothing(salesData, input.forecastHorizon);
        recommendations = `- The forecast was generated using **Double Exponential Smoothing (Holt's Method)**.
- This traditional model is effective for data with a clear **trend**.
- It uses two smoothing parameters (alpha and beta) to capture both the level and the trend of the sales data.
- This forecast is a linear projection based on the detected trend. It's a solid baseline for trend-based predictions.`;
      }

      const forecastData = forecastValues.map((value, index) => {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(lastDate.getDate() + (index + 1) * aggregationDays);
        return {
          date: forecastDate.toISOString().split('T')[0],
          predicted_sales: Math.round(value),
        };
      });

      return {
        forecastData: JSON.stringify(forecastData),
        recommendations: recommendations,
      };
    }

    // Default to AI model for other types
    const { output } = await prompt(input);
    return output!;
  }
);

const RecommendModelInputSchema = z.object({
  dataSample: z.string().describe("A sample of the historical data in JSON format."),
});
export type RecommendModelInput = z.infer<typeof RecommendModelInputSchema>;

const RecommendModelOutputSchema = z.object({
  recommendedModel: ForecastModelSchema.describe("The recommended forecasting model."),
  reasoning: z.string().describe("The reasoning behind the recommendation."),
});
export type RecommendModelOutput = z.infer<typeof RecommendModelOutputSchema>;


export async function recommendModel(input: RecommendModelInput): Promise<RecommendModelOutput> {
  return recommendModelFlow(input);
}

const recommendModelFlow = ai.defineFlow({
  name: 'recommendModelFlow',
  inputSchema: RecommendModelInputSchema,
  outputSchema: RecommendModelOutputSchema,
}, async (input) => {
  const { output } = await ai.generate({
    prompt: `Based on the following data sample, recommend the best forecasting model (dynamic, arima, prophet, xgboost, ses, or des). Provide a brief reason.
        
Data: ${input.dataSample}`,
    model: 'googleai/gemini-2.5-flash',
    output: {
      schema: RecommendModelOutputSchema
    }
  });

  return output!;
});
