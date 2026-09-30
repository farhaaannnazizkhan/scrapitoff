"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export function RecyclerCard({ recycler, lot, score }: { recycler: any, lot: any, score: number }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{recycler.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-gray-700 text-sm font-medium">{recycler.rating || '4.5'}</span>
            <span className="text-gray-400 text-xs px-2 py-0.5 bg-gray-100 rounded">Match: {score}</span>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200">
          Authorized
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">📍</span>
          <span className="font-medium">{recycler.area || 'Unknown location'} (5 km)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">♻️</span>
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">General recycler</span>
        </div>
        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100 mt-3">
          <span className="text-green-800 font-medium text-xs uppercase tracking-wide">Offered Rate</span>
          <span className="font-bold text-green-700 text-lg">₹{lot.quoted_price}/kg</span>
        </div>
      </div>

      <button
        onClick={() => router.push(`/collector/handover/${lot.id}?recyclerId=${recycler.id}`)}
        className="w-full h-12 mt-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        Select
      </button>
    </div>
  );
}
