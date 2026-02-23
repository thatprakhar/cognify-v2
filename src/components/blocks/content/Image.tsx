import React from 'react';

interface ImageProps {
    url: string;
    alt: string;
    caption?: string;
}

export const Image: React.FC<ImageProps> = ({ url = '', alt = '', caption }) => {
    return (
        <figure className="my-6">
            <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                <img
                    src={url}
                    alt={alt}
                    className="w-full h-auto object-cover max-h-[500px]"
                    loading="lazy"
                />
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};
