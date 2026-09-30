import React from 'react';
import Link from 'next/link';
import { getPickupRequestById } from '@/lib/db/pickupRequests';
import { getMaterialByCategory } from '@/lib/db/materials';
import { getFirstCollector } from '@/lib/db/users';
import { WeightForm } from '@/components/collector/WeightForm';

export const dynamic = 'force-dynamic';

export default async function EnterWeightPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  const request = await getPickupRequestById(requestId);
  const collector = await getFirstCollector();
  
  const material = request ? await getMaterialByCategory(request.material_category) : null;

  if (!request || !material || !collector) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Request or Material Not Found</h2>
        <Link href="/collector" className="text-green-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white min-h-screen sm:min-h-0 sm:mt-12 sm:rounded-xl sm:shadow-sm">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <Link href="/collector" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Enter Weight</h1>
      </header>

      <WeightForm request={request} material={material} collectorId={collector.id} />
    </div>
  );
}
