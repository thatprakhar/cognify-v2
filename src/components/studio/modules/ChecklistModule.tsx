"use client";
import React, { useState } from "react";
import { ChecklistModuleConfig } from "@/lib/schema/module-configs/checklist-module";

interface Props {
  config: ChecklistModuleConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function ChecklistModule({ config }: Props) {
  const allItemIds = config.sections.flatMap((s) => s.items.map((i) => i.id));
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pct = allItemIds.length > 0 ? Math.round((completed.size / allItemIds.length) * 100) : 0;

  const priorityColor: Record<string, string> = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-gray-400",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{completed.size} / {allItemIds.length} completed</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {config.sections.map((section) => {
        const sectionDone = section.items.filter((i) => completed.has(i.id)).length;
        return (
          <div key={section.id} className="bg-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">{section.title}</h3>
              <span className="text-xs text-gray-400">{sectionDone}/{section.items.length}</span>
            </div>
            {section.items.map((item) => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={completed.has(item.id)}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 accent-green-500 h-4 w-4 rounded"
                />
                <div className="flex-1">
                  <div className={`text-sm ${completed.has(item.id) ? "line-through text-gray-500" : "text-gray-200"}`}>
                    {item.text}
                    {item.priority && (
                      <span className={`ml-2 text-xs ${priorityColor[item.priority] ?? "text-gray-400"}`}>
                        [{item.priority}]
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}
