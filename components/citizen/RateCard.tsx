import React from 'react';
import { Material } from '@prisma/client';

interface RateCardProps {
  material: {
    id: string;
    category: string;
    sub_category?: string | null;
    description?: string | null;
    image_url?: string | null;
    unit: string;
    base_rate_per_kg: number;
  };
  trend?: "rising" | "falling" | "stable";
}


const EMOJI_MAP: Record<string, string> = {
  'Newspaper': '📰',
  'Copper': '🔌',
  'PCB': '💻',
  'Battery': '🔋',
  'Plastic': '♻️',
  'Iron': '⚙️',
  'Aluminium': '🥫',
  'E-waste Mixed': '🗑️',
  'Glass': '🍾',
  'Cardboard': '📦',
};

export function RateCard({ material, trend = "stable" }: RateCardProps) {
  const emoji = EMOJI_MAP[material.category] || '♻️';
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border-l-4 border-green-600 p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="text-4xl mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full">
        {emoji}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-gray-900 text-lg">{material.category}</h3>
        <p className="text-gray-500 text-sm">{material.description || material.sub_category || 'Scrap Material'}</p>
      </div>
      <div className="text-right">
        <div className="font-bold text-green-700 text-xl">
          ₹{(material.base_rate_per_kg ?? 0) * 1.0} <span className="text-sm font-normal text-gray-500">/ {material.unit}</span>
        </div>
        <div className="text-sm mt-1 flex items-center justify-end">
          {trend === 'stable' && <span className="text-gray-400 mr-1">→</span>}
          {trend === 'rising' && <span className="text-green-500 mr-1">↑</span>}
          {trend === 'falling' && <span className="text-red-500 mr-1">↓</span>}
          <span className="capitalize text-gray-500">{trend}</span>
        </div>
      </div>
    </div>
  );
}
