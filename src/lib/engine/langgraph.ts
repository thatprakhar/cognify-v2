import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { StudioGraphState } from "./state";
import { createSystemStudioSpecV1, repairSystemStudioSpecV1 } from "./tools";
import { BaseMessage, ToolMessage } from "@langchain/core/messages";

import { validateStudioSpec } from "../validation/strict-validator";

const routerNode = async (state: StudioGraphState) => {
    if (state.mode !== "system_studio") {
        // Mode bypass placeholder just passing empty draft
        return { ...state };
    }
    return { ...state };
};

const composerNode = async (state: StudioGraphState) => {
    // Use bound tool LLM
    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0,
    }).bindTools([createSystemStudioSpecV1]);

    const systemPrompt = `You are an expert software architect building interactive system diagrams and tradeoffs.
The user wants to explore a technical concept or system architecture.
You MUST call the create_system_studio_spec_v1 tool to generate the response.
CRITICAL: You MUST fully populate the 'config' object for EVERY module you include.
- For SystemMap: populate 'nodes' and 'edges'
- For ModuleCards: populate 'modules'
- For TradeoffMatrix: populate 'options', 'criteria', and 'scores'
- For RiskPanel: populate 'risks'
DO NOT leave any config object empty.`;

    const response = await model.invoke([
        { role: "system", content: systemPrompt },
        ...state.messages
    ]);

    // Extract tool call
    const toolCall = response.tool_calls?.[0];
    if (toolCall?.name === "create_system_studio_spec_v1") {
        const draftSpec = toolCall.args as any;

        // We must provide the tool message response to avoid OpenAI API 400 error on the next turn
        const toolMessage = new ToolMessage({
            content: "Successfully generated the speculative draft spec.",
            tool_call_id: toolCall.id!,
            name: toolCall.name || "create_system_studio_spec_v1"
        });

        return { draftSpec, messages: [response, toolMessage] };
    }

    return { validationErrors: ["Failed to call create_system_studio_spec_v1"] };
};

const validatorNode = async (state: StudioGraphState) => {
    if (!state.draftSpec) return { validationErrors: ["No draft spec generated."] };

    const { isValid, errors, autoFilledSpec } = validateStudioSpec(state.draftSpec);

    // Save autoFilledSpec as our new working copy if valid (or even if partially failed, we want those defaults)
    if (!isValid) {
        return { validationErrors: errors, draftSpec: autoFilledSpec || state.draftSpec };
    }
    return { validationErrors: [], draftSpec: autoFilledSpec || state.draftSpec };
};

const repairNode = async (state: StudioGraphState) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0,
    }).bindTools([repairSystemStudioSpecV1]);

    // Provide exactly the repair tool
    const response = await model.invoke([
        ...state.messages,
        { role: "system", content: `Please repair the following validation errors in your spec by calling repair_system_studio_spec_v1: \n${state.validationErrors?.join("\n")}\n\nCRITICAL: Make sure to fully populate the missing arrays like 'modules', 'nodes', 'options', 'risks', etc.` }
    ]);

    const toolCall = response.tool_calls?.[0];
    if (toolCall?.name === "repair_system_studio_spec_v1") {
        const draftSpec = toolCall.args.updatedSpec as any;

        const toolMessage = new ToolMessage({
            content: "Successfully repaired the spec.",
            tool_call_id: toolCall.id!,
            name: toolCall.name || "repair_system_studio_spec_v1"
        });

        return {
            draftSpec,
            attempt: state.attempt + 1,
            messages: [response, toolMessage]
        };
    }

    // Fallback if LLM randomly stops using tools
    return { attempt: state.attempt + 1 };
};

const computeNode = async (state: StudioGraphState) => {
    // Simulate deterministic compute mapping layout and tradesoff scores
    return { finalSpec: state.draftSpec };
};

const finalizeNode = async (state: StudioGraphState) => {
    return {
        runMeta: {
            engine: "langgraph",
            modelVersion: "gpt-4o",
            promptVersion: "v1",
            graphVersion: "v1",
            graphHash: "hash",
            registryVersion: "v1",
            computeVersion: "v1",
            latencyMs: 1000,
            attemptCount: state.attempt,
        }
    };
};

// Define Edges
const routeAfterValidator = (state: StudioGraphState): "ComputeNode" | "RepairNode" => {
    const hasErrors = state.validationErrors && state.validationErrors.length > 0;
    if (!hasErrors) return "ComputeNode";
    if (hasErrors && state.attempt < 4) return "RepairNode";
    return "ComputeNode"; // Return with partial errors if attempts exceeded
};

export const createSystemStudioGraph = () => {
    const workflow = new StateGraph<StudioGraphState>({
        channels: {
            query: { value: (x, y) => y ?? x, default: () => "" },
            mode: { value: (x, y) => y ?? x, default: () => "system_studio" },
            context: { value: (x, y) => y ?? x, default: () => ({ history: [], userEdits: {} }) },
            draftSpec: { value: (x, y) => y ?? x, default: () => undefined },
            validationErrors: { value: (x, y) => y ?? x, default: () => undefined },
            attempt: { value: (x, y) => y ?? x, default: () => 1 },
            finalSpec: { value: (x, y) => y ?? x, default: () => undefined },
            messages: { value: (x, y) => x.concat(y), default: () => [] as BaseMessage[] },
            runMeta: { value: (x, y) => y ?? x, default: () => undefined }
        }
    })
        .addNode("RouterNode", routerNode)
        .addNode("ComposerNode", composerNode)
        .addNode("ValidatorNode", validatorNode)
        .addNode("RepairNode", repairNode)
        .addNode("ComputeNode", computeNode)
        .addNode("FinalizeNode", finalizeNode)

        .addEdge(START, "RouterNode")

        // Simplified Routing map
        .addConditionalEdges("RouterNode", (state) => {
            if (state.mode !== "system_studio") return END;
            return "ComposerNode";
        })

        .addEdge("ComposerNode", "ValidatorNode")
        .addConditionalEdges("ValidatorNode", routeAfterValidator)
        .addEdge("RepairNode", "ValidatorNode")
        // Compute handles partial errors gracefully directly modifying output
        .addEdge("ComputeNode", "FinalizeNode")
        .addEdge("FinalizeNode", END);

    return workflow.compile();
};
