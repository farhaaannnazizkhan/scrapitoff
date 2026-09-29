"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Material } from '@prisma/client';

interface PickupFormProps {
  materials: Material[];
}

export function PickupForm({ materials }: PickupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    material_category: materials[0]?.category || '',
    rough_size: 'Small',
    address: '',
    time_slot: 'Morning (9–12)',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.address.trim().length < 10) {
      setError('Address must be at least 10 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/citizen/status/${result.id}`);
      } else {
        setError(result.error || 'Failed to book pickup.');
      }
    } catch (err) {
      setError('An error occurred while booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg font-medium">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Material Category</label>
        <select
          value={formData.material_category}
          onChange={(e) => setFormData({ ...formData, material_category: e.target.value })}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
          required
        >
          {materials.map((m) => (
            <option key={m.id} value={m.category}>{m.category}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rough Lot Size</label>
        <div className="space-y-2">
          {['Small', 'Medium', 'Large'].map((size) => (
            <label key={size} className="flex items-center p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="rough_size"
                value={size}
                checked={formData.rough_size === size}
                onChange={(e) => setFormData({ ...formData, rough_size: e.target.value })}
                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-900 font-medium">{size} <span className="text-gray-500 font-normal">{size === 'Small' ? '(1–5 kg)' : size === 'Medium' ? '(5–20 kg)' : '(20+ kg)'}</span></span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          placeholder="Enter detailed address"
          required
          minLength={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time Slot</label>
        <select
          value={formData.time_slot}
          onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
        >
          <option value="Morning (9–12)">Morning (9–12)</option>
          <option value="Afternoon (12–3)">Afternoon (12–3)</option>
          <option value="Evening (3–6)">Evening (3–6)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg transition-colors"
      >
        {loading ? 'Booking...' : 'Confirm Pickup'}
      </button>
    </form>
  );
}
