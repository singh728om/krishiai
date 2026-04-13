'use server';
/**
 * @fileOverview An AI agent for detecting crop diseases from a photo and providing treatment recommendations.
 *
 * - cropDiseaseDiagnosis - A function that handles the crop disease diagnosis process.
 * - CropDiseaseDiagnosisInput - The input type for the cropDiseaseDiagnosis function.
 * - CropDiseaseDiagnosisOutput - The return type for the cropDiseaseDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDiseaseDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z
    .string()
    .describe('The vernacular language for the treatment recommendation (e.g., "Hindi", "English", "Marathi").'),
});
export type CropDiseaseDiagnosisInput = z.infer<typeof CropDiseaseDiagnosisInputSchema>;

const CropDiseaseDiagnosisOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the detected crop disease.'),
  confidenceScore: z.number().min(0).max(100).describe('Confidence score of the diagnosis (0-100%).'),
  severity: z.enum(['Mild', 'Moderate', 'Severe']).describe('The severity of the disease.'),
  affectedAreaPercentage: z.number().min(0).max(100).describe('The estimated percentage of the crop area affected by the disease (0-100%).'),
  treatmentRecommendation: z
    .string()
    .describe('A detailed, actionable treatment recommendation in the specified vernacular language.'),
});
export type CropDiseaseDiagnosisOutput = z.infer<typeof CropDiseaseDiagnosisOutputSchema>;

export async function cropDiseaseDiagnosis(input: CropDiseaseDiagnosisInput): Promise<CropDiseaseDiagnosisOutput> {
  return cropDiseaseDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropDiseaseDiagnosisPrompt',
  input: {schema: CropDiseaseDiagnosisInputSchema},
  output: {schema: CropDiseaseDiagnosisOutputSchema},
  prompt: `You are an expert agricultural diagnostician for KrishiAI, specializing in Indian crops and diseases. Your task is to analyze the provided crop photo and description to accurately identify any diseases, assess their severity, and provide actionable treatment recommendations.

Analyze the following crop image and information:

Photo: {{media url=photoDataUri}}

Based on your analysis, provide a precise diagnosis including:
1. The common name of the disease.
2. A confidence score for your diagnosis.
3. The severity of the disease (Mild, Moderate, or Severe).
4. The estimated percentage of the crop area affected.
5. A detailed, actionable treatment recommendation tailored to the disease and severity. The recommendation MUST be provided in the following language: {{{language}}}.

Ensure your response is structured exactly according to the output schema requirements.`,
});

const cropDiseaseDiagnosisFlow = ai.defineFlow(
  {
    name: 'cropDiseaseDiagnosisFlow',
    inputSchema: CropDiseaseDiagnosisInputSchema,
    outputSchema: CropDiseaseDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a valid diagnosis from the AI.');
    }
    return output;
  }
);
