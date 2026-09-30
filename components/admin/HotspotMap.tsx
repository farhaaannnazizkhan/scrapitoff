"use client";

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Hotspot {
  area: string;
  count: number;
}

export function HotspotMap({ hotspots }: { hotspots: Hotspot[] }) {
  const getCoordinates = (area: string) => {
    let hash = 0;
    for (let i = 0; i < area.length; i++) {
      hash = ((hash << 5) - hash) + area.charCodeAt(i);
      hash = hash & hash;
    }
    const latOffset = (Math.abs(hash) % 100) / 1000;
    const lngOffset = (Math.abs(hash >> 2) % 100) / 1000;
    
    return [21.14 + latOffset, 79.08 + lngOffset] as [number, number];
  };

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
      <MapContainer center={[21.14, 79.08]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotspots.map((hotspot, idx) => {
          const position = getCoordinates(hotspot.area);
          return (
            <CircleMarker 
              key={idx}
              center={position}
              pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.6 }}
              radius={Math.min(20, Math.max(5, hotspot.count * 5))}
            >
              <Popup>
                <div className="text-center">
                  <strong>{hotspot.area}</strong><br/>
                  {hotspot.count} pickups
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
