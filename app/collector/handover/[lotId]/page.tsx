import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLotWithDetails } from '@/lib/db/lots';
import { getUserById } from '@/lib/db/users';
import { HandoverConfirm } from '@/components/collector/HandoverConfirm';

export const dynamic = 'force-dynamic';

export default async function HandoverPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lotId: string }>,
  searchParams: Promise<{ recyclerId?: string }>
}) {
  const { lotId } = await params;
  const resolvedSearchParams = await searchParams;
  const recyclerId = resolvedSearchParams.recyclerId;
  
  if (!recyclerId) {
    notFound();
  }

  const lot = await getLotWithDetails(lotId);
  if (!lot) {
    notFound();
  }

  const recycler = await getUserById(recyclerId);
  if (!recycler || recycler.role !== 'RECYCLER') {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 sm:mt-8 min-h-screen sm:min-h-0 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <Link href={`/collector/recycler/${lotId}`} className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Confirm Handover</h1>
      </header>

      <HandoverConfirm lotId={lotId} recyclerId={recyclerId} recyclerName={recycler.name} />
    </div>
  );
}
