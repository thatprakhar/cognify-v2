import React from 'react';

interface HeroProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    viewMode?: 'simple' | 'advanced';
}

export const Hero: React.FC<HeroProps> = ({ title = '', subtitle, imageUrl, viewMode = 'simple' }) => {
    return (
        <div className="mb-12 mt-4 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-zinc-900 mb-5 leading-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-[17px] text-zinc-600 max-w-3xl mb-8 leading-relaxed">
                    {subtitle}
                </p>
            )}
            {imageUrl && (
                <div className="w-full mt-2 rounded-2xl overflow-hidden shadow-sm border border-zinc-200/80 bg-white p-2">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto object-cover max-h-[460px] rounded-xl"
                    />
                </div>
            )}
        </div>
    );
};
