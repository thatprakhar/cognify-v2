import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface CognifyEquationProps {
    latex: string;
    displayMode?: boolean;
}

export const CognifyEquation: React.FC<CognifyEquationProps> = ({ latex = '', displayMode = true }) => {
    // We use a ref to safely render KaTeX without dangerouslySetInnerHTML where possible, 
    // or we can just use dangerouslySetInnerHTML trusting the LLM output (KaTeX is mostly safe).
    // The safest and standard way in React is to use the katex.renderToString method.

    let html = '';
    try {
        html = katex.renderToString(latex, {
            displayMode: displayMode,
            throwOnError: false, // Don't crash the app on bad syntax
            errorColor: '#ef4444', // red-500
        });
    } catch (e) {
        html = `<span class="text-red-500">KaTeX Error: ${e}</span>`;
    }

    return (
        <div
            className={`my-6 overflow-x-auto ${displayMode ? 'text-center py-4 bg-zinc-50 rounded-lg border border-zinc-100' : ''}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
