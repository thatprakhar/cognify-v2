'use client';

import React, { useState } from 'react';

interface SliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    defaultValue?: number;
}

export const Slider: React.FC<SliderProps> = ({ label, min, max, step = 1, defaultValue }) => {
    const [value, setValue] = useState(defaultValue ?? min);

    return (
        <div className="w-full py-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};
