# Cognify V2 — Full Architecture & Implementation Context

> **Purpose**: This document captures the full design context for Cognify V2 so any AI agent or developer can pick up implementation from where it was left off.

---

## What is Cognify?

A **"Chat-in, UX-out"** product: users type queries into a chat input, and instead of text responses, the system generates **interactive UI experiences**. The system NEVER responds with free-form text — only structured JSON that gets rendered as live React components.

Examples:
- "Help me choose my career path" → interactive quiz → results dashboard
- "Analyze my monthly expenses" → CSV upload → dashboard with charts
- "Explain neural networks" → modern wiki page with visuals + inline quiz

---

## Key Design Decisions (approved by the founder)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Experience types | **No hardcoded experiences.** Build a library of reusable "Lego block" component primitives. LLM composes them dynamically. | Scalability — any query can produce any combination of blocks |
| User input | **Free-form queries** supported. Prompt chips are examples/demos only. | UX flexibility |
| Chat model | **Multi-turn.** Chat blocked during guided flows (quiz steps), then unlocked for follow-ups after experience renders. | Users can refine, ask follow-ups, request changes |
| Export | **Not in MVP.** | Ship fast |
| Data uploads | **CSV upload only.** No Plaid/bank APIs. | Simplicity |
| Data persistence | **Ephemeral** — server processes in-memory, nothing persists to DB. | Privacy, simplicity for MVP |
| Authentication | **OAuth** (Google/GitHub) via NextAuth | Security |
| LLM pipeline | **Three-agent pipeline** (see below) | Separation of concerns |
| LLM provider | **Single provider to start** (either Claude or OpenAI), with abstraction layer for swapping later | Flexibility |
| API security | **Server-side only.** API keys never reach the client. **Rate limiting**: 20 generations/hour, 100/day per user. | Cost control |
| Streaming | **Real LLM processing status** via SSE. No fake animations. | Authenticity |
| Framework | **Next.js** (App Router, TypeScript, Tailwind) | Fullstack in one repo, fast to ship, easy deploy |
| Component nesting | **Nestable + grid-based.** Primitives can contain other primitives within a layout system. | Rich, complex experiences |
| Design system | **Unified** — all blocks share a common visual language | Consistency |
| Analytics | **Skip for MVP**, add later | Ship fast |
| Caching | **Skip for MVP**, add later. When added: hash(query + userId) → cached spec with "Regenerate" button | Ship fast |
| Budget | **$100-200/month** for LLM API costs during development | Reasonable |

---

## System Architecture

### Three-Agent Pipeline

```
User Query
    ↓
┌─────────────────────────────────┐
│ Agent 1: INTENT EXTRACTION      │
│ Understands what the user wants │
│ Output: IntentSpec JSON         │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ Agent 2: UX SELECTOR            │
│ Picks the best experience type  │
│ Output: UXPlan JSON             │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ Agent 3: UI RENDERER            │
│ Generates component tree JSON   │
│ Output: UISpec JSON             │
└──────────────┬──────────────────┘
               ↓
    Dynamic React Renderer
    (walks JSON tree → renders Lego blocks)
```

Each agent's output is validated via Zod schemas before being passed to the next agent. If validation fails, the agent is re-prompted once. If it fails again, graceful error to user.

### SSE Streaming Protocol

The `/api/generate` endpoint streams server-sent events to the client:

```
event: status
data: {"stage": "intent", "message": "Understanding your query..."}

event: status
data: {"stage": "ux", "message": "Designing the best experience..."}

event: status
data: {"stage": "rendering", "message": "Building your interactive experience..."}

event: complete
data: { ...full UISpec JSON... }

event: error
data: {"message": "Failed to generate", "code": "VALIDATION_ERROR"}
```

---

## JSON Schemas

### Agent 1 Output — IntentSpec

```json
{
  "query": "Help me understand how neural networks work",
  "intent": "explanation",
  "domain": "machine-learning",
  "complexity": "intermediate",
  "goalType": "understand",
  "requiredInputs": [],
  "contextFromChat": []
}
```

