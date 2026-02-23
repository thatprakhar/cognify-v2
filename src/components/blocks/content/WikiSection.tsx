import React from 'react';

interface WikiSectionProps {
 heading: string;
 body: string;
}

export const WikiSection: React.FC<WikiSectionProps> = ({ heading = '', body = '' }) => {
 return (
 <section className="my-6">
 <h2 className="text-2xl font-semibold mb-3 text-black border-b border-zinc-200 pb-2">
 {heading}
 </h2>
 <div
 className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed"
 dangerouslySetInnerHTML={{ __html: body }}
 />
 </section>
 );
};
