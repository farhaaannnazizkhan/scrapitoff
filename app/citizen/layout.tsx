import React from 'react';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
