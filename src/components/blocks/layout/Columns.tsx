import React from 'react';

interface ColumnsProps {
 layout?: 'equal' | 'sidebar-left' | 'sidebar-right';
 children: React.ReactNode;
}

export const Columns: React.FC<ColumnsProps> = ({ layout = 'equal', children }) => {
 let gridClass = 'grid-cols-1 md:grid-cols-2';

 if (layout === 'sidebar-left') {
 gridClass = 'grid-cols-1 md:grid-cols-[1fr_2fr]';
 } else if (layout === 'sidebar-right') {
 gridClass = 'grid-cols-1 md:grid-cols-[2fr_1fr]';
 }

 return (
 <div className={`grid gap-6 w-full ${gridClass}`}>
 {children}
 </div>
 );
};
