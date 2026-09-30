import React from 'react';
import Link from 'next/link';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { CleanlinessForm } from '@/components/citizen/CleanlinessForm';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
  const lang = await getLanguage();

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 pb-12 bg-gray-50 min-h-screen">
      <header className="flex items-center pb-4 mb-2 border-b border-gray-200">
        <Link href="/citizen" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Report a Cleanliness Issue</h1>
      </header>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <CleanlinessForm />
      </div>
    </div>
  );
}
