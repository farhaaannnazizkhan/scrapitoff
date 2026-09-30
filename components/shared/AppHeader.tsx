import React from 'react';
import Link from 'next/link';
import { RoleSwitcher } from './RoleSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DemoRole } from '@/lib/auth/demoRole';
import { Language } from '@/lib/i18n/getLanguage';

import { translations } from '@/lib/i18n/translations';

export function AppHeader({ currentRole, currentLang }: { currentRole: DemoRole, currentLang: Language }) {
  const t = translations[currentLang];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-6 border-b border-gray-200">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">♻️</span>
        <span className="text-xl font-extrabold text-green-700 tracking-tight">ScrapItOff</span>
      </Link>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/citizen/scan" className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors border border-green-200">
          {t.scan_waste || 'Scan'}
        </Link>
        <Link href="/verify" className="px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors border border-purple-200">
          {t.verify_lot || 'Verify Lot'}
        </Link>
        <Link href="/citizen/impact" className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors border border-blue-200">
          Impact
        </Link>
        <LanguageSwitcher currentLang={currentLang} />
        <RoleSwitcher currentRole={currentRole} />
      </div>
    </header>
  );
}
