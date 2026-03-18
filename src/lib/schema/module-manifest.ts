export type ModuleManifestEntry = {
    name: string;
    version: string;
    category: "structural" | "explanation" | "decision" | "risk-action" | "data" | "assessment";
    purpose: string;
    queryPatterns: string[];
    requiresData: boolean;
    computeLayer: boolean;
    dependsOn: string[];         // module names whose generated IDs this module may reference
    minArrayLengths: Record<string, number>;
};

export const MODULE_MANIFEST: ModuleManifestEntry[] = [
    {
        name: "SystemMap",
        version: "1.0",
        category: "structural",
        purpose: "Directed graph of nodes and edges representing a system, process, or data flow",
        queryPatterns: ["how does X work", "architecture of", "system design", "data flow", "components of", "infrastructure", "pipeline"],
        requiresData: false,
        computeLayer: true,
        dependsOn: [],
        minArrayLengths: { nodes: 3, edges: 2 },
    },
    {
        name: "ModuleCards",
        version: "1.0",
        category: "structural",
        purpose: "Software architecture module breakdown with APIs, data stores, and failure modes (use ConceptCards for non-technical queries)",
        queryPatterns: ["microservices", "service breakdown", "module architecture", "API design", "software components", "backend services"],
        requiresData: false,
        computeLayer: false,
        dependsOn: ["SystemMap"],
        minArrayLengths: { modules: 2 },
    },
    {
        name: "DiagramModule",
        version: "1.0",
        category: "structural",
        purpose: "Mermaid diagram: flowchart, sequence, class diagram, ER diagram, or Gantt chart",
        queryPatterns: ["flowchart", "sequence diagram", "draw a diagram", "class diagram", "entity relationship", "show the flow", "process diagram"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: {},
    },
    {
        name: "ExplainerSection",
        version: "1.0",
        category: "explanation",
        purpose: "Structured explanation with sections, callouts, and key takeaways — the wiki/deep-dive module",
        queryPatterns: ["explain", "what is", "how does", "deep dive", "overview of", "teach me about", "I want to understand"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { sections: 2 },
    },
    {
        name: "ConceptCards",
        version: "1.0",
        category: "explanation",
        purpose: "Grid of cards explaining key concepts, components, entities, or ideas",
        queryPatterns: ["what are the", "explain the parts", "key concepts", "main components", "types of", "principles of", "building blocks"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { cards: 2 },
    },
    {
        name: "Timeline",
        version: "1.0",
        category: "explanation",
        purpose: "Chronological sequence of events, phases, milestones, or steps",
        queryPatterns: ["history of", "timeline", "phases of", "sequence of", "evolution of", "when did", "steps in", "progression"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { items: 3 },
    },
    {
        name: "TradeoffMatrix",
        version: "1.0",
        category: "decision",
        purpose: "Weighted scoring matrix comparing 3+ options across multiple criteria",
        queryPatterns: ["compare multiple", "which is better among", "tradeoffs", "evaluate options", "choose between three", "pros and cons of multiple"],
        requiresData: false,
        computeLayer: true,
        dependsOn: [],
        minArrayLengths: { options: 2, criteria: 3, scores: 6 },
    },
    {
        name: "ComparisonPanel",
        version: "1.0",
        category: "decision",
        purpose: "Head-to-head comparison of exactly two options with pros/cons and scored criteria",
        queryPatterns: ["X vs Y", "A or B", "compare two", "difference between", "should I use X or Y", "which one"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { criteria: 3 },
    },
    {
        name: "ScorecardPanel",
        version: "1.0",
        category: "decision",
        purpose: "Evaluate something against multiple scored dimensions with a final verdict",
        queryPatterns: ["how good is", "rate", "score my", "evaluate", "assess", "grade", "review my", "is this a good"],
        requiresData: false,
        computeLayer: true,
        dependsOn: [],
        minArrayLengths: { dimensions: 3 },
    },
    {
        name: "RiskPanel",
        version: "1.0",
        category: "risk-action",
        purpose: "Risk register with severity/likelihood classification and mitigations",
        queryPatterns: ["risks", "what could go wrong", "failure modes", "vulnerabilities", "concerns", "pitfalls", "dangers of"],
        requiresData: false,
        computeLayer: false,
        dependsOn: ["SystemMap"],
        minArrayLengths: { risks: 3 },
    },
    {
        name: "ActionPlan",
        version: "1.0",
        category: "risk-action",
        purpose: "Concrete phased action plan with prioritized tasks and timeframes",
        queryPatterns: ["what should I do", "give me a plan", "how should I approach", "next steps", "roadmap", "action items", "help me plan"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { phases: 2 },
    },
    {
        name: "Dashboard",
        version: "1.0",
        category: "data",
        purpose: "Chart grid for data analysis — bar, line, area, and pie charts from uploaded CSV data",
        queryPatterns: ["analyze my data", "visualize", "chart", "show trends", "dashboard", "data from my", "CSV"],
        requiresData: true,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { charts: 1 },
    },
    {
        name: "QuizModule",
        version: "1.0",
        category: "assessment",
        purpose: "Interactive multiple-choice quiz with scoring and per-question explanations",
        queryPatterns: ["quiz me", "test my knowledge", "how well do I know", "practice questions", "test yourself", "challenge me"],
        requiresData: false,
        computeLayer: false,
        dependsOn: [],
        minArrayLengths: { questions: 3 },
    },
];

export const getModuleByName = (name: string): ModuleManifestEntry | undefined =>
    MODULE_MANIFEST.find(m => m.name === name);

export const getModulesByCategory = (category: ModuleManifestEntry["category"]): ModuleManifestEntry[] =>
    MODULE_MANIFEST.filter(m => m.category === category);

/** Returns a compact menu string for LLM system prompts */
export const getModuleMenuForPrompt = (moduleNames?: string[]): string => {
    const modules = moduleNames
        ? MODULE_MANIFEST.filter(m => moduleNames.includes(m.name))
        : MODULE_MANIFEST;
    return modules.map(m => `- ${m.name}: ${m.purpose}`).join("\n");
};

/** Query-type to recommended module sets */
export const QUERY_TYPE_MODULE_RECOMMENDATIONS: Record<string, string[]> = {
    "architecture":      ["SystemMap", "ModuleCards", "RiskPanel", "TradeoffMatrix"],
    "explanation":       ["ExplainerSection", "ConceptCards", "Timeline"],
    "comparison-two":    ["ComparisonPanel", "ExplainerSection", "ActionPlan"],
    "comparison-multi":  ["TradeoffMatrix", "ConceptCards", "ActionPlan"],
    "risk-audit":        ["RiskPanel", "SystemMap", "ActionPlan"],
    "data-analysis":     ["Dashboard", "ExplainerSection"],
    "learning":          ["ExplainerSection", "ConceptCards", "QuizModule"],
    "planning":          ["ActionPlan", "Timeline", "ScorecardPanel"],
    "scoring":           ["ScorecardPanel", "ComparisonPanel", "ActionPlan"],
    "general":           ["ExplainerSection", "ConceptCards", "ActionPlan"],
};
