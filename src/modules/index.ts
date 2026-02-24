/**
 * Capability Modules — barrel export.
 * Each module is a pre-built interactive template.
 * The LLM fills a typed config schema; the module handles all layout.
 */

export { ComparisonModule } from './ComparisonModule';
export type { ComparisonModuleConfig } from './ComparisonModule';

export { CalculatorModule } from './CalculatorModule';
export type { CalculatorModuleConfig } from './CalculatorModule';

/**
 * MODULE_COMPONENT_MAP — maps module type strings to their React components.
 * Used by renderNode to render capability module nodes.
 */
import { ComparisonModule } from './ComparisonModule';
import { CalculatorModule } from './CalculatorModule';

export const MODULE_COMPONENT_MAP: Record<string, React.FC<any>> = {
    Comparison: ComparisonModule,
    Calculator: CalculatorModule,
};
