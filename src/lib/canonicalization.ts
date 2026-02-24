import { createHash } from "crypto";
import type { StudioSpecV1 } from "./schema/studio-spec";

export type CanonicalizeResult<T> = {
    canonical: T;
    canonicalJson: string;
    canonicalHash: string;
    canonicalizationVersion: string;
};

export function stableStringify(value: unknown): string {
    return JSON.stringify(sortKeysDeep(value));
}

function sortKeysDeep(value: any): any {
    if (Array.isArray(value)) return value.map(sortKeysDeep);
    if (value && typeof value === "object") {
        const out: Record<string, any> = {};
        for (const k of Object.keys(value).sort()) {
            const v = value[k];
            if (v === undefined) continue;
            out[k] = sortKeysDeep(v);
        }
        return out;
    }
    return value;
}

export function sha256(input: string): string {
    return createHash("sha256").update(input).digest("hex");
}

export function stableHashJson(
    value: unknown,
    canonicalizationVersion?: string
): { canonicalJson: string; hash: string; canonicalizationVersion: string } {
    const version = canonicalizationVersion ?? "canon.v1";
    const str = stableStringify(value);
    return {
        canonicalJson: str,
        hash: sha256(str),
        canonicalizationVersion: version,
    };
}

// ----------------------------------------------------------------------------
// Canonicalization Rules per Module Component
// ----------------------------------------------------------------------------

function strCmp(a: string, b: string) {
    return a < b ? -1 : a > b ? 1 : 0;
}

function pruneDeep<T>(value: T): T {
    if (Array.isArray(value)) {
        const arr = value.map(pruneDeep).filter((v) => v !== undefined) as any[];
        return arr as any;
    }
    if (value && typeof value === "object") {
        const out: any = {};
        for (const k of Object.keys(value as any)) {
            const v = pruneDeep((value as any)[k]);
            if (v === undefined) continue;
            const isEmptyArr = Array.isArray(v) && v.length === 0;
            const isEmptyObj = v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0;
            if (isEmptyArr || isEmptyObj) continue;
            out[k] = v;
        }
        return out;
    }
    return value;
}

function canonSystemMap(cfg: any, prune: boolean) {
    if (!cfg) return cfg;
    const out = { ...cfg };

    if (out.nodes) {
        out.nodes.sort((a: any, b: any) => strCmp(a.id, b.id));
        for (const n of out.nodes) {
            if (n.tags) n.tags.sort(strCmp);
            if (n.highlightOnHoverIds) n.highlightOnHoverIds.sort(strCmp);
        }
    }
    if (out.edges) {
        out.edges.sort((a: any, b: any) => strCmp(a.id, b.id));
    }
    if (out.legend) {
        out.legend.sort((a: any, b: any) => strCmp(a.type + a.label, b.type + b.label));
    }
    if (out.callouts) {
        out.callouts.sort((a: any, b: any) => strCmp(a.id, b.id));
        for (const c of out.callouts) {
            if (c.relatedNodeIds) c.relatedNodeIds.sort(strCmp);
        }
    }

    return prune ? pruneDeep(out) : out;
}

function canonModuleCards(cfg: any, prune: boolean) {
    if (!cfg) return cfg;
    const out = { ...cfg };

    if (out.modules) {
        out.modules.sort((a: any, b: any) => strCmp(a.id, b.id));
        for (const m of out.modules) {
            if (m.apis) m.apis.sort((a: any, b: any) => strCmp(a.id, b.id));
            if (m.dataStores) m.dataStores.sort((a: any, b: any) => strCmp(a.id, b.id));
            if (m.keyDecisions) m.keyDecisions.sort(strCmp);
            if (m.failureModes) m.failureModes.sort(strCmp);
            if (m.dependsOnModuleIds) m.dependsOnModuleIds.sort(strCmp);
        }
    }
    if (out.groups) {
        out.groups.sort((a: any, b: any) => strCmp(a.id, b.id));
        for (const g of out.groups) {
            if (g.moduleIds) g.moduleIds.sort(strCmp);
        }
    }
    if (out.qualities) {
        out.qualities.sort((a: any, b: any) => strCmp(a.id, b.id));
    }

    return prune ? pruneDeep(out) : out;
}

