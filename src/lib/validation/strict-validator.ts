import { StudioSpecV1, StudioSpecV1Schema } from "../schema/studio-spec";
import { SystemMapConfigSchema } from "../schema/module-configs/system-map";
import { ModuleCardsConfigSchema } from "../schema/module-configs/module-cards";
import { TradeoffMatrixConfigSchema } from "../schema/module-configs/tradeoff-matrix";
import { RiskPanelConfigSchema } from "../schema/module-configs/risk-panel";
import { ConceptCardsConfigSchema } from "../schema/module-configs/concept-cards";
import { ComparisonPanelConfigSchema } from "../schema/module-configs/comparison-panel";
import { TimelineConfigSchema } from "../schema/module-configs/timeline";
import { ExplainerSectionConfigSchema } from "../schema/module-configs/explainer-section";
import { ScorecardPanelConfigSchema } from "../schema/module-configs/scorecard-panel";
import { QuizModuleConfigSchema } from "../schema/module-configs/quiz-module";
import { DiagramModuleConfigSchema } from "../schema/module-configs/diagram-module";
import { DashboardConfigSchema } from "../schema/module-configs/dashboard";
import { ActionPlanConfigSchema } from "../schema/module-configs/action-plan";
import { InteractiveCalculatorConfigSchema } from "../schema/module-configs/interactive-calculator";
import { DecisionTreeConfigSchema } from "../schema/module-configs/decision-tree";
import { ProsConsConfigSchema } from "../schema/module-configs/pros-cons";
import { ChecklistModuleConfigSchema } from "../schema/module-configs/checklist-module";
import { RecipeModuleConfigSchema } from "../schema/module-configs/recipe-module";
import { HierarchyTreeConfigSchema } from "../schema/module-configs/hierarchy-tree";
import { MindMapConfigSchema } from "../schema/module-configs/mind-map";
import { FlashcardDeckConfigSchema } from "../schema/module-configs/flashcard-deck";
import { NumberedProcessConfigSchema } from "../schema/module-configs/numbered-process";
import { ScenarioComparisonConfigSchema } from "../schema/module-configs/scenario-comparison";

type ValidationResult = {
    isValid: boolean;
    errors: string[];
    autoFilledSpec?: StudioSpecV1;
};

