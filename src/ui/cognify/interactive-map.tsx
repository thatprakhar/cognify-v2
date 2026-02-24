'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/ui/shadcn/card';
import { Loader2 } from 'lucide-react';

export interface CognifyMapProps {
    center: [number, number];
    zoom?: number;
    markers?: Array<{
        lat: number;
        lng: number;
        label?: string;
    }>;
}

// Dynamically import the actual map rendering code so that Leaflet (which relies on `window`) 
// doesn't crash the Next.js static site generation / SSR process.
const MapInner = dynamic(() => import('./interactive-map-inner').then(mod => mod.MapInner), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm">Loading map data...</p>
        </div>
    )
});

export const CognifyMap: React.FC<CognifyMapProps> = ({
    center = [51.505, -0.09], // Default London
    zoom = 13,
    markers = []
}) => {
    return (
        <Card className="my-6 overflow-hidden relative z-0 h-[400px] w-full border border-zinc-200">
            <MapInner center={center} zoom={zoom} markers={markers} />
        </Card>
    );
};