function canonTradeoffs(cfg: any, prune: boolean) {
    if (!cfg) return cfg;
    const out = { ...cfg };

    if (out.options) out.options.sort((a: any, b: any) => strCmp(a.id, b.id));
    if (out.criteria) out.criteria.sort((a: any, b: any) => strCmp(a.id, b.id));
    if (out.scores) {
        out.scores.sort((a: any, b: any) => {
            const cmpOpt = strCmp(a.optionId, b.optionId);
            if (cmpOpt !== 0) return cmpOpt;
            const cmpCri = strCmp(a.criterionId, b.criterionId);
            if (cmpCri !== 0) return cmpCri;
            return (Number(a.rawScore) || 0) - (Number(b.rawScore) || 0);
        });
    }
    if (out.recommendation) {
        if (out.recommendation.keyReasons) out.recommendation.keyReasons.sort(strCmp);
        if (out.recommendation.whatWouldChange) out.recommendation.whatWouldChange.sort(strCmp);
    }

    return prune ? pruneDeep(out) : out;
}

function canonRiskPanel(cfg: any, prune: boolean) {
    if (!cfg) return cfg;
    const out = { ...cfg };

    if (out.risks) {
        out.risks.sort((a: any, b: any) => strCmp(a.id, b.id));
        for (const r of out.risks) {
            if (r.mitigations) r.mitigations.sort(strCmp);
            if (r.detectionSignals) r.detectionSignals.sort(strCmp);
            if (r.relatedNodeIds) r.relatedNodeIds.sort(strCmp);
            if (r.relatedModuleIds) r.relatedModuleIds.sort(strCmp);
        }
    }

    return prune ? pruneDeep(out) : out;
}

function slotCompare(slotA: string, slotB: string, primary: readonly string[]) {
    const ia = primary.indexOf(slotA);
    const ib = primary.indexOf(slotB);
    const aIn = ia !== -1;
    const bIn = ib !== -1;
    if (aIn && bIn) return ia - ib;
    if (aIn) return -1;
    if (bIn) return 1;
    return strCmp(slotA, slotB);
}

export function canonicalizeStudioSpecV1(
    spec: StudioSpecV1,
    opts?: { canonicalizationVersion?: string; pruneEmpties?: boolean }
): CanonicalizeResult<StudioSpecV1> {
    const canonicalizationVersion = opts?.canonicalizationVersion ?? "canon.v1";
    const pruneEmpties = opts?.pruneEmpties ?? true;

    const cloned: StudioSpecV1 = JSON.parse(JSON.stringify(spec));
    const slotOrder = cloned.layout.primarySlots || [];

    const modulesArr = [...cloned.modules] as any[];
    modulesArr.sort((a, b) => slotCompare(a.slot, b.slot, slotOrder) || strCmp(a.module, b.module));
    (cloned as any).modules = modulesArr as any;

    for (const inv of cloned.modules as any[]) {
        switch (inv.module) {
            case "SystemMap":
                inv.config = canonSystemMap(inv.config, pruneEmpties);
                break;
            case "ModuleCards":
                inv.config = canonModuleCards(inv.config, pruneEmpties);
                break;
            case "TradeoffMatrix":
                inv.config = canonTradeoffs(inv.config, pruneEmpties);
                break;
            case "RiskPanel":
                inv.config = canonRiskPanel(inv.config, pruneEmpties);
                break;
            default:
                inv.config = pruneEmpties ? pruneDeep(inv.config) : inv.config;
        }
    }

    const canonicalObj = pruneEmpties ? pruneDeep(cloned) : cloned;
    const canonicalJson = stableStringify(canonicalObj);
    const canonicalHash = sha256(canonicalJson);

    return { canonical: canonicalObj, canonicalJson, canonicalHash, canonicalizationVersion };
}
