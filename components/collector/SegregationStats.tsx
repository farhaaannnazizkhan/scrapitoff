"use client";

import React, { useEffect, useState } from 'react';

export function SegregationStats({ collectorId }: { collectorId: string }) {
  const [stats, setStats] = useState({ paper: 0, plastic: 0, metal: 0, eWaste: 0, residual: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const data = localStorage.getItem(`scrapitoff_split_${collectorId}`);
      if (data) setStats(JSON.parse(data));
    } catch(e) {}
  }, [collectorId]);

  if (!mounted) return null;

  // Don't show if all are 0
  if (stats.paper === 0 && stats.plastic === 0 && stats.metal === 0 && stats.eWaste === 0 && stats.residual === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="bg-green-500 w-2 h-6 rounded-full inline-block"></span>
        Today's Segregation Breakdown
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{k === 'eWaste' ? 'E-Waste' : k}</p>
            <p className="font-bold text-xl text-gray-900">{v.toFixed(1)} <span className="text-sm font-normal text-gray-500">kg</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
