'use client';

import React from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ModuleRegistryRenderer } from '@/components/studio/ModuleRegistry';
import { useChat } from '@/hooks/useChat';
import { useGenerate } from '@/hooks/useGenerate';
import { X, Activity, Clock, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { LandingPage } from '@/components/auth/LandingPage';
import { PipelineStage } from '@/lib/chat-types';

export default function Home() {
    const { data: session, status } = useSession();
    const [showDemo, setShowDemo] = React.useState(false);
    const [isTelemetryOpen, setIsTelemetryOpen] = React.useState(true);
    const { messages, addMessage } = useChat();
    const { generate, isGenerating, currentStage, statusMessage, studioSpec, computedData, runMetadata, statusSteps, validationData, error, clearError } = useGenerate();

    const handleSendMessage = async (query: string) => {
        // Add user message to UI
        addMessage('user', query);

        // Start generation
        await generate(query, messages);
    };

    if (status === 'loading') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white ">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session && !showDemo) {
        return <LandingPage onTryDemo={() => setShowDemo(true)} />;
    }

    return (
        <main className="flex w-full h-screen overflow-hidden bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Left Panel: Chat */}
            <div className="w-full md:w-[400px] lg:w-[500px] flex-shrink-0 border-r border-zinc-200/80 z-10 shadow-2xl shadow-zinc-200/50 md:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] bg-white relative">
                <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentStage={currentStage as PipelineStage | null}
                    statusMessage={statusMessage}
                    statusSteps={statusSteps as { stage: PipelineStage; message: string }[]}
                    isGenerating={isGenerating}
                />
            </div>

            {/* Right Panel: Interactive Experience */}
            <div className="hidden md:flex flex-1 relative bg-[#FAFAFA] overflow-hidden">
                {runMetadata && (
                    <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-md text-white text-xs p-4 rounded-xl shadow-2xl font-mono border border-white/10 w-72 flex flex-col transition-all duration-300">
                        <div
                            className={`flex items-center justify-between cursor-pointer ${isTelemetryOpen ? 'pb-2 border-b border-white/10 mb-3' : ''}`}
                            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
                        >
                            <span className="font-bold text-blue-400 flex items-center gap-2"><Activity size={14} /> ENGINE TELEMETRY</span>
                            {isTelemetryOpen ? <ChevronUp size={14} className="text-zinc-400 hover:text-white transition-colors" /> : <ChevronDown size={14} className="text-zinc-400 hover:text-white transition-colors" />}
                        </div>
                        {isTelemetryOpen && (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Router</span>
                                    <span className={runMetadata.engine === 'langgraph' ? 'text-green-400 font-bold' : 'text-orange-400'}>{runMetadata.engine.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Model Priority</span>
                                    <span>{runMetadata.modelClass}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 flex items-center gap-1.5"><Clock size={12} /> Latency (TTFB)</span>
                                    <span>{runMetadata.latencyMs}ms</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 flex items-center gap-1.5"><RefreshCw size={12} /> Retry Loops</span>
                                    <span className={runMetadata.retryCount > 0 ? "text-yellow-400" : ""}>{runMetadata.retryCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Semantic Drift</span>
                                    <span className={runMetadata.semanticDriftDetected ? "text-red-400 font-bold" : "text-zinc-500"}>{runMetadata.semanticDriftDetected ? "DETECTED" : "Safe"}</span>
                                </div>
                                <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
                                    <span className="text-zinc-500 text-[10px]">FINGERPRINT</span>
                                    <span className="text-[10px] text-zinc-400 break-all">{runMetadata.engineFingerprint}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1 w-full h-full overflow-y-auto p-8">
                    {studioSpec ? (
                        <ModuleRegistryRenderer
                            spec={studioSpec}
                            computedBySlot={computedData || {}}
                            slotErrors={validationData?.slotErrors || {}}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-400">
                            {isGenerating ? "Composing studio..." : "Enter a query to generate an interactive experience."}
                        </div>
                    )}
                </div>
                {error && (
                    <div className="absolute bottom-4 right-4 bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow-lg border border-red-100 max-w-md z-50 flex items-start justify-between gap-4">
                        <div>
                            <p className="font-semibold text-sm">Error generating experience</p>
                            <p className="text-sm opacity-90 mt-1">{error}</p>
                        </div>
                        <button onClick={clearError} className="text-red-600 hover:text-red-800 transition-colors p-1 -mr-2">
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
