/**
 * UISpec Fixture Data — used by the /dev/ui-fixtures dev page.
 * Covers: Quiz, Dashboard, Wiki, Unknown (error test), and Invalid (validator torture test).
 */

export const quizFixture = {
    version: '1.0',
    title: 'Career Path Quiz',
    theme: { accent: 'blue' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Hero',
                props: {
                    title: 'Discover Your Ideal Career Path',
                    subtitle: 'Answer these questions to get a personalized recommendation based on your interests and skills.',
                },
            },
            {
                type: 'Callout',
                props: {
                    type: 'info',
                    title: 'How This Works',
                    message: 'Select the best answer for each question. Your results will be calculated at the end.',
                },
            },
            {
                type: 'Quiz',
                props: {
                    questions: [
                        {
                            question: 'What type of work environment do you prefer?',
                            options: ['Remote / home office', 'Open-plan office', 'Hybrid mix', 'Outdoors or on-site'],
                            correct: 2,
                        },
                        {
                            question: 'Which skill do you most enjoy using?',
                            options: ['Analytical thinking', 'Creative design', 'Communication', 'Technical building'],
                            correct: 3,
                        },
                        {
                            question: 'How do you approach problem-solving?',
                            options: ['Research thoroughly first', 'Experiment and iterate', 'Collaborate with others', 'Trust your intuition'],
                            correct: 1,
                        },
                    ],
                },
            },
            {
                type: 'Divider',
                props: { style: 'dashed' },
            },
            {
                type: 'InfoCard',
                props: {
                    title: 'About This Assessment',
                    content: 'This quiz is designed to give you initial guidance. For a thorough assessment, consider speaking with a career counselor.',
                    icon: 'BookOpen',
                },
            },
        ],
    },
};

