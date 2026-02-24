import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/shadcn/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// --- CognifyHero ---

interface CognifyHeroProps {
    title: string;
    subtitle?: string;
    viewMode?: 'simple' | 'advanced';
}

export const CognifyHero: React.FC<CognifyHeroProps> = ({ title = '', subtitle }) => (
    <div className="mb-12 mt-4 flex flex-col items-start text-left">
        <h1 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-foreground mb-5 leading-tight">
            {title}
        </h1>
        {subtitle && (
            <p className="text-[17px] text-muted-foreground max-w-3xl mb-8 leading-relaxed">
                {subtitle}
            </p>
        )}
    </div>
);

// --- CognifyInfoCard ---

interface CognifyInfoCardProps {
    title: string;
    content: string;
    icon?: string;
}

export const CognifyInfoCard: React.FC<CognifyInfoCardProps> = ({ title = '', content = '', icon }) => {
    // Safe icon lookup: only render if it's a valid lucide icon name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = icon ? (LucideIcons as any)[icon] as React.FC<{ size?: number }> | undefined : null;

    return (
        <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    {IconComponent && (
                        <div className="text-blue-500 mt-0.5 flex-shrink-0">
                            <IconComponent size={24} />
                        </div>
                    )}
                    <CardTitle className="text-blue-900 text-base">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-blue-800/80 text-sm leading-relaxed">{content}</p>
            </CardContent>
        </Card>
    );
};

// --- CognifyStatCard ---

interface CognifyStatCardProps {
    label: string;
    value: string | number;
    trend?: string;
}

export const CognifyStatCard: React.FC<CognifyStatCardProps> = ({ label = '', value = '', trend }) => {
    let TrendIcon = Minus;
    let trendColor = 'text-muted-foreground';

    if (trend) {
        if (trend.startsWith('+')) {
            TrendIcon = TrendingUp;
            trendColor = 'text-emerald-500';
        } else if (trend.startsWith('-')) {
            TrendIcon = TrendingDown;
            trendColor = 'text-red-500';
        }
    }

    return (
        <Card>
            <CardContent className="p-6 flex flex-col gap-2">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-foreground">{value}</span>
                    {trend && (
                        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
                            <TrendIcon className="w-4 h-4 mr-1" />
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// --- CognifyImage ---

const ALLOWED_IMAGE_PROTOCOLS = ['https:', 'data:'];

interface CognifyImageProps {
    url: string;
    alt: string;
    caption?: string;
}

export const CognifyImage: React.FC<CognifyImageProps> = ({ url = '', alt = '', caption }) => {
    // Image URL policy: only allow https: and data: URLs
    let safeUrl = '';
    try {
        if (url.startsWith('data:')) {
            safeUrl = url;
        } else {
            const parsed = new URL(url);
            if (ALLOWED_IMAGE_PROTOCOLS.includes(parsed.protocol)) {
                safeUrl = url;
            }
        }
    } catch {
        // Invalid URL, render placeholder
    }

    return (
        <figure className="my-6">
            <Card className="overflow-hidden p-2">
                {safeUrl ? (
                    <img
                        src={safeUrl}
                        alt={alt}
                        className="w-full h-auto object-cover max-h-[500px] rounded-lg"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground p-8 min-h-[200px]">
                        <span className="text-sm">Image unavailable</span>
                    </div>
                )}
            </Card>
            {caption && (
                <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
            )}
        </figure>
    );
};
