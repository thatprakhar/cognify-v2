import React from 'react';

// --- Layout Wrappers ---

interface CognifyStackProps {
    gap?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

const gapMap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' } as const;

export const CognifyStack: React.FC<CognifyStackProps> = ({ gap = 'md', children }) => (
    <div className={`flex flex-col ${gapMap[gap]}`}>{children}</div>
);

// ---

interface CognifyGridProps {
    columns?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const gridGapMap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' } as const;
const gridColMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
} as const;

export const CognifyGrid: React.FC<CognifyGridProps> = ({ columns = 2, gap = 'md', children }) => (
    <div className={`grid ${gridColMap[columns]} ${gridGapMap[gap]}`}>{children}</div>
);

// ---

interface CognifyColumnsProps {
    layout?: 'equal' | 'sidebar-left' | 'sidebar-right';
    children: React.ReactNode;
}

const columnsMap = {
    'equal': 'grid-cols-1 md:grid-cols-2',
    'sidebar-left': 'grid-cols-1 md:grid-cols-[1fr_2fr]',
    'sidebar-right': 'grid-cols-1 md:grid-cols-[2fr_1fr]',
} as const;

export const CognifyColumns: React.FC<CognifyColumnsProps> = ({ layout = 'equal', children }) => (
    <div className={`grid gap-6 w-full ${columnsMap[layout]}`}>{children}</div>
);
