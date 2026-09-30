"use client";

import React, { useState } from 'react';

export function VerifyResult({ result }: { result: any }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.blockchain.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="font-bold text-gray-900">Verification Result</h3>
        {result.verified && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span>✓</span> Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-gray-500">Lot ID</div>
        <div className="font-mono text-xs text-gray-800 break-all">{result.lot.id}</div>
        
        <div className="text-gray-500">Material</div>
        <div className="font-medium text-gray-900">{result.lot.material_category}</div>
        
        <div className="text-gray-500">Weight</div>
        <div className="font-medium text-gray-900">{result.lot.weight_kg} kg</div>
        
        <div className="text-gray-500">Price</div>
        <div className="font-medium text-gray-900">₹{result.lot.final_price || 'N/A'}</div>

        <div className="text-gray-500">Collector</div>
        <div className="font-medium text-gray-900">{result.collector.name}</div>
        
        <div className="text-gray-500">Recycler</div>
        <div className="font-medium text-gray-900">{result.recycler ? result.recycler.name : 'Pending'}</div>
        
        <div className="text-gray-500">Timestamp</div>
        <div className="font-medium text-gray-900">{new Date(result.blockchain.timestamp).toLocaleString()}</div>
      </div>

      <div className="bg-gray-50 rounded p-3 border border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Blockchain Hash</span>
          <button 
            onClick={handleCopy}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="font-mono text-xs text-purple-700 break-all">
          {result.blockchain.hash}
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 font-medium italic mt-2">
        This record is immutable and matches the on-chain hash.
      </p>
    </div>
  );
}
