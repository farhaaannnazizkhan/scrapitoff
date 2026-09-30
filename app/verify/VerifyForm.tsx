"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { VerifyResult } from '@/components/shared/VerifyResult';

export default function VerifyForm({ translations }: { translations: any }) {
  const [lotId, setLotId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotId.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch(`/api/verify?lotId=${encodeURIComponent(lotId.trim())}`);
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to verify lot.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white min-h-screen sm:min-h-0 sm:mt-12 sm:rounded-xl sm:shadow-sm">
      <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
        <Link href="/" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{translations.verify_lot}</h1>
      </header>

      <form onSubmit={handleVerify} className="space-y-4 mb-8">
        <div>
          <label htmlFor="lotId" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Lot ID
          </label>
          <input
            id="lotId"
            type="text"
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !lotId.trim()}
          className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
          <p className="font-bold">Verification Failed</p>
          <p>{error}</p>
        </div>
      )}

      <VerifyResult result={result} />
    </div>
  );
}
