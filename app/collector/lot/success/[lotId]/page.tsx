import React from 'react';
import Link from 'next/link';
import { getLotById } from '@/lib/db/lots';
import { getBlockchainRecordByLotId } from '@/lib/db/blockchain';
import { shortenHash } from '@/lib/blockchain/hash';
import { CopyButton } from '@/components/shared/CopyButton';

export const dynamic = 'force-dynamic';

export default async function LotSuccessPage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;
  const lot = await getLotById(lotId);
  const blockchainRecord = await getBlockchainRecordByLotId(lotId);

  if (!lot || !blockchainRecord) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lot details not found</h2>
        <Link href="/collector" className="text-green-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm text-center animate-in zoom-in-95 duration-500">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lot Created Successfully</h1>

      <div className="bg-gray-50 p-4 rounded-md inline-block border border-gray-200 mb-6 w-full">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Lot ID</p>
        <p className="font-mono text-sm font-medium text-gray-800 break-all">{lot.id}</p>
      </div>

      <div className="text-left bg-gray-50 p-5 rounded-lg space-y-3 border border-gray-100 mb-6">
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-500 text-sm font-medium">Material</span>
          <span className="font-bold text-gray-900 text-sm">{lot.material_category}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3 pt-1">
          <span className="text-gray-500 text-sm font-medium">Weight</span>
          <span className="font-bold text-gray-900 text-sm">{lot.weight_kg} kg</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-gray-500 text-sm font-medium">Fair Price</span>
          <span className="font-bold text-gray-900 text-sm text-green-700">₹{lot.quoted_price}</span>
        </div>
      </div>

      <div className="mb-8 border border-purple-200 bg-purple-50 p-4 rounded-lg flex flex-col items-center">
        <span className="inline-block rounded-full bg-purple-100 text-purple-700 text-sm px-3 py-1 font-bold mb-3 border border-purple-200">
          Blockchain Verified
        </span>
        <div className="flex items-center justify-between w-full bg-white p-2 rounded text-sm border border-purple-100">
          <span className="font-mono text-gray-600 truncate">{shortenHash(blockchainRecord.hash)}</span>
          <CopyButton text={blockchainRecord.hash} />
        </div>
      </div>

      <div className="space-y-3">
        <Link 
          href={`/collector/recycler/${lot.id}`}
          className="block w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-sm"
        >
          Select Recycler
        </Link>
        <Link 
          href="/collector"
          className="block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg flex items-center justify-center transition-colors shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
