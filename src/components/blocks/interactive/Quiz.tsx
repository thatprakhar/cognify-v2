'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

interface QuizProps {
    questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const question = questions[currentIndex];

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === question.correct) {
            setScore(s => s + 1);
        }
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setSelected(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (showResult) {
        return (
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                    You scored {score} out of {questions.length}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 text-sm text-zinc-500 font-medium">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">
                {question.question}
            </h3>

            <div className="space-y-3">
                {question.options.map((opt, idx) => {
                    let btnClass = "border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                    if (selected !== null) {
                        if (idx === question.correct) {
                            btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                        } else if (idx === selected) {
                            btnClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                        } else {
                            btnClass = "border-zinc-200 dark:border-zinc-800 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={selected !== null}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${btnClass}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
