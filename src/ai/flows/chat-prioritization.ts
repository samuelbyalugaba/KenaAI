'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing chats based on sentiment.
 *
 * - chatPrioritization - A function that prioritizes chats based on sentiment.
 * - ChatPrioritizationInput - The input type for the chatPrioritization function.
 * - ChatPrioritizationOutput - The return type for the chatPrioritization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatPrioritizationInputSchema = z.object({
  chatText: z.string().describe('The text content of the chat message.'),
});
export type ChatPrioritizationInput = z.infer<typeof ChatPrioritizationInputSchema>;

const ChatPrioritizationOutputSchema = z.object({
  priority: z
    .enum(['urgent', 'high', 'normal', 'low'])
    .describe('The priority level of the chat based on sentiment.'),
  sentimentAnalysis: z
    .string()
    .describe('The overall sentiment analysis of the chat message.'),
});
export type ChatPrioritizationOutput = z.infer<typeof ChatPrioritizationOutputSchema>;

export async function chatPrioritization(input: ChatPrioritizationInput): Promise<ChatPrioritizationOutput> {
  return chatPrioritizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrioritizationPrompt',
  input: {schema: ChatPrioritizationInputSchema},
  output: {schema: ChatPrioritizationOutputSchema},
  prompt: `You are an AI assistant that prioritizes chats based on their urgency and sentiment.\nAnalyze the following chat message and determine its priority level (urgent, high, normal, low) and overall sentiment.\n\nChat Message: {{{chatText}}}\n\nProvide your analysis in JSON format.`,
});

const chatPrioritizationFlow = ai.defineFlow(
  {
    name: 'chatPrioritizationFlow',
    inputSchema: ChatPrioritizationInputSchema,
    outputSchema: ChatPrioritizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
