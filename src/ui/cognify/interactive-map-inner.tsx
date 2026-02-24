'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CognifyMapProps } from './interactive-map';

// Fix for default marker icons missing in Next.js/Webpack builds
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// A helper component to automatically adjust the map view when props change.
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

export const MapInner: React.FC<CognifyMapProps> = ({ center, zoom = 13, markers = [] }) => {
    // Defensive check for partial streaming JSON where center might be partially defined or empty
    const isValidCenter = Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number';
    const safeCenter = isValidCenter ? center as [number, number] : [0, 0] as [number, number];

    return (
        <MapContainer
            center={safeCenter}
            zoom={zoom}
            scrollWheelZoom={false}
            className="w-full h-full"
        >
            <MapController center={safeCenter} zoom={zoom ?? 4} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {(markers || []).map((marker, idx) => {
                if (!marker || typeof marker.lat !== 'number' || typeof marker.lng !== 'number') return null;
                return (
                    <Marker key={idx} position={[marker.lat, marker.lng]}>
                        {marker.label && (
                            <Popup>
                                <span className="font-medium text-zinc-900">{marker.label}</span>
                            </Popup>
                        )}
                    </Marker>
                );
            })}
        </MapContainer>
    );
};
