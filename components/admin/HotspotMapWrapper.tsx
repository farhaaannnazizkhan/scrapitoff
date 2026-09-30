"use client";

import dynamic from "next/dynamic";

const HotspotMap = dynamic(
  () => import("@/components/admin/HotspotMap").then((m) => m.HotspotMap),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" /> }
);

export function HotspotMapWrapper({ hotspots }: { hotspots: { area: string; count: number }[] }) {
  return <HotspotMap hotspots={hotspots} />;
}
