import React from 'react';
import * as LucideIcons from 'lucide-react';

interface InfoCardProps {
    title: string;
    content: string;
    icon?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content, icon }) => {
    // Dynamically render icon from lucide-react if passed
    const IconComponent = icon && (LucideIcons as any)[icon];

    return (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-xl flex items-start gap-4">
            {IconComponent && (
                <div className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0">
                    <IconComponent size={24} />
                </div>
            )}
            <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">{title}</h3>
                <div
                    className="text-blue-800/80 dark:text-blue-200/80 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};
