'use client';

import React from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ExperiencePanel } from '@/components/experience/ExperiencePanel';
import { useChat } from '@/hooks/useChat';
import { useGenerate } from '@/hooks/useGenerate';
import { X, Activity, Clock, RefreshCw } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { LandingPage } from '@/components/auth/LandingPage';

export default function Home() {
    const { data: session, status } = useSession();
    const [showDemo, setShowDemo] = React.useState(false);

    const { messages, addMessage } = useChat();
    const { generate, isGenerating, currentStage, statusMessage, uiSpec, uiSpecRaw, answerSpec, uxPlan, runMetadata, statusSteps, validationData, error, clearError } = useGenerate();

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
                    currentStage={currentStage}
                    statusMessage={statusMessage}
                    statusSteps={statusSteps}
                    isGenerating={isGenerating}
                />
                {/* Dev Mode Toggle */}
                <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-zinc-200 shadow-sm text-xs font-mono select-none">
                    <input
                        type="checkbox"
                        id="langgraph-toggle"
                        className="cursor-pointer"
                        onChange={(e) => {
                            window.localStorage.setItem('useLangGraph', e.target.checked.toString());
                        }}
                        defaultChecked={typeof window !== 'undefined' ? window.localStorage.getItem('useLangGraph') === 'true' : false}
                    />
                    <label htmlFor="langgraph-toggle" className="text-zinc-600 cursor-pointer font-semibold">USE LANGGRAPH ENGINE</label>
                </div>
            </div>

            {/* Right Panel: Interactive Experience */}
            <div className="hidden md:flex flex-1 relative bg-[#FAFAFA] overflow-hidden">
                {runMetadata && (
                    <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-md text-white text-xs p-4 rounded-xl shadow-2xl space-y-3 font-mono border border-white/10 w-72">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span className="font-bold text-blue-400 flex items-center gap-2"><Activity size={14} /> ENGINE TELEMETRY</span>
                        </div>
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
                <ExperiencePanel
                    uiSpec={uiSpec}
                    uiSpecRaw={uiSpecRaw}
                    answerSpec={answerSpec}
                    uxPlan={uxPlan}
                    isGenerating={isGenerating}
                    runMetadata={runMetadata}
                    validationData={validationData}
                    onSubmitClarification={(answers) => {
                        const formattedAnswers = Object.entries(answers)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n');
                        handleSendMessage(`Here are the clarification answers:\n${formattedAnswers}`);
                    }}
                />
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
