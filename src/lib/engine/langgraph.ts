import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { MultiChainGraphState, QueryIntent, LayoutPlan } from "./state";
import { regenerateSystemStudioSlotV1 } from "./tools";
import { BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { validateStudioSpec } from "../validation/strict-validator";
import { computeSpec } from "../compute";
import { QUERY_TYPE_MODULE_RECOMMENDATIONS, getModuleMenuForPrompt } from "../schema/module-manifest";

// ─── Slot-specific system prompt snippets ────────────────────────────────────

const SLOT_PROMPTS: Record<string, string> = {
    SystemMap: `Generate a JSON object with these exact fields:
{
  "nodes": [ { "id": "api-gateway", "label": "API Gateway", "type": "service", "description": "..." }, ... ],
  "edges": [ { "from": "api-gateway", "to": "user-db", "label": "reads", "type": "sync" }, ... ],
  "legend": [ { "type": "service", "color": "#3B82F6" }, ... ]
}
- nodes: 4-8 nodes. type must be one of: user/service/database/external/client/worker/queue/concept/process
- edges: type must be one of: sync/async/stream/event
- All ids: short hyphenated lowercase strings`,

    ModuleCards: `Generate a JSON object with this exact shape:
{
  "heading": "Core Services",
  "modules": [
    { "id": "auth-service", "name": "Auth Service", "description": "...", "responsibility": "...", "apis": ["POST /login"], "dataStores": ["users-db"], "keyDecisions": ["JWT over sessions"], "failureModes": ["token expiry"], "dependsOnModuleIds": [] },
    ...
  ]
}
- 3-6 module cards. All array fields can be empty arrays [] but must be present.`,

    ConceptCards: `Generate a JSON object with this exact shape:
{
  "heading": "Key Concepts",
  "displayMode": "grid",
  "cards": [
    { "id": "principal", "title": "Principal", "body": "The initial amount of money..." },
    ...
  ]
}
- REQUIRED on every card: id (hyphenated-lowercase), title (2-5 words), body (plaintext 2-4 sentences)
- displayMode: "grid" (default), "list" (6+ cards), "spotlight" (2-3 cards)
- 4-7 cards total`,

    ExplainerSection: `Generate a JSON object with this exact shape:
{
  "heading": "How Compound Interest Works",
  "summary": "One or two sentence TL;DR in plaintext.",
  "sections": [
    { "id": "what-it-is", "title": "What It Is", "body": "Plaintext explanation 2-5 sentences.", "callout": { "type": "insight", "text": "Short callout text." } },
    ...
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}
- REQUIRED top-level: heading (string), summary (string), sections (array)
- REQUIRED on every section: id (hyphenated-lowercase), title (string), body (string)
- callout is optional per section but include at least one. type: tip/warning/insight/fact
- 3-4 sections, 3-5 keyTakeaways`,

    Timeline: `Generate a JSON object with this exact shape:
{
  "heading": "Timeline of Events",
  "orientation": "vertical",
  "items": [
    { "id": "item-1", "date": "1900", "title": "Event Title", "description": "What happened.", "isHighlighted": false },
    ...
  ]
}
- REQUIRED on every item: id, date, title, description
- 5-8 items ordered chronologically. Mark 1-2 as isHighlighted: true`,

    TradeoffMatrix: `Generate a JSON object with this exact shape:
{
  "options": [ { "id": "option-a", "name": "Option A", "description": "..." }, ... ],
  "criteria": [ { "id": "cost", "name": "Cost", "description": "...", "isMoreBetter": false }, ... ],
  "scores": [ { "optionId": "option-a", "criterionId": "cost", "rawScore": 4 }, ... ],
  "recommendation": { "optionId": "option-a", "keyReasons": ["reason1"], "whatWouldChange": ["if X then Y"] }
}
- EVERY (option, criterion) pair must have a score entry. rawScore 1-5.
- Scores must vary meaningfully across options for the same criterion.
- 2-4 options, 4-5 criteria`,

    ComparisonPanel: `Generate a JSON object with this exact shape:
{
  "optionA": { "id": "option-a", "name": "Option A", "pros": ["..."], "cons": ["..."], "stats": [ { "key": "Cost", "value": "$10/mo" } ] },
  "optionB": { "id": "option-b", "name": "Option B", "pros": ["..."], "cons": ["..."], "stats": [ { "key": "Cost", "value": "$20/mo" } ] },
  "criteria": [ { "id": "perf", "name": "Performance", "scoreA": 4, "scoreB": 3, "winner": "optionA" } ],
  "recommendation": { "winner": "optionA", "reasoning": "...", "bestFor": ["use case 1"] }
}
- 3-5 pros/cons each, 3-5 stats each, 4-5 criteria. Scores 1-5, must differ between options.`,

    ScorecardPanel: `Generate a JSON object with this exact shape:
{
  "heading": "Performance Scorecard",
  "subject": "What is being scored",
  "dimensions": [
    { "id": "reliability", "name": "Reliability", "score": 8, "maxScore": 10, "status": "strong", "rationale": "Why this score." },
    ...
  ],
  "verdict": "One sentence overall assessment."
}
- 4-6 dimensions. status: strong/adequate/weak/critical. Vary scores — no all-9s.`,

    RiskPanel: `Generate a JSON object with this exact shape:
{
  "risks": [
    { "id": "risk-1", "title": "Risk Title", "description": "What could go wrong.", "severity": "high", "likelihood": "medium", "mitigations": ["action 1", "action 2"], "detectionSignals": ["warning sign 1"] },
    ...
  ],
  "spotlightRiskId": "risk-1"
}
- 4-6 risks. severity: low/medium/high/critical. likelihood: low/medium/high
- Each risk needs at least 2 mitigations and 1 detectionSignal`,

    ActionPlan: `Generate a JSON object with this exact shape:
{
  "heading": "Action Plan",
  "phases": [
    {
      "id": "phase-1", "name": "Immediate", "description": "What to do now.",
      "actions": [
        { "id": "action-1", "title": "Specific action title", "description": "Details.", "priority": "high", "effort": "low", "owner": "Team" }
      ]
    }
  ]
}
- 2-3 phases, 3-4 actions per phase. priority: high/medium/low. effort: low/medium/high
- Actions must be specific and concrete`,

    DiagramModule: `Generate a JSON object with this exact shape:
{
  "heading": "System Diagram",
  "diagramType": "flowchart",
  "mermaidCode": "flowchart TD\\n  A[\\"Start\\"] --> B[\\"Process\\"]\\n  B --> C[\\"End\\"]"
}
- CRITICAL: ALL Mermaid node labels MUST use double quotes: A["Label"] NOT A[Label]
- mermaidCode must be valid Mermaid syntax starting with diagram type declaration
- Keep readable — max 12 nodes`,

    Dashboard: `Generate a JSON object with this exact shape:
{
  "heading": "Dashboard",
  "isMockData": true,
  "charts": [
    { "id": "chart-1", "type": "bar", "title": "Chart Title", "xKey": "category", "yKey": "value", "data": [ { "category": "A", "value": 10 }, { "category": "B", "value": 20 } ] }
  ]
}
- 2-3 charts. type: bar/line/area/pie. Always set isMockData: true unless real data provided.`,

    QuizModule: `Generate a JSON object with this exact shape:
{
  "heading": "Test Your Knowledge",
  "questions": [
    { "id": "q-1", "text": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0, "explanation": "Why A is correct." },
    ...
  ]
}
- 5-6 questions, 3-4 options each. correctIndex is 0-based. Vary difficulty.`,
};

// ─── Helper: get the system prompt for a specific slot/module ────────────────

function slotSystemPrompt(moduleName: string, intent: QueryIntent): string {
    const base = SLOT_PROMPTS[moduleName] ?? `Generate a complete, fully-populated config for the ${moduleName} module.`;
    return `You are generating content for a single module slot in a structured UI spec.
Module: ${moduleName}
Query context: "${intent.subject}" (domain: ${intent.domain})
Constraints: ${intent.constraints.length > 0 ? intent.constraints.join(", ") : "none"}

${base}

Call the regenerate_system_studio_slot_v1 tool with the slot name and fully populated config.
All text fields: plaintext only. All IDs: short hyphenated strings like "item-1".`;
}

// ─── Node 1: IntentExtractorNode ──────────────────────────────────────────────

const intentExtractorNode = async (state: MultiChainGraphState) => {
    const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

    const moduleMenu = getModuleMenuForPrompt();
    const prompt = `Analyze this user query and return a JSON object (no other text) with these exact fields:
{
  "queryType": one of: architecture|explanation|comparison-two|comparison-multi|risk-audit|data-analysis|learning|planning|scoring|general,
  "domain": "the subject domain e.g. distributed systems, personal finance, biology",
  "subject": "the main thing being asked about",
  "suggestedModules": ["2-4 module names from the list below that best answer this query"],
  "constraints": ["any explicit constraints from the user e.g. beginner level, AWS only"],
  "isFollowUp": false
}

AVAILABLE MODULES:
${moduleMenu}

MODULE SELECTION GUIDE:
- "how does X work" / "explain X" → ExplainerSection + ConceptCards + (SystemMap if technical)
- "X vs Y" (2 options) → ComparisonPanel + ActionPlan
- "compare X, Y, Z" (3+ options) → TradeoffMatrix + ConceptCards
- "what are the risks" / "what could go wrong" → RiskPanel + ActionPlan
- "design a system" / "architecture for" → SystemMap + ModuleCards + RiskPanel
- "history of" / "timeline" → Timeline + ExplainerSection
- "quiz me" / "test my knowledge" → QuizModule + ExplainerSection
- "help me plan" / "what should I do" → ActionPlan + ScorecardPanel
- "rate" / "evaluate" / "how good is" → ScorecardPanel + ExplainerSection

User query: "${state.query}"

Return ONLY valid JSON, nothing else.`;

    const response = await model.invoke([{ role: "user", content: prompt }]);
    const text = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

    try {
        const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
        const intent: QueryIntent = JSON.parse(cleaned);

        // Fallback: if suggestedModules is empty or invalid, use recommendation map
        if (!intent.suggestedModules || intent.suggestedModules.length < 2) {
            intent.suggestedModules = QUERY_TYPE_MODULE_RECOMMENDATIONS[intent.queryType] ?? ["ExplainerSection", "ConceptCards"];
        }
        return { intent, messages: [new HumanMessage(`Intent: ${JSON.stringify(intent)}`)] };
    } catch {
        // Fallback intent on parse failure
        const fallback: QueryIntent = {
            queryType: "general",
            domain: "general",
            subject: state.query,
            suggestedModules: ["ExplainerSection", "ConceptCards", "ActionPlan"],
            constraints: [],
            isFollowUp: false,
        };
        return { intent: fallback };
    }
};

// ─── Node 2: LayoutPlannerNode (deterministic) ────────────────────────────────

const layoutPlannerNode = async (state: MultiChainGraphState) => {
    const intent = state.intent!;
    const modules = intent.suggestedModules.slice(0, 4);

    // Assign canonical slot names
    const slotNames: Record<string, string> = {
        SystemMap: "system_map",
        ModuleCards: "core_modules",
        TradeoffMatrix: "tradeoffs",
        RiskPanel: "risks",
        ComparisonPanel: "comparison",
        ConceptCards: "key_concepts",
        ExplainerSection: "explainer",
        Timeline: "timeline",
        ScorecardPanel: "scorecard",
        QuizModule: "quiz",
        DiagramModule: "diagram",
        Dashboard: "dashboard",
        ActionPlan: "action_plan",
    };

    const moduleAssignments: Record<string, string> = {};
    const primarySlots: string[] = [];

    for (const mod of modules) {
        const slot = slotNames[mod] ?? mod.toLowerCase().replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
        moduleAssignments[slot] = mod;
        primarySlots.push(slot);
    }

    const layoutPlan: LayoutPlan = {
        title: intent.subject,
        primarySlots,
        moduleAssignments,
    };


    return { layoutPlan };
};

// ─── Node 3: SlotComposerNode (generates all slots sequentially) ───────────────
// SystemMap goes first (other modules may reference its node IDs).
// The rest are generated in order after.

const slotComposerNode = async (state: MultiChainGraphState) => {
    const { intent, layoutPlan } = state;
    if (!intent || !layoutPlan) return {};

    const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

    const slotDrafts: Record<string, any> = { ...state.slotDrafts };
    const systemMapNodeIds: string[] = [];

    // Sort so SystemMap goes first
    const orderedSlots = [...layoutPlan.primarySlots].sort((a, b) => {
        if (layoutPlan.moduleAssignments[a] === "SystemMap") return -1;
        if (layoutPlan.moduleAssignments[b] === "SystemMap") return 1;
        return 0;
    });

    for (const slot of orderedSlots) {
        const moduleName = layoutPlan.moduleAssignments[slot];
        if (!moduleName) continue;

        let extraContext = "";
        if (systemMapNodeIds.length > 0 && (moduleName === "RiskPanel" || moduleName === "ModuleCards")) {
            extraContext = `\nAvailable SystemMap node IDs for cross-referencing: ${systemMapNodeIds.join(", ")}`;
        }

        const instructions = SLOT_PROMPTS[moduleName] ?? `Generate a complete, fully-populated config object for the ${moduleName} module.`;

        const prompt = `You are generating a config object for a ${moduleName} UI module.
Topic: "${state.query}" (domain: ${intent.domain}, subject: ${intent.subject})
${extraContext}

${instructions}

Fill every required field with real, high-quality content about the topic.
Return ONLY a valid JSON object. No explanation, no markdown fences, no extra text — just the raw JSON.`;

        try {
            const response = await model.invoke([{ role: "user", content: prompt }]);
            const text = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
            const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
            const config = JSON.parse(cleaned);
            slotDrafts[slot] = config;

            if (moduleName === "SystemMap" && config.nodes) {
                systemMapNodeIds.push(...(config.nodes as any[]).map((n: any) => n.id).filter(Boolean));
            }
        } catch (err) {
            console.error(`SlotComposer failed for slot ${slot}:`, err);
        }
    }

    return { slotDrafts };
};

// ─── Node 4: SlotValidatorNode ────────────────────────────────────────────────

const slotValidatorNode = async (state: MultiChainGraphState) => {
    const { layoutPlan, slotDrafts } = state;
    if (!layoutPlan) return {};

    const slotErrors: Record<string, string[]> = {};

    for (const slot of layoutPlan.primarySlots) {
        const moduleName = layoutPlan.moduleAssignments[slot];
        const config = slotDrafts[slot];
        if (!config) {
            slotErrors[slot] = [`No config generated for slot ${slot}`];
            continue;
        }

        // Validate by assembling a temporary single-module spec
        const tempSpec = {
            schemaVersion: "studio_spec.v1",
            title: "validation-temp",
            layout: { primarySlots: [slot] },
            modules: [{ slot, module: moduleName, moduleVersion: "1.0", config }],
        };

        const { errors, autoFilledSpec } = validateStudioSpec(tempSpec as any);

        // Carry back any auto-filled config
        if (autoFilledSpec?.modules?.[0]?.config) {
            state.slotDrafts[slot] = autoFilledSpec.modules[0].config;
        }

        if (errors.filter(e => !e.startsWith("Spec must have")).length > 0) {
            slotErrors[slot] = errors.filter(e => !e.startsWith("Spec must have"));
        }
    }


    return { slotErrors };
};

// ─── Node 5: SlotRepairNode ───────────────────────────────────────────────────

const slotRepairNode = async (state: MultiChainGraphState) => {
    const { layoutPlan, slotDrafts, slotErrors, slotAttempts, intent } = state;
    if (!layoutPlan || !intent) return {};

    const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

    const updatedDrafts = { ...slotDrafts };
    const updatedAttempts = { ...slotAttempts };

    for (const [slot, errors] of Object.entries(slotErrors)) {
        if (!errors || errors.length === 0) continue;
        const attempts = slotAttempts[slot] ?? 0;
        if (attempts >= 2) continue;

        const moduleName = layoutPlan.moduleAssignments[slot];
        const currentConfig = slotDrafts[slot];

        const prompt = `You are repairing a ${moduleName} config that failed validation.
Errors: ${errors.join("; ")}
Current (invalid) config:
${JSON.stringify(currentConfig, null, 2)}

Fix ONLY the issues listed. Return ONLY the corrected JSON config object. No explanation, no markdown fences.
Original query context: "${intent.subject}"`;

        try {
            const response = await model.invoke([{ role: "user", content: prompt }]);
            const text = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
            const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
            updatedDrafts[slot] = JSON.parse(cleaned);
        } catch (err) {
            console.error(`SlotRepair failed for slot ${slot}:`, err);
        }

        updatedAttempts[slot] = attempts + 1;
    }

    return { slotDrafts: updatedDrafts, slotAttempts: updatedAttempts };
};

// ─── Node 6: AssemblerNode ────────────────────────────────────────────────────

const assemblerNode = async (state: MultiChainGraphState) => {
    const { layoutPlan, slotDrafts } = state;
    if (!layoutPlan) return {};

    const modules = layoutPlan.primarySlots
        .filter(slot => slotDrafts[slot] != null)
        .map(slot => ({
            slot,
            module: layoutPlan.moduleAssignments[slot],
            moduleVersion: "1.0",
            config: slotDrafts[slot],
        }));

    const draftSpec = {
        schemaVersion: "studio_spec.v1" as const,
        title: layoutPlan.title || state.query,
        layout: { primarySlots: layoutPlan.primarySlots },
        modules,
    };

    return { draftSpec };
};

// ─── Node 7: ComputeNode ──────────────────────────────────────────────────────

const computeNode = async (state: MultiChainGraphState) => {
    if (!state.draftSpec) return {};
    try {
        const computedBySlot = computeSpec(state.draftSpec, state.context?.userEdits ?? {});
        return { computedBySlot, finalSpec: state.draftSpec };
    } catch {
        return { computedBySlot: {}, finalSpec: state.draftSpec };
    }
};

// ─── Node 8: FinalizeNode ─────────────────────────────────────────────────────

const finalizeNode = async (state: MultiChainGraphState) => {
    const latencyMs = state.startTime ? Date.now() - state.startTime : 0;
    return {
        runMeta: {
            engine: "langgraph" as const,
            modelVersion: "gpt-4o",
            promptVersion: "v2",
            graphVersion: "v2",
            graphHash: "multi-chain-v2",
            registryVersion: "v2",
            computeVersion: "v1",
            latencyMs,
            attemptCount: state.globalAttempt,
        },
    };
};

// ─── Routing ──────────────────────────────────────────────────────────────────

const routeAfterSlotValidator = (state: MultiChainGraphState): "SlotRepairNode" | "AssemblerNode" => {
    const failingSlots = Object.entries(state.slotErrors ?? {})
        .filter(([slot, errs]) => errs.length > 0 && (state.slotAttempts[slot] ?? 0) < 2);
    return failingSlots.length > 0 ? "SlotRepairNode" : "AssemblerNode";
};

// ─── Graph ────────────────────────────────────────────────────────────────────

export const createMultiChainStudioGraph = () => {
    const workflow = new StateGraph<MultiChainGraphState>({
        channels: {
            query: { value: (x, y) => y ?? x, default: () => "" },
            mode: { value: (x, y) => y ?? x, default: () => "system_studio" },
            context: { value: (x, y) => y ?? x, default: () => ({ history: [], userEdits: {} }) },
            messages: { value: (x, y) => x.concat(y), default: () => [] as BaseMessage[] },
            startTime: { value: (x, y) => y ?? x, default: () => Date.now() },
            intent: { value: (x, y) => y ?? x, default: () => undefined },
            layoutPlan: { value: (x, y) => y ?? x, default: () => undefined },
            slotDrafts: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            slotErrors: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            slotAttempts: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            draftSpec: { value: (x, y) => y ?? x, default: () => undefined },
            computedBySlot: { value: (x, y) => y ?? x, default: () => undefined },
            finalSpec: { value: (x, y) => y ?? x, default: () => undefined },
            runMeta: { value: (x, y) => y ?? x, default: () => undefined },
            globalAttempt: { value: (x, y) => y ?? x, default: () => 1 },
        },
    })
        .addNode("IntentExtractorNode", intentExtractorNode)
        .addNode("LayoutPlannerNode", layoutPlannerNode)
        .addNode("SlotComposerNode", slotComposerNode)
        .addNode("SlotValidatorNode", slotValidatorNode)
        .addNode("SlotRepairNode", slotRepairNode)
        .addNode("AssemblerNode", assemblerNode)
        .addNode("ComputeNode", computeNode)
        .addNode("FinalizeNode", finalizeNode)

        .addEdge(START, "IntentExtractorNode")
        .addEdge("IntentExtractorNode", "LayoutPlannerNode")
        .addEdge("LayoutPlannerNode", "SlotComposerNode")
        .addEdge("SlotComposerNode", "SlotValidatorNode")
        .addConditionalEdges("SlotValidatorNode", routeAfterSlotValidator)
        .addEdge("SlotRepairNode", "SlotValidatorNode")
        .addEdge("AssemblerNode", "ComputeNode")
        .addEdge("ComputeNode", "FinalizeNode")
        .addEdge("FinalizeNode", END);

    return workflow.compile();
};

// Keep old export for any remaining references
export const createSystemStudioGraph = createMultiChainStudioGraph;
