import React from 'react';
import Link from 'next/link';
import { getFirstCitizen } from '@/lib/db/users';
import { prisma } from '@/lib/db/client';
import { computeImpact } from '@/lib/ai/impact';

export const dynamic = 'force-dynamic';

export default async function ImpactPage() {
  const citizen = await getFirstCitizen();
  if (!citizen) {
    return <div className="p-8 text-center text-red-500">No citizen found.</div>;
  }

  const lots = await prisma.lot.findMany({
    where: {
      pickup_request: {
        citizen_id: citizen.id
      },
      status: 'VERIFIED'
    },
    include: {
      pickup_request: true
    }
  });

  const impact = computeImpact(lots);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <Link href="/citizen" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Impact</h1>
      </header>

      <div className="bg-green-600 text-white rounded-xl p-8 text-center shadow-lg">
        <p className="text-green-100 uppercase tracking-widest text-sm font-semibold mb-2">Total Waste Diverted</p>
        <p className="text-6xl font-extrabold">{impact.total_kg.toFixed(1)} <span className="text-2xl font-medium">kg</span></p>
        <p className="mt-4 text-green-50 font-medium">Every kg you recycle keeps it out of a landfill.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-2xl mb-1">♻️</div>
          <p className="text-2xl font-bold text-gray-900">{impact.recycled_kg.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Recycled (kg)</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-2xl mb-1">📦</div>
          <p className="text-2xl font-bold text-gray-900">{impact.reused_kg.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Reused (kg)</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-2xl mb-1">⚠️</div>
          <p className="text-2xl font-bold text-gray-900">{impact.safely_disposed_kg.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Safe Disposal (kg)</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-2xl mb-1">☁️</div>
          <p className="text-2xl font-bold text-green-600">{impact.co2_avoided_kg.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">CO₂ Avoided (kg)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-lg font-bold text-gray-900">Green Score</h2>
          <span className="text-2xl font-extrabold text-green-600">{impact.green_score}<span className="text-sm text-gray-400 font-medium">/100</span></span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
          <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${impact.green_score}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 text-right">Based on your total contribution.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Earned Badges</h2>
        {impact.badges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {impact.badges.map(b => (
              <span key={b} className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-4 py-2 rounded-full text-sm shadow-sm transition-transform hover:scale-105">
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Complete pickups to earn badges!</p>
        )}
      </div>
    </div>
  );
}
