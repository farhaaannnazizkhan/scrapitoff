"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AcceptButtonProps {
  requestId: string;
  collectorId: string;
}

export function AcceptButton({ requestId, collectorId }: AcceptButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/collector/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, collectorId }),
      });
      
      const result = await res.json();
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Failed to accept pickup');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && <div className="text-red-500 text-sm mb-2 text-center font-medium">{error}</div>}
      <button
        onClick={handleAccept}
        disabled={loading}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Accepting...' : 'Accept'}
      </button>
    </div>
  );
}
