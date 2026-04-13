'use server';
/**
 * @fileOverview A Genkit flow for predicting the optimal selling time for agricultural commodities.
 *
 * - predictOptimalSellingTime - A function that handles the optimal selling time prediction process.
 * - OptimalSellingTimePredictionInput - The input type for the predictOptimalSellingTime function.
 * - OptimalSellingTimePredictionOutput - The return type for the predictOptimalSellingTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const OptimalSellingTimePredictionInputSchema = z.object({
  commodityName: z.string().describe('The name of the agricultural commodity (e.g., "Wheat", "Tomato").'),
  currentPrice: z.number().describe('The current market price of the commodity in INR.'),
  priceTrendDescription: z.string().describe('A brief description of the recent market price trend, such as "prices have been steadily increasing", "prices are volatile", or "prices are stable".'),
  msp: z.number().optional().describe('The Minimum Support Price (MSP) for the commodity, if applicable.'),
});
export type OptimalSellingTimePredictionInput = z.infer<typeof OptimalSellingTimePredictionInputSchema>;

// Output Schema
const OptimalSellingTimePredictionOutputSchema = z.object({
  optimalSellingTime: z.string().describe('Predicted best time to sell the commodity, e.g., "in 2-3 weeks", "now", "wait for 1 month".'),
  explanation: z.string().describe('A brief explanation (2-3 sentences) for the prediction.'),
  expectedPriceChange: z.string().optional().describe('Predicted price change, e.g., "prices expected to rise 8%", "prices expected to drop 5%", "no significant change expected".'),
});
export type OptimalSellingTimePredictionOutput = z.infer<typeof OptimalSellingTimePredictionOutputSchema>;

// Prompt definition
const optimalSellingTimePrompt = ai.definePrompt({
  name: 'optimalSellingTimePrompt',
  input: {schema: OptimalSellingTimePredictionInputSchema},
  output: {schema: OptimalSellingTimePredictionOutputSchema},
  prompt: `You are an expert market analyst specializing in agricultural commodities in India. Your task is to provide farmers with advice on the optimal time to sell their produce to maximize profit.

Based on the following information, predict the best time for the farmer to sell their commodity and provide a brief explanation (2-3 sentences). Also, estimate the expected price change.

Commodity: {{{commodityName}}}
Current Market Price: ₹{{{currentPrice}}}
Recent Price Trend: {{{priceTrendDescription}}}
{{#if msp}}Minimum Support Price (MSP): ₹{{{msp}}}{{/if}}`,
});

// Flow definition
const optimalSellingTimePredictionFlow = ai.defineFlow(
  {
    name: 'optimalSellingTimePredictionFlow',
    inputSchema: OptimalSellingTimePredictionInputSchema,
    outputSchema: OptimalSellingTimePredictionOutputSchema,
  },
  async (input) => {
    const {output} = await optimalSellingTimePrompt(input);
    if (!output) {
      throw new Error('Failed to get prediction from AI model.');
    }
    return output;
  }
);

// Wrapper function
export async function predictOptimalSellingTime(input: OptimalSellingTimePredictionInput): Promise<OptimalSellingTimePredictionOutput> {
  return optimalSellingTimePredictionFlow(input);
}
