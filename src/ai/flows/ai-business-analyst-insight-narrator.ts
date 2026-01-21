'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating plain-language summaries of dashboard data with actionable advice using an LLM.
 *
 * - generateBusinessInsights - A function that generates business insights from dashboard data.
 * - GenerateBusinessInsightsInput - The input type for the generateBusinessInsights function.
 * - GenerateBusinessInsightsOutput - The return type for the generateBusinessInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessInsightsInputSchema = z.object({
  dashboardData: z.string().describe('The dashboard data to analyze.'),
});
export type GenerateBusinessInsightsInput = z.infer<typeof GenerateBusinessInsightsInputSchema>;

const GenerateBusinessInsightsOutputSchema = z.object({
  summary: z.string().describe('A plain-language summary of the dashboard data. Format this using Markdown.'),
  actionableAdvice: z.string().describe('Actionable advice based on the dashboard data. Format this as a Markdown list.'),
});
export type GenerateBusinessInsightsOutput = z.infer<typeof GenerateBusinessInsightsOutputSchema>;

export async function generateBusinessInsights(input: GenerateBusinessInsightsInput): Promise<GenerateBusinessInsightsOutput> {
  return generateBusinessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessInsightsPrompt',
  input: {schema: GenerateBusinessInsightsInputSchema},
  output: {schema: GenerateBusinessInsightsOutputSchema},
  prompt: `You are a professional business analyst. Analyze the following dashboard data and provide a concise, plain-language summary and a list of actionable advice.

Use Markdown for formatting. For the actionable advice, use a bulleted list.

Dashboard Data: {{{dashboardData}}}
`,
});

const generateBusinessInsightsFlow = ai.defineFlow(
  {
    name: 'generateBusinessInsightsFlow',
    inputSchema: GenerateBusinessInsightsInputSchema,
    outputSchema: GenerateBusinessInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
