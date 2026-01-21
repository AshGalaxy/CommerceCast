
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal times and products for running promotions.
 *
 * It includes:
 * - `smartPromotionPlanner`: The main function to trigger the promotion planning flow.
 * - `SmartPromotionPlannerInput`: The input type for the `smartPromotionPlanner` function.
 * - `SmartPromotionPlannerOutput`: The output type for the `smartPromotionPlanner` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartPromotionPlannerInputSchema = z.object({
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data in JSON format, including fields like date, product_id, sales quantity, product_category, region, etc.'
    ),
  currentInventoryLevels: z
    .string()
    .describe(
      'Current inventory levels for each product, in JSON format. Example: [{"product_id": "prod_A", "quantity": 500}]'
    ),
  forecastData: z
    .string()
    .optional()
    .describe('Optional: Future demand forecast data in JSON format, with columns for date and predicted_sales.'),
  analyticalInsights: z
    .string()
    .optional()
    .describe('Analytical insights from the Promotion Engine (DoS, Stock Status).'),
});
export type SmartPromotionPlannerInput = z.infer<
  typeof SmartPromotionPlannerInputSchema
>;

const SmartPromotionPlannerOutputSchema = z.object({
  promotionSuggestions: z.array(z.object({
    product_id: z.string().describe('The ID of the product being promoted.'),
    suggestion: z.string().describe('A description of the promotion suggestion, including any targeting (e.g., region or category).'),
    optimal_start_date: z.string().describe('The recommended start date for the promotion in YYYY-MM-DD format.'),
    optimal_end_date: z.string().describe('The recommended end date for the promotion in YYYY-MM-DD format.'),
    predicted_impact: z.string().describe('The predicted impact of the promotion on sales (e.g., "15-20% sales lift in the North region").'),
  })).describe('A list of promotion suggestions for different products.')
});

export type SmartPromotionPlannerOutput = z.infer<typeof SmartPromotionPlannerOutputSchema>;


export async function smartPromotionPlanner(
  input: SmartPromotionPlannerInput
): Promise<SmartPromotionPlannerOutput> {
  return smartPromotionPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartPromotionPlannerPrompt',
  input: { schema: SmartPromotionPlannerInputSchema },
  output: { schema: SmartPromotionPlannerOutputSchema },
  prompt: `You are an expert promotion planner for an e-commerce business. Your task is to analyze historical sales data, current inventory levels, and future demand forecasts to suggest optimal promotions.

Use the rich historical data, which may include regions and categories, to find opportunities. Look for slow-moving products in high-inventory, seasonal trends, or categories with high interest but low conversion.

Most importantly, use the demand forecast to plan ahead. If a product's demand is predicted to be low, suggest a promotion to boost sales. If demand is high, a promotion may not be needed.

Historical Sales Data (JSON):
{{{historicalSalesData}}}

Current Inventory Levels (JSON):
{{{currentInventoryLevels}}}

{{#if forecastData}}
Demand Forecast Data (JSON):
{{{forecastData}}}
{{/if}}

{{#if analyticalInsights}}
CRITICAL: Use these pre-calculated Analytical Insights to guide your strategy:
{{{analyticalInsights}}}

RULES based on Insights:
- If Status is 'Overstock': You MUST recommend a Clearance/Discount strategy to free up cash.
- If Status is 'Healthy': Recommend strategic bundles or small discounts to maximize margin.
- If Status is 'Low Stock': Do NOT recommend a discount. Suggest a "Back in Stock" alert or Pre-order strategy.
{{/if}}

Provide a list of data-driven promotion suggestions. Each suggestion must include the product ID, a clear suggestion, the optimal start and end dates, and a specific prediction of the promotion's impact.`,
});


const smartPromotionPlannerFlow = ai.defineFlow(
  {
    name: 'smartPromotionPlannerFlow',
    inputSchema: SmartPromotionPlannerInputSchema,
    outputSchema: SmartPromotionPlannerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

