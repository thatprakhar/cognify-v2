'use client';

import React, { useState } from 'react';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'select';
    options?: string[];
    required?: boolean;
}

interface FormProps {
    fields: FormField[];
    submitLabel: string;
}

export const Form: React.FC<FormProps> = ({ fields = [], submitLabel }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we'd collect data and pass it back
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Success!</h3>
                <p className="text-emerald-600 dark:text-emerald-400">
                    Your form was submitted successfully.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/50">
            {fields.map((field, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                        <select
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select an option</option>
                            {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
                {submitLabel}
            </button>
        </form>
    );
};
