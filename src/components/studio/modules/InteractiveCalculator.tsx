"use client";
import React, { useReducer, useMemo } from "react";
import { InteractiveCalculatorConfig } from "@/lib/schema/module-configs/interactive-calculator";

interface Props {
  config: InteractiveCalculatorConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function InteractiveCalculator({ config }: Props) {
  const initialValues = Object.fromEntries(
    config.inputs.map((inp) => [inp.id, inp.defaultValue])
  );

  const [values, dispatch] = useReducer(
    (state: Record<string, number>, action: { id: string; value: number }) => ({
      ...state,
      [action.id]: action.value,
    }),
    initialValues
  );

  const computed = useMemo(() => {
    return config.outputs.map((out) => {
      try {
        const fn = new Function(...Object.keys(values), `return ${out.formula}`);
        const result = fn(...Object.values(values));
        return { ...out, result };
      } catch {
        return { ...out, result: NaN };
      }
    });
  }, [values, config.outputs]);

  const formatValue = (value: number, format: string, unit?: string) => {
    if (isNaN(value)) return "—";
    if (format === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
    if (format === "percentage") return `${value.toFixed(1)}%`;
    const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return unit ? `${formatted} ${unit}` : formatted;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>

      <div className="grid gap-4">
        {config.inputs.map((input) => (
          <div key={input.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">{input.label}</label>
              <span className="text-sm font-mono text-blue-400">
                {values[input.id].toLocaleString()}{input.unit ? ` ${input.unit}` : ""}
              </span>
            </div>
            <input
              type="range"
              min={input.min}
              max={input.max}
              step={input.step}
              value={values[input.id]}
              onChange={(e) => dispatch({ id: input.id, value: parseFloat(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{input.min.toLocaleString()}{input.unit ? ` ${input.unit}` : ""}</span>
              <span>{input.max.toLocaleString()}{input.unit ? ` ${input.unit}` : ""}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        {computed.map((out) => (
          <div key={out.id} className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">{out.label}</div>
            <div className="text-3xl font-bold text-white">
              {formatValue(out.result, out.format ?? "number", out.unit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
