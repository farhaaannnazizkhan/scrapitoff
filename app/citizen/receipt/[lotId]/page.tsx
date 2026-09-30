import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReceiptPage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-10 text-center animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt</h1>
      <p className="text-gray-500 text-sm mb-6 font-mono">Lot ID: {lotId}</p>
      
      <div className="bg-green-50 text-green-800 p-4 rounded-lg font-medium border border-green-200 mb-8">
        Your waste has been successfully processed!
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <Link 
          href="/citizen/impact" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-lg hover:underline transition-all"
        >
          View my impact →
        </Link>
      </div>
    </div>
  );
}
