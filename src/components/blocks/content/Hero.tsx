import React from 'react';

interface HeroProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ title = '', subtitle, imageUrl }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-32 h-32 object-cover rounded-full mb-6 shadow-md"
                />
            )}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
};
