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

  const [splitEnabled, setSplitEnabled] = useState(false);
  const [split, setSplit] = useState({ paper: '', plastic: '', metal: '', eWaste: '', residual: '' });

  const fairPriceData = weightKg && weightKg > 0 
    ? calculateFairPrice(Number(weightKg), condition, material.base_rate_per_kg)
    : { fairPrice: 0, minPrice: 0, maxPrice: 0 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || Number(weightKg) <= 0) {
      setError("Please enter a valid weight.");
      return;
    }
    let splitData = null;
    if (splitEnabled) {
      const sum = (Number(split.paper) || 0) + (Number(split.plastic) || 0) + (Number(split.metal) || 0) + (Number(split.eWaste) || 0) + (Number(split.residual) || 0);
      if (Math.abs(sum - Number(weightKg)) > 0.1) {
        setError("Sum does not match total weight");
        return;
      }
      splitData = {
        paper: Number(split.paper) || 0,
        plastic: Number(split.plastic) || 0,
        metal: Number(split.metal) || 0,
        eWaste: Number(split.eWaste) || 0,
        residual: Number(split.residual) || 0,
      };
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
          baseRatePerKg: material.base_rate_per_kg,
          ...(splitEnabled && { split: splitData })
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        if (splitEnabled && splitData) {
          try {
            const key = `scrapitoff_split_${collectorId}`;
            const existing = JSON.parse(localStorage.getItem(key) || '{"paper":0,"plastic":0,"metal":0,"eWaste":0,"residual":0}');
            existing.paper += splitData.paper;
            existing.plastic += splitData.plastic;
            existing.metal += splitData.metal;
            existing.eWaste += splitData.eWaste;
            existing.residual += splitData.residual;
            localStorage.setItem(key, JSON.stringify(existing));
          } catch(e) {}
        }
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

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
          <input 
            type="checkbox" 
            checked={splitEnabled} 
            onChange={e => setSplitEnabled(e.target.checked)} 
            className="w-4 h-4 text-green-600 focus:ring-green-500 rounded border-gray-300"
          />
          Mixed Waste? Split it.
        </label>
        
        {splitEnabled && (
          <div className="space-y-3 mt-4 pl-6">
            {['paper', 'plastic', 'metal', 'eWaste', 'residual'].map((cat) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{cat === 'eWaste' ? 'E-Waste' : cat}</span>
                <input 
                  type="number" 
                  min="0" step="0.1" 
                  value={split[cat as keyof typeof split]} 
                  onChange={e => setSplit({...split, [cat]: e.target.value})}
                  className="w-24 h-8 px-2 border border-gray-300 rounded text-right focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ))}
          </div>
        )}
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
