import React from 'react';
import Link from 'next/link';
import { getPickupRequestById } from '@/lib/db/pickupRequests';

export const dynamic = 'force-dynamic';

export default async function PickupStatusPage({ params }: { params: { id: string } }) {
  const request = await getPickupRequestById(params.id);

  if (!request) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Request not found</h2>
        <Link href="/citizen" className="text-green-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900">Pickup Request Confirmed</h1>
      
      <div className="bg-gray-50 p-4 rounded-md inline-block border border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Request ID</p>
        <p className="font-mono text-sm font-medium text-gray-800">{request.id}</p>
      </div>

      <div>
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold tracking-wide">
          {request.status}
        </span>
      </div>

      <div className="text-left bg-gray-50 p-5 rounded-lg space-y-3 mt-6 border border-gray-100">
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-500 text-sm font-medium">Material</span>
          <span className="font-bold text-gray-900 text-sm">{request.material_category}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3 pt-1">
          <span className="text-gray-500 text-sm font-medium">Lot Size</span>
          <span className="font-bold text-gray-900 text-sm">{request.rough_size}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3 pt-1">
          <span className="text-gray-500 text-sm font-medium">Time Slot</span>
          <span className="font-bold text-gray-900 text-sm">{request.time_slot}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-gray-500 text-sm font-medium">Address</span>
          <span className="font-bold text-gray-900 text-sm text-right max-w-[60%] truncate" title={request.address}>{request.address}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-6 font-medium bg-blue-50 p-3 rounded-lg text-blue-800">
        A verified collector will be assigned shortly.
      </p>

      <div className="pt-4">
        <Link 
          href="/citizen"
          className="inline-block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg flex items-center justify-center transition-colors shadow-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
