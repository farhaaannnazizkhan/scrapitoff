import React from 'react';
import Link from 'next/link';
import { getAllMaterials } from '@/lib/db/materials';
import { RateCard } from '@/components/citizen/RateCard';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';

export const dynamic = 'force-dynamic';

export default async function CitizenPage() {
  const materials = await getAllMaterials();
  const lang = await getLanguage();
  const t = translations[lang];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">{t.app_name}</h1>
          <p className="text-gray-500 mt-1 font-medium">{t.tagline}</p>
        </div>
      </header>

      <section>
        <div className="mb-6">
          <Link 
            href="/citizen/scan"
            className="flex items-center justify-center w-full h-14 bg-green-100 hover:bg-green-200 text-green-800 font-bold rounded-lg transition-colors border border-green-300 shadow-sm"
          >
            🔍 What is this waste? Scan now
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <RateCard key={material.id} material={material} />
          ))}
        </div>
        {materials.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            No materials found. Please run the seed script.
          </div>
        )}
      </section>

      <div className="text-center mt-12 pt-8">
        <Link 
          href="/citizen/book"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto text-lg"
        >
          {t.book_pickup}
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Rates updated daily. Actual weight measured at pickup.
        </p>
      </div>
    </div>
  );
}
