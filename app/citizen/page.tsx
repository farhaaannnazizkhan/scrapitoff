import React from 'react';
import Link from 'next/link';
import { getAllMaterials } from '@/lib/db/materials';
import { RateCard } from '@/components/citizen/RateCard';

export const dynamic = 'force-dynamic';

export default async function CitizenPage() {
  const materials = await getAllMaterials();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">ScrapItOff</h1>
          <p className="text-gray-500 mt-1 font-medium">Live scrap rates in your area</p>
        </div>
        
        <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1 w-fit">
          <button className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 rounded transition-colors" aria-label="English">EN</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors" aria-label="Hindi">हिं</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors" aria-label="Marathi">मर</button>
        </div>
      </header>

      <section>
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
          Book a Pickup
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Rates updated daily. Actual weight measured at pickup.
        </p>
      </div>
    </div>
  );
}
