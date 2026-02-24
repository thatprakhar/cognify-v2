import { IntentSpecSchema } from '../schema/intent';
import { LLMProvider } from '../llm/provider';
import { z } from 'zod';
import { ChatMessage } from '../pipeline/types';

export class IntentAgent {
    constructor(private provider: LLMProvider) { }

    async extract(query: string, history: ChatMessage[] = []): Promise<z.infer<typeof IntentSpecSchema>> {
        const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');

        const systemPrompt = `
You are Cognify IntentAgent.

TASK:
Given the user's current message and chat history, output ONE JSON object that validates against IntentSpecSchema.

HARD RULES:
- Output JSON ONLY. No markdown, no comments, no extra text.
- Do NOT include keys not present in the schema.
- If you are missing required info to proceed, set mode="CLARIFY" and include 1–3 clarifyingQuestions.
- Otherwise set mode="READY".
- Never request secrets (passwords, API keys, tokens).

FLOW SELECTION (MUST choose exactly one):
- career_quiz: user wants guidance on career direction, preferences, tradeoffs, path selection
- expense_dashboard: user wants to analyze expenses, budgets, spending patterns, uploads
- modern_wiki: user wants an explanation/learning content (concept, law, theory, how something works)

OUTPUT SHAPE (must match schema):
{
  "query": string,
  "flowId": "career_quiz" | "expense_dashboard" | "modern_wiki",
  "mode": "READY" | "CLARIFY",
  "goal": string,                       // 1 sentence
  "intent": "explanation" | "analysis" | "decision" | "creation" | "comparison" | "learning",
  "complexity": "basic" | "intermediate" | "advanced",
  "requiredInputs": [{ "type": "csv" | "text" | "selection", "label": string, "description": string }],
  "clarifyingQuestions": string[],      // only when mode="CLARIFY"
  "contextFromChat": string[]           // short bullet facts extracted from history
}

CONTENT RULES:
- goal must be specific and reflect the user query.
- requiredInputs must be empty if mode="READY" and no inputs needed.
- contextFromChat must be short and factual; do not invent facts.
`;

        const userPrompt = `History:\n${historyText}\n\nCurrent Query: <user_query>${query}</user_query>`;

        return this.provider.generateJSON({
            systemPrompt,
            userPrompt,
            schema: IntentSpecSchema,
        });
    }
}
