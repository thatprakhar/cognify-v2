'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';

import { LandingPage } from '@/components/auth/LandingPage';
import { ModuleRegistryRenderer } from '@/components/studio/ModuleRegistry';
import { CommandBar } from '@/components/layout/CommandBar';
import { QueryTabs } from '@/components/layout/QueryTabs';
import { ConversationDrawer } from '@/components/layout/ConversationDrawer';
import { useGenerate } from '@/hooks/useGenerate';
import { ChatMessage } from '@/lib/chat-types';
import { StudioSpecV1 } from '@/lib/schema/studio-spec';

interface Session {
    id: string;
    query: string;
    messages: ChatMessage[];
    studioSpec: StudioSpecV1 | null;
    computedData: Record<string, unknown> | null;
    runMetadata: {
        engine: string;
        latencyMs: number;
        retryCount: number;
        semanticDriftDetected: boolean;
        engineFingerprint: string;
        modelClass: string;
    } | null;
    validationData: { slotErrors: Record<string, string> } | null;
}

const EXAMPLE_PROMPTS = [
    'How does the TCP/IP networking stack work?',
    'Compare React, Vue, and Angular',
    'Break down the risks of starting a startup',
];

export default function Home() {
    const { data: session, status } = useSession();
    const [showDemo, setShowDemo] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [generatingSessionId, setGeneratingSessionId] = useState<string | null>(null);
    const [commandInput, setCommandInput] = useState('');

    const {
        generate,
        isGenerating,
        currentStage,
        statusMessage,
        statusSteps,
        studioSpec,
        computedData,
        runMetadata,
        validationData,
        error,
        clearError,
    } = useGenerate();

    const handleSendMessage = useCallback(
        async (query: string) => {
            const sessionId = crypto.randomUUID();
            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: query,
                timestamp: new Date(),
            };
            setSessions(prev => [
                ...prev,
                {
                    id: sessionId,
                    query,
                    messages: [userMsg],
                    studioSpec: null,
                    computedData: null,
                    runMetadata: null,
                    validationData: null,
                },
            ]);
            setActiveSessionId(sessionId);
            setGeneratingSessionId(sessionId);
            const result = await generate(query, []);
            if (result?.studioSpec) {
                setSessions(prev =>
                    prev.map(s =>
                        s.id === sessionId
                            ? {
                                  ...s,
                                  studioSpec: result.studioSpec,
                                  computedData: result.computedData ?? null,
                                  runMetadata: result.runMetadata ?? null,
                                  validationData: result.validationData ?? null,
                              }
                            : s
                    )
                );
            }
            setGeneratingSessionId(null);
        },
        [generate]
    );

    // Derived display values
    const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;
    // isLiveSession: show live hook state while this session is generating (generatingSessionId set)
    const isLiveSession = activeSessionId === generatingSessionId;
    const isActiveGenerating = isLiveSession && isGenerating;

    const displaySpec = isLiveSession ? studioSpec : (activeSession?.studioSpec ?? null);
    const displayComputed = isLiveSession ? (computedData ?? {}) : (activeSession?.computedData ?? {});
    const displayValidation = isLiveSession ? validationData : (activeSession?.validationData ?? null);
    const displayRunMetadata = activeSession?.runMetadata ?? (isLiveSession ? runMetadata : null);

    if (status === 'loading') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session && !showDemo) {
        return <LandingPage onTryDemo={() => setShowDemo(true)} />;
    }

    return (
        <main className="h-screen w-full overflow-hidden bg-[#F9F8F6] font-sans text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Top nav */}
            <QueryTabs
                sessions={sessions.map(s => ({ id: s.id, query: s.query, hasSpec: !!s.studioSpec }))}
                activeSessionId={activeSessionId}
                onSelectSession={setActiveSessionId}
                runMetadata={displayRunMetadata}
                onToggleDrawer={() => setIsDrawerOpen(v => !v)}
                isDrawerOpen={isDrawerOpen}
            />

            {/* Conversation drawer */}
            <ConversationDrawer
                isOpen={isDrawerOpen}
                messages={activeSession?.messages ?? []}
                activeQuery={activeSession?.query ?? null}
                onClose={() => setIsDrawerOpen(false)}
            />

            {/* Studio canvas */}
            <div className="absolute inset-0 top-12 bottom-16 overflow-y-auto">
                {displaySpec ? (
                    <ModuleRegistryRenderer
                        spec={displaySpec}
                        computedBySlot={displayComputed as Record<string, unknown>}
                        slotErrors={displayValidation?.slotErrors ?? {}}
                    />
                ) : isActiveGenerating ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Composing studio...
                        </span>
                    </div>
                ) : (
                    /* Empty state hero */
                    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 font-mono">
                                Outform
                            </h1>
                            <p className="text-zinc-400 mt-3 text-lg">
                                Ask anything. Get an interactive experience.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                            {EXAMPLE_PROMPTS.map(prompt => (
                                <button
                                    key={prompt}
                                    onClick={() => setCommandInput(prompt)}
                                    className="px-4 py-2 text-sm text-zinc-600 bg-white border border-zinc-200 rounded-full hover:border-zinc-400 hover:text-zinc-900 transition-colors shadow-sm"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Error toast */}
            {error && (
                <div className="fixed bottom-20 right-4 bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow-lg border border-red-100 max-w-md z-50 flex items-start justify-between gap-4">
                    <div>
                        <p className="font-semibold text-sm">Error generating experience</p>
                        <p className="text-sm opacity-90 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 -mr-2"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Bottom command bar */}
            <CommandBar
                value={commandInput}
                onChange={setCommandInput}
                onSend={handleSendMessage}
                isGenerating={isGenerating}
                statusSteps={statusSteps}
                currentStage={currentStage}
                statusMessage={statusMessage}
            />
        </main>
    );
}
