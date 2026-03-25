# Cognify

**Chat-in, UX-out.** Type a query; get back a structured, interactive interface — never a wall of text.

Cognify is a Next.js app that turns natural language prompts into rich UI panels using a multi-step LangGraph pipeline. Instead of returning prose, it generates a validated JSON spec that the frontend renders as interactive modules: system diagrams, comparison matrices, quizzes, calculators, dashboards, and more.

---

## How it works

```
User prompt
    │
    ▼
RouterNode        — classifies query intent and selects relevant modules
    │
    ▼
ComposerNode      — GPT-4o generates a StudioSpecV1 JSON via tool call
    │
    ▼
ValidatorNode     — Zod schema + experience invariants + auto-fill
    │
    ▼
RepairNode        — if invalid, GPT-4o repairs (up to 4 attempts)
    │
    ▼
ComputeNode       — deterministic math (DAGRE layout, weighted scores)
    │
    ▼
FinalizeNode      — attaches run metadata + canonical SHA-256 hash
    │
    ▼
ModuleRegistryRenderer — React renders each module slot
```

## Module library (23 modules)

| Category | Modules |
|---|---|
| **Structural** | SystemMap, ModuleCards, DiagramModule, HierarchyTree, MindMap |
| **Explanation** | ExplainerSection, ConceptCards, Timeline, NumberedProcess, RecipeModule |
| **Decision** | TradeoffMatrix, ComparisonPanel, ProsCons, DecisionTree, ScenarioComparison, ScorecardPanel |
| **Risk & Action** | RiskPanel, ActionPlan, ChecklistModule |
| **Data** | Dashboard (CSV charts), InteractiveCalculator |
| **Assessment** | QuizModule, FlashcardDeck |

Example prompts that produce different module combinations:
- *"How does the TCP/IP stack work?"* → SystemMap + ExplainerSection + RiskPanel
- *"React vs Vue vs Angular"* → TradeoffMatrix + ConceptCards + ActionPlan
- *"Quiz me on machine learning"* → QuizModule + ConceptCards
- *"Analyze my CSV sales data"* → Dashboard + ExplainerSection
- *"Calculate mortgage payments"* → InteractiveCalculator + ScenarioComparison

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **AI pipeline**: LangGraph + GPT-4o (`@langchain/langgraph`, `@langchain/openai`)
- **Validation**: Zod v4 (schema + per-module config validation)
- **Auth**: NextAuth v5 beta with Google OAuth
- **Database**: SQLite via Prisma
- **UI**: React 19, Tailwind CSS v4, Radix UI, Framer Motion
- **Charts**: Recharts
- **Diagrams**: Mermaid
- **Math**: KaTeX
- **Maps**: Leaflet / react-leaflet
- **CSV parsing**: PapaParser

## Getting started

### Prerequisites

- Node.js 18+
- A Google OAuth app ([console.cloud.google.com](https://console.cloud.google.com))
- An OpenAI API key

### 1. Clone and install

```bash
git clone https://github.com/thatprakhar/cognify-v2.git
cd cognify-v2
npm install
```

### 2. Configure environment

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=file:./dev.db
```

### 3. Set up the database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development

```bash
npm run dev        # dev server with Turbopack
npm run build      # production build
npm run lint       # ESLint

npx prisma studio  # visual DB browser
npx prisma db push # apply schema changes
```

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── run/        # main generation endpoint (POST)
│   │   ├── upload/     # CSV upload handler
│   │   └── auth/       # NextAuth routes
│   └── page.tsx        # two-panel layout (chat + studio)
├── components/
│   ├── studio/
│   │   ├── ModuleRegistry.tsx   # maps slots → React components
│   │   └── modules/             # 23 module components
│   └── layout/
├── lib/
│   ├── engine/
│   │   └── langgraph.ts         # LangGraph state machine
│   ├── schema/
│   │   ├── studio-spec.ts       # StudioSpecV1 envelope schema
│   │   ├── module-manifest.ts   # module registry + query routing
│   │   └── module-configs/      # per-module Zod schemas
│   ├── validation/
│   │   └── strict-validator.ts  # spec validation + auto-fill
│   ├── compute/                 # DAGRE layout, score computation
│   └── rate-limit/
└── hooks/
    ├── useChat.ts               # message history
    └── useGenerate.ts           # pipeline state + studioSpec
```

## Security notes

- API keys are server-side only — never sent to the client
- User input is placed in a delimited block, never interpolated into LLM system prompts
- All LLM outputs go through Zod validation before rendering
- The renderer never uses `dangerouslySetInnerHTML`, `eval`, or dynamic `import()`
- Per-user in-memory rate limiting on the generation endpoint

## License

MIT
