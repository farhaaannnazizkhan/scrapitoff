"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function HandoverConfirm({ lotId, recyclerId, recyclerName }: { lotId: string, recyclerId: string, recyclerName: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState('');

  useEffect(() => {
    // Generate a 4-digit demo OTP
    setDemoOtp(Math.floor(1000 + Math.random() * 9000).toString());
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/collector/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId, recyclerId, otp }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        router.push(`/collector/handover/success/${lotId}`);
      } else {
        setError(result.error || "Handover failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConfirm} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 text-center">Confirm Handover to {recyclerName}</h2>
      
      {error && <div className="text-red-700 bg-red-100 p-3 rounded-md font-medium text-center">{error}</div>}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800 text-sm font-medium mb-2">Show this Demo OTP to the Recycler</p>
        <p className="text-3xl font-bold text-blue-900 tracking-widest">{demoOtp}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Recycler Confirmation Code</label>
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} 
          placeholder="Enter 4-digit code"
          required 
          maxLength={4}
          className="w-full h-14 px-4 border border-gray-300 rounded-lg text-center text-xl tracking-widest focus:ring-green-500 focus:border-green-500" 
        />
        <p className="text-xs text-gray-500 text-center mt-2">For demo purposes, any 4 digits will work.</p>
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 4}
        className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-lg"
      >
        {loading ? "Confirming..." : "Confirm Handover"}
      </button>
    </form>
  );
}
