# Cognify v2 Architecture Review

## Diagnosis

The core problem is not rendering quality — it's that **the LLM is doing layout design when it should be configuring pre-built capability modules.** The current pipeline asks a general-purpose model to invent UI structure from scratch on every request. This produces generic output because the model has no incentive or constraint to reach for specific interactive patterns.

```
Current: Question → LLM invents layout → generic WikiSections
Target:  Question → intent classifies → capability module selected → LLM configures its parameters
```

The system is structurally incapable of reaching "app per question" without this shift. No amount of prompt tuning will make an LLM consistently generate complex, valid, interactive JSON when simpler text output satisfies the instruction. **You must remove the option of falling back to text.**

---

## Architecture: From Layout Generation to Capability Modules

### Current Pipeline
```
AnswerAgent → UXSelector → RendererAgent → generic UISpec → renderer
                                ↑
                          LLM invents everything
```

### Proposed Pipeline
```
IntentClassifier → CapabilityRouter → Module-specific Agent → typed ModuleSpec → renderer
       ↓                   ↓                    ↓
   small model        deterministic        per-module prompt
   (classify)          (code)            + per-module schema
```

### Key Difference
The RendererAgent currently has 20 components × infinite arrangements = unbounded output space. Capability modules constrain this to **N fixed templates**, each with a typed config schema. The LLM fills in parameters, not structure.

**Example — Comparison Module:**
```typescript
// LLM outputs THIS, not a UISpec tree
interface ComparisonModuleConfig {
  title: string;
  optionA: { name: string; pros: string[]; cons: string[]; stats: Record<string, string> };
  optionB: { name: string; pros: string[]; cons: string[]; stats: Record<string, string> };
  criteria: { name: string; weight: number }[];
  recommendation?: string;
}
```
The module's React component handles all layout, animation, and interactivity internally. The LLM never touches `Stack`, `Grid`, or `Tabs` — it fills a domain-specific config.

---

## P0: Changes That Most Increase Perceived Product Maturity

### 1. Graceful Validation Degradation
**Current:** One invalid node → entire page shows error.
**Proposed:** Render valid subtrees, replace invalid nodes with inline error callouts.

```diff
- if (!validation.valid) return <ValidationErrorUI errors={validation.errors} />;
+ // Render what you can. Invalid subtrees get ErrorCallout inline.
```

This is the single highest-leverage change. The career assessment prompt *tried* to build a multi-step tool but one `undefined` node killed the entire output. The user saw nothing. **Ship this first.**

**Tradeoff:** You may render partially broken layouts. Acceptable for MVP — users see 90% of a good experience vs 0%.

### 2. Five High-Leverage Capability Modules

| Module | Covers Intents | What It Replaces |
|--------|---------------|-----------------|
| **Comparison** | Decision, Analysis | Side-by-side table + weighted criteria + recommendation |
| **Assessment** | Self-reflection, Learning | N-question quiz → results radar + matched outcomes |
| **Timeline** | Planning, Roadmap | Day/phase timeline with expandable detail cards |
| **Calculator** | Financial, Analytical | Input sliders → computed output chart + table |
| **Explainer** | Knowledge, Learning | Sections with progressive disclosure + embedded quiz |

These 5 modules cover all 8 of your test prompts. Each module:
- Has a **typed config schema** (Zod) — tighter than generic UISpec
- Has a **fixed React implementation** — no LLM layout decisions
- Is configured by a **module-specific prompt** — not a generic renderer

**Tradeoff:** Less flexibility than generic UISpec. But constrained = higher quality. You can always fall back to generic UISpec for uncategorized intents.

### 3. Required Interactive Minimums Per Experience Type

Currently, the UXSelector picks "wiki" and the renderer generates 5 WikiSections. Nothing forces interactivity.

**Proposed — Experience Type Contracts:**

```typescript
const EXPERIENCE_CONTRACTS: Record<ExperienceType, RequiredBlocks> = {
  quiz:      { required: ['Quiz'], minInteractive: 1 },
  dashboard: { required: ['Chart', 'StatCard'], minInteractive: 1 },
  wiki:      { required: ['WikiSection'], minInteractive: 0, maxWikiSections: 4, requireQuiz: true },
  form:      { required: ['Form'], minInteractive: 1 },
  comparison:{ required: ['Table'], minInteractive: 2 },
};
```

The validator enforces these **post-generation**. If the LLM generates a "wiki" with zero Quiz blocks → reject and retry (or inject a default quiz).

