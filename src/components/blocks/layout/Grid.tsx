import React from 'react';

interface GridProps {
 columns?: number;
 gap?: 'sm' | 'md' | 'lg';
 children: React.ReactNode;
}

const gapMap = {
 sm: 'gap-2',
 md: 'gap-4',
 lg: 'gap-6',
};

export const Grid: React.FC<GridProps> = ({ columns = 2, gap = 'md', children }) => {
 const colClass = `grid-cols-${Math.max(1, Math.min(4, columns))}`;
 return (
 <div className={`grid ${colClass} ${gapMap[gap]} sm:grid-cols-1 md:grid-cols-${columns}`}>
 {children}
 </div>
 );
};
