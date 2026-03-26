import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { MultiChainGraphState, QueryIntent, LayoutPlan } from "./state";
import { regenerateSystemStudioSlotV1 } from "./tools";
import { BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { validateStudioSpec } from "../validation/strict-validator";
import { computeSpec } from "../compute";
import { QUERY_TYPE_MODULE_RECOMMENDATIONS, getModuleMenuForPrompt } from "../schema/module-manifest";
import { getSchemaRequirements } from "../schema/schema-hints";

// ─── Slot-specific system prompt snippets ────────────────────────────────────

const SLOT_PROMPTS: Record<string, string> = {
  SystemMap: `Generate a JSON object with these exact fields:
{
  "nodes": [ { "id": "api-gateway", "label": "API Gateway", "type": "service", "description": "..." }, ... ],
  "edges": [ { "id": "edge-1", "from": "api-gateway", "to": "user-db", "label": "reads", "type": "sync" }, ... ],
  "legend": [ { "type": "service", "label": "Service" }, { "type": "database", "label": "Database" }, ... ]
}
- nodes: 4-8 nodes. type must be one of: user/service/database/external/client/worker/queue
- edges: MUST include id (e.g. "edge-1", "edge-2"). type must be one of: sync/async/stream/event
- legend: each entry MUST have type (string) and label (string) — no color field
- All ids: short hyphenated lowercase strings`,

  ModuleCards: `Generate a JSON object with this exact shape:
{
  "modules": [
    {
      "id": "auth-service",
      "name": "Auth Service",
      "description": "Handles user identity and session management.",
      "responsibility": "Issues and validates JWT tokens for all authenticated requests.",
      "apis": [ { "id": "api-login", "name": "POST /login", "description": "Accepts credentials and returns a signed JWT." } ],
      "dataStores": [ { "id": "ds-users", "name": "users-db", "description": "Stores hashed credentials and profile data." } ],
      "keyDecisions": ["JWT over sessions for stateless auth"],
      "failureModes": ["token expiry causes silent logout"],
      "dependsOnModuleIds": []
    }
  ]
}
- 3-6 modules. Top-level has ONLY "modules" array — do NOT add a "heading" field.
- apis and dataStores MUST be arrays of objects with id, name, description — NOT plain strings.
- keyDecisions, failureModes, dependsOnModuleIds are string arrays and can be [].`,

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
  "heading": "React vs Vue",
  "context": "1-2 sentences explaining what is being compared and why it matters.",
  "optionA": {
    "name": "React",
    "description": "1-2 sentence summary of this option.",
    "pros": ["Large ecosystem", "Flexible", "Strong job market"],
    "cons": ["Steeper learning curve", "Requires extra libraries"],
    "stats": { "Performance": "High", "Learning Curve": "Medium", "Bundle Size": "~40kb" },
    "badge": "Most Popular"
  },
  "optionB": {
    "name": "Vue",
    "description": "1-2 sentence summary of this option.",
    "pros": ["Gentle learning curve", "Great docs"],
    "cons": ["Smaller ecosystem", "Less enterprise adoption"],
    "stats": { "Performance": "High", "Learning Curve": "Low", "Bundle Size": "~34kb" }
  },
  "criteria": [
    { "name": "Performance", "optionAScore": 4, "optionBScore": 4, "isMoreBetter": true },
    { "name": "Ease of Use", "optionAScore": 3, "optionBScore": 5, "isMoreBetter": true },
    { "name": "Ecosystem Size", "optionAScore": 5, "optionBScore": 3, "isMoreBetter": true }
  ],
  "recommendation": {
    "winner": "optionA",
    "reasoning": "React wins for large teams due to ecosystem.",
    "whenToChooseA": "Large teams, enterprise projects.",
    "whenToChooseB": "Smaller projects, teams prioritizing ease of use."
  }
}
- heading and context are REQUIRED top-level fields
- optionA and optionB MUST have: name, description, pros (3-5 items), cons (3-5 items)
- stats MUST be a plain key-value object like {"Cost": "$10/mo"} — NOT an array
- criteria: each item MUST have name (string), optionAScore (1-5), optionBScore (1-5), isMoreBetter (boolean). Scores must differ between options.
- recommendation.winner must be "optionA", "optionB", or "depends"
- recommendation.whenToChooseA and whenToChooseB are optional but helpful
- 3-6 criteria`,

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
  "heading": "Your Action Plan",
  "context": "1-2 sentences of situational framing for this plan.",
  "phases": [
    {
      "id": "immediate",
      "name": "Immediate",
      "timeframe": "This week",
      "actions": [
        { "id": "setup-auth", "title": "Set up authentication", "description": "Specific concrete details.", "priority": "high", "effort": "medium" },
        { "id": "review-budget", "title": "Review initial budget", "description": "Specific concrete details.", "priority": "high", "effort": "low" }
      ]
    },
    {
      "id": "short-term",
      "name": "Short-term",
      "timeframe": "1-3 months",
      "actions": [
        { "id": "build-mvp", "title": "Build MVP features", "description": "Specific concrete details.", "priority": "medium", "effort": "high" }
      ]
    }
  ]
}
- heading and context are REQUIRED top-level fields
- Each phase MUST have: id (hyphenated-lowercase), name, timeframe (e.g. "This week", "1-3 months", "6+ months"), actions (2-5 items)
- Each action MUST have: id (hyphenated-lowercase), title (3-8 words, imperative), description (1-2 sentences), priority (high/medium/low), effort (low/medium/high)
- 2-4 phases ordered from most immediate to longest-term`,

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
  "heading": "Sales Analysis",
  "description": "Overview of sales performance by region and product.",
  "isMockData": true,
  "charts": [
    { "type": "bar", "title": "Revenue by Region", "xAxisKey": "region", "yAxisKeys": ["revenue"] },
    { "type": "line", "title": "Monthly Trend", "xAxisKey": "month", "yAxisKeys": ["sales", "returns"] }
  ]
}
- charts have NO "id" field. Each chart needs: type, title, xAxisKey, yAxisKeys (array of strings).
- xAxisKey: the column used as X axis / category label.
- yAxisKeys: array of column names for Y axis values — always an array even for one series.
- Do NOT include a "data" array — charts use uploaded CSV data.
- type: bar/line/area/pie. Set isMockData: true unless user uploaded real data.`,

  QuizModule: `Generate a JSON object with this exact shape:
{
  "heading": "Test Your Knowledge: Neural Networks",
  "description": "1-2 sentences describing what the quiz covers.",
  "questions": [
    { "id": "q-1", "question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0, "explanation": "Why A is correct and others are wrong." },
    ...
  ]
}
- heading and description are REQUIRED at the top level.
- Each question MUST use "question" (not "text") for the question string.
- 3-8 questions, 3-4 options each. correctIndex is 0-based. Vary difficulty.`,

  InteractiveCalculator: `Generate a JSON object with this exact shape:
{
  "title": "ROI Calculator",
  "description": "Adjust the sliders to compute your return on investment.",
  "inputs": [
    { "id": "initial_investment", "label": "Initial Investment", "unit": "$", "min": 1000, "max": 100000, "step": 1000, "defaultValue": 10000 },
    { "id": "annual_return", "label": "Annual Return Rate", "unit": "%", "min": 1, "max": 30, "step": 0.5, "defaultValue": 7 },
    { "id": "years", "label": "Investment Period", "unit": "years", "min": 1, "max": 30, "step": 1, "defaultValue": 10 }
  ],
  "outputs": [
    { "id": "final_value", "label": "Final Value", "unit": "$", "formula": "initial_investment * Math.pow(1 + annual_return / 100, years)", "format": "currency" },
    { "id": "total_gain", "label": "Total Gain", "unit": "$", "formula": "initial_investment * Math.pow(1 + annual_return / 100, years) - initial_investment", "format": "currency" }
  ]
}
- 2-4 inputs with sensible min/max/step/defaultValue for the topic
- 1-3 outputs with valid JS formula strings that reference input ids by exact id
- formula must be a valid JS expression (no semicolons, no assignments) — just a return expression
- format: "number" | "currency" | "percentage"`,

  DecisionTree: `Generate a JSON object with this exact shape:
{
  "title": "Which Framework Should I Use?",
  "description": "Answer a few questions to get a recommendation.",
  "rootId": "q-start",
  "nodes": [
    { "id": "q-start", "label": "Start", "type": "question", "question": "What is your primary use case?", "choices": [{ "label": "Web app", "nextId": "q-team-size" }, { "label": "Mobile app", "nextId": "leaf-react-native" }] },
    { "id": "q-team-size", "label": "Team Size", "type": "question", "question": "How large is your team?", "choices": [{ "label": "Solo or small", "nextId": "leaf-next" }, { "label": "Large team", "nextId": "leaf-remix" }] },
    { "id": "leaf-next", "label": "Next.js", "type": "leaf", "recommendation": "Next.js", "reasoning": "Great for small teams building fast web apps.", "nextSteps": ["Run npx create-next-app", "Read the docs"] },
    { "id": "leaf-remix", "label": "Remix", "type": "leaf", "recommendation": "Remix", "reasoning": "Better data loading patterns for large teams.", "nextSteps": ["Run npx create-remix", "Study loaders"] },
    { "id": "leaf-react-native", "label": "React Native", "type": "leaf", "recommendation": "React Native", "reasoning": "Best cross-platform mobile experience.", "nextSteps": ["Install Expo CLI"] }
  ]
}
- rootId must match an existing node id
- Every choice.nextId must reference an existing node id
- At least 2 question nodes and 2 leaf nodes
- leaf nodes have: recommendation (short name), reasoning (1-2 sentences), optional nextSteps array`,

  ProsCons: `Generate a JSON object with this exact shape:
{
  "title": "Should I Rent or Buy a Home?",
  "question": "What makes more financial sense given my situation?",
  "options": [
    {
      "id": "renting",
      "label": "Renting",
      "pros": [
        { "id": "p1", "text": "Flexibility to move", "weight": 2 },
        { "id": "p2", "text": "No maintenance costs", "weight": 2 },
        { "id": "p3", "text": "Lower upfront cost", "weight": 3 }
      ],
      "cons": [
        { "id": "c1", "text": "No equity buildup", "weight": 3 },
        { "id": "c2", "text": "Subject to rent increases", "weight": 2 }
      ]
    },
    {
      "id": "buying",
      "label": "Buying",
      "pros": [
        { "id": "p1", "text": "Build equity over time", "weight": 3 },
        { "id": "p2", "text": "Stable monthly payments", "weight": 2 }
      ],
      "cons": [
        { "id": "c1", "text": "High upfront costs", "weight": 3 },
        { "id": "c2", "text": "Less flexibility", "weight": 2 },
        { "id": "c3", "text": "Maintenance responsibilities", "weight": 1 }
      ]
    }
  ],
  "recommendation": "Buying makes more sense if you plan to stay 5+ years."
}
- At least 2 pros and 2 cons per option. weight 1-3 (3 = most important)
- recommendation is optional but should be included when there's a clear winner`,

  ChecklistModule: `Generate a JSON object with this exact shape:
{
  "title": "SaaS Launch Checklist",
  "description": "Everything you need to do before going live.",
  "sections": [
    {
      "id": "pre-launch",
      "title": "Pre-Launch",
      "items": [
        { "id": "item-1", "text": "Set up error monitoring", "description": "Configure Sentry or similar.", "priority": "high" },
        { "id": "item-2", "text": "Write privacy policy", "priority": "high" },
        { "id": "item-3", "text": "Test payment flow end-to-end", "priority": "high" },
        { "id": "item-4", "text": "Set up analytics", "description": "GA4 or Plausible.", "priority": "medium" }
      ]
    },
    {
      "id": "post-launch",
      "title": "Post-Launch",
      "items": [
        { "id": "item-5", "text": "Monitor error rates for 24h", "priority": "high" },
        { "id": "item-6", "text": "Send launch email to waitlist", "priority": "medium" }
      ]
    }
  ]
}
- 2-4 sections, 3-6 items each
- priority: "high" | "medium" | "low" — set realistically
- description is optional but adds clarity`,

  RecipeModule: `Generate a JSON object with this exact shape:
{
  "title": "Classic Chocolate Chip Cookies",
  "description": "Crispy edges, chewy centers.",
  "servings": 24,
  "totalTime": "45 minutes",
  "ingredients": [
    { "id": "ing-1", "name": "all-purpose flour", "amount": 2.25, "unit": "cups" },
    { "id": "ing-2", "name": "butter", "amount": 1, "unit": "cup", "notes": "softened" },
    { "id": "ing-3", "name": "granulated sugar", "amount": 0.75, "unit": "cup" },
    { "id": "ing-4", "name": "brown sugar", "amount": 0.75, "unit": "cup", "notes": "packed" },
    { "id": "ing-5", "name": "eggs", "amount": 2, "unit": "large" },
    { "id": "ing-6", "name": "chocolate chips", "amount": 2, "unit": "cups" }
  ],
  "steps": [
    { "id": "step-1", "title": "Preheat & Prep", "instruction": "Preheat oven to 375°F. Line baking sheets with parchment paper.", "duration": "5 min" },
    { "id": "step-2", "title": "Mix Wet Ingredients", "instruction": "Beat butter and both sugars until creamy. Add eggs one at a time.", "tip": "Room temperature butter creams much better." },
    { "id": "step-3", "title": "Combine", "instruction": "Gradually mix in flour. Fold in chocolate chips.", "duration": "5 min" },
    { "id": "step-4", "title": "Bake", "instruction": "Drop rounded tablespoons onto sheets. Bake 9-11 minutes until golden.", "duration": "10 min" }
  ]
}
- At least 5 ingredients and 4 steps. Use realistic amounts and units.
- Steps can have an optional title, duration (time string), and tip.`,

  HierarchyTree: `Generate a JSON object with this exact shape:
{
  "title": "Machine Learning Taxonomy",
  "description": "A hierarchical breakdown of ML approaches.",
  "root": {
    "id": "ml",
    "label": "Machine Learning",
    "description": "The root of all ML approaches.",
    "children": [
      {
        "id": "supervised",
        "label": "Supervised Learning",
        "description": "Training with labeled data.",
        "children": [
          { "id": "classification", "label": "Classification", "description": "Predict discrete categories." },
          { "id": "regression", "label": "Regression", "description": "Predict continuous values." }
        ]
      },
      {
        "id": "unsupervised",
        "label": "Unsupervised Learning",
        "description": "Training without labels.",
        "children": [
          { "id": "clustering", "label": "Clustering" },
          { "id": "dim-reduction", "label": "Dimensionality Reduction" }
        ]
      },
      {
        "id": "reinforcement",
        "label": "Reinforcement Learning",
        "description": "Learning through rewards and penalties."
      }
    ]
  }
}
- root can have 2-6 children. Children can have their own children (max 3 levels deep).
- Every node needs id (hyphenated-lowercase) and label. description is optional.`,

  MindMap: `Generate a JSON object with this exact shape:
{
  "title": "Product-Market Fit Mind Map",
  "centerLabel": "PMF",
  "description": "Key dimensions of product-market fit.",
  "branches": [
    {
      "id": "customer",
      "label": "Customer",
      "color": "#3b82f6",
      "topics": [
        { "id": "t1", "label": "ICP Definition", "detail": "Ideal customer profile clarity." },
        { "id": "t2", "label": "Pain Points", "detail": "Core problems being solved." },
        { "id": "t3", "label": "Willingness to Pay" }
      ]
    },
    {
      "id": "product",
      "label": "Product",
      "color": "#10b981",
      "topics": [
        { "id": "t4", "label": "Core Feature Set" },
        { "id": "t5", "label": "Retention Rate" },
        { "id": "t6", "label": "NPS Score" }
      ]
    },
    {
      "id": "market",
      "label": "Market",
      "color": "#f59e0b",
      "topics": [
        { "id": "t7", "label": "TAM Size" },
        { "id": "t8", "label": "Competitive Moat" }
      ]
    },
    {
      "id": "growth",
      "label": "Growth",
      "color": "#8b5cf6",
      "topics": [
        { "id": "t9", "label": "Organic Acquisition" },
        { "id": "t10", "label": "Referral Rate" }
      ]
    }
  ]
}
- 3-6 branches, each with 2-5 topics
- color is optional (hex color string) — assign distinct colors
- centerLabel should be a short abbreviation or keyword for the center circle`,

  FlashcardDeck: `Generate a JSON object with this exact shape:
{
  "title": "JavaScript Fundamentals",
  "description": "Core JS concepts for interviews and review.",
  "subject": "JavaScript",
  "cards": [
    { "id": "card-1", "front": "What is a closure?", "back": "A closure is a function that retains access to its lexical scope even when executed outside that scope.", "hint": "Think about inner functions.", "category": "Functions" },
    { "id": "card-2", "front": "What does 'hoisting' mean?", "back": "Variable and function declarations are moved to the top of their scope before code execution.", "category": "Execution" },
    { "id": "card-3", "front": "What is the event loop?", "back": "A mechanism that handles asynchronous callbacks by processing items from the callback queue after the call stack empties.", "category": "Async" },
    { "id": "card-4", "front": "Difference between == and ===?", "back": "== coerces types before comparing. === compares value AND type with no coercion.", "hint": "Think about type coercion.", "category": "Operators" },
    { "id": "card-5", "front": "What is a Promise?", "back": "An object representing the eventual completion or failure of an asynchronous operation.", "category": "Async" },
    { "id": "card-6", "front": "What is 'this' in JavaScript?", "back": "A reference to the current execution context. Its value depends on how a function is called.", "hint": "Arrow functions behave differently.", "category": "Scope" }
  ]
}
- At least 6 cards. front: question or term. back: complete answer.
- hint is optional but helpful. category groups cards by topic.`,

  NumberedProcess: `Generate a JSON object with this exact shape:
{
  "title": "How to Deploy a Next.js App to Production",
  "description": "A complete guide from build to live.",
  "context": "Assumes you have a working Next.js app and a Vercel account.",
  "steps": [
    {
      "id": "step-1",
      "title": "Run production build",
      "description": "Run npm run build to compile your app. Fix any TypeScript or ESLint errors before proceeding.",
      "detail": "The build output goes to .next/. Check for large bundle warnings.",
      "callout": { "type": "warning", "text": "Do not skip the build step — runtime errors surface here." }
    },
    {
      "id": "step-2",
      "title": "Set environment variables",
      "description": "Configure all required env vars in your deployment platform.",
      "substeps": ["Copy .env.local to Vercel dashboard", "Mark secrets as encrypted", "Never commit .env files to git"]
    },
    {
      "id": "step-3",
      "title": "Deploy to Vercel",
      "description": "Push to main branch or run vercel --prod from the CLI.",
      "callout": { "type": "tip", "text": "Use preview deployments for every PR to catch issues early." }
    },
    {
      "id": "step-4",
      "title": "Verify deployment",
      "description": "Check the deployment URL, run smoke tests, and monitor error logs for 30 minutes.",
      "detail": "Use Vercel Analytics to confirm page loads are normal."
    }
  ]
}
- 4-7 steps. Each must have id, title, description.
- detail is optional extra context. substeps is an optional string array.
- callout types: tip | warning | note | info`,

  ScenarioComparison: `Generate a JSON object with this exact shape:
{
  "title": "Startup Funding Scenarios",
  "description": "Compare three funding paths for your startup.",
  "metrics": [
    { "id": "runway", "label": "Runway", "unit": "months", "format": "number", "higherIsBetter": true },
    { "id": "dilution", "label": "Equity Dilution", "unit": "%", "format": "percentage", "higherIsBetter": false },
    { "id": "capital", "label": "Capital Raised", "format": "currency", "higherIsBetter": true },
    { "id": "speed", "label": "Time to Close", "unit": "weeks", "format": "number", "higherIsBetter": false }
  ],
  "scenarios": [
    {
      "id": "bootstrap",
      "label": "Bootstrap",
      "description": "Self-funded growth",
      "metrics": {
        "runway": { "value": 18 },
        "dilution": { "value": 0 },
        "capital": { "value": 0 },
        "speed": { "value": 0 }
      }
    },
    {
      "id": "angel",
      "label": "Angel Round",
      "description": "$500K from angels",
      "isHighlighted": true,
      "metrics": {
        "runway": { "value": 24 },
        "dilution": { "value": 10 },
        "capital": { "value": 500000 },
        "speed": { "value": 8 }
      }
    },
    {
      "id": "seed",
      "label": "Seed VC",
      "description": "$2M seed round",
      "metrics": {
        "runway": { "value": 36 },
        "dilution": { "value": 20 },
        "capital": { "value": 2000000 },
        "speed": { "value": 16 }
      }
    }
  ],
  "showChart": true
}
- 2-5 metrics, 2-4 scenarios. Every scenario must have a value for every metric id.
- higherIsBetter determines which cells are highlighted green vs red.
- Mark one scenario as isHighlighted: true for the recommended option.`,
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
  const model = new ChatOpenAI({ modelName: "gpt-5.2", temperature: 0 });

  const moduleMenu = getModuleMenuForPrompt();
  const prompt = `Analyze this user query and return a JSON object (no other text) with these exact fields:
{
  "queryType": one of: architecture|explanation|comparison-two|comparison-multi|risk-audit|data-analysis|learning|planning|scoring|process|calculation|decision|brainstorm|creative|financial|general,
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
- "calculate" / "estimate" / "how much" / "ROI" / "mortgage" → InteractiveCalculator + ScenarioComparison
- "help me decide" / "should I" / "which should I pick" → DecisionTree + ProsCons
- "pros and cons" / "is it worth it" → ProsCons + ActionPlan
- "checklist" / "what do I need" / "before I launch" → ChecklistModule + ActionPlan
- "step by step" / "how to" / "process for" / "guide to" → NumberedProcess + ChecklistModule
- "brainstorm" / "mind map" / "ideas around" → MindMap + ConceptCards
- "flashcards" / "study" / "memorize" / "learn terms" → FlashcardDeck + ExplainerSection
- "org chart" / "hierarchy" / "taxonomy" / "tree" → HierarchyTree + ExplainerSection
- "scenarios" / "what if" / "projection" / "financial forecast" → ScenarioComparison + InteractiveCalculator
- "recipe" / "how to make" / "ingredients" → RecipeModule

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
    InteractiveCalculator: "calculator",
    DecisionTree: "decision_tree",
    ProsCons: "pros_cons",
    ChecklistModule: "checklist",
    RecipeModule: "recipe",
    HierarchyTree: "hierarchy",
    MindMap: "mind_map",
    FlashcardDeck: "flashcards",
    NumberedProcess: "process",
    ScenarioComparison: "scenarios",
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

  const model = new ChatOpenAI({ modelName: "gpt-5.2", temperature: 0 });

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
    const schemaRequirements = getSchemaRequirements(moduleName);

    const prompt = `You are generating a config object for a ${moduleName} UI module.
Topic: "${state.query}" (domain: ${intent.domain}, subject: ${intent.subject})
${extraContext}

${instructions}

${schemaRequirements}

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

  const model = new ChatOpenAI({ modelName: "gpt-5.2", temperature: 0 });

  const updatedDrafts = { ...slotDrafts };
  const updatedAttempts = { ...slotAttempts };

  for (const [slot, errors] of Object.entries(slotErrors)) {
    if (!errors || errors.length === 0) continue;
    const attempts = slotAttempts[slot] ?? 0;
    if (attempts >= 2) continue;

    const moduleName = layoutPlan.moduleAssignments[slot];
    const currentConfig = slotDrafts[slot];

    const schemaHint = SLOT_PROMPTS[moduleName] ?? "";
    const schemaRequirements = getSchemaRequirements(moduleName);
    const prompt = `You are repairing a ${moduleName} config that failed validation.

ERRORS (each error includes the field path):
${errors.join("\n")}

CURRENT (INVALID) CONFIG:
${JSON.stringify(currentConfig, null, 2)}

CORRECT SCHEMA SHAPE FOR REFERENCE:
${schemaHint}

${schemaRequirements}

Fix every field listed in the errors above. Pay close attention to the field paths in each error.
Return ONLY the corrected JSON config object. No explanation, no markdown fences.
Query context: "${intent.subject}"`;


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
      modelVersion: "gpt-5.2",
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
