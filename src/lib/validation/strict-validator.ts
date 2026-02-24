import { StudioSpecV1, StudioSpecV1Schema } from "../schema/studio-spec";
import { SystemMapConfigSchema } from "../schema/module-configs/system-map";
import { ModuleCardsConfigSchema } from "../schema/module-configs/module-cards";
import { TradeoffMatrixConfigSchema } from "../schema/module-configs/tradeoff-matrix";
import { RiskPanelConfigSchema } from "../schema/module-configs/risk-panel";

type ValidationResult = {
    isValid: boolean;
    errors: string[];
    autoFilledSpec?: StudioSpecV1;
};

// Map of registries
const configSchemas: Record<string, any> = {
    SystemMap: SystemMapConfigSchema,
    ModuleCards: ModuleCardsConfigSchema,
    TradeoffMatrix: TradeoffMatrixConfigSchema,
    RiskPanel: RiskPanelConfigSchema,
};

export function validateStudioSpec(spec: any): ValidationResult {
    const errors: string[] = [];
    let autoFilledSpec = JSON.parse(JSON.stringify(spec)) as StudioSpecV1;

    // 1. Envelope Schema Validation
    const envelopeResult = StudioSpecV1Schema.safeParse(spec);
    if (!envelopeResult.success) {
        errors.push(...envelopeResult.error.issues.map((e: any) => `Envelope: ${e.path.join(".")} - ${e.message}`));
        return { isValid: false, errors };
    }

    // 2. Structural P0 invariants
    const requiredSlots = ["system_map", "core_modules", "tradeoffs", "risks"];
    const providedSlots = autoFilledSpec.modules.map(m => m.slot);

    for (const req of requiredSlots) {
        if (!providedSlots.includes(req)) {
            errors.push(`Missing required primary slot: ${req}`);
        }
    }

    // 3. Module Config Schema Validation & Auto-Fill
    for (const inv of autoFilledSpec.modules) {
        const schema = configSchemas[inv.module];
        if (!schema) {
            errors.push(`Unknown module type: ${inv.module} at slot ${inv.slot}`);
            continue;
        }

        // Ensure base config object exists
        if (!inv.config) inv.config = {};

        // Ensure critical arrays are initialized to prevent downstream undefined errors
        if (inv.module === "ModuleCards" && !inv.config.modules) inv.config.modules = [];
        if (inv.module === "SystemMap" && !inv.config.nodes) inv.config.nodes = [];
        if (inv.module === "SystemMap" && !inv.config.edges) inv.config.edges = [];
        if (inv.module === "TradeoffMatrix" && !inv.config.options) inv.config.options = [];
        if (inv.module === "TradeoffMatrix" && !inv.config.criteria) inv.config.criteria = [];
        if (inv.module === "TradeoffMatrix" && !inv.config.scores) inv.config.scores = [];
        if (inv.module === "RiskPanel" && !inv.config.risks) inv.config.risks = [];

        const configResult = schema.safeParse(inv.config);
        if (!configResult.success) {
            errors.push(`Slot ${inv.slot} (${inv.module}): Schema invalid - ${configResult.error.issues.map((e: any) => e.message).join(", ")}`);
        } else {
            // 4. Experience Threshold Invariants
            if (inv.module === "TradeoffMatrix") {
                const cfg = inv.config as any;
                if (cfg.criteria.length < 3) {
                    // Auto-fill fallback to prevent full failure
                    while (cfg.criteria.length < 3) {
                        cfg.criteria.push({
                            id: `auto-crit-${cfg.criteria.length}`,
                            name: "Placeholder Criterion",
                            description: "Auto-filled to meet minimum experience thresholds.",
                            isMoreBetter: true
                        });
                        // Add default scores for the new criterion
                        for (const opt of cfg.options) {
                            cfg.scores.push({ optionId: opt.id, criterionId: `auto-crit-${cfg.criteria.length - 1}`, rawScore: 3 });
                        }
                    }
                }
            }

            if (inv.module === "RiskPanel") {
                const cfg = inv.config as any;
                if (cfg.risks.length < 3) {
                    while (cfg.risks.length < 3) {
                        cfg.risks.push({
                            id: `auto-risk-${cfg.risks.length}`,
                            title: "Placeholder Risk",
                            description: "Auto-filled to meet minimum experience thresholds.",
                            severity: "medium",
                            likelihood: "medium",
                            mitigations: ["Auto-filled placeholder mitigation"]
                        });
                    }
                }
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        autoFilledSpec
    };
}
