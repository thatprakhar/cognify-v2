import { z } from 'zod';
import { LLMProvider } from '../llm/provider';
import { AnswerSpecSchema } from '../schema/answer';
import { DashboardModuleConfigSchema } from '../../modules/types';

export class DashboardAgent {
  constructor(private provider: LLMProvider) { }

  async generateConfig(
    answerSpec: z.infer<typeof AnswerSpecSchema>,
    onChunk?: (chunk: string) => void,
    overrides?: { temperature?: number; seed?: number }
  ): Promise<z.infer<typeof DashboardModuleConfigSchema>> {
    const systemPrompt = `
Your job is to read the provided AnswerSpec (which likely includes CSV or Data summary) and transform it into a strict JSON configuration for a Dashboard capability module.

MODULE OVERVIEW:
The Dashboard module renders charts and data grids to analyze structured data. 
You do NOT provide the raw data arrays. The raw data is already stored server-side. You only configure how the data should be plotted.

RULES FOR OUTPUT SHAPE:
- Output strictly JSON that matches the \`DashboardModuleConfigSchema\`.
- \`title\`: A concise string title for the dashboard (e.g., "Sales Analysis"). THIS IS REQUIRED.
- \`charts\`: An array of chart configurations. Each must have:
  - \`type\`: 'bar', 'line', 'area', or 'pie'.
  - \`title\`: A title for the chart.
  - \`xAxisKey\`: The column name from the data to use for the X-axis (e.g., "Month", "Category").
  - \`yAxisKeys\`: An array of column names to plot on the Y-axis (e.g., ["Revenue", "Profit"]).
- \`dataGrid\`: Optional configuration for a data table.
  - \`columns\`: An array of column names to display in the table.
- \`isMockData\`: Set to true if you are inventing column names that were not in the actual uploaded file summary.
`;

    const userPrompt = `Query: ${answerSpec.query}\n\nAnswer Content:\n${answerSpec.answerMarkdown}`;

    return this.provider.generateJSON<typeof DashboardModuleConfigSchema>({
      systemPrompt,
      userPrompt,
      schema: DashboardModuleConfigSchema,
      maxTokens: 1500,
      modelClass: 'capable', // using capable model to accurately map columns
      onChunk,
      ...overrides
    });
  }
}
