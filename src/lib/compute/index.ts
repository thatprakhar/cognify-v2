import { StudioSpecV1 } from "../schema/studio-spec";

export type ComputedData = Record<string, any>;

export function computeSpec(spec: StudioSpecV1, userEdits: Record<string, any> = {}): Record<string, ComputedData> {
    const computedBySlot: Record<string, ComputedData> = {};

    for (const inv of spec.modules) {
        if (inv.module === "SystemMap") {
            const cfg = inv.config as any;
            // Simulate DAGRE layout layout math
            // Real implementation would calculate x, y for nodes based on edges
            computedBySlot[inv.slot] = {
                layoutVersion: "v1",
                nodesLayout: (cfg?.nodes || []).map((n: any) => ({ id: n?.id || 'unknown', x: 0, y: 0 }))
            };
        }

        if (inv.module === "TradeoffMatrix") {
            const cfg = inv.config as any;
            // Compute weighted scores based on User Edits
            const weights = userEdits.weights || {};
            const finalScores: Record<string, number> = {};

            for (const opt of (cfg?.options || [])) {
                if (opt?.id) finalScores[opt.id] = 0;
            }

            for (const score of (cfg?.scores || [])) {
                if (score?.criterionId && score?.optionId) {
                    const weight = weights[score.criterionId] ?? 1.0;
                    finalScores[score.optionId] += ((score.rawScore || 0) * weight);
                }
            }

            computedBySlot[inv.slot] = { finalScores, computeVersion: "v1" };
        }

        // RiskPanel and ModuleCards do not have spatial/math compute for P0
    }

    return computedBySlot;
}
