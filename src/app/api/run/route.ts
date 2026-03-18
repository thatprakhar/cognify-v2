import { createSystemStudioGraph } from "../../../lib/engine/langgraph";
import { validateStudioSpec } from "../../../lib/validation/strict-validator";
import { computeSpec } from "../../../lib/compute";
import { canonicalizeStudioSpecV1 } from "../../../lib/canonicalization";
import { HumanMessage } from "@langchain/core/messages";

function sseEvent(event: string, data: unknown): string {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: unknown) => {
                controller.enqueue(encoder.encode(sseEvent(event, data)));
            };

            try {
                const body = await req.json();
                const { query, context } = body;

                emit("status", { stage: "intent", message: "Extracting intent..." });

                const graph = createSystemStudioGraph();

                const initialState = {
                    query,
                    mode: "system_studio",
                    context: context || { history: [], userEdits: {} },
                    messages: [new HumanMessage(query)],
                    attempt: 1,
                    startTime: Date.now(),
                    slotDrafts: {},
                    slotErrors: {},
                    slotAttempts: {},
                    globalAttempt: 1,
                };

                // Accumulate state across chunks — each node only emits its own delta
                let accFinalSpec: any = null;
                let accRunMeta: any = null;
                let accComputedBySlot: any = null;

                for await (const chunk of await graph.stream(initialState)) {
                    const c = chunk as Record<string, any>;
                    const nodeName = Object.keys(c)[0];
                    const nodeState = c[nodeName];

                    if (nodeName === "IntentExtractorNode" && nodeState.intent) {
                        emit("intent_ready", { intent: nodeState.intent });
                        emit("status", { stage: "layout", message: "Planning layout..." });
                    }

                    if (nodeName === "LayoutPlannerNode" && nodeState.layoutPlan) {
                        emit("layout_ready", { layoutPlan: nodeState.layoutPlan });
                        emit("status", { stage: "composing", message: "Composing modules..." });
                    }

                    if (nodeName === "SlotComposerNode" && nodeState.slotDrafts) {
                        for (const slot of Object.keys(nodeState.slotDrafts)) {
                            emit("slot_ready", { slot });
                        }
                        emit("status", { stage: "validating", message: "Validating modules..." });
                    }

                    if (nodeName === "AssemblerNode") {
                        emit("status", { stage: "assembling", message: "Assembling spec..." });
                    }

                    if (nodeName === "ComputeNode") {
                        emit("status", { stage: "computing", message: "Running compute layer..." });
                        if (nodeState.finalSpec) accFinalSpec = nodeState.finalSpec;
                        if (nodeState.computedBySlot) accComputedBySlot = nodeState.computedBySlot;
                    }

                    if (nodeName === "FinalizeNode") {
                        if (nodeState.runMeta) accRunMeta = nodeState.runMeta;
                    }
                }

                // Emit run_complete after graph finishes
                if (accFinalSpec) {
                    const { isValid, errors, autoFilledSpec } = validateStudioSpec(accFinalSpec);
                    const finalSpec = (autoFilledSpec || accFinalSpec) as any;
                    const { canonicalHash } = canonicalizeStudioSpecV1(finalSpec);
                    const computedBySlot = accComputedBySlot ?? computeSpec(finalSpec, context?.userEdits);

                    const slotErrors: Record<string, string> = {};
                    if (!isValid) {
                        errors.forEach((e: string) => {
                            const match = e.match(/Slot ([a-z_]+)/);
                            if (match) slotErrors[match[1]] = e;
                        });
                    }

                    emit("run_complete", {
                        studioSpec: finalSpec,
                        computed: computedBySlot,
                        runMeta: {
                            ...(accRunMeta ?? {}),
                            canonicalHash,
                            modelClass: "capable",
                            latencyMs: accRunMeta?.latencyMs ?? 0,
                            retryCount: (accRunMeta?.attemptCount ?? 1) - 1,
                            semanticDriftDetected: false,
                            engineFingerprint: canonicalHash?.slice(0, 16),
                        },
                        validation: { errors, slotErrors },
                    });
                } else {
                    emit("error", { message: "No spec generated — all slots failed validation" });
                }
            } catch (err: any) {
                console.error("API /run SSE error:", err);
                controller.enqueue(
                    encoder.encode(sseEvent("error", { message: err.message || "Generation failed" }))
                );
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