**Tradeoff:** Retry loops add latency (1-2s per retry). But a correct experience on second try beats a boring one on first try.

---

## P1: Structural Improvements

### 4. Split the Monolithic RendererAgent

Current: One agent generates all UISpec for all intent types.
**Proposed:** IntentClassifier routes to specialized sub-agents.

```
"Explain concave lens"  → ExplainerAgent  → ExplainerModuleConfig
"MBA vs CS?"            → ComparisonAgent → ComparisonModuleConfig
"What career suits me?" → AssessmentAgent → AssessmentModuleConfig
"Plan a trip"           → PlannerAgent    → TimelineModuleConfig
"Project net worth"     → CalculatorAgent → CalculatorModuleConfig
```

Each sub-agent has a **short, specific prompt** with the module's config schema. No need to list all 20 components — the agent only needs to fill its module's fields.

**Tradeoff:** More code to maintain (5 agents vs 1). But each agent is simpler, faster, and more reliable.

### 5. Computation Layer (Server-Side)

The LLM should **never compute**. Financial projections, compound interest, CSV analysis — these must be deterministic code.

```
LLM outputs:    { monthlyContribution: 2000, returnRate: 0.08, years: 5 }
Server computes: yearByYearProjection(config) → data[]
Client renders:  <CalculatorModule data={computed} config={llmConfig} />
```

**Where computation lives:**
- Next.js API route or server action
- Called **between** LLM output and rendering
- Results are deterministic — same config always produces same data

**Tradeoff:** Adds a computation step to the pipeline (~50-100ms). But users get *correct* numbers instead of hallucinated ones.

### 6. Model Routing

| Agent | Model | Rationale |
|-------|-------|-----------|
| IntentClassifier | Small/fast (GPT-4o-mini, Haiku) | Binary classification, ~100 tokens |
| AnswerAgent | Large (GPT-4o, Sonnet) | Content quality matters most here |
| Module Config Agent | Medium (GPT-4o-mini) | Filling a typed schema, not creative writing |

**Tradeoff:** Multiple model calls vs single large call. Net latency is similar because small models are 5-10x faster, and you parallelize Intent + Answer.

---

## P2: Deferred

| Item | Why Defer |
|------|-----------|
| Architecture diagrams (Mermaid) | Need a diagramming component — not MVP |
| Map/geo integration | Requires third-party API (Mapbox), high effort |
| File upload → analysis pipeline | Needs backend storage, parsing, security review |
| Multi-turn conversation state | Clarify → re-render loop works but needs session management |
| Export to slides/PDF | Polish feature, not core differentiation |
| Auto-repair loops (LLM retries) | Graceful degradation is sufficient for now |

---

## Validation Strategy: Recommended Approach

```
Level 1: Schema validation (Zod)         → reject malformed JSON
Level 2: Structural validation            → per-node, graceful (render valid, error callout for invalid)
Level 3: Experience contract validation   → post-render check (missing required blocks → retry once)
```

**Key change:** Level 2 moves from **fail-closed** to **degrade-gracefully**. Level 3 is new and enforces "this doesn't feel like an app" quality gate.

---

## Data Pipeline (for CSV / projections / personalization)

```
User Input (CSV/params) → Server Parser → Structured Data
                                              ↓
                              LLM configures visualization
                                              ↓
                              Server computes derived metrics
                                              ↓
                              Client renders with computed data
```

**What's deterministic:** All computation (sums, projections, aggregations).
**What's LLM-generated:** Visualization config (which chart type, which columns to highlight, narrative summary).

---

## The 3 Changes That Most Shift Perception

1. **Graceful validation degradation** — users see *something* instead of red error box
2. **Comparison + Calculator modules** — two modules that instantly make Decision and Financial prompts feel like tools, not text
3. **Per-experience interactive minimums** — structurally prevents "5 WikiSections" fallback

These three changes, without any other work, would move the reaction from "structured text" to "it built something for my question." They're each 1-2 day implementations.

---

## What Won't Work

- **Prompt tuning alone.** You can spend weeks perfecting the RendererAgent prompt. The LLM will still default to the simplest valid output (WikiSections) because it's the safest path. Structure must be enforced in code, not suggested in prompts.
- **Adding more generic components.** A `RadarChart` component is useless if the LLM never reaches for it. The issue isn't component vocabulary — it's that free-form layout generation doesn't produce specialized output.
- **Making the RendererAgent "smarter."** The problem is architectural. One agent generating arbitrary UI trees will always converge to generic patterns. Specialized agents generating typed configs will always produce purposeful output.
