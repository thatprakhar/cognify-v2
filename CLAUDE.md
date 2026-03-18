# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js with Turbopack)
npm run build    # Production build
npm run lint     # ESLint check
npx prisma db push      # Apply schema changes to SQLite dev DB
npx prisma generate     # Regenerate Prisma client after schema changes
npx prisma studio       # Visual DB browser
```

## Environment Variables

Required in `.env.local`:
```
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=file:./dev.db
```

## Architecture

Cognify is a **"Chat-in, UX-out"** app. Users type queries; the system generates structured JSON specs that render as interactive UI — never free-form text responses.

### Core Pipeline (`/api/run`)

The main generation endpoint (`src/app/api/run/route.ts`) runs a **LangGraph state machine** (`src/lib/engine/langgraph.ts`) with these nodes:

```
RouterNode → ComposerNode → ValidatorNode → RepairNode (up to 4x) → ComputeNode → FinalizeNode
```

1. **ComposerNode** — GPT-4o calls `create_system_studio_spec_v1` tool to produce a `StudioSpecV1` JSON
2. **ValidatorNode** — runs `validateStudioSpec()` (Zod envelope + per-module config schemas + experience invariants + auto-fill)
3. **RepairNode** — if validation fails, GPT-4o calls `repair_system_studio_spec_v1` tool; loops up to 4 attempts
4. **ComputeNode** — deterministic math (DAGRE layout for SystemMap, weighted scores for TradeoffMatrix)
5. **FinalizeNode** — attaches run metadata

After the graph, `canonicalizeStudioSpecV1()` (stable key sort + SHA-256 hash) produces a `canonicalHash` for drift detection.

### StudioSpec Schema (`src/lib/schema/studio-spec.ts`)

The generated spec has a fixed envelope:
```json
{
  "schemaVersion": "studio_spec.v1",
  "title": "...",
  "layout": { "primarySlots": ["system_map", "core_modules", "tradeoffs", "risks"] },
  "modules": [{ "slot": "system_map", "module": "SystemMap", "moduleVersion": "1.0", "config": {...} }]
}
```

Four **required slots** must always be present: `system_map`, `core_modules`, `tradeoffs`, `risks`.

Four **module types**: `SystemMap`, `ModuleCards`, `TradeoffMatrix`, `RiskPanel`. Each has a Zod config schema in `src/lib/schema/module-configs/`.

### Frontend Rendering

`ModuleRegistryRenderer` (`src/components/studio/ModuleRegistry.tsx`) maps each module slot to its React component. The four studio modules live in `src/components/studio/modules/`.

The two-panel layout (`src/app/page.tsx`):
- **Left**: `ChatPanel` with messages and input
- **Right**: `ModuleRegistryRenderer` + engine telemetry overlay

State is managed in two hooks: `useChat` (message history) and `useGenerate` (pipeline state, studioSpec, computedData, runMetadata).

### Auth & Data

- Auth: NextAuth v5 beta with Google OAuth, Prisma adapter, SQLite (`dev.db`)
- CSV upload: `/api/upload` parses CSVs via PapaParser, stores in a global in-memory `csvStore` (ephemeral — not persisted to DB)
- Rate limiting: in-memory per-user limiter (`src/lib/rate-limit/limiter.ts`)

### Key Design Constraints

- API keys are **server-side only** — never sent to client
- The renderer never uses `dangerouslySetInnerHTML`, `eval`, or dynamic `import()`
- User input is never interpolated into LLM system prompts — placed in a delimited block
- All LLM outputs go through Zod validation before use
- Mermaid node labels **must use double quotes** to prevent syntax errors