- `intent` enum: `explanation` | `analysis` | `decision` | `creation` | `comparison` | `learning`
- `goalType` enum: `understand` | `decide` | `analyze` | `create` | `compare` | `learn`
- `complexity` enum: `basic` | `intermediate` | `advanced`
- `requiredInputs`: array of `{ type: "csv" | "text" | "selection", label: string, description: string }`

### Agent 2 Output — UXPlan

```json
{
  "experienceType": "wiki",
  "layout": "single-column",
  "sections": [
    { "role": "hero", "purpose": "Visual hook + title" },
    { "role": "content", "purpose": "Core explanation with visuals" },
    { "role": "interactive", "purpose": "Try-it-yourself simulation" },
    { "role": "summary", "purpose": "Key takeaways" }
  ],
  "interactionModel": "scroll-through",
  "estimatedBlocks": 8
}
```

- `experienceType` enum: `quiz` | `dashboard` | `wiki` | `form` | `comparison` | `slides` | `hybrid`
- `layout` enum: `single-column` | `two-column` | `tabbed` | `step-by-step`
- `interactionModel` enum: `scroll-through` | `step-by-step` | `tabbed` | `interactive`

### Agent 3 Output — UISpec (the core schema)

```json
{
  "version": "1.0",
  "title": "How Neural Networks Work",
  "theme": { "accent": "#2563eb" },
  "root": {
    "type": "Stack",
    "props": { "gap": "lg" },
    "children": [
      {
        "type": "Hero",
        "props": {
          "title": "Neural Networks",
          "subtitle": "From biological neurons to AI"
        }
      },
      {
        "type": "Tabs",
        "props": { "tabs": ["Basics", "Advanced"] },
        "children": [
          { "type": "WikiSection", "props": { "heading": "Basics", "body": "..." } },
          { "type": "WikiSection", "props": { "heading": "Advanced", "body": "..." } }
        ]
      },
      {
        "type": "Quiz",
        "props": {
          "questions": [
            {
              "question": "What does an activation function do?",
              "options": ["Stores data", "Introduces non-linearity", "Compresses images"],
              "correct": 1
            }
          ]
        }
      }
    ]
  }
}
```

The UISpec is a **recursive tree**: every node has `type` (from allowlist), `props` (type-specific), and optional `children` (array of nodes).

---

## Lego Block Component Library (Allowlist)

### Layout Blocks (can contain children)
| Block | Purpose |
|-------|---------|
| `Stack` | Vertical flex container with configurable gap |
| `Grid` | CSS grid layout (2-4 columns) |
| `Tabs` | Tabbed navigation, each tab maps to a child |
| `Accordion` | Collapsible sections |
| `Columns` | Side-by-side columns |

### Content Blocks (leaf only, no children)
| Block | Purpose |
|-------|---------|
| `Hero` | Large title + subtitle + optional visual |
| `WikiSection` | Heading + rich text body + optional aside |
| `InfoCard` | Highlighted card with title + content |
| `StatCard` | Single metric with label + trend |
| `Table` | Data table with headers + rows |
| `Image` | Image with caption |
| `Callout` | Highlighted tip/warning/note box |
| `Divider` | Visual separator |

### Interactive Blocks (leaf only, no children)
| Block | Purpose |
|-------|---------|
| `Quiz` | Multi-question quiz with scoring |
| `Form` | Input fields that collect user data |
| `FileUpload` | CSV/file upload with preview |
| `Slider` | Range input for parameters |
| `Chart` | Recharts-powered visualization (bar, line, pie, area) |
| `ProgressTracker` | Step indicator for multi-step flows |

### Nesting Rules
1. Only Layout Blocks can have `children`
2. Content/Interactive Blocks are leaf-only — `children` is rejected
3. Layout Blocks MUST have at least one child
4. The `root` of every UISpec must be a Layout Block

---

## Prompting Strategy

