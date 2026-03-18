"use client";
import React, { useState } from "react";
import { FlashcardDeckConfig } from "@/lib/schema/module-configs/flashcard-deck";

interface Props {
  config: FlashcardDeckConfig;
  computed?: Record<string, any>;
  slot?: string;
}

export function FlashcardDeck({ config }: Props) {
  const [order, setOrder] = useState(() => config.cards.map((_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const shuffle = () => {
    setOrder([...order].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const card = config.cards[order[currentIndex]];
  const progress = config.cards.length > 0 ? Math.round((known.size / config.cards.length) * 100) : 0;

  const advance = (markKnown: boolean) => {
    if (markKnown) setKnown((prev) => new Set([...prev, card.id]));
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, config.cards.length - 1)), 150);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{config.title}</h2>
          {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
        </div>
        <div className="text-xs text-gray-400">{known.size}/{config.cards.length} known</div>
      </div>

      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="relative cursor-pointer select-none"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative h-48 transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}
        >
          <div
            className="absolute inset-0 bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            {card.category && <div className="text-xs text-purple-400 mb-2">{card.category}</div>}
            <p className="text-lg font-medium text-white text-center">{card.front}</p>
            {card.hint && <p className="text-xs text-gray-500 mt-3">Hint: {card.hint}</p>}
            <p className="text-xs text-gray-600 mt-4">Click to reveal</p>
          </div>
          <div
            className="absolute inset-0 bg-purple-900/50 border border-purple-700/50 rounded-2xl flex items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-base text-white text-center">{card.back}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={() => advance(false)}
            className="flex-1 py-2 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 text-sm transition-colors"
          >
            Keep reviewing
          </button>
          <button
            onClick={() => advance(true)}
            className="flex-1 py-2 rounded-lg bg-green-900/50 text-green-300 hover:bg-green-900 text-sm transition-colors"
          >
            Got it
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{currentIndex + 1} / {config.cards.length}</span>
        <button onClick={shuffle} className="hover:text-gray-200 transition-colors">Shuffle</button>
      </div>
    </div>
  );
}