export const dashboardFixture = {
    version: '1.0',
    title: 'Monthly Expenses Dashboard',
    theme: { accent: 'green' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Hero',
                props: {
                    title: 'February 2026 Expenses',
                    subtitle: 'Your financial overview for the month, broken down by category.',
                },
            },
            {
                type: 'Grid',
                props: { columns: 4, gap: 'md' },
                children: [
                    {
                        type: 'StatCard',
                        props: { label: 'Total Spent', value: '$3,847', trend: '+12%' },
                    },
                    {
                        type: 'StatCard',
                        props: { label: 'Food & Dining', value: '$892', trend: '-5%' },
                    },
                    {
                        type: 'StatCard',
                        props: { label: 'Transport', value: '$423', trend: '+3%' },
                    },
                    {
                        type: 'StatCard',
                        props: { label: 'Entertainment', value: '$245', trend: '-18%' },
                    },
                ],
            },
            {
                type: 'Columns',
                props: { layout: 'sidebar-right' },
                children: [
                    {
                        type: 'Chart',
                        props: {
                            type: 'bar',
                            data: [
                                { category: 'Food', amount: 892 },
                                { category: 'Transport', amount: 423 },
                                { category: 'Rent', amount: 1500 },
                                { category: 'Entertainment', amount: 245 },
                                { category: 'Utilities', amount: 187 },
                                { category: 'Other', amount: 600 },
                            ],
                            xKey: 'category',
                            yKeys: ['amount'],
                            isMockData: true,
                        },
                    },
                    {
                        type: 'Stack',
                        props: { gap: 'sm' },
                        children: [
                            {
                                type: 'Callout',
                                props: {
                                    type: 'success',
                                    title: 'Under Budget',
                                    message: 'You spent 8% less than your monthly target of $4,200.',
                                },
                            },
                            {
                                type: 'Callout',
                                props: {
                                    type: 'warning',
                                    title: 'Watch Out',
                                    message: 'Transport costs are trending up for the third month in a row.',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'Table',
                props: {
                    headers: ['Date', 'Category', 'Description', 'Amount'],
                    rows: [
                        ['Feb 1', 'Rent', 'Monthly apartment rent', '$1,500'],
                        ['Feb 3', 'Food', 'Grocery store', '$87.50'],
                        ['Feb 5', 'Transport', 'Gas station', '$45.00'],
                        ['Feb 8', 'Entertainment', 'Movie tickets', '$32.00'],
                        ['Feb 12', 'Utilities', 'Electric bill', '$95.00'],
                        ['Feb 15', 'Food', 'Restaurant dinner', '$68.00'],
                    ],
                    isMockData: true,
                },
            },
        ],
    },
};

export const wikiFixture = {
    version: '1.0',
    title: 'Understanding Machine Learning',
    theme: { accent: 'purple' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Hero',
                props: {
                    title: 'Machine Learning: A Comprehensive Guide',
                    subtitle: 'From fundamentals to advanced concepts — everything you need to know about ML.',
                },
            },
            {
                type: 'Tabs',
                props: { tabs: ['Overview', 'Types of ML', 'Applications'] },
                children: [
                    // Tab 1: Overview
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'WikiSection',
                                props: {
                                    heading: 'What is Machine Learning?',
                                    body: 'Machine learning is a subset of artificial intelligence that enables systems to **learn and improve** from experience without being explicitly programmed.\n\nIt focuses on developing algorithms that can access data and use it to learn for themselves.\n\n## Key Concepts\n\n- **Training Data**: The dataset used to teach the model\n- **Features**: Input variables used for prediction\n- **Labels**: The target values the model learns to predict\n- **Model**: The mathematical representation learned from data',
                                },
                            },
                            {
                                type: 'WikiSection',
                                props: {
                                    heading: 'Brief History',
                                    body: 'The concept of machine learning dates back to the 1950s when **Arthur Samuel** coined the term while working at IBM.\n\nKey milestones include:\n\n1. **1957**: Perceptron algorithm invented\n2. **1986**: Backpropagation popularized\n3. **2012**: Deep learning breakthrough with AlexNet\n4. **2017**: Transformer architecture introduced\n5. **2022-2026**: Large language models become mainstream',
                                },
                            },
                        ],
                    },
                    // Tab 2: Types
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'Grid',
                                props: { columns: 3, gap: 'md' },
                                children: [
                                    {
                                        type: 'InfoCard',
                                        props: {
                                            title: 'Supervised Learning',
                                            content: 'Learns from labeled training data to make predictions on unseen data.',
                                            icon: 'GraduationCap',
                                        },
                                    },
                                    {
                                        type: 'InfoCard',
                                        props: {
                                            title: 'Unsupervised Learning',
                                            content: 'Discovers hidden patterns in data without pre-existing labels.',
                                            icon: 'Search',
                                        },
                                    },
                                    {
                                        type: 'InfoCard',
                                        props: {
                                            title: 'Reinforcement Learning',
                                            content: 'Agent learns by interacting with an environment and receiving rewards.',
                                            icon: 'Gamepad2',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    // Tab 3: Applications
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'Table',
                                props: {
                                    headers: ['Domain', 'Application', 'ML Type'],
                                    rows: [
                                        ['Healthcare', 'Disease diagnosis', 'Supervised'],
                                        ['Finance', 'Fraud detection', 'Supervised'],
                                        ['Retail', 'Customer segmentation', 'Unsupervised'],
                                        ['Gaming', 'NPC behavior', 'Reinforcement'],
                                        ['NLP', 'Language translation', 'Supervised'],
                                    ],
                                },
                            },
                            {
                                type: 'Callout',
                                props: {
                                    type: 'info',
                                    title: 'Growing Field',
                                    message: 'Machine learning applications are expanding rapidly across industries. The global ML market is projected to reach $200B by 2029.',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

// --- Error test: unknown component type ---
export const unknownTypeFixture = {
    version: '1.0',
    title: 'Unknown Component Test',
    theme: { accent: 'orange' as const },
    root: {
        type: 'Stack',
        props: { gap: 'md' },
        children: [
            {
                type: 'Hero',
                props: { title: 'Error Handling Test', subtitle: 'This fixture includes an unknown component to test the ErrorCallout.' },
            },
            {
                type: 'MagicWidget' as any, // Unknown — should trigger ErrorCallout
                props: { foo: 'bar' },
            },
            {
                type: 'Callout',
                props: { type: 'success', title: 'After Unknown', message: 'This callout renders after the unknown component to prove the renderer continues.' },
            },
        ],
    },
};

// --- Validator torture test: too deep nesting ---
function buildDeepNesting(depth: number): any {
    if (depth <= 0) {
        return { type: 'Callout', props: { type: 'info', title: 'Bottom', message: `Reached depth ${depth}` } };
    }
    return {
        type: 'Stack',
        props: { gap: 'sm' },
        children: [buildDeepNesting(depth - 1)],
    };
}

export const validatorTortureFixture = {
    version: '1.0',
    title: 'Validator Torture Test',
    theme: { accent: 'orange' as const },
    root: buildDeepNesting(15), // exceeds MAX_DEPTH of 10
};

// --- Capability Module: Comparison ---
export const comparisonFixture = {
    version: '1.0',
    title: 'MBA vs CS Masters',
    theme: { accent: 'blue' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Comparison',
                props: {
                    title: 'MBA vs Master\'s in Computer Science',
                    subtitle: 'A structured comparison to help you decide which degree aligns with your goals.',
                    optionA: {
                        name: 'MBA',
                        description: 'Broad business education with leadership focus',
                        pros: [
                            'Strong professional network and alumni connections',
                            'Leadership and management skills',
                            'Wide career pivot options (consulting, finance, product)',
                            'Higher starting salary in business roles',
                        ],
                        cons: [
                            'Very expensive ($100k–$200k total)',
                            '2 years full-time typically required',
                            'Less technical depth',
                            'ROI depends heavily on school prestige',
                        ],
                        stats: {
                            'Avg. Cost': '$120,000 – $200,000',
                            'Duration': '2 years (full-time)',
                            'Median Salary (post-grad)': '$115,000 – $155,000',
                            'Career Options': 'Consulting, Finance, PM, Ops',
                            'Admission Difficulty': 'High (GMAT + Work Experience)',
                        },
                    },
                    optionB: {
                        name: 'MS in CS',
                        description: 'Deep technical specialization in computer science',
                        pros: [
                            'Deep technical expertise (AI/ML, systems, etc.)',
                            'High demand in tech job market',
                            'Often funded via TA/RA positions',
                            'Enables PhD path if interested',
                        ],
                        cons: [
                            'Narrower career scope than MBA',
                            'Less emphasis on business/leadership skills',
                            'Can be very research-heavy at some schools',
                            'Tech salary ceiling may be reached faster',
                        ],
                        stats: {
                            'Avg. Cost': '$30,000 – $80,000 (often funded)',
                            'Duration': '1.5 – 2 years',
                            'Median Salary (post-grad)': '$120,000 – $170,000',
                            'Career Options': 'SWE, ML Engineer, Research, CTO path',
                            'Admission Difficulty': 'Moderate-High (GRE + Projects)',
                        },
                    },
                    criteria: [
                        { name: 'Earning Potential', optionAScore: 7, optionBScore: 9 },
                        { name: 'Career Flexibility', optionAScore: 9, optionBScore: 6 },
                        { name: 'Cost Efficiency', optionAScore: 4, optionBScore: 8 },
                        { name: 'Technical Depth', optionAScore: 3, optionBScore: 10 },
                        { name: 'Networking Value', optionAScore: 10, optionBScore: 5 },
                        { name: 'Time to ROI', optionAScore: 6, optionBScore: 8 },
                    ],
                    recommendation: 'If you want to build or lead technology products, the MS in CS gives the strongest technical foundation with excellent earning potential and lower cost. If you want to transition into general management, consulting, or finance, the MBA opens broader doors — but at 3x the cost. For a tech-focused career, the MS in CS offers better ROI.',
                    isMockData: true,
                },
            },
        ],
    },
};

// --- Capability Module: Calculator ---
export const calculatorFixture = {
    version: '1.0',
    title: 'Net Worth Projector',
    theme: { accent: 'green' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Calculator',
                props: {
                    title: 'Net Worth Projection',
                    subtitle: 'See how your savings grow with compound returns over time.',
                    inputs: [
                        { name: 'principal', label: 'Starting Amount', type: 'slider', min: 0, max: 100000, step: 1000, defaultValue: 10000, unit: '$' },
                        { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'slider', min: 0, max: 10000, step: 100, defaultValue: 2000, unit: '$' },
                        { name: 'annualRate', label: 'Expected Annual Return', type: 'slider', min: 1, max: 15, step: 0.5, defaultValue: 8, unit: '%' },
                        { name: 'years', label: 'Investment Horizon', type: 'slider', min: 1, max: 30, step: 1, defaultValue: 5, unit: 'years' },
                    ],
                    formula: 'compound_growth' as const,
                    outputLabel: 'Projected Net Worth',
                    scenarios: [
                        { name: 'Conservative (6%)', overrides: { annualRate: 6 } },
                        { name: 'Moderate (8%)', overrides: { annualRate: 8 } },
                        { name: 'Aggressive (10%)', overrides: { annualRate: 10 } },
                    ],
                    isMockData: true,
                },
            },
        ],
    },
};

// --- P3: Extended Capabilities Test ---
export const extendedCapabilitiesFixture = {
    version: '1.0',
    title: 'Extended Capabilities Test',
    theme: { accent: 'purple' as const },
    root: {
        type: 'Stack',
        props: { gap: 'lg' },
        children: [
            {
                type: 'Hero',
                props: {
                    title: 'Advanced Capabilities & Visualization',
                    subtitle: 'Testing mathematical rendering, geographic mapping, and premium rich text formatting.',
                },
            },
            {
                type: 'Tabs',
                props: { tabs: ['Mathematics', 'Geography', 'Code & Tables'] },
                children: [
                    // Tab 1: Mathematics
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'WikiSection',
                                props: {
                                    heading: 'The Maxwell Equations',
                                    body: 'James Clerk Maxwell derived four fundamental equations of electromagnetism. Note how elegant the math looks inline, like this: $\\\\nabla \\\\cdot \\\\mathbf{B} = 0$, which states there are no magnetic monopoles. Below is the block rendering:',
                                    viewMode: 'advanced'
                                }
                            },
                            {
                                type: 'Equation',
                                props: {
                                    latex: '\\\\nabla \\\\times \\\\mathbf{E} = -\\\\frac{\\\\partial \\\\mathbf{B}}{\\\\partial t}',
                                    displayMode: true
                                }
                            }
                        ]
                    },
                    // Tab 2: Geography
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'InfoCard',
                                props: {
                                    title: 'Global HQ Locations',
                                    content: 'An interactive Leaflet map rendering our primary and secondary office coordinates.',
                                    icon: 'MapPin'
                                }
                            },
                            {
                                type: 'Map',
                                props: {
                                    center: [40.7128, -74.0060], // NYC
                                    zoom: 3,
                                    markers: [
                                        { lat: 40.7128, lng: -74.0060, label: 'New York (HQ)' },
                                        { lat: 51.5072, lng: -0.1276, label: 'London (EMEA HQ)' },
                                        { lat: 35.6762, lng: 139.6503, label: 'Tokyo (APAC HQ)' },
                                        { lat: 37.7749, lng: -122.4194, label: 'San Francisco (Tech Hub)' }
                                    ]
                                }
                            }
                        ]
                    },
                    // Tab 3: Code & Tables
                    {
                        type: 'Stack',
                        props: { gap: 'md' },
                        children: [
                            {
                                type: 'WikiSection',
                                props: {
                                    heading: 'Advanced Markdown Showcase',
                                    viewMode: 'advanced',
                                    body: 'This section demonstrates **GitHub Flavored Markdown** features like tables and syntax highlighting.\n\n### Python Implementation\n\n```python\ndef fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    return fibonacci(n-1) + fibonacci(n-2)\n```\n\n### Feature Matrix\n\n| Feature | Status | Notes |\n|---------|--------|-------|\n| Maps | ✅ Done | Leaflet integration |\n| Math | ✅ Done | KaTeX integration |\n| Code | ✅ Done | React Syntax Highlighter |'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
