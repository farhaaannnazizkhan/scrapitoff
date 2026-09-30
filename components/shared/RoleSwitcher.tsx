"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoRole } from '@/lib/auth/demoRole';

export function RoleSwitcher({ currentRole }: { currentRole: DemoRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const switchRole = async (role: DemoRole) => {
    if (role === currentRole) return;
    setLoading(true);

    try {
      await fetch('/api/demo/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      
      router.refresh();
      router.push(`/${role}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = (role: DemoRole) => 
    `px-3 py-1 text-xs font-bold rounded-full transition-colors ${
      currentRole === role 
        ? 'bg-green-600 text-white shadow-sm' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm relative z-50">
      <button 
        disabled={loading} 
        onClick={() => switchRole('citizen')} 
        className={btnClass('citizen')}
      >
        Citizen
      </button>
      <button 
        disabled={loading} 
        onClick={() => switchRole('collector')} 
        className={btnClass('collector')}
      >
        Collector
      </button>
      <button 
        disabled={loading} 
        onClick={() => switchRole('recycler')} 
        className={btnClass('recycler')}
      >
        Recycler
      </button>
    </div>
  );
}
