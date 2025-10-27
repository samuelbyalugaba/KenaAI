'use server';
/**
 * @fileOverview A Genkit flow for importing contacts from Google People API.
 * This file defines the AI flow and the necessary tools to interact with
 * the Google People API to fetch and format contact information.
 *
 * - importGoogleContacts - The main exported function to trigger the import.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single contact from the People API
const GoogleContactSchema = z.object({
  name: z.string().describe('The full name of the contact.'),
  email: z.string().optional().describe('The primary email address of the contact.'),
  phone: z.string().optional().describe('The primary phone number of the contact.'),
});

// Define the schema for the list of contacts returned by the tool
const GoogleContactsListSchema = z.array(GoogleContactSchema);
export type GoogleContactsList = z.infer<typeof GoogleContactsListSchema>;


// Define the tool to get contacts from Google People API
const getGoogleContacts = ai.defineTool(
    {
        name: 'getGoogleContacts',
        description: 'Retrieves a list of contacts from the user\'s Google Contacts (People API). The user must grant permission.',
        inputSchema: z.object({}),
        outputSchema: GoogleContactsListSchema,
    },
    async () => {
        // In a real application, this function would use OAuth2 to authenticate with the
        // Google People API and fetch the user's contacts. For this demo, we will
        // return a mock list of contacts.
        console.log("AI TOOL: getGoogleContacts called. Returning mock data.");
        return [
            { name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1-555-0105' },
            { name: 'Bob Williams', email: 'b.williams@example.com', phone: '+1-555-0106' },
            { name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '+1-555-0107' },
            { name: 'Diana Miller', email: 'diana.m@example.com', phone: '+1-555-0108' },
            { name: 'Eve Davis', email: 'eve.d@example.com', phone: '+1-555-0109' },
        ];
    }
);


// Define the prompt that uses the tool
const importContactsPrompt = ai.definePrompt({
    name: 'importContactsPrompt',
    tools: [getGoogleContacts],
    prompt: `The user wants to import their contacts from Google.
    You must call the getGoogleContacts tool to fetch the contacts.
    Do not ask for confirmation, just call the tool.
    Once you have the list of contacts, do not output any text, just return the structured data from the tool.`,
});

// Define the main flow for importing contacts
const importGoogleContactsFlow = ai.defineFlow(
  {
    name: 'importGoogleContactsFlow',
    inputSchema: z.object({}),
    outputSchema: GoogleContactsListSchema,
  },
  async () => {
    const { output } = await importContactsPrompt();
    
    if (!output) {
      throw new Error('The AI model did not return any contacts.');
    }

    return output;
  }
);

/**
 * Executes the Google Contacts import flow.
 * This function initiates the AI flow to fetch contacts using the defined tool.
 * @returns A promise that resolves to a list of contacts.
 */
export async function importGoogleContacts(): Promise<GoogleContactsList> {
  return importGoogleContactsFlow({});
}
