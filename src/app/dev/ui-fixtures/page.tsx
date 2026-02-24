'use client';

import React, { useState } from 'react';
import { RenderRoot } from '@/renderer/renderNode';
import {
    quizFixture,
    dashboardFixture,
    wikiFixture,
    unknownTypeFixture,
    validatorTortureFixture,
    comparisonFixture,
    calculatorFixture,
} from './fixtures';
import type { UINodeSchema } from '@/lib/schema/ui-spec';

const FIXTURES = [
    { name: 'Quiz', fixture: quizFixture, description: 'Career path quiz with radio options' },
    { name: 'Dashboard', fixture: dashboardFixture, description: 'Expenses dashboard with charts, stats, and table' },
    { name: 'Wiki', fixture: wikiFixture, description: 'Machine learning wiki with tabs and markdown' },
    { name: 'Comparison', fixture: comparisonFixture, description: 'MBA vs CS — interactive comparison module' },
    { name: 'Calculator', fixture: calculatorFixture, description: 'Net worth projector — sliders + computed chart' },
    { name: 'Unknown Type', fixture: unknownTypeFixture, description: 'Tests ErrorCallout for unknown component types' },
    { name: 'Validator Error', fixture: validatorTortureFixture, description: 'Tests validator rejection (nesting too deep)' },
] as const;

export default function UIFixturesPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = FIXTURES[activeIndex];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="border-b border-zinc-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Cognify UI Fixtures
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Dev-only page for testing the deterministic renderer with sample UISpec JSON.
                    </p>
                </div>
            </div>

            {/* Fixture Tabs */}
            <div className="border-b border-zinc-200 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {FIXTURES.map((f, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeIndex === idx
                                    ? 'border-zinc-900 text-zinc-900'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                                    }`}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixture Info */}
            <div className="max-w-6xl mx-auto px-6 py-3">
                <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-zinc-700">{active.fixture.title}</span>
                    <span className="text-zinc-400">—</span>
                    <span className="text-zinc-500">{active.description}</span>
                    <span className="ml-auto text-zinc-400 text-xs font-mono">
                        accent: {active.fixture.theme.accent}
                    </span>
                </div>
            </div>

            {/* Rendered Fixture */}
            <div className="max-w-4xl mx-auto px-6 py-6" data-accent={active.fixture.theme.accent}>
                <RenderRoot root={active.fixture.root as UINodeSchema} viewMode="advanced" />
            </div>

            {/* Raw JSON */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <details className="border border-zinc-200 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 text-sm font-medium text-zinc-600 cursor-pointer hover:bg-zinc-50 transition-colors select-none">
                        View Raw JSON
                    </summary>
                    <pre className="px-4 py-4 text-xs text-zinc-600 bg-zinc-50 overflow-x-auto max-h-[400px] overflow-y-auto">
                        {JSON.stringify(active.fixture, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
}
