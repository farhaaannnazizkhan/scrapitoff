import React from 'react';
import Link from 'next/link';
import { getLotWithDetails } from '@/lib/db/lots';
import { getBlockchainRecordByLotId } from '@/lib/db/blockchain';
import { shortenHash } from '@/lib/blockchain/hash';
import { CopyButton } from '@/components/shared/CopyButton';

export const dynamic = 'force-dynamic';

export default async function HandoverSuccessPage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;
  
  const lot = await getLotWithDetails(lotId);
  const blockchainRecord = await getBlockchainRecordByLotId(lotId);

  if (!lot || !blockchainRecord) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Details not found</h2>
        <Link href="/collector" className="text-green-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm text-center animate-in zoom-in-95 duration-500">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Handover Confirmed</h1>

      <div className="bg-gray-50 p-4 rounded-md inline-block border border-gray-200 mb-6 w-full text-left">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Lot ID</p>
        <p className="font-mono text-sm font-medium text-gray-800 break-all mb-4">{lot.id}</p>
        
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Recycler Facility</p>
        <p className="font-bold text-gray-900">{lot.recycler?.name || 'Unknown Recycler'}</p>
      </div>

      <div className="mb-6 border border-purple-200 bg-purple-50 p-4 rounded-lg flex flex-col items-center">
        <span className="inline-block rounded-full bg-purple-100 text-purple-700 text-sm px-3 py-1 font-bold mb-3 border border-purple-200">
          Blockchain Verified
        </span>
        <div className="flex items-center justify-between w-full bg-white p-2 rounded text-sm border border-purple-100">
          <span className="font-mono text-gray-600 truncate">{shortenHash(blockchainRecord.hash)}</span>
          <CopyButton text={blockchainRecord.hash} />
        </div>
      </div>

      <div className="mb-8 border border-amber-200 bg-amber-50 p-4 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">PENDING</span>
          <span className="font-bold text-gray-900">₹{lot.final_price || lot.quoted_price}</span>
        </div>
        <p className="text-sm text-amber-800 font-medium">
          Payment pending — will be released by recycler.
        </p>
      </div>

      <Link 
        href="/collector"
        className="block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg flex items-center justify-center transition-colors shadow-sm"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
