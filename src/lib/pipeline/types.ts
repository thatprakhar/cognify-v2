// ============================================================
// Core types for the Cognify 3-agent pipeline
// ============================================================

// --- Agent 1: Answer Extraction ---

export type AnswerMode = 'READY' | 'CLARIFY'
export type PolicyCategory = 'none' | 'self_harm' | 'illegal' | 'hate' | 'sexual' | 'privacy' | 'other'

export interface SafetyFlags {
    needsRefusal: boolean
    policyCategory: PolicyCategory
}

export interface AnswerSpec {
    schemaVersion: string
    mode: AnswerMode
    query: string
    answerMarkdown: string
    assumptions: string[]
    followUpQuestions: string[]
    safetyFlags: SafetyFlags
    contentTags: string[]
}

// --- Agent 2: UX Selection ---

export type ExperienceType = 'quiz' | 'dashboard' | 'wiki' | 'form' | 'comparison' | 'slides' | 'hybrid'
export type LayoutType = 'single-column' | 'two-column' | 'tabbed' | 'step-by-step'
export type InteractionModel = 'scroll-through' | 'step-by-step' | 'tabbed' | 'interactive'

export interface UXSection {
    role: string
    purpose: string
}

export interface UXPlan {
    experienceType: ExperienceType
    layout: LayoutType
    sections: UXSection[]
    interactionModel: InteractionModel
    estimatedBlocks: number
}

// --- Agent 3: UI Rendering ---

export interface UINode {
    type: string
    props: Record<string, unknown>
    children?: UINode[]
}

export interface UISpecTheme {
    accent?: string
}

export interface UISpec {
    version: string
    title: string
    theme?: UISpecTheme
    root: UINode
}

// --- Pipeline ---

export type PipelineStage = 'answer' | 'intent' | 'ux' | 'computation' | 'rendering'
export type PipelineStatus = 'idle' | 'running' | 'complete' | 'error'

export interface PipelineState {
    status: PipelineStatus
    currentStage: PipelineStage | null
    answerSpec: AnswerSpec | null
    uxPlan: UXPlan | null
    uiSpec: UISpec | null
    error: string | null
}

// --- SSE Events ---

export type SSEEventType = 'status' | 'spec' | 'spec-chunk' | 'complete' | 'error' | 'debug'

export interface SSEStatusEvent {
    stage: PipelineStage
    message: string
}

export interface SSEDebugEvent {
    stage: PipelineStage
    data: any
}

export interface SSESpecEvent {
    type: 'partial'
    blocks: number
    total: number
}

export interface SSESpecChunkEvent {
    type: 'spec-chunk'
    partial: string
}

export interface SSECompleteEvent {
    uiSpec: UISpec
}

export interface SSEErrorEvent {
    message: string
    code: string
}

// --- Chat ---

export type MessageRole = 'user' | 'system' | 'status'

export interface ChatMessage {
    id: string
    role: MessageRole
    content: string
    timestamp: Date
    metadata?: {
        stage?: PipelineStage
        spec?: UISpec
    }
}

export interface Session {
    id: string
    userId?: string
    messages: ChatMessage[]
    currentSpec: UISpec | null
    pipeline: PipelineState
    createdAt: Date
}

