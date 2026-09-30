"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { wasteCatalog, WasteItem, WasteCategory } from '@/lib/data/wasteCatalog';

interface Props {
  lang: "en" | "hi" | "mr";
}

const CATEGORY_COLORS: Record<WasteCategory, string> = {
  "Recyclable": "bg-green-100 text-green-800 border-green-200",
  "E-Waste": "bg-purple-100 text-purple-800 border-purple-200",
  "Hazardous": "bg-red-100 text-red-800 border-red-200",
  "Organic": "bg-amber-100 text-amber-800 border-amber-200",
  "Residual": "bg-gray-100 text-gray-800 border-gray-200",
};

const ROUTE_ICONS: Record<string, string> = {
  "Recycler": "♻️",
  "E-Waste Facility": "🔌",
  "Treatment Facility": "⚠️",
  "Compost": "🌱",
  "Landfill": "🗑️",
};

export function WasteScanner({ lang }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Basic language map for TTS
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langMap[lang] || 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredItems = wasteCatalog.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.name_en.toLowerCase().includes(search) ||
      item.name_hi.includes(search) ||
      item.name_mr.includes(search)
    );
  });

  if (selectedItem) {
    const itemName = selectedItem[`name_${lang}`] || selectedItem.name_en;
    const itemAdvice = selectedItem[`advice_${lang}`] || selectedItem.advice_en;
    const itemWarning = selectedItem[`safety_warning_${lang}`] || selectedItem.safety_warning_en;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{itemName}</h2>
            <p className="text-sm text-gray-500 mt-1">{selectedItem.sub_category}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[selectedItem.category]}`}>
            {selectedItem.category}
          </span>
        </div>

        <div className="space-y-6 mt-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl">{ROUTE_ICONS[selectedItem.disposal_route] || "🗑️"}</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Disposal Route</p>
              <p className="font-medium text-gray-900">{selectedItem.disposal_route}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 text-blue-900 rounded-lg">
            <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-80">Estimated Value</p>
            <p className="font-bold text-xl">
              {selectedItem.estimated_value_per_kg > 0 
                ? `₹${selectedItem.estimated_value_per_kg} / kg` 
                : "No resale value"}
            </p>
          </div>

          <div className="relative">
            <p className="text-gray-700 font-medium">{itemAdvice}</p>
            {itemWarning && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg flex gap-2">
                <span>⚠️</span>
                <span className="text-sm font-medium">{itemWarning}</span>
              </div>
            )}
            <button 
              onClick={() => handleSpeak(`${itemName}. ${itemAdvice}. ${itemWarning ? itemWarning : ''}`)}
              className="mt-4 flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              aria-label="Listen to advice"
            >
              🔊 Listen
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push(`/citizen/book?material=${encodeURIComponent(selectedItem.sub_category)}`)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors text-center"
          >
            Book Pickup
          </button>
          <button
            onClick={() => setSelectedItem(null)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm text-gray-900"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-h-[60vh] overflow-y-auto">
        {filteredItems.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredItems.map((item) => {
              const name = item[`name_${lang}`] || item.name_en;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">{name}</p>
                      <p className="text-xs text-gray-500">{item.sub_category}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${CATEGORY_COLORS[item.category]} border-none bg-opacity-50`}>
                      {item.category}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No items found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
