'use server';

/**
 * @fileOverview Implements dynamic ensemble forecasting using Genkit.
 *
 * - dynamicEnsembleForecasting - A function that performs dynamic ensemble forecasting.
 * - DynamicEnsembleForecastingInput - The input type for the dynamicEnsembleForecasting function.
 * - DynamicEnsembleForecastingOutput - The return type for the dynamicEnsembleForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicEnsembleForecastingInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical sales data in JSON format.  Must be an array of objects, where each object has a date and sales property. Example:  `[{"date": "2024-01-01", "sales": 100}, {"date": "2024-01-02", "sales": 110}]`'
    ),
  forecastHorizon: z
    .number()
    .describe('The number of days into the future to forecast.'),
});
export type DynamicEnsembleForecastingInput = z.infer<
  typeof DynamicEnsembleForecastingInputSchema
>;

const DynamicEnsembleForecastingOutputSchema = z.object({
  forecastData: z
    .string()
    .describe(
      'Forecasted sales data in JSON format, with date and predicted sales.  Must be an array of objects, where each object has a date and sales property. Example:  `[{"date": "2024-01-01", "sales": 100}, {"date": "2024-01-02", "sales": 110}]`'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for adjusting the forecast, for example, adjusting inventory levels or promotional plans.'
    ),
});
export type DynamicEnsembleForecastingOutput = z.infer<
  typeof DynamicEnsembleForecastingOutputSchema
>;

export async function dynamicEnsembleForecasting(
  input: DynamicEnsembleForecastingInput
): Promise<DynamicEnsembleForecastingOutput> {
  return dynamicEnsembleForecastingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicEnsembleForecastingPrompt',
  input: {schema: DynamicEnsembleForecastingInputSchema},
  output: {schema: DynamicEnsembleForecastingOutputSchema},
  prompt: `You are an expert in time series forecasting and business analytics.  Given the following historical sales data and the desired forecast horizon, generate a sales forecast.  Then provide recommendations for adjusting inventory levels or promotional plans based on the forecast.

Historical Data: {{{historicalData}}}
Forecast Horizon (days): {{{forecastHorizon}}}

Output the forecast data in JSON format, including the date and predicted sales for each day in the forecast horizon.  Also provide specific and actionable recommendations based on the forecast.

Ensure the forecast data is returned as a JSON array of objects containing "date" and "sales" keys.
`,
});

const dynamicEnsembleForecastingFlow = ai.defineFlow(
  {
    name: 'dynamicEnsembleForecastingFlow',
    inputSchema: DynamicEnsembleForecastingInputSchema,
    outputSchema: DynamicEnsembleForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
