import { z } from "zod";

const ExplainerSectionItemSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'intro' or 'how-it-works'"),
    title: z.string().describe("Section title, 2-6 words"),
    body: z.string().describe("Plaintext only. No markdown, no HTML. 2-5 sentences explaining this section."),
    callout: z.object({
        type: z.enum(["tip", "warning", "insight", "fact"]).describe("tip: practical advice. warning: caution. insight: non-obvious observation. fact: specific data point."),
        text: z.string().describe("Plaintext. 1-2 sentences max."),
    }).optional().describe("Optional highlighted callout box for this section"),
    bulletPoints: z.array(z.string()).optional().describe("Optional 3-5 supporting bullet points in plaintext"),
});

export const ExplainerSectionConfigSchema = z.object({
    heading: z.string().describe("Main section heading e.g. 'How Neural Networks Work'"),
    summary: z.string().describe("TL;DR shown prominently at top. Plaintext. 1-2 sentences capturing the core idea."),
    sections: z.array(ExplainerSectionItemSchema).min(2).describe("2-5 explanation sections covering different aspects"),
    keyTakeaways: z.array(z.string()).optional().describe("Optional 3-5 bullet point summary at the bottom"),
}).strict();

export type ExplainerSectionConfig = z.infer<typeof ExplainerSectionConfigSchema>;
