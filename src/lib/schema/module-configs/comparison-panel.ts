import { z } from "zod";

const ComparisonOptionSchema = z.object({
    name: z.string().describe("Name of this option"),
    description: z.string().describe("Plaintext. 1-2 sentences summarizing this option."),
    pros: z.array(z.string()).min(2).describe("3-5 key advantages"),
    cons: z.array(z.string()).min(2).describe("3-5 key disadvantages"),
    stats: z.record(z.string(), z.string()).describe("Key-value pairs of comparable metrics e.g. {'Performance': 'High', 'Cost': '$50/mo', 'Learning Curve': 'Steep'}"),
    badge: z.string().optional().describe("Optional label e.g. 'Recommended', 'Budget Pick', 'Enterprise Choice'"),
});

const ComparisonCriterionSchema = z.object({
    name: z.string().describe("Criterion name e.g. 'Performance', 'Ease of Use', 'Cost'"),
    optionAScore: z.number().min(1).max(5).describe("1-5 score for option A. 5 = excellent, 1 = poor."),
    optionBScore: z.number().min(1).max(5).describe("1-5 score for option B. 5 = excellent, 1 = poor. Must differ from optionAScore for meaningful comparison."),
    isMoreBetter: z.boolean().describe("True if higher score means better (e.g. performance). False for cost where lower is better."),
});

export const ComparisonPanelConfigSchema = z.object({
    heading: z.string().describe("Section heading e.g. 'React vs Vue' or 'Option A vs Option B'"),
    context: z.string().describe("Plaintext. 1-2 sentences explaining what is being compared and why it matters."),
    optionA: ComparisonOptionSchema,
    optionB: ComparisonOptionSchema,
    criteria: z.array(ComparisonCriterionSchema).min(3).describe("3-6 criteria for head-to-head scoring. Scores must vary — never assign same score to both options for all criteria."),
    recommendation: z.object({
        winner: z.enum(["optionA", "optionB", "depends"]).describe("Which option wins overall, or 'depends' if context-specific"),
        reasoning: z.string().describe("Plaintext. 1-2 sentences explaining the recommendation."),
        whenToChooseA: z.string().optional().describe("Scenarios where option A is the better choice"),
        whenToChooseB: z.string().optional().describe("Scenarios where option B is the better choice"),
    }),
    isMockData: z.boolean().default(false),
}).strict();

export type ComparisonPanelConfig = z.infer<typeof ComparisonPanelConfigSchema>;