const configSchemas: Record<string, any> = {
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

/** Auto-fill empty critical arrays to prevent downstream crashes */
function autoFillArrays(inv: any): void {
    const m = inv.module;
    if (!inv.config) inv.config = {};

    // Original modules
    if (m === "SystemMap") {
        if (!inv.config.nodes) inv.config.nodes = [];
        if (!inv.config.edges) inv.config.edges = [];
    }
    if (m === "ModuleCards" && !inv.config.modules) inv.config.modules = [];
    if (m === "TradeoffMatrix") {
        if (!inv.config.options) inv.config.options = [];
        if (!inv.config.criteria) inv.config.criteria = [];
        if (!inv.config.scores) inv.config.scores = [];
    }
    if (m === "RiskPanel" && !inv.config.risks) inv.config.risks = [];

    // New modules
    if (m === "ConceptCards" && !inv.config.cards) inv.config.cards = [];
    if (m === "Timeline" && !inv.config.items) inv.config.items = [];
    if (m === "ExplainerSection") {
        if (!inv.config.sections) inv.config.sections = [];
    }
    if (m === "ScorecardPanel" && !inv.config.dimensions) inv.config.dimensions = [];
    if (m === "QuizModule" && !inv.config.questions) inv.config.questions = [];
    if (m === "ActionPlan" && !inv.config.phases) inv.config.phases = [];
    if (m === "Dashboard" && !inv.config.charts) inv.config.charts = [];
    if (m === "ComparisonPanel") {
        if (!inv.config.criteria) inv.config.criteria = [];
    }

    // New modules
    if (m === "InteractiveCalculator") {
        if (!inv.config.inputs) inv.config.inputs = [];
        if (!inv.config.outputs) inv.config.outputs = [];
    }
    if (m === "DecisionTree" && !inv.config.nodes) inv.config.nodes = [];
    if (m === "ProsCons" && !inv.config.options) inv.config.options = [];
    if (m === "ChecklistModule" && !inv.config.sections) inv.config.sections = [];
    if (m === "RecipeModule") {
        if (!inv.config.ingredients) inv.config.ingredients = [];
        if (!inv.config.steps) inv.config.steps = [];
    }
    if (m === "MindMap" && !inv.config.branches) inv.config.branches = [];
    if (m === "FlashcardDeck" && !inv.config.cards) inv.config.cards = [];
    if (m === "NumberedProcess" && !inv.config.steps) inv.config.steps = [];
    if (m === "ScenarioComparison") {
        if (!inv.config.metrics) inv.config.metrics = [];
        if (!inv.config.scenarios) inv.config.scenarios = [];
    }
}

/** Add placeholder items to reach minimum array lengths */
function applyMinimumThresholds(inv: any): void {
    const cfg = inv.config;

    if (inv.module === "TradeoffMatrix") {
        while (cfg.criteria.length < 3) {
            const idx = cfg.criteria.length;
            cfg.criteria.push({
                id: `auto-crit-${idx}`,
                name: "Placeholder Criterion",
                description: "Auto-filled to meet minimum experience thresholds.",
                isMoreBetter: true,
            });
            for (const opt of cfg.options) {
                cfg.scores.push({ optionId: opt.id, criterionId: `auto-crit-${idx}`, rawScore: 3 });
            }
        }
    }

    if (inv.module === "RiskPanel") {
        while (cfg.risks.length < 3) {
            cfg.risks.push({
                id: `auto-risk-${cfg.risks.length}`,
                title: "Placeholder Risk",
                description: "Auto-filled to meet minimum experience thresholds.",
                severity: "medium",
                likelihood: "medium",
                mitigations: ["Auto-filled placeholder mitigation"],
            });
        }
    }

    if (inv.module === "ConceptCards") {
        while (cfg.cards.length < 2) {
            cfg.cards.push({
                id: `auto-card-${cfg.cards.length}`,
                title: "Placeholder Concept",
                body: "Auto-filled placeholder.",
            });
        }
    }

    if (inv.module === "Timeline") {
        while (cfg.items.length < 3) {
            cfg.items.push({
                id: `auto-item-${cfg.items.length}`,
                date: "TBD",
                title: "Placeholder Event",
                description: "Auto-filled placeholder.",
            });
        }
    }

    if (inv.module === "ScorecardPanel") {
        while (cfg.dimensions.length < 3) {
            cfg.dimensions.push({
                id: `auto-dim-${cfg.dimensions.length}`,
                name: "Placeholder Dimension",
                score: 5,
                rationale: "Auto-filled placeholder.",
                status: "adequate",
            });
        }
    }

    if (inv.module === "QuizModule") {
        while (cfg.questions.length < 3) {
            cfg.questions.push({
                id: `auto-q-${cfg.questions.length}`,
                question: "Placeholder question?",
                options: ["Option A", "Option B", "Option C"],
                correctIndex: 0,
                explanation: "Auto-filled placeholder.",
            });
        }
    }

    if (inv.module === "ActionPlan") {
        while (cfg.phases.length < 2) {
            cfg.phases.push({
                id: `auto-phase-${cfg.phases.length}`,
                name: "Placeholder Phase",
                timeframe: "TBD",
                actions: [
                    { id: "auto-action-0", title: "Placeholder Action", description: "Auto-filled.", priority: "medium", effort: "medium" },
                ],
            });
        }
    }

    if (inv.module === "FlashcardDeck") {
        while (cfg.cards.length < 4) {
            cfg.cards.push({
                id: `auto-card-${cfg.cards.length}`,
                front: "Placeholder question",
                back: "Placeholder answer. Auto-filled.",
            });
        }
    }

    if (inv.module === "NumberedProcess") {
        while (cfg.steps.length < 3) {
            cfg.steps.push({
                id: `auto-step-${cfg.steps.length}`,
                title: "Placeholder Step",
                description: "Auto-filled placeholder step.",
            });
        }
    }

    if (inv.module === "ChecklistModule") {
        while (cfg.sections.length < 1) {
            cfg.sections.push({
                id: `auto-section-0`,
                title: "Checklist",
                items: [{ id: "auto-item-0", text: "Placeholder item" }],
            });
        }
    }

    if (inv.module === "MindMap") {
        while (cfg.branches.length < 2) {
            cfg.branches.push({
                id: `auto-branch-${cfg.branches.length}`,
                label: "Placeholder Branch",
                topics: [{ id: `auto-topic-${cfg.branches.length}`, label: "Topic" }],
            });
        }
    }
}

export function validateStudioSpec(spec: any): ValidationResult {
    const errors: string[] = [];
    let autoFilledSpec = JSON.parse(JSON.stringify(spec)) as StudioSpecV1;

    // 1. Envelope Schema Validation
    const envelopeResult = StudioSpecV1Schema.safeParse(spec);
    if (!envelopeResult.success) {
        errors.push(...envelopeResult.error.issues.map((e: any) => `Envelope: ${e.path.join(".")} - ${e.message}`));
        return { isValid: false, errors };
    }

    // 2. Structural invariants — flexible module count (2-5 modules, no duplicates)
    const moduleCount = autoFilledSpec.modules.length;
    if (moduleCount < 2) {
        errors.push(`Spec must have at least 2 modules, got ${moduleCount}`);
    }
    if (moduleCount > 5) {
        errors.push(`Spec must have at most 5 modules, got ${moduleCount}`);
    }
    const moduleTypes = autoFilledSpec.modules.map(m => m.module);
    const duplicates = moduleTypes.filter((t, i) => moduleTypes.indexOf(t) !== i);
    if (duplicates.length > 0) {
        errors.push(`Duplicate module types not allowed: ${[...new Set(duplicates)].join(", ")}`);
    }

    // 3. Module Config Schema Validation & Auto-Fill
    for (const inv of autoFilledSpec.modules) {
        const schema = configSchemas[inv.module];
        if (!schema) {
            errors.push(`Unknown module type: ${inv.module} at slot ${inv.slot}`);
            continue;
        }

        autoFillArrays(inv);

        const configResult = schema.safeParse(inv.config);
        if (!configResult.success) {
            errors.push(`Slot ${inv.slot} (${inv.module}): Schema invalid - ${configResult.error.issues.map((e: any) => `${e.path.join(".") || "root"}: ${e.message}`).join(", ")}`);
        } else {
            // 4. Experience threshold auto-fill (after schema passes)
            applyMinimumThresholds(inv);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        autoFilledSpec,
    };
}
