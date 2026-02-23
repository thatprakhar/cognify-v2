import React from 'react';
import { Check } from 'lucide-react';

interface ProgressTrackerProps {
    steps: string[];
    currentStep: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full my-6">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-0"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 dark:bg-blue-500 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${(Math.min(currentStep, steps.length - 1) / (Math.max(1, steps.length - 1))) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    let circleClass = "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400";
                    if (isCompleted) {
                        circleClass = "bg-blue-600 border-blue-600 text-white";
                    } else if (isCurrent) {
                        circleClass = "bg-white dark:bg-zinc-900 border-blue-600 text-blue-600 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30";
                    }

                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${circleClass}`}>
                                {isCompleted ? <Check className="w-4 h-4" /> : (idx + 1)}
                            </div>
                            <span className={`text-xs font-medium absolute top-10 whitespace-nowrap ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500'}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
