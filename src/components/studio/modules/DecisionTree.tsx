"use client";
import React, { useState } from "react";
import { DecisionTreeConfig } from "@/lib/schema/module-configs/decision-tree";

interface Props {
  config: DecisionTreeConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function DecisionTree({ config }: Props) {
  const [currentId, setCurrentId] = useState(config.rootId);
  const [path, setPath] = useState<Array<{ question: string; choice: string }>>([]);

  const currentNode = config.nodes.find((n) => n.id === currentId);

  const handleChoice = (choiceLabel: string, nextId: string) => {
    if (currentNode?.type === "question") {
      setPath((p) => [...p, { question: currentNode.question, choice: choiceLabel }]);
      setCurrentId(nextId);
    }
  };

  const reset = () => {
    setCurrentId(config.rootId);
    setPath([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>

      {path.length > 0 && (
        <div className="space-y-1">
          {path.map((step, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-400">
              <span className="text-gray-600">{step.question}</span>
              <span className="text-blue-400">→ {step.choice}</span>
            </div>
          ))}
        </div>
      )}

      {currentNode?.type === "question" && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <p className="text-lg font-medium text-white">{currentNode.question}</p>
          <div className="grid gap-2">
            {currentNode.choices.map((choice) => (
              <button
                key={choice.nextId}
                onClick={() => handleChoice(choice.label, choice.nextId)}
                className="text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-blue-700 text-gray-200 hover:text-white transition-colors"
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentNode?.type === "leaf" && (
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-xl p-6 space-y-3">
          <div className="text-xs font-semibold text-green-400 uppercase tracking-wider">Recommendation</div>
          <p className="text-xl font-bold text-white">{currentNode.recommendation}</p>
          <p className="text-sm text-gray-300">{currentNode.reasoning}</p>
          {currentNode.nextSteps && currentNode.nextSteps.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Next Steps</div>
              <ul className="space-y-1">
                {currentNode.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-green-400">→</span>{step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {path.length > 0 && (
        <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ↺ Start over
        </button>
      )}
    </div>
  );
}
