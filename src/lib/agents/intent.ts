import { IntentSpecSchema } from '../schema/intent';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';
import { ChatMessage } from '../pipeline/types';

export class IntentAgent {
 constructor(private provider: LLMProvider) { }

 async extract(query: string, history: ChatMessage[] = []): Promise<z.infer<typeof IntentSpecSchema>> {
 const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');

 const systemPrompt = `You are an intent extraction agent for Cognify. Given a user's chat message
and conversation history, output a JSON object matching the IntentSpec schema.

Rules:
- NEVER output free text. ONLY output valid JSON.
- Identify the user's goal: understand, decide, analyze, create, compare, or learn?
- Identify the domain and complexity level.
- If the user needs to provide data before proceeding, list them in requiredInputs.
- If this is a follow-up message, include relevant context from chat history.

Output ONLY this JSON structure:
{ 
 "query": "...", 
 "intent": "explanation" | "analysis" | "decision" | "creation" | "comparison" | "learning", 
 "domain": "...", 
 "complexity": "basic" | "intermediate" | "advanced",
 "goalType": "understand" | "decide" | "analyze" | "create" | "compare" | "learn", 
 "requiredInputs": [{ "type": "csv" | "text" | "selection", "label": "...", "description": "..." }], 
 "contextFromChat": [] 
}`;

 const userPrompt = `History:\n${historyText}\n\nCurrent Query: <user_query>${query}</user_query>`;

 return this.provider.generateJSON({
 systemPrompt,
 userPrompt,
 schema: IntentSpecSchema,
 });
 }
}
