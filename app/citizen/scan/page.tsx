import React from 'react';
import Link from 'next/link';
import { WasteScanner } from '@/components/citizen/WasteScanner';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';

export const dynamic = 'force-dynamic';

export default async function ScanPage() {
  const lang = await getLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <Link 
          href="/citizen" 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Back to Citizen Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Scan Waste</h1>
      </header>

      <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
        <p className="text-green-800 text-sm font-medium flex items-center gap-2">
          <span>ℹ️</span> Not sure what to do with your waste? Search our catalog for disposal advice.
        </p>
      </div>

      <WasteScanner lang={lang} />
    </div>
  );
}
