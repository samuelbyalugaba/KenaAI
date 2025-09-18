'use server';

/**
 * @fileOverview A Genkit flow for generating marketing campaign messages.
 *
 * - generateCampaignMessage - A function that generates a campaign message based on a title.
 * - GenerateCampaignMessageInput - The input type for the generateCampaignMessage function.
 * - GenerateCampaignMessageOutput - The return type for the generateCampaignMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignMessageInputSchema = z.object({
  campaignTitle: z.string().describe('The title of the marketing campaign.'),
});
export type GenerateCampaignMessageInput = z.infer<typeof GenerateCampaignMessageInputSchema>;

const GenerateCampaignMessageOutputSchema = z.object({
  message: z
    .string()
    .describe('The generated marketing message for the campaign.'),
});
export type GenerateCampaignMessageOutput = z.infer<typeof GenerateCampaignMessageOutputSchema>;

export async function generateCampaignMessage(input: GenerateCampaignMessageInput): Promise<GenerateCampaignMessageOutput> {
  return generateCampaignMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignMessagePrompt',
  input: {schema: GenerateCampaignMessageInputSchema},
  output: {schema: GenerateCampaignMessageOutputSchema},
  prompt: `You are a marketing expert. Write a concise and compelling message for a marketing campaign with the following title:
"{{{campaignTitle}}}"

Keep the message under 160 characters. Include a clear call to action.
`,
});

const generateCampaignMessageFlow = ai.defineFlow(
  {
    name: 'generateCampaignMessageFlow',
    inputSchema: GenerateCampaignMessageInputSchema,
    outputSchema: GenerateCampaignMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
