"use client";
import React, { useState } from "react";
import { RecipeModuleConfig } from "@/lib/schema/module-configs/recipe-module";

interface Props {
  config: RecipeModuleConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function RecipeModule({ config }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preparedIngredients, setPreparedIngredients] = useState<Set<string>>(new Set());
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const toggleIngredient = (id: string) => {
    setPreparedIngredients((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatAmount = (amount: number, unit: string) => {
    const scaled = amount * servingMultiplier;
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
    return `${formatted} ${unit}`;
  };

  const step = config.steps[currentStep];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{config.title}</h2>
          {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
        </div>
        {config.totalTime && (
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{config.totalTime}</span>
        )}
      </div>

      <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
        <span className="text-sm text-gray-400">Servings:</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))} className="text-gray-400 hover:text-white w-6 h-6 rounded bg-gray-700 flex items-center justify-center">−</button>
          <span className="text-white font-medium w-12 text-center">{config.servings * servingMultiplier}</span>
          <button onClick={() => setServingMultiplier(servingMultiplier + 0.5)} className="text-gray-400 hover:text-white w-6 h-6 rounded bg-gray-700 flex items-center justify-center">+</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">Ingredients</h3>
          {config.ingredients.map((ing) => (
            <label key={ing.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preparedIngredients.has(ing.id)}
                onChange={() => toggleIngredient(ing.id)}
                className="accent-orange-500 h-3.5 w-3.5"
              />
              <span className={`text-xs ${preparedIngredients.has(ing.id) ? "line-through text-gray-500" : "text-gray-300"}`}>
                <span className="text-orange-400 mr-1">{formatAmount(ing.amount, ing.unit)}</span>
                {ing.name}
                {ing.notes && <span className="text-gray-500"> ({ing.notes})</span>}
              </span>
            </label>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Step {currentStep + 1} of {config.steps.length}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 space-y-3">
            {step.title && <h3 className="font-semibold text-white">{step.title}</h3>}
            <p className="text-sm text-gray-300">{step.instruction}</p>
            {step.duration && <span className="text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded">{step.duration}</span>}
            {step.tip && (
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded p-2 text-xs text-yellow-300">
                {step.tip}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 py-2 rounded-lg bg-gray-700 text-sm text-gray-300 disabled:opacity-40 hover:bg-gray-600"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(config.steps.length - 1, currentStep + 1))}
              disabled={currentStep === config.steps.length - 1}
              className="flex-1 py-2 rounded-lg bg-orange-700 text-sm text-white disabled:opacity-40 hover:bg-orange-600"
            >
              Next
            </button>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / config.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
