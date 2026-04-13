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
  sowingDate: z.string().describe('The date when the crop was sown (e.g., 