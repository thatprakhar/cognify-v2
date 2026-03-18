"use client";
import React, { useState } from "react";
import { NumberedProcessConfig } from "@/lib/schema/module-configs/numbered-process";

interface Props {
  config: NumberedProcessConfig;
  computed?: Record<string, any>;
  slot?: string;
}

type StepStatus = "pending" | "active" | "complete";

const calloutStyles: Record<string, string> = {
  tip: "bg-blue-900/30 border-blue-700/50 text-blue-300",
  warning: "bg-yellow-900/30 border-yellow-700/50 text-yellow-300",
  note: "bg-gray-700/50 border-gray-600/50 text-gray-300",
  info: "bg-cyan-900/30 border-cyan-700/50 text-cyan-300",
};

const calloutEmoji: Record<string, string> = { tip: "💡", warning: "⚠️", note: "📝", info: "ℹ️" };

export function NumberedProcess({ config }: Props) {
  const [statuses, setStatuses] = useState<Record<string, StepStatus>>(
    Object.fromEntries(config.steps.map((s, i) => [s.id, i === 0 ? "active" : "pending"]))
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set(config.steps[0] ? [config.steps[0].id] : []));

  const toggleStep = (id: string) => {
    setStatuses((prev) => {
      const current = prev[id];
      const next: StepStatus = current === "pending" ? "active" : current === "active" ? "complete" : "pending";
      return { ...prev, [id]: next };
    });
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const completedCount = Object.values(statuses).filter((s) => s === "complete").length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
        {config.context && <p className="text-xs text-gray-500 mt-1 italic">{config.context}</p>}
      </div>

      <div className="text-xs text-gray-400">{completedCount}/{config.steps.length} steps complete</div>

      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-700" />

        {config.steps.map((step, i) => {
          const status = statuses[step.id];
          const isExpanded = expanded.has(step.id);
          return (
            <div key={step.id} className="relative flex gap-4 mb-4">
              <button
                onClick={() => toggleStep(step.id)}
                className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  status === "complete" ? "bg-green-500 border-green-500 text-white" :
                  status === "active" ? "bg-blue-600 border-blue-500 text-white" :
                  "bg-gray-800 border-gray-600 text-gray-400"
                }`}
              >
                {status === "complete" ? "✓" : <span className="text-sm font-bold">{i + 1}</span>}
              </button>

              <div className="flex-1 pb-2">
                <div
                  className={`font-medium cursor-pointer py-1 ${status === "complete" ? "text-gray-500 line-through" : "text-white"}`}
                  onClick={() => toggleStep(step.id)}
                >
                  {step.title}
                </div>

                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-300">{step.description}</p>
                    {step.detail && <p className="text-xs text-gray-400">{step.detail}</p>}
                    {step.substeps && (
                      <ul className="space-y-1 ml-3">
                        {step.substeps.map((sub, j) => (
                          <li key={j} className="text-xs text-gray-400 flex gap-2">
                            <span className="text-gray-600">{j + 1}.</span>{sub}
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.callout && (
                      <div className={`border rounded p-2 text-xs ${calloutStyles[step.callout.type] ?? calloutStyles.note}`}>
                        {calloutEmoji[step.callout.type]} {step.callout.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
