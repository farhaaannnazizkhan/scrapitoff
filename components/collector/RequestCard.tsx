"use client";

import React from 'react';
import { AcceptButton } from './AcceptButton';

interface RequestCardProps {
  request: any; // Using any or a complex intersection type to handle the included citizen
  collectorId: string;
}

export function RequestCard({ request, collectorId }: RequestCardProps) {
  const isAccepted = request.status === 'ACCEPTED';

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-5 flex flex-col gap-4 relative overflow-hidden transition-all ${isAccepted ? 'border-amber-500' : 'border-amber-400'}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-xs text-gray-500 block mb-1">ID: {request.id.split('-')[0]}</span>
          <h3 className="font-bold text-gray-900 text-xl">{request.material_category}</h3>
        </div>
        {isAccepted && (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
            ACCEPTED
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">⚖️</span>
          <span className="font-medium">{request.rough_size}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">📍</span>
          <span className="font-medium">{request.citizen?.area || 'Area not provided'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🕒</span>
          <span className="font-medium">{request.time_slot}</span>
        </div>
      </div>

      {!isAccepted && (
        <div className="mt-2 pt-4 border-t border-gray-100">
          <AcceptButton requestId={request.id} collectorId={collectorId} />
        </div>
      )}
      
      {isAccepted && (
        <div className="mt-2 pt-4 border-t border-gray-100">
          <a
            href={`/collector/lot/${request.id}`}
            className="block w-full text-center h-12 leading-10 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Enter Weight
          </a>
        </div>
      )}
    </div>
  );
}
