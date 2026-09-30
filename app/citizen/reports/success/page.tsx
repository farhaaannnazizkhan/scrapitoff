import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ReportSuccessPage() {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 pb-12 flex flex-col items-center justify-center min-h-screen">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <span className="text-5xl">✅</span>
      </div>
      
      <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">Report Submitted</h1>
      
      <p className="text-center text-gray-500 font-medium">
        Your report has been sent to the municipal dashboard. You will be notified when the status changes.
      </p>

      <div className="w-full flex flex-col gap-3 mt-8">
        <Link href="/citizen/reports" className="w-full text-center py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors">
          View my reports
        </Link>
        <Link href="/citizen" className="w-full text-center py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
