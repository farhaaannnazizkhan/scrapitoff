import React from 'react';
import Link from 'next/link';
import { getAllMaterials } from '../../../lib/db/materials';
import { PickupForm } from '../../../components/citizen/PickupForm';

export const dynamic = 'force-dynamic';

export default async function BookPickupPage() {
  const materials = await getAllMaterials();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      <header className="flex items-center pb-4 border-b border-gray-200">
        <Link href="/citizen" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Book a Pickup</h1>
      </header>

      <PickupForm materials={materials} />
    </div>
  );
}
