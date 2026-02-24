'use client';

import React from 'react';
import type { UINodeSchema } from '@/lib/schema/ui-spec';
import { PARENT_BLOCKS, LEAF_BLOCKS } from '@/lib/schema/ui-spec';
import { COGNIFY_COMPONENT_MAP, ErrorCallout } from '@/ui/cognify';
import { validateUISpec } from './validateUISpec';
import { ValidationErrorUI } from './ValidationErrorUI';
import { MAX_NODE_COUNT } from '@/lib/schema/allowlist';

/**
 * renderNode — pure deterministic mapping from UISpec node → Cognify wrapper.
 *
 * Rules:
 * 1. Only COGNIFY_COMPONENT_MAP entries are renderable (typed by BlockType)
 * 2. Unknown type → inline ErrorCallout (siblings still render)
 * 3. Layout with no children → inline ErrorCallout
 * 4. Leaf with children → children silently dropped
 * 5. Null/undefined nodes → silently skipped
 * 6. No dynamic imports
 */
export function renderNode(
    node: UINodeSchema,
    viewMode: 'simple' | 'advanced' = 'simple',
    key?: string | number,
): React.ReactNode {
    if (!node || !node.type) return null; // graceful handling during partial streaming

    const Component = COGNIFY_COMPONENT_MAP[node.type as keyof typeof COGNIFY_COMPONENT_MAP];

    // Unknown type → inline ErrorCallout (siblings continue rendering)
    if (!Component) {
        return <ErrorCallout key={key} type={node.type || 'undefined'} />;
    }

    const isParent = PARENT_BLOCKS.has(node.type);
    const isLeaf = LEAF_BLOCKS.has(node.type);

    // Layout block without children → inline error (siblings continue)
    if (isParent && (!node.children || node.children.length === 0)) {
        return (
            <ErrorCallout
                key={key}
                type={node.type}
                message={`Layout block "${node.type}" requires children but has none.`}
            />
        );
    }

    // Leaf block: render without children (ignore any children present)
    if (isLeaf) {
        return <Component key={key} {...node.props} viewMode={viewMode} />;
    }

    // Layout block: recursively render children, filtering nulls
    const children = node.children
        ?.map((child, idx) => renderNode(child, viewMode, `${node.type}-${idx}`))
        .filter(Boolean);

    return (
        <Component key={key} {...node.props} viewMode={viewMode}>
            {children}
        </Component>
    );
}

/**
 * RenderRoot — GRACEFUL degradation strategy:
 *
 * - Catastrophic errors (null root, node count exceeded) → full ValidationErrorUI
 * - Structural errors (unknown types, missing children) → inline ErrorCallout per node
 *   Valid siblings of broken nodes still render.
 *
 * This means a single bad node in a 20-node tree shows an inline error card
 * instead of killing the entire experience.
 */
interface RenderRootProps {
    root: UINodeSchema;
    viewMode?: 'simple' | 'advanced';
}

export const RenderRoot: React.FC<RenderRootProps> = ({ root, viewMode = 'simple' }) => {
    // Catastrophic: null root
    if (!root) {
        return <ValidationErrorUI errors={['UISpec root is null or undefined.']} />;
    }

    // Catastrophic: node count check (prevent DoS-style trees)
    const validation = validateUISpec(root);
    const catastrophicErrors = validation.errors.filter(e =>
        e.includes('Exceeded max node count') ||
        e.includes('root is null')
    );

    if (catastrophicErrors.length > 0) {
        return <ValidationErrorUI errors={catastrophicErrors} />;
    }

    // Non-catastrophic errors: log as warnings, render inline via renderNode
    if (validation.errors.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('[Cognify Renderer] Structural warnings (handled inline):', validation.errors);
    }

    // renderNode handles per-node errors gracefully with inline ErrorCallout
    return <>{renderNode(root, viewMode)}</>;
};

