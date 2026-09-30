"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateFairPrice } from '@/lib/ai/pricing';
import { Material, PickupRequest } from '@prisma/client';

export function WeightForm({ request, material, collectorId }: { request: PickupRequest, material: Material, collectorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [condition, setCondition] = useState<"Standard" | "Mixed" | "Clean">("Standard");

  const fairPriceData = weightKg && weightKg > 0 
    ? calculateFairPrice(Number(weightKg), condition, material.base_rate_per_kg)
    : { fairPrice: 0, minPrice: 0, maxPrice: 0 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || Number(weightKg) <= 0) {
      setError("Please enter a valid weight.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/collector/lot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          collectorId,
          materialCategory: request.material_category,
          weightKg: Number(weightKg),
          condition,
          baseRatePerKg: material.base_rate_per_kg
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        router.push(`/collector/lot/success/${result.lotId}`);
      } else {
        setError(result.error || "Failed to create lot");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-700 bg-red-100 p-3 rounded-md font-medium">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Material Category</label>
        <input 
          type="text" 
          value={request.material_category} 
          disabled 
          className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Weight (kg)</label>
        <input 
          type="number" 
          value={weightKg} 
          onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')} 
          min="0.1" 
          step="0.1" 
          required 
          placeholder="e.g. 5.5"
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
        <div className="flex gap-4">
          {["Standard", "Mixed", "Clean"].map((cond) => (
            <label key={cond} className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="condition" 
                value={cond} 
                checked={condition === cond} 
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{cond}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-blue-900 font-bold mb-1">Fair Price Estimate: ₹{fairPriceData.fairPrice}</h3>
        <p className="text-blue-700 text-sm">Range: ₹{fairPriceData.minPrice} – ₹{fairPriceData.maxPrice}</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
      >
        {loading ? "Processing..." : "Create Lot & Register on Blockchain"}
      </button>
    </form>
  );
}
