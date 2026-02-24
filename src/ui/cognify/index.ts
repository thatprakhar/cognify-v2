// Cognify Component Facade — barrel export
// This is the ONLY renderable allowlisted surface.
// Includes both primitive wrappers and capability modules.

// Layout
export { CognifyStack, CognifyGrid, CognifyColumns } from './layout';
export { CognifyTabs, CognifyAccordion } from './layout-radix';

// Content
export { CognifyHero, CognifyInfoCard, CognifyStatCard, CognifyImage } from './content';
export { CognifyWikiSection } from './content-wiki';
export { CognifyCallout, CognifyDivider, CognifyTable, ErrorCallout } from './content-blocks';

// Interactive
export { CognifyQuiz, CognifyForm, CognifyFileUpload, CognifySlider, CognifyProgressTracker } from './interactive';
export { CognifyChart } from './chart';

// --- Component Type Map ---
// Maps UISpec node.type strings to Cognify wrapper components.
// This is a typed record keyed from the BlockType union, NOT a loose Record<string, ...>.

import type { BlockType } from '@/lib/schema/ui-spec';
import type React from 'react';

import { CognifyStack, CognifyGrid, CognifyColumns } from './layout';
import { CognifyTabs, CognifyAccordion } from './layout-radix';
import { CognifyHero, CognifyInfoCard, CognifyStatCard, CognifyImage } from './content';
import { CognifyWikiSection } from './content-wiki';
import { CognifyCallout, CognifyDivider, CognifyTable } from './content-blocks';
import { CognifyQuiz, CognifyForm, CognifyFileUpload, CognifySlider, CognifyProgressTracker } from './interactive';
import { CognifyChart } from './chart';
import { ComparisonModule } from '@/modules/ComparisonModule';
import { CalculatorModule } from '@/modules/CalculatorModule';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COGNIFY_COMPONENT_MAP: Record<BlockType, React.FC<any>> = {
    // Layout
    Stack: CognifyStack,
    Grid: CognifyGrid,
    Columns: CognifyColumns,
    Tabs: CognifyTabs,
    Accordion: CognifyAccordion,
    // Content
    Hero: CognifyHero,
    WikiSection: CognifyWikiSection,
    InfoCard: CognifyInfoCard,
    StatCard: CognifyStatCard,
    Table: CognifyTable,
    Image: CognifyImage,
    Callout: CognifyCallout,
    Divider: CognifyDivider,
    // Interactive
    Quiz: CognifyQuiz,
    Form: CognifyForm,
    FileUpload: CognifyFileUpload,
    Slider: CognifySlider,
    Chart: CognifyChart,
    ProgressTracker: CognifyProgressTracker,
    // Capability Modules (self-contained interactive templates)
    Comparison: ComparisonModule,
    Calculator: CalculatorModule,
};
