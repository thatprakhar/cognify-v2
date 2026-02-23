import React from 'react';

interface StackProps {
 gap?: 'sm' | 'md' | 'lg' | 'xl';
 children: React.ReactNode;
}

const gapMap = {
 sm: 'gap-2',
 md: 'gap-4',
 lg: 'gap-6',
 xl: 'gap-8',
};

export const Stack: React.FC<StackProps> = ({ gap = 'md', children }) => {
 return (
 <div className={`flex flex-col ${gapMap[gap]}`}>
 {children}
 </div>
 );
};
