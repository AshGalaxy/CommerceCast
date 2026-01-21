'use server';
/**
 * @fileOverview A comprehensive AI report generator.
 *
 * - generateReport - A function that creates a detailed business report from sales data.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  salesData: z.string().describe('Historical sales data in CSV format.'),
  reportType: z.string().describe('The type of report to generate (e.g. "executive_summary").'),
  forecastData: z.string().optional().describe('Optional: Future demand forecast data in JSON format.')
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  title: z.string().describe('The title of the generated report.'),
  executiveSummary: z.string().describe('A high-level summary of the key findings. Should be formatted in Markdown.'),
  kpis: z.array(z.object({
    metric: z.string().describe('The name of the Key Performance Indicator.'),
    value: z.string().describe('The value of the KPI.'),
    change: z.string().optional().describe('The change from the previous period (e.g., "+20%").'),
  })).describe('A list of key performance indicators.'),
  analysis: z.string().describe('A detailed analysis of trends, patterns, and outliers in the data. Should be formatted in Markdown, using lists and bold text.'),
  recommendations: z.string().describe('Actionable recommendations based on the analysis. Should be formatted as a Markdown list.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;


export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are a world-class business analyst, tasked with creating a detailed and professional report. The user has requested a '{{reportType}}' report.

CRITICAL INSTRUCTIONS:
1.  **Currency**: All monetary values MUST be presented in Indian Rupees (INR) using the '₹' symbol. DO NOT use '$'.
2.  **Brevity and Clarity**: Your analysis must be concise, use strong business keywords, and be easy for a busy executive to understand. Avoid jargon.
3.  **Formatting**: Use excellent Markdown formatting (headings, bold text, bullet points) for maximum readability.

REPORT SPECIFICATIONS:
- If 'reportType' is 'executive_summary':
    - **Executive Summary**: STRICTLY under 100 words. Focus on the most critical, high-level takeaways (e.g., overall performance, major highlights, and key risks).
    - **Analysis**: STRICTLY under 250 words. Provide a concise analysis of major trends.
- If 'reportType' is 'deep_dive_sales':
    - **Executive Summary**: Around 150 words.
    - **Analysis**: Provide a more granular analysis focusing on product performance, regional sales, and customer behavior.

DATA FOR ANALYSIS:
- Historical Sales (CSV): {{{salesData}}}
{{#if forecastData}}
- Demand Forecast (JSON): {{{forecastData}}}
- **Synthesize Insights**: You MUST integrate the forecast data into your 'Analysis' and 'Recommendations'. Your insights must be forward-looking, considering both past performance and future demand.
{{/if}}

REQUIRED REPORT STRUCTURE:
1.  **Title**: A clear, descriptive title.
2.  **Executive Summary**: A concise overview adhering to the word limits above.
3.  **Key Performance Indicators (KPIs)**: Calculate key metrics like Total Revenue, Total Sales Volume, Average Order Value, and number of unique customers. All currency MUST be in INR (₹).
4.  **Analysis**: A detailed breakdown adhering to the word limits and instructions above.
5.  **Recommendations**: Provide specific, data-driven, and actionable recommendations based on your analysis. Format as a Markdown list.

Generate a comprehensive and professional report based on these instructions.`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
