import { z } from "zod";

export const ModuleNameSchema = z.enum([
    // Structural
    "SystemMap",
    "ModuleCards",
    "DiagramModule",
    // Explanation
    "ExplainerSection",
    "ConceptCards",
    "Timeline",
    // Decision
    "TradeoffMatrix",
    "ComparisonPanel",
    "ScorecardPanel",
    // Risk & Action
    "RiskPanel",
    "ActionPlan",
    // Data
    "Dashboard",
    // Assessment
    "QuizModule",
    // Interactive
    "InteractiveCalculator",
    "DecisionTree",
    "ProsCons",
    "ChecklistModule",
    "RecipeModule",
    // Visual/Structural
    "HierarchyTree",
    "MindMap",
    "FlashcardDeck",
    "NumberedProcess",
    "ScenarioComparison",
]);
export type ModuleName = z.infer<typeof ModuleNameSchema>;

export const ModuleInvocationSchema = z.object({
    slot: z.string(),
    module: ModuleNameSchema,
    moduleVersion: z.string(),
    config: z.record(z.string(), z.any()), // Validated strictly post-generation based on the specific module schema
});
export type ModuleInvocation = z.infer<typeof ModuleInvocationSchema>;

export const StudioSpecV1Schema = z.object({
    schemaVersion: z.literal("studio_spec.v1"),
    title: z.string(),
    layout: z.object({
        primarySlots: z.array(z.string()),
    }),
    modules: z.array(ModuleInvocationSchema),
}).strict();

export type StudioSpecV1 = z.infer<typeof StudioSpecV1Schema>;
