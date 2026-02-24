import { NextResponse } from "next/server";
import { createSystemStudioGraph } from "../../../lib/engine/langgraph";
import { validateStudioSpec } from "../../../lib/validation/strict-validator";
import { computeSpec } from "../../../lib/compute";
import { canonicalizeStudioSpecV1 } from "../../../lib/canonicalization";
import { BaseMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query, mode, context } = body;

        const graph = createSystemStudioGraph();

        const initialState = {
            query,
            mode: mode || "system_studio",
            context: context || { history: [], userEdits: {} },
            messages: [new HumanMessage(query)] as BaseMessage[],
            attempt: 1
        };

        // Run execution
        const result = await graph.invoke(initialState);

        // Strict validation logic inside the router but guaranteeing shape output
        const spec = (result.finalSpec || result.draftSpec) as any;

        if (!spec) {
            return NextResponse.json({ error: "No spec generated" }, { status: 500 });
        }

        const { isValid, errors, autoFilledSpec } = validateStudioSpec(spec);

        const finalSpecToCompute = (autoFilledSpec || spec) as any;

        // Canonicalization prevents runtime drift
        const { canonicalJson, canonicalHash } = canonicalizeStudioSpecV1(finalSpecToCompute);

        // Deterministic map compute
        const computedBySlot = computeSpec(finalSpecToCompute, context?.userEdits);

        // Build the specific partial slot errors
        const slotErrors: Record<string, string> = {};
        if (!isValid) {
            // Simple parse to assign errors to slots based on path
            errors.forEach(e => {
                const match = e.match(/Slot ([a-z_]+)/);
                if (match) {
                    slotErrors[match[1]] = e;
                }
            });
        }

        return NextResponse.json({
            studioSpec: finalSpecToCompute,
            computed: computedBySlot,
            runMeta: {
                ...(result.runMeta as any),
                canonicalHash
            },
            validation: {
                attempts: result.attempt,
                errors,
                slotErrors
            }
        });

    } catch (err: any) {
        console.error("API /run error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
