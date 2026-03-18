"use client";
import React, { useState } from "react";
import { ScenarioComparisonConfig } from "@/lib/schema/module-configs/scenario-comparison";

interface Props {
  config: ScenarioComparisonConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function ScenarioComparison({ config }: Props) {
  const [highlightedScenario, setHighlightedScenario] = useState<string | null>(
    config.scenarios.find((s) => s.isHighlighted)?.id ?? null
  );

  const formatValue = (value: number, format: string, unit?: string) => {
    if (format === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    if (format === "percentage") return `${value.toFixed(1)}%`;
    const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 1 });
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const getBestWorst = (metricId: string, higherIsBetter: boolean) => {
    const values = config.scenarios.map((s) => s.metrics[metricId]?.value ?? 0);
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
    const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
    return { best, worst };
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-medium py-2 pr-4 min-w-32">Metric</th>
              {config.scenarios.map((scenario) => (
                <th
                  key={scenario.id}
                  className={`text-center py-2 px-3 cursor-pointer rounded-t transition-colors min-w-28 ${
                    highlightedScenario === scenario.id ? "bg-blue-900/50 text-blue-300" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setHighlightedScenario(highlightedScenario === scenario.id ? null : scenario.id)}
                >
                  {scenario.label}
                  {scenario.description && (
                    <div className="font-normal text-xs text-gray-500 mt-0.5">{scenario.description}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {config.metrics.map((metric, mi) => {
              const { best, worst } = getBestWorst(metric.id, metric.higherIsBetter ?? true);
              return (
                <tr key={metric.id} className={mi % 2 === 0 ? "bg-gray-800/30" : ""}>
                  <td className="py-2 pr-4 text-gray-300 font-medium">{metric.label}</td>
                  {config.scenarios.map((scenario) => {
                    const mv = scenario.metrics[metric.id];
                    const value = mv?.value ?? 0;
                    const isBest = value === best;
                    const isWorst = value === worst && best !== worst;
                    return (
                      <td
                        key={scenario.id}
                        className={`text-center py-2 px-3 font-mono transition-colors ${
                          highlightedScenario === scenario.id ? "bg-blue-900/20" : ""
                        } ${isBest ? "text-green-400 font-bold" : isWorst ? "text-red-400" : "text-gray-200"}`}
                      >
                        {formatValue(value, metric.format ?? "number", metric.unit)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 text-xs text-gray-500">
        <span className="text-green-400">■</span> Best value
        <span className="text-red-400">■</span> Worst value
      </div>
    </div>
  );
}
