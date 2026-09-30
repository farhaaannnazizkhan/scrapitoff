import React from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { getDemoRole } from '@/lib/auth/demoRole';

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentRole = await getDemoRole();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 sm:p-6 lg:p-8">
        <AppHeader currentRole={currentRole} />
        {children}
      </div>
    </div>
  );
}
