'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing long chat threads using AI.
 *
 * The flow takes a chat thread as input and returns a concise summary of the conversation's key points.
 *
 * @interface IntelligentChatSummaryInput - Defines the input schema for the intelligentChatSummary function.
 * @interface IntelligentChatSummaryOutput - Defines the output schema for the intelligentChatSummary function.
 * @function intelligentChatSummary - A wrapper function that calls the intelligentChatSummaryFlow with the input and returns the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentChatSummaryInputSchema = z.object({
  chatThread: z
    .string()
    .describe('The complete chat thread to be summarized.'),
});

export type IntelligentChatSummaryInput = z.infer<
  typeof IntelligentChatSummaryInputSchema
>;

const IntelligentChatSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the chat thread.'),
});

export type IntelligentChatSummaryOutput = z.infer<
  typeof IntelligentChatSummaryOutputSchema
>;

export async function intelligentChatSummary(
  input: IntelligentChatSummaryInput
): Promise<IntelligentChatSummaryOutput> {
  return intelligentChatSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentChatSummaryPrompt',
  input: {schema: IntelligentChatSummaryInputSchema},
  output: {schema: IntelligentChatSummaryOutputSchema},
  prompt: `You are an AI expert specializing in summarizing chat threads.

  Please provide a concise summary of the key points in the following chat thread:
  \"{{{chatThread}}}\".
  The summary should be no more than 200 words.
  `,
});

const intelligentChatSummaryFlow = ai.defineFlow(
  {
    name: 'intelligentChatSummaryFlow',
    inputSchema: IntelligentChatSummaryInputSchema,
    outputSchema: IntelligentChatSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
