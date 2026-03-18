import { z } from "zod";

export const ConceptCardSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'api-gateway' or 'neural-net'"),
    title: z.string().describe("Card title, 2-5 words"),
    body: z.string().describe("Plaintext only. No markdown, no HTML. 2-4 sentences explaining this concept."),
    tags: z.array(z.string()).optional().describe("Optional category tags for grouping"),
    icon: z.string().optional().describe("Optional Lucide icon name e.g. 'Database', 'Shield', 'Zap'"),
    badge: z.string().optional().describe("Optional short badge label e.g. 'Core', 'Advanced', 'Optional'"),
    linkedCardIds: z.array(z.string()).optional().describe("IDs of related cards within this same module"),
});

export const ConceptCardsConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'Key Concepts' or 'Core Components'"),
    displayMode: z.enum(["grid", "list", "spotlight"]).describe("grid: card grid layout. list: compact vertical list. spotlight: first card is featured large."),
    cards: z.array(ConceptCardSchema).min(2).describe("2-8 cards. Each card is a concept, entity, component, or idea."),
}).strict();

export type ConceptCardsConfig = z.infer<typeof ConceptCardsConfigSchema>;
