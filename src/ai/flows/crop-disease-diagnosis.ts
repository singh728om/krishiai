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
  treatmentMedicines: z.array(z.string()).describe('List of specific medicines or chemicals recommended for treatment.'),
  precautions: z.array(z.string()).describe('List of preventative measures and precautions to take.'),
  detailedAdvice: z.string().describe('Comprehensive actionable advice in the specified language.')
});
export type CropDiseaseDiagnosisOutput = z.infer<typeof CropDiseaseDiagnosisOutputSchema>;

export async function cropDiseaseDiagnosis(input: CropDiseaseDiagnosisInput): Promise<CropDiseaseDiagnosisOutput> {
  return cropDiseaseDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropDiseaseDiagnosisPrompt',
  input: {schema: CropDiseaseDiagnosisInputSchema},
  output: {schema: CropDiseaseDiagnosisOutputSchema},
  prompt: `You are an expert agricultural pathologist for KrishiAI, specializing in Indian crops. 

Analyze this crop photo: {{media url=photoDataUri}}

Your task:
1. Identify the disease if present.
2. Provide a confidence score.
3. List specific medicines/fungicides/pesticides (treatmentMedicines).
4. List long-term precautions to prevent recurrence (precautions).
5. Provide a summary of actionable steps (detailedAdvice) in the language: {{{language}}}.

If the photo is not of a crop, identify that and set diseaseName to "Not a Crop".`,
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
