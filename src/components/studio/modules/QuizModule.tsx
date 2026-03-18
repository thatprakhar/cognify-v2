'use client';
import React, { useState } from 'react';
import { QuizModuleConfig } from '../../../lib/schema/module-configs/quiz-module';

export function QuizModule({ config = {} as any }: { config: QuizModuleConfig; computed: any; slot: string }) {
    const questions = config.questions || [];
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    const answeredCount = Object.keys(answers).length;
    const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length;
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = score >= (config.passingScore ?? 70);

    const handleAnswer = (questionId: string, index: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: index }));
        setRevealed(prev => ({ ...prev, [questionId]: true }));
    };

    if (submitted) {
        return (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                    <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className={`rounded-xl p-5 text-center ${passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className={`text-5xl font-black mb-2 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>{score}%</div>
                        <div className={`text-sm font-semibold ${passed ? 'text-emerald-700' : 'text-red-600'}`}>
                            {passed ? '🎉 Passed!' : '😅 Not quite'} — {correctCount}/{questions.length} correct
                        </div>
                    </div>
                    <div className="space-y-3">
                        {questions.map(q => {
                            const userAnswer = answers[q.id] ?? -1;
                            const isCorrect = userAnswer === q.correctIndex;
                            return (
                                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="font-medium text-zinc-900 text-sm mb-2">{q.question}</div>
                                    <div className="text-xs text-zinc-600 mb-1">
                                        {isCorrect ? '✓' : '✗'} You: <span className="font-semibold">{q.options[userAnswer] ?? 'No answer'}</span>
                                        {!isCorrect && <> · Correct: <span className="font-semibold text-emerald-700">{q.options[q.correctIndex]}</span></>}
                                    </div>
                                    <p className="text-xs text-zinc-500 italic">{q.explanation}</p>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => { setAnswers({}); setRevealed({}); setSubmitted(false); }}
                        className="w-full py-2 text-sm font-semibold text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                        Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-900">{config.heading}</h2>
                {config.description && <p className="text-sm text-zinc-500 mt-1">{config.description}</p>}
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-zinc-500 flex-shrink-0">{answeredCount}/{questions.length}</span>
                </div>
            </div>

            <div className="p-6 space-y-5">
                {questions.map((q, qi) => {
                    const userAnswer = answers[q.id];
                    const isRevealed = revealed[q.id];
                    return (
                        <div key={q.id}>
                            <div className="flex gap-3 mb-3">
                                <span className="w-6 h-6 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{qi + 1}</span>
                                <p className="font-medium text-zinc-900 text-sm pt-0.5">{q.question}</p>
                            </div>
                            <div className="pl-9 space-y-2">
                                {q.options.map((opt, i) => {
                                    const isSelected = userAnswer === i;
                                    const isCorrect = i === q.correctIndex;
                                    let style = 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white';
                                    if (isRevealed && isSelected && isCorrect) style = 'border-emerald-300 bg-emerald-50';
                                    else if (isRevealed && isSelected && !isCorrect) style = 'border-red-300 bg-red-50';
                                    else if (isRevealed && isCorrect) style = 'border-emerald-200 bg-emerald-50/50';
                                    return (
                                        <button key={i} onClick={() => handleAnswer(q.id, i)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${style}`}>
                                            <span className="font-mono text-xs text-zinc-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                                            {opt}
                                        </button>
                                    );
                                })}
                                {isRevealed && (
                                    <p className="text-xs text-zinc-500 italic pl-1 pt-1">{q.explanation}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {answeredCount === questions.length && (
                    <button onClick={() => setSubmitted(true)}
                        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        See Results
                    </button>
                )}
            </div>
        </div>
    );
}
