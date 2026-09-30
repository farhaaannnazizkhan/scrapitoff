"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Hotspot {
  area: string;
  count: number;
}

export function HotspotMap({ hotspots }: { hotspots: Hotspot[] }) {
  // Deterministic mock coordinates within India
  function coordsFor(area: string): [number, number] {
    let hash = 0;
    for (let i = 0; i < area.length; i++) {
      hash = (hash * 31 + area.charCodeAt(i)) | 0;
    }
    const latOffset = ((hash % 100) / 100) * 8 - 4;
    const lngOffset = (((hash >> 8) % 100) / 100) * 8 - 4;
    return [22 + latOffset, 79 + lngOffset];
  }

  const maxCount = Math.max(...hotspots.map((h) => h.count), 1);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden z-0 relative">
      <MapContainer
        {...({ center: [22, 79], zoom: 4, style: { height: "100%", width: "100%" } } as any)}
      >
        <TileLayer
          {...({ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap" } as any)}
        />
        {hotspots.map((h, i) => {
          const [lat, lng] = coordsFor(h.area);
          const radius = 8 + (h.count / maxCount) * 20;
          return (
            <CircleMarker
              key={i}
              {...({ center: [lat, lng], radius, pathOptions: { fillColor: "#dc2626", color: "#991b1b", fillOpacity: 0.6 } } as any)}
            >
              <Popup>
                <strong>{h.area}</strong>
                <br />
                {h.count} pickups
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
