export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    uiSpec?: any;
    uiSpecRaw?: string;
    answerSpec?: any;
    uxPlan?: any;
};

export type PipelineStage = 'planning' | 'complete' | 'error';
