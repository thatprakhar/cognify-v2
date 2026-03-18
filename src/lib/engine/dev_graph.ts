import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { StudioGraphState } from "./state";
import { createSystemStudioSpecV1, repairSystemStudioSpecV1 } from "./tools";
import { BaseMessage, ToolMessage } from "@langchain/core/messages";

import { validateStudioSpec } from "../validation/strict-validator";

const routerNode = async (state: StudioGraphState) => {
    return { ...state };
};

const composerNode = async (state: StudioGraphState) => {
    // Use bound tool LLM
    const model = new ChatOpenAI({
        modelName: "gpt-5.2",
        temperature: 0,
    });

    const systemPrompt = `You are an expert at explaining things by building interactive diagrams and experiences.
The user has a question for you.
You must answer the question by building a diagram and experience. Your output should be RAW HTML. RAW HTML directly as response. NO TEXT OUTPUT.
Your raw html should be valid html and it will be rendered directly by setting dangerouslySetInnerHTML. So make sure it is valid html. and it works in this way on its own!
The pages should be beautiful. Use Tailwind CSS for styling. Also remember the pages are the end user experience. Whatever interactions that happen
on it, the resultant logic should be part of your raw html response. Please think extensivley before outputting html
`;

    const response = await model.invoke([
        { role: "system", content: systemPrompt },
        ...state.messages
    ]);


    return { finalSpec: response.content };
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


export const createDevGraph = () => {
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
            runMeta: { value: (x, y) => y ?? x, default: () => undefined },
            startTime: { value: (x, y) => y ?? x, default: () => Date.now() },
            slotDrafts: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            slotErrors: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            slotAttempts: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
            globalAttempt: { value: (x, y) => y ?? x, default: () => 1 },
        }
    })
        .addNode("RouterNode", routerNode)
        .addNode("ComposerNode", composerNode)
        .addNode("FinalizeNode", finalizeNode)

        .addEdge(START, "RouterNode")

        // Simplified Routing map
        .addEdge("RouterNode", "ComposerNode")
        .addEdge("ComposerNode", "FinalizeNode")
        .addEdge("FinalizeNode", END);

    return workflow.compile();
};
