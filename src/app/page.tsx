'use client';

import React from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ExperiencePanel } from '@/components/experience/ExperiencePanel';
import { useChat } from '@/hooks/useChat';
import { useGenerate } from '@/hooks/useGenerate';
import { X } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { LandingPage } from '@/components/auth/LandingPage';

export default function Home() {
    const { data: session, status } = useSession();
    const [showDemo, setShowDemo] = React.useState(false);

    const { messages, addMessage } = useChat();
    const { generate, isGenerating, currentStage, statusMessage, uiSpec, uiSpecRaw, intentSpec, uxPlan, error, clearError } = useGenerate();

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
                    isGenerating={isGenerating}
                />
            </div>

            {/* Right Panel: Interactive Experience */}
            <div className="hidden md:flex flex-1 relative bg-[#FAFAFA] overflow-hidden">
                <ExperiencePanel
                    uiSpec={uiSpec}
                    uiSpecRaw={uiSpecRaw}
                    intentSpec={intentSpec}
                    uxPlan={uxPlan}
                    isGenerating={isGenerating}
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
