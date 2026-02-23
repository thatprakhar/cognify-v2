import React from 'react';

interface ImageProps {
 url: string;
 alt: string;
 caption?: string;
}

export const Image: React.FC<ImageProps> = ({ url = '', alt = '', caption }) => {
 return (
 <figure className="my-6">
 <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 ">
 <img
 src={url}
 alt={alt}
 className="w-full h-auto object-cover max-h-[500px]"
 loading="lazy"
 />
 </div>
 {caption && (
 <figcaption className="mt-3 text-center text-sm text-zinc-500 ">
 {caption}
 </figcaption>
 )}
 </figure>
 );
};
