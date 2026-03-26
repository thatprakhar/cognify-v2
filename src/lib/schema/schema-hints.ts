import { z } from "zod";
import { SystemMapConfigSchema } from "./module-configs/system-map";
import { ModuleCardsConfigSchema } from "./module-configs/module-cards";
import { TradeoffMatrixConfigSchema } from "./module-configs/tradeoff-matrix";
import { RiskPanelConfigSchema } from "./module-configs/risk-panel";
import { ConceptCardsConfigSchema } from "./module-configs/concept-cards";
import { ComparisonPanelConfigSchema } from "./module-configs/comparison-panel";
import { TimelineConfigSchema } from "./module-configs/timeline";
import { ExplainerSectionConfigSchema } from "./module-configs/explainer-section";
import { ScorecardPanelConfigSchema } from "./module-configs/scorecard-panel";
import { QuizModuleConfigSchema } from "./module-configs/quiz-module";
import { DiagramModuleConfigSchema } from "./module-configs/diagram-module";
import { DashboardConfigSchema } from "./module-configs/dashboard";
import { ActionPlanConfigSchema } from "./module-configs/action-plan";
import { InteractiveCalculatorConfigSchema } from "./module-configs/interactive-calculator";
import { DecisionTreeConfigSchema } from "./module-configs/decision-tree";
import { ProsConsConfigSchema } from "./module-configs/pros-cons";
import { ChecklistModuleConfigSchema } from "./module-configs/checklist-module";
import { RecipeModuleConfigSchema } from "./module-configs/recipe-module";
import { HierarchyTreeConfigSchema } from "./module-configs/hierarchy-tree";
import { MindMapConfigSchema } from "./module-configs/mind-map";
import { FlashcardDeckConfigSchema } from "./module-configs/flashcard-deck";
import { NumberedProcessConfigSchema } from "./module-configs/numbered-process";
import { ScenarioComparisonConfigSchema } from "./module-configs/scenario-comparison";

const CONFIG_SCHEMAS: Record<string, z.ZodTypeAny> = {
    SystemMap: SystemMapConfigSchema,
    ModuleCards: ModuleCardsConfigSchema,
    TradeoffMatrix: TradeoffMatrixConfigSchema,
    RiskPanel: RiskPanelConfigSchema,
    ConceptCards: ConceptCardsConfigSchema,
    ComparisonPanel: ComparisonPanelConfigSchema,
    Timeline: TimelineConfigSchema,
    ExplainerSection: ExplainerSectionConfigSchema,
    ScorecardPanel: ScorecardPanelConfigSchema,
    QuizModule: QuizModuleConfigSchema,
    DiagramModule: DiagramModuleConfigSchema,
    Dashboard: DashboardConfigSchema,
    ActionPlan: ActionPlanConfigSchema,
    InteractiveCalculator: InteractiveCalculatorConfigSchema,
    DecisionTree: DecisionTreeConfigSchema,
    ProsCons: ProsConsConfigSchema,
    ChecklistModule: ChecklistModuleConfigSchema,
    RecipeModule: RecipeModuleConfigSchema,
    HierarchyTree: HierarchyTreeConfigSchema,
    MindMap: MindMapConfigSchema,
    FlashcardDeck: FlashcardDeckConfigSchema,
    NumberedProcess: NumberedProcessConfigSchema,
    ScenarioComparison: ScenarioComparisonConfigSchema,
};

/** Recursively extract field requirements from a JSON Schema node */
function extractFields(schema: any, prefix: string, required: string[]): string[] {
    if (!schema?.properties) return [];
    const lines: string[] = [];

    for (const [key, def] of Object.entries(schema.properties as Record<string, any>)) {
        const path = prefix ? `${prefix}.${key}` : key;
        const isRequired = required.includes(key);
        const marker = isRequired ? "REQUIRED" : "optional";

        if (def.type === "array") {
            const itemDef = def.items;
            if (itemDef?.properties) {
                const itemRequired: string[] = itemDef.required ?? [];
                lines.push(`${path}[]: array of objects (${marker})`);
                lines.push(...extractFields(itemDef, `${path}[]`, itemRequired));
            } else if (def.enum) {
                lines.push(`${path}: array of enum(${def.enum.join("|")}) (${marker})`);
            } else {
                const itemType = itemDef?.type ?? "any";
                lines.push(`${path}[]: array of ${itemType} (${marker})`);
            }
        } else if (def.type === "object" && def.properties) {
            const subRequired: string[] = def.required ?? [];
            lines.push(`${path}: object (${marker})`);
            lines.push(...extractFields(def, path, subRequired));
        } else if (def.enum) {
            lines.push(`${path}: one of ${def.enum.map((v: any) => `"${v}"`).join("|")} (${marker})`);
        } else if (def.anyOf || def.oneOf) {
            lines.push(`${path}: ${def.type ?? "any"} (${marker})`);
        } else {
            lines.push(`${path}: ${def.type ?? "any"} (${marker})`);
        }
    }
    return lines;
}

/**
 * Returns a concise field-requirements block derived directly from the Zod schema.
 * This is injected into LLM prompts to ensure generated configs always match the schema.
 */
export function getSchemaRequirements(moduleName: string): string {
    const schema = CONFIG_SCHEMAS[moduleName];
    if (!schema) return "";

    try {
        const jsonSchema = z.toJSONSchema(schema) as any;
        const topRequired: string[] = jsonSchema.required ?? [];
        const lines = extractFields(jsonSchema, "", topRequired);
        if (lines.length === 0) return "";
        return `REQUIRED FIELDS (derived from schema — follow exactly):\n${lines.map(l => `  ${l}`).join("\n")}`;
    } catch {
        return "";
    }
}
