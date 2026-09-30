"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReportStatusControl({ reportId, currentStatus }: { reportId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    
    try {
      const res = await fetch('/api/cleanliness/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus })
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      disabled={loading}
      value={currentStatus}
      onChange={handleChange}
      className={`text-xs font-bold px-2 py-1 rounded border-0 outline-none focus:ring-2 focus:ring-gray-300 ${
        currentStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
        currentStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
        'bg-green-100 text-green-800'
      }`}
    >
      <option value="PENDING" className="bg-white text-gray-900">PENDING</option>
      <option value="IN_PROGRESS" className="bg-white text-gray-900">IN PROGRESS</option>
      <option value="RESOLVED" className="bg-white text-gray-900">RESOLVED</option>
    </select>
  );
}
