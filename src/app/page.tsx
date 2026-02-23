'use client';

import React from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ExperiencePanel } from '@/components/experience/ExperiencePanel';
import { useChat } from '@/hooks/useChat';
import { useGenerate } from '@/hooks/useGenerate';

export default function Home() {
  const { messages, addMessage } = useChat();
  const { generate, isGenerating, currentStage, statusMessage, uiSpec, intentSpec, uxPlan, error } = useGenerate();

  const handleSendMessage = async (query: string) => {
    // Add user message to UI
    addMessage('user', query);

    // Start generation
    await generate(query, messages);
  };

  return (
    <main className="flex w-full h-screen overflow-hidden bg-white dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      {/* Left Panel: Chat */}
      <div className="w-full md:w-[400px] lg:w-[500px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 z-10 shadow-xl md:shadow-none">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          currentStage={currentStage}
          statusMessage={statusMessage}
          isGenerating={isGenerating}
        />
      </div>

      {/* Right Panel: Interactive Experience */}
      <div className="hidden md:flex flex-1 relative bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <ExperiencePanel
          uiSpec={uiSpec}
          intentSpec={intentSpec}
          uxPlan={uxPlan}
          isGenerating={isGenerating}
        />
        {error && (
          <div className="absolute bottom-4 right-4 bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow-lg border border-red-100 max-w-md z-50">
            <p className="font-semibold text-sm">Error generating experience</p>
            <p className="text-sm opacity-90 mt-1">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