### Agent 1: Intent Extraction
```
SYSTEM: You are an intent extraction agent for Cognify. Given a user's chat message
and conversation history, output a JSON object matching the IntentSpec schema.

Rules:
- NEVER output free text. ONLY output valid JSON.
- Identify the user's goal: understand, decide, analyze, create, compare, or learn?
- Identify the domain and complexity level.
- If the user needs to provide data before proceeding, list them in requiredInputs.
- If this is a follow-up message, include relevant context from chat history.

Output ONLY this JSON structure:
{ "query": "...", "intent": "...", "domain": "...", "complexity": "...",
  "goalType": "...", "requiredInputs": [], "contextFromChat": [] }
```

### Agent 2: UX Selection
```
SYSTEM: You are a UX architect agent. Given an IntentSpec, decide the best interactive
experience structure. Rules:
- "understand" goals → wiki or slides
- "decide" goals → quiz or comparison
- "analyze" goals → dashboard with charts
- "learn" goals → quiz + wiki hybrid
- "create" goals → form + result display

Output ONLY this JSON structure:
{ "experienceType": "...", "layout": "...", "sections": [...],
  "interactionModel": "...", "estimatedBlocks": N }
```

### Agent 3: UI Rendering
```
SYSTEM: You are a UI rendering agent. Given an IntentSpec and UXPlan, generate a
complete UISpec JSON using ONLY the allowed component types.

AVAILABLE COMPONENTS: [full allowlist with props]

Rules:
- ONLY output valid JSON matching UISpec schema
- ONLY use component types from the allowlist
- Root must be a layout block
- Leaf blocks cannot have children
- Parent blocks must have children
- Use real, accurate information — no hallucination
- For charts, provide realistic data arrays
```

All agents use `response_format: { type: "json_object" }` (OpenAI) or equivalent.

---

## Project Structure

