/**
 * validateUISpec — runtime validation of UISpec JSON before rendering.
 * Enforces: node count, depth, string lengths, type allowlist, leaf/parent invariants, props shape.
 * Returns { valid, errors } — never throws.
 */

import { ALL_BLOCKS, PARENT_BLOCKS, LEAF_BLOCKS, type UINodeSchema } from '@/lib/schema/ui-spec';
import {
    MAX_NODE_COUNT, MAX_DEPTH, MAX_TITLE_LENGTH, MAX_BODY_LENGTH,
    MAX_QUIZ_QUESTIONS, MAX_QUIZ_OPTIONS, MAX_TABLE_ROWS, MAX_TABLE_COLUMNS,
    MAX_FORM_FIELDS, MAX_SECTIONS,
} from '@/lib/schema/allowlist';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

const ALLOWED_TYPES = new Set<string>(ALL_BLOCKS);

export function validateUISpec(root: UINodeSchema | undefined | null): ValidationResult {
    const errors: string[] = [];

    if (!root) {
        return { valid: false, errors: ['UISpec root is null or undefined.'] };
    }

    let nodeCount = 0;

    function walk(node: UINodeSchema, depth: number, path: string) {
        nodeCount++;

        if (nodeCount > MAX_NODE_COUNT) {
            errors.push(`Exceeded max node count of ${MAX_NODE_COUNT}.`);
            return;
        }

        if (depth > MAX_DEPTH) {
            errors.push(`Exceeded max depth of ${MAX_DEPTH} at ${path}.`);
            return;
        }

        // Type allowlist check
        if (!ALLOWED_TYPES.has(node.type)) {
            errors.push(`Unknown component type "${node.type}" at ${path}.`);
            return; // Don't walk children of unknown types
        }

        // Leaf/parent invariant
        const isParent = PARENT_BLOCKS.has(node.type);
        const isLeaf = LEAF_BLOCKS.has(node.type);

        if (isParent && (!node.children || node.children.length === 0)) {
            errors.push(`Layout block "${node.type}" at ${path} must have children.`);
        }

        if (isLeaf && node.children && node.children.length > 0) {
            errors.push(`Leaf block "${node.type}" at ${path} must not have children.`);
        }

        // Props shape validation per type
        validateProps(node, path, errors);

        // Recurse
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i]) {
                    walk(node.children[i], depth + 1, `${path}.children[${i}]`);
                }
            }
        }
    }

    walk(root, 0, 'root');
    return { valid: errors.length === 0, errors };
}

function validateProps(node: UINodeSchema, path: string, errors: string[]) {
    const p = node.props || {};

    // String length checks for common text props
    const checkStringLength = (key: string, max: number) => {
        if (typeof p[key] === 'string' && (p[key] as string).length > max) {
            errors.push(`${path}.props.${key} exceeds max length of ${max} chars.`);
        }
    };

    // HTML detection in text fields
    const checkNoHtml = (key: string) => {
        if (typeof p[key] === 'string') {
            const val = p[key] as string;
            // Check for obvious HTML tags (allow markdown which doesn't use < > in normal text)
            if (/<\s*(?:script|iframe|object|embed|form|input|style|link|meta|base)\b/i.test(val)) {
                errors.push(`${path}.props.${key} contains forbidden HTML tags.`);
            }
        }
    };

    switch (node.type) {
        case 'Hero':
            checkStringLength('title', MAX_TITLE_LENGTH);
            checkStringLength('subtitle', MAX_BODY_LENGTH);
            checkNoHtml('title');
            checkNoHtml('subtitle');
            break;

        case 'WikiSection':
            checkStringLength('heading', MAX_TITLE_LENGTH);
            checkStringLength('body', MAX_BODY_LENGTH);
            checkNoHtml('heading');
            // body allows markdown but not dangerous HTML
            checkNoHtml('body');
            break;

        case 'InfoCard':
            checkStringLength('title', MAX_TITLE_LENGTH);
            checkStringLength('content', MAX_BODY_LENGTH);
            checkNoHtml('title');
            checkNoHtml('content');
            break;

        case 'StatCard':
            checkStringLength('label', MAX_TITLE_LENGTH);
            break;

        case 'Callout':
            checkStringLength('title', MAX_TITLE_LENGTH);
            checkStringLength('message', MAX_BODY_LENGTH);
            checkNoHtml('title');
            checkNoHtml('message');
            break;

        case 'Table': {
            const rows = p.rows;
            const headers = p.headers;
            if (Array.isArray(rows) && rows.length > MAX_TABLE_ROWS) {
                errors.push(`${path}.props.rows exceeds max of ${MAX_TABLE_ROWS} rows.`);
            }
            if (Array.isArray(headers) && headers.length > MAX_TABLE_COLUMNS) {
                errors.push(`${path}.props.headers exceeds max of ${MAX_TABLE_COLUMNS} columns.`);
            }
            break;
        }

        case 'Quiz': {
            const questions = p.questions;
            if (Array.isArray(questions)) {
                if (questions.length > MAX_QUIZ_QUESTIONS) {
                    errors.push(`${path}.props.questions exceeds max of ${MAX_QUIZ_QUESTIONS}.`);
                }
                for (let i = 0; i < Math.min(questions.length, MAX_QUIZ_QUESTIONS); i++) {
                    const q = questions[i] as Record<string, unknown>;
                    if (q && Array.isArray(q.options) && q.options.length > MAX_QUIZ_OPTIONS) {
                        errors.push(`${path}.props.questions[${i}].options exceeds max of ${MAX_QUIZ_OPTIONS}.`);
                    }
                }
            }
            break;
        }

        case 'Form': {
            const fields = p.fields;
            if (Array.isArray(fields) && fields.length > MAX_FORM_FIELDS) {
                errors.push(`${path}.props.fields exceeds max of ${MAX_FORM_FIELDS} fields.`);
            }
            break;
        }

        case 'Chart': {
            const chartType = p.type;
            const validChartTypes = ['bar', 'line', 'pie', 'area'];
            if (chartType && typeof chartType === 'string' && !validChartTypes.includes(chartType)) {
                errors.push(`${path}.props.type "${chartType}" is not an allowed chart type.`);
            }
            break;
        }
    }
}
