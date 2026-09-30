"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function IncomingLotCard({ lot }: { lot: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recycler/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId: lot.id }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        setError(data.error || "Failed to confirm receipt.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Lot ID: {lot.id.split('-')[0]}</p>
          <h3 className="font-bold text-gray-900 text-lg">{lot.material_category}</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">DELIVERED</span>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-1">
        <p><strong>Weight:</strong> {lot.weight_kg} kg</p>
        <p><strong>Price:</strong> ₹{lot.final_price || lot.quoted_price}</p>
        <p><strong>Collector:</strong> {lot.collector?.name || 'Unknown'}</p>
      </div>

      {error && <p className="text-red-600 text-xs font-bold">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full h-10 mt-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      >
        {loading ? "Confirming..." : "Confirm Receipt & Pay"}
      </button>
    </div>
  );
}