```
cognify-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + providers
│   │   ├── page.tsx                # Home — chat + experience panels
│   │   ├── globals.css
│   │   └── api/
│   │       ├── generate/route.ts   # SSE pipeline endpoint
│   │       ├── chat/route.ts       # Follow-up chat endpoint
│   │       └── auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── StatusIndicator.tsx
│   │   ├── experience/
│   │   │   ├── ExperiencePanel.tsx
│   │   │   └── BlockRenderer.tsx   # Recursive JSON → React mapper
│   │   └── blocks/                 # Lego block primitives
│   │       ├── layout/
│   │       │   ├── Stack.tsx
│   │       │   ├── Grid.tsx
│   │       │   ├── Tabs.tsx
│   │       │   ├── Accordion.tsx
│   │       │   └── Columns.tsx
│   │       ├── content/
│   │       │   ├── Hero.tsx
│   │       │   ├── WikiSection.tsx
│   │       │   ├── InfoCard.tsx
│   │       │   ├── StatCard.tsx
│   │       │   ├── Table.tsx
│   │       │   ├── Callout.tsx
│   │       │   └── Divider.tsx
│   │       └── interactive/
│   │           ├── Quiz.tsx
│   │           ├── Form.tsx
│   │           ├── FileUpload.tsx
│   │           ├── Slider.tsx
│   │           ├── Chart.tsx
│   │           └── ProgressTracker.tsx
│   ├── lib/
│   │   ├── pipeline/
│   │   │   ├── orchestrator.ts     # Runs 3 agents sequentially
│   │   │   ├── stream.ts           # SSE helpers
│   │   │   └── types.ts            # ✅ CREATED — IntentSpec, UXPlan, UISpec types
│   │   ├── agents/
│   │   │   ├── intent.ts           # Agent 1
│   │   │   ├── ux-selector.ts      # Agent 2
│   │   │   └── renderer.ts         # Agent 3
│   │   ├── llm/
│   │   │   ├── provider.ts         # Abstract LLM interface
│   │   │   ├── openai.ts           # OpenAI adapter
│   │   │   └── claude.ts           # Claude adapter
│   │   ├── schema/
│   │   │   ├── intent.ts           # ✅ CREATED — Zod schema for IntentSpec
│   │   │   ├── ux-plan.ts          # ✅ CREATED — Zod schema for UXPlan
│   │   │   ├── ui-spec.ts          # ✅ CREATED — Zod schema for UISpec + allowlist
│   │   │   └── blocks.ts           # Per-block prop schemas (TODO)
│   │   ├── auth/
│   │   │   └── config.ts           # NextAuth configuration
│   │   └── rate-limit/
│   │       └── limiter.ts          # In-memory rate limiter
│   └── hooks/
│       ├── useGenerate.ts          # SSE + generation state hook
│       └── useChat.ts              # Chat state management
├── .env.local                      # API keys, OAuth secrets (TODO — create this)
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## What Has Been Built So Far

### ✅ Completed
1. **Next.js project scaffolded** with TypeScript, Tailwind, App Router, Turbopack
2. **Dependencies installed**: zod, next-auth@beta, @auth/core, openai, @anthropic-ai/sdk, lucide-react, framer-motion, recharts
3. **Core types** (`src/lib/pipeline/types.ts`): IntentSpec, UXPlan, UISpec, PipelineState, SSE events, ChatMessage, Session
4. **Zod schemas** created:
   - `src/lib/schema/intent.ts` — IntentSpec validation
   - `src/lib/schema/ux-plan.ts` — UXPlan validation
   - `src/lib/schema/ui-spec.ts` — UISpec validation with recursive UINode, component allowlist, parent/leaf nesting rules

### 🔲 TODO (in order)
1. **LLM adapter** (`lib/llm/provider.ts`, `openai.ts`, `claude.ts`) — provider-agnostic interface
2. **Per-block prop schemas** (`lib/schema/blocks.ts`) — Zod schemas for each block's props
3. **Agent implementations** (`lib/agents/intent.ts`, `ux-selector.ts`, `renderer.ts`) — system prompts + LLM calls
4. **Pipeline orchestrator** (`lib/pipeline/orchestrator.ts`) — runs 3 agents sequentially, handles retries
5. **SSE streaming** (`lib/pipeline/stream.ts`) — helper for streaming events
6. **API routes** (`app/api/generate/route.ts`, `app/api/chat/route.ts`) — endpoints
7. **Auth** (`lib/auth/config.ts`, `app/api/auth/[...nextauth]/route.ts`) — NextAuth OAuth setup
8. **Rate limiter** (`lib/rate-limit/limiter.ts`) — in-memory per-user limiting
9. **Lego block components** (`components/blocks/`) — all 18 React components
10. **BlockRenderer** (`components/experience/BlockRenderer.tsx`) — recursive JSON → React mapper
11. **Chat UI** (`components/chat/`) — ChatPanel, ChatInput, MessageBubble, StatusIndicator
12. **Experience UI** (`components/experience/ExperiencePanel.tsx`) — right-side container
13. **Frontend hooks** (`hooks/useGenerate.ts`, `hooks/useChat.ts`) — state management
14. **Main page** (`app/page.tsx`) — two-panel layout connecting everything
15. **Global styles** — Tailwind theme, design tokens, light theme
16. **`.env.local`** — environment variables template

---

## Environment Variables Needed

```env
# LLM Provider (pick one to start)
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

---

## Security Considerations
- User input is NEVER interpolated into system prompts — placed in a `<user_query>` delimited block
- Agent outputs are validated via Zod before passing to next agent
- Renderer only reads validated `props` — no `dangerouslySetInnerHTML`, no `eval`, no dynamic `import()`
- Rate limiting: 20 generations/hour, 100/day per user
- API keys server-side only, never sent to client

---

## Design Aesthetic
- **Light theme**, modern, minimal (Notion/Apple-ish)
- Left side: chat-style input + message bubbles
- Under input: prompt chips (examples of what the system can do)
- Right side: the generated interactive experience
- The system shows real-time pipeline status during generation
- Never shows long textual answers — always structured UI
