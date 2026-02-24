/**
 * Capability Modules — barrel export.
 * Each module is a pre-built interactive template.
 * The LLM fills a typed config schema; the module handles all layout.
 */

export { ComparisonModule } from './ComparisonModule';
export { CalculatorModule } from './CalculatorModule';
export { DashboardModule } from './DashboardModule';
export { DiagramModule } from './DiagramModule';

export type {
    ComparisonModuleConfig,
    CalculatorModuleConfig,
    DashboardModuleConfig,
    DiagramModuleConfig
} from './types';

/**
 * MODULE_COMPONENT_MAP — maps module type strings to their React components.
 * Used by renderNode to render capability module nodes.
 */
import { ComparisonModule } from './ComparisonModule';
import { CalculatorModule } from './CalculatorModule';
import { DashboardModule } from './DashboardModule';
import { DiagramModule } from './DiagramModule';

export const MODULE_COMPONENT_MAP: Record<string, React.FC<any>> = {
    Comparison: ComparisonModule,
    Calculator: CalculatorModule,
    Dashboard: DashboardModule,
    Diagram: DiagramModule,
};
