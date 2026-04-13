'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized advisories on how to improve crop yield.
 *
 * - yieldImprovementAdvisory - A function that generates yield improvement advisories based on farm details.
 * - YieldImprovementAdvisoryInput - The input type for the yieldImprovementAdvisory function.
 * - YieldImprovementAdvisoryOutput - The return type for the yieldImprovementAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldImprovementAdvisoryInputSchema = z.object({
  cropType: z.string().describe('The type of crop being cultivated.'),
  acreage: z.number().describe('The total acreage of the farm.'),
  soilType: z.string().describe('The type of soil in the farm (e.g., black, alluvial, red).'),
  irrigationType: z
    .string()
    .describe('The type of irrigation used (e.g., drip, sprinkler, rainfed).'),
  sowingDate: z.string().describe('The date when the crop was sown.'),
});
export type YieldImprovementAdvisoryInput = z.infer<typeof YieldImprovementAdvisoryInputSchema>;

const YieldImprovementAdvisoryOutputSchema = z.object({
  predictedYieldRange: z.string().describe('The estimated yield per acre.'),
  advisorySteps: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).describe('Actionable steps to improve yield.'),
  environmentalAnalysis: z.string().describe('Brief analysis of soil and irrigation compatibility.')
});
export type YieldImprovementAdvisoryOutput = z.infer<typeof YieldImprovementAdvisoryOutputSchema>;

export async function yieldImprovementAdvisory(input: YieldImprovementAdvisoryInput): Promise<YieldImprovementAdvisoryOutput> {
  return yieldImprovementAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yieldImprovementAdvisoryPrompt',
  input: {schema: YieldImprovementAdvisoryInputSchema},
  output: {schema: YieldImprovementAdvisoryOutputSchema},
  prompt: `You are an expert agronomist. Based on the following farm data, provide a yield improvement plan.

Crop: {{{cropType}}}
Acreage: {{{acreage}}} acres
Soil: {{{soilType}}}
Irrigation: {{{irrigationType}}}
Sowing Date: {{{sowingDate}}}

Provide:
1. A realistic predicted yield range.
2. 3-5 Actionable steps for the farmer to maximize yield.
3. Analysis of how soil and irrigation impact this specific crop.`,
});

const yieldImprovementAdvisoryFlow = ai.defineFlow(
  {
    name: 'yieldImprovementAdvisoryFlow',
    inputSchema: YieldImprovementAdvisoryInputSchema,
    outputSchema: YieldImprovementAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get advisory from AI.');
    }
    return output;
  }
);
