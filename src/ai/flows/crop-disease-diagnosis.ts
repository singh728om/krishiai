
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
    .describe('The language for the entire output (e.g., "Hindi", "English", "Marathi").'),
});
export type CropDiseaseDiagnosisInput = z.infer<typeof CropDiseaseDiagnosisInputSchema>;

const CropDiseaseDiagnosisOutputSchema = z.object({
  isCrop: z.boolean().describe('Whether the uploaded image contains a crop or plant.'),
  diseaseName: z.string().describe('The name of the detected crop disease or "Healthy" in the requested language.'),
  confidenceScore: z.number().describe('Confidence score of the diagnosis (0-100).'),
  severity: z.enum(['Mild', 'Moderate', 'Severe', 'None']).describe('The severity of the disease.'),
  affectedAreaPercentage: z.number().describe('The estimated percentage of the crop area affected by the disease (0-100).'),
  treatmentMedicines: z.array(z.string()).describe('List of specific medicines or treatments in the requested language.'),
  precautions: z.array(z.string()).describe('List of preventative measures in the requested language.'),
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
  prompt: `You are an expert agricultural pathologist for KrishiAI, specializing in Indian crops and local farming conditions.

Analyze the symptoms shown in this crop photo carefully: {{media url=photoDataUri}}

Your task:
1. Determine if the image is actually a crop or plant.
2. Identify the specific disease, pest, or nutrient deficiency.
3. Provide a confidence percentage for your diagnosis.
4. Categorize the severity.
5. Estimate the percentage of the plant/field affected.
6. Recommend specific medicines or organic treatments available in India.
7. Provide long-term preventative measures.
8. Give a detailed, actionable summary.

IMPORTANT: You MUST provide the following fields in the requested language ({{{language}}}):
- diseaseName
- treatmentMedicines
- precautions
- detailedAdvice

If the language is Hindi, use Devnagari script. If English, use English.`,
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
        throw new Error('AI model failed to return a valid diagnosis output.');
      }
      return output;
    } catch (error: any) {
      console.error('Genkit flow error in cropDiseaseDiagnosis:', error);
      throw new Error(`AI Diagnosis failed: ${error.message}`);
    }
  }
);
