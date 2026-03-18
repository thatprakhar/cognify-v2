"use client";
import React, { useReducer, useMemo } from "react";
import { ProsConsConfig } from "@/lib/schema/module-configs/pros-cons";

interface Props {
  config: ProsConsConfig;
  computed?: Record<string, any>;
  slot?: string;
}

type WeightAction = { optionId: string; itemId: string; type: "pro" | "con"; weight: 1 | 2 | 3 };

export function ProsCons({ config }: Props) {
  const initialWeights = Object.fromEntries(
    config.options.flatMap((opt) => [
      ...opt.pros.map((p) => [`${opt.id}-pro-${p.id}`, p.weight ?? 2]),
      ...opt.cons.map((c) => [`${opt.id}-con-${c.id}`, c.weight ?? 2]),
    ])
  );

  const [weights, dispatch] = useReducer(
    (state: Record<string, number>, action: WeightAction) => ({
      ...state,
      [`${action.optionId}-${action.type}-${action.itemId}`]: action.weight,
    }),
    initialWeights
  );

  const scores = useMemo(() =>
    config.options.map((opt) => {
      const proScore = opt.pros.reduce((sum, p) => sum + (weights[`${opt.id}-pro-${p.id}`] ?? 2), 0);
      const conScore = opt.cons.reduce((sum, c) => sum + (weights[`${opt.id}-con-${c.id}`] ?? 2), 0);
      return { id: opt.id, label: opt.label, score: proScore - conScore, proScore, conScore };
    }), [weights, config.options]
  );

  const maxScore = Math.max(...scores.map((s) => Math.abs(s.score)), 1);
  const winner = scores.reduce((a, b) => (a.score > b.score ? a : b));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{config.question}</p>
      </div>

      <div className="grid gap-4">
        {config.options.map((opt) => {
          const score = scores.find((s) => s.id === opt.id)!;
          const barWidth = Math.abs(score.score) / maxScore * 100;
          return (
            <div key={opt.id} className="bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">{opt.label}</h3>
                <span className={`text-lg font-bold ${score.score > 0 ? "text-green-400" : score.score < 0 ? "text-red-400" : "text-gray-400"}`}>
                  {score.score > 0 ? "+" : ""}{score.score}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${score.score >= 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-green-400 mb-2">Pros</div>
                  {opt.pros.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 text-xs">+</span>
                      <span className="text-xs text-gray-300 flex-1">{p.text}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-400 mb-2">Cons</div>
                  {opt.cons.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 text-xs">−</span>
                      <span className="text-xs text-gray-300 flex-1">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-lg p-4">
        <div className="text-xs font-semibold text-blue-400 mb-1">Weighted Recommendation</div>
        <p className="text-white font-medium">{config.recommendation ?? `${winner.label} scores highest overall`}</p>
      </div>
    </div>
  );
}
