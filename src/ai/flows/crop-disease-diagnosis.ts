
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
  confidenceScore: z.number().describe('Confidence score of the diagnosis (0-100).'),
  severity: z.enum(['Mild', 'Moderate', 'Severe']).describe('The severity of the disease.'),
  affectedAreaPercentage: z.number().describe('The estimated percentage of the crop area affected by the disease (0-100).'),
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
  prompt: `You are an expert agricultural pathologist for KrishiAI, specializing in Indian crops and pests.

Analyze the symptoms shown in this crop photo carefully: {{media url=photoDataUri}}

Your task:
1. Identify the specific disease or pest infestation.
2. Provide a confidence percentage for your diagnosis.
3. Categorize the severity as Mild, Moderate, or Severe.
4. Estimate the percentage of the plant/field affected.
5. Recommend specific medicines, fungicides, or organic treatments available in India.
6. Provide long-term preventative measures.
7. Give a detailed, actionable summary in the requested language: {{{language}}}.

If the uploaded image is not a plant or crop, set diseaseName to "Not a Crop" and provide a score of 0.`,
});

const cropDiseaseDiagnosisFlow = ai.defineFlow(
  {
    name: 'cropDiseaseDiagnosisFlow',
    inputSchema: CropDiseaseDiagnosisInputSchema,
    outputSchema: CropDiseaseDiagnosisOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI model returned an empty diagnosis.');
      }
      return output;
    } catch (error: any) {
      console.error('Genkit flow error:', error);
      throw new Error(`AI Diagnosis failed: ${error.message}`);
    }
  }
);
