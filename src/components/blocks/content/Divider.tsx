import React from 'react';

interface DividerProps {
    style?: 'solid' | 'dashed' | 'dotted';
}

export const Divider: React.FC<DividerProps> = ({ style = 'solid' }) => {
    const baseClass = "my-8 w-full border-t border-zinc-200 dark:border-zinc-800";
    let borderStyle = "border-solid";

    if (style === 'dashed') borderStyle = "border-dashed";
    if (style === 'dotted') borderStyle = "border-dotted";

    return <hr className={`${baseClass} ${borderStyle}`} />;
};
