import React from 'react';

interface ImageProps {
    url: string;
    alt: string;
    caption?: string;
}

export const Image: React.FC<ImageProps> = ({ url = '', alt = '', caption }) => {
    return (
        <figure className="my-6">
            <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50 min-h-[200px] flex items-center justify-center">
                {url ? (
                    <img
                        src={url}
                        alt={alt}
                        className="w-full h-auto object-cover max-h-[500px]"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 p-8">
                        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin mb-3" />
                        <span className="text-sm">Generating map or image...</span>
                    </div>
                )}
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-sm text-zinc-500 ">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};
