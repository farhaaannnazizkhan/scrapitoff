import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLotWithDetails } from '@/lib/db/lots';
import { getAllRecyclers } from '@/lib/db/users';
import { rankRecyclers } from '@/lib/ai/matching';
import { RecyclerCard } from '@/components/collector/RecyclerCard';

export const dynamic = 'force-dynamic';

export default async function SelectRecyclerPage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;
  
  const lot = await getLotWithDetails(lotId);
  if (!lot) {
    notFound();
  }

  const recyclers = await getAllRecyclers();
  const ranked = rankRecyclers(lot, recyclers);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-12 animate-in fade-in duration-500">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <Link href="/collector" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Select Recycler</h1>
      </header>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Lot Summary</h2>
        <div className="flex flex-wrap gap-4 text-sm md:text-base">
          <div className="flex-1 min-w-[120px]">
            <span className="text-gray-500 block mb-1 text-xs">ID</span>
            <span className="font-mono font-medium text-gray-900">{lot.id.substring(0,8)}...</span>
          </div>
          <div className="flex-1 min-w-[120px]">
            <span className="text-gray-500 block mb-1 text-xs">Material</span>
            <span className="font-bold text-gray-900">{lot.material_category}</span>
          </div>
          <div className="flex-1 min-w-[120px]">
            <span className="text-gray-500 block mb-1 text-xs">Weight</span>
            <span className="font-bold text-gray-900">{lot.weight_kg} kg</span>
          </div>
          <div className="flex-1 min-w-[120px]">
            <span className="text-gray-500 block mb-1 text-xs">Fair Price</span>
            <span className="font-bold text-green-700">₹{lot.quoted_price}</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="bg-green-500 w-2 h-6 rounded-full inline-block"></span>
        Available Recyclers
      </h2>
      
      {ranked.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          No recyclers available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ranked.map(r => (
            <RecyclerCard key={r.id} recycler={r} lot={lot} score={r.matchScore} />
          ))}
        </div>
      )}
    </div>
  );
}
