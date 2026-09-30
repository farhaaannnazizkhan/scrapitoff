import React from 'react';
import Link from 'next/link';
import { RoleSwitcher } from './RoleSwitcher';
import { DemoRole } from '@/lib/auth/demoRole';

export function AppHeader({ currentRole }: { currentRole: DemoRole }) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-6 border-b border-gray-200">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">♻️</span>
        <span className="text-xl font-extrabold text-green-700 tracking-tight">ScrapItOff</span>
      </Link>
      
      <RoleSwitcher currentRole={currentRole} />
    </header>
  );
}
