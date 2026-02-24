import type { z } from 'zod';
import type { UISpecSchema } from '../schema/ui-spec';

/**
 * Enforces per-experience minimum interactive component contracts.
 * If the generated UISpec does not contain the required components for
 * its intended experience type, a fallback component is injected into
 * the root of the layout tree.
 */
export function enforceExperienceContract(
    uiSpec: z.infer<typeof UISpecSchema>,
    experienceType: 'quiz' | 'dashboard' | 'wiki' | 'form'
): z.infer<typeof UISpecSchema> {
    const foundType = new Set<string>();

    function traverseNodes(node: any) {
        if (!node) return;
        if (node.type) foundType.add(node.type);
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(traverseNodes);
        }
    }

    if (uiSpec.root) {
        traverseNodes(uiSpec.root);
    }

    let needsInjection = false;
    let fallbackNode: any = null;

    switch (experienceType) {
        case 'quiz':
            if (!foundType.has('Quiz')) {
                needsInjection = true;
                fallbackNode = {
                    type: 'Quiz',
                    props: {
                        questions: [
                            {
                                question: "Did you find this answer helpful?",
                                options: ["Yes, very helpful", "No, not really"],
                                correct: 0
                            }
                        ]
                    }
                };
            }
            break;
        case 'dashboard':
            if (!foundType.has('Chart') && !foundType.has('StatCard') && !foundType.has('Calculator') && !foundType.has('Table')) {
                needsInjection = true;
                fallbackNode = {
                    type: 'StatCard',
                    props: {
                        label: 'Readiness Score',
                        value: '100%',
                        trend: 'Optimal'
                    }
                };
            }
            break;
        case 'form':
            if (!foundType.has('Form')) {
                needsInjection = true;
                fallbackNode = {
                    type: 'Form',
                    props: {
                        fields: [
                            {
                                name: 'feedback',
                                label: 'Any additional feedback?',
                                type: 'text',
                                required: false
                            }
                        ],
                        submitLabel: 'Submit'
                    }
                };
            }
            break;
        case 'wiki':
            // Wiki needs at least some structural or callout element to avoid being a plain wall of text
            if (!foundType.has('Tabs') && !foundType.has('Accordion') && !foundType.has('Callout') && !foundType.has('Comparison') && !foundType.has('Table')) {
                needsInjection = true;
                fallbackNode = {
                    type: 'Callout',
                    props: {
                        type: 'info',
                        title: 'Interactive Summary',
                        message: 'This wiki organizes information to help you learn faster.'
                    }
                };
            }
            break;
    }

    if (needsInjection && fallbackNode && uiSpec.root && Array.isArray(uiSpec.root.children)) {
        uiSpec.root.children.push(fallbackNode);
    }

    return uiSpec;
}
