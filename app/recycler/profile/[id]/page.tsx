import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/db/users';
import { computeHygieneScore } from '@/lib/ai/hygieneScore';
import { HygienePanel } from '@/components/shared/HygienePanel';

export const dynamic = 'force-dynamic';

export default async function RecyclerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const recycler = await getUserById(id);
  if (!recycler || recycler.role !== 'RECYCLER') {
    notFound();
  }

  const placeholderStats = {
    total_handovers: 10,
    safety_cards_completed: 5,
    complaints: 0,
    verification_count: 2
  };
  
  const scores = computeHygieneScore(recycler, placeholderStats);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-12 animate-in fade-in duration-500">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{recycler.name}</h1>
        <span className="ml-4 bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded border border-green-200">
          Authorized Facility
        </span>
      </header>

      <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-2 text-gray-700">
          <p className="flex gap-2"><span>📍</span> <strong>Location:</strong> {recycler.area}</p>
          <p className="flex gap-2"><span>📞</span> <strong>Phone:</strong> {recycler.phone}</p>
          <p className="flex gap-2"><span>⭐</span> <strong>Rating:</strong> {recycler.rating || '4.5'} ({recycler.total_deals || 0} deals)</p>
        </div>
      </div>

      <HygienePanel scores={scores} />

      <div className="mt-8">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <span className="bg-amber-400 w-2 h-6 rounded-full inline-block"></span>
          Public Reviews
        </h3>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500 italic">
          No public reviews yet.
        </div>
      </div>
    </div>
  );
}
