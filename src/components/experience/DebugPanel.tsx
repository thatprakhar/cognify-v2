'use client';

import React, { useState } from 'react';
import { IntentSpec, UXPlan, UISpec } from '@/lib/pipeline/types';
import { ChevronDown, ChevronUp, Bug, Terminal, Code } from 'lucide-react';

interface DebugPanelProps {
    intentSpec: IntentSpec | null;
    uxPlan: UXPlan | null;
    uiSpec: UISpec | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ intentSpec, uxPlan, uiSpec }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'intent' | 'ux' | 'ui'>('intent');

    if (!intentSpec && !uxPlan && !uiSpec) return null;

    let activeData = null;
    if (activeTab === 'intent') activeData = intentSpec;
    if (activeTab === 'ux') activeData = uxPlan;
    if (activeTab === 'ui') activeData = uiSpec;

    return (
        <div className={`fixed bottom-0 right-0 w-full lg:w-1/2 bg-zinc-900 border-t border-l border-zinc-800 shadow-2xl transition-transform duration-300 z-50 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

            {/* Toggle Button attached to top */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-8 -top-10 bg-zinc-900 border border-b-0 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors text-xs font-mono"
            >
                <Bug size={14} />
                Dev Mode
                {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>

            {/* Panel Content */}
            <div className="h-80 flex flex-col">
                {/* Header / Tabs */}
                <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-4">
                    <button
                        onClick={() => setActiveTab('intent')}
                        className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'intent' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Terminal size={14} />
                        1. IntentExtractor
                    </button>
                    <button
                        onClick={() => setActiveTab('ux')}
                        className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ux' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Code size={14} />
                        2. UXSelector
                    </button>
                    <button
                        onClick={() => setActiveTab('ui')}
                        className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ui' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Bug size={14} />
                        3. UIRenderer
                    </button>
                </div>

                {/* JSON Body */}
                <div className="flex-1 overflow-auto bg-[#0d0d0d] p-4">
                    {activeData ? (
                        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">
                            {JSON.stringify(activeData, null, 2)}
                        </pre>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 text-xs font-mono italic">
                            Waiting for agent payload...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
