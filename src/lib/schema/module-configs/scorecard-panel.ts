import { z } from "zod";

export const ScorecardDimensionSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Short hyphenated ID like 'performance' or 'ease-of-use'"),
    name: z.string().describe("Dimension name e.g. 'Performance', 'Scalability', 'Developer Experience'"),
    score: z.number().min(0).max(10).describe("Raw score 0-10. Be honest — vary scores meaningfully."),
    rationale: z.string().describe("Plaintext. 1-2 sentences explaining why this score was given."),
    status: z.enum(["strong", "adequate", "weak", "critical"]).describe("strong: 8-10. adequate: 5-7. weak: 3-4. critical: 0-2."),
});

export const ScorecardPanelConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'PostgreSQL Evaluation'"),
    subject: z.string().describe("What is being scored e.g. 'PostgreSQL', 'My Business Plan', 'This Architecture'"),
    dimensions: z.array(ScorecardDimensionSchema).min(3).describe("3-7 dimensions to evaluate. Vary scores — a perfect 10 across all dimensions is not credible."),
    verdict: z.string().describe("Plaintext 1-sentence overall assessment summarizing the scorecard."),
    // overallScore is computed server-side
}).strict();

export type ScorecardPanelConfig = z.infer<typeof ScorecardPanelConfigSchema>;
