"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AssignControl({ 
  reportId, 
  currentAssignedTo, 
  workers 
}: { 
  reportId: string; 
  currentAssignedTo: string | null; 
  workers: { id: string, name: string, ward: string }[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssignedTo = e.target.value;
    setLoading(true);
    
    try {
      const res = await fetch('/api/municipal/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, assignedTo: newAssignedTo })
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
      value={currentAssignedTo || ""}
      onChange={handleChange}
      className="text-xs font-bold px-2 py-1 rounded border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 bg-white text-gray-900 w-full sm:w-auto"
    >
      <option value="" className="text-gray-500">Unassigned</option>
      {workers.map(w => (
        <option key={w.id} value={w.name}>{w.name} ({w.ward})</option>
      ))}
    </select>
  );
}
