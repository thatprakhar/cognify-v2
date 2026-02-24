import { StudioSpecV1 } from "../lib/schema/studio-spec";
import { ComputedData } from "../lib/compute";

export interface StudioState {
    runId: string;
    studioSpec: StudioSpecV1 | null;
    computedBySlot: Record<string, ComputedData>;
    expandedSlots: Set<string>;
    slotErrors: Record<string, string>;
    userEdits: {
        weights?: Record<string, number>;
    };
    runMeta?: any;
}

export type StudioEvent =
    | { type: "studio.run_completed"; payload: { runId: string; studioSpec: StudioSpecV1; computedBySlot: Record<string, ComputedData>; runMeta: any; slotErrors: Record<string, string> } }
    | { type: "studio.slot_expanded"; payload: { slot: string } }
    | { type: "studio.slot_collapsed"; payload: { slot: string } }
    | { type: "studio.tradeoff_weight_changed"; payload: { criterionId: string; weight: number } }
    | { type: "studio.module_regenerate_requested"; payload: { slot: string } }
    | { type: "studio.export_clicked" };

export const initialStudioState: StudioState = {
    runId: "",
    studioSpec: null,
    computedBySlot: {},
    expandedSlots: new Set(),
    slotErrors: {},
    userEdits: { weights: {} },
};

export function studioReducer(state: StudioState, event: StudioEvent): StudioState {
    switch (event.type) {
        case "studio.run_completed":
            return {
                ...state,
                runId: event.payload.runId,
                studioSpec: event.payload.studioSpec,
                computedBySlot: event.payload.computedBySlot,
                runMeta: event.payload.runMeta,
                slotErrors: event.payload.slotErrors,
                userEdits: { weights: {} }, // Reset edits on new run
            };

        case "studio.slot_expanded":
            const newExpanded = new Set(state.expandedSlots);
            newExpanded.add(event.payload.slot);
            return { ...state, expandedSlots: newExpanded };

        case "studio.slot_collapsed":
            const newCollapsed = new Set(state.expandedSlots);
            newCollapsed.delete(event.payload.slot);
            return { ...state, expandedSlots: newCollapsed };

        case "studio.tradeoff_weight_changed":
            return {
                ...state,
                userEdits: {
                    ...state.userEdits,
                    weights: {
                        ...state.userEdits.weights,
                        [event.payload.criterionId]: event.payload.weight,
                    },
                },
            };

        case "studio.module_regenerate_requested":
            // handled externally by orchestrator calling `/api/event`; optimistic updates happen here later
            return state;

        case "studio.export_clicked":
            return state;

        default:
            return state;
    }
}
