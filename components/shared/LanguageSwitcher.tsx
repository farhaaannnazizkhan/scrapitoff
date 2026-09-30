"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Language } from '@/lib/i18n/getLanguage';

export function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const switchLang = async (lang: Language) => {
    if (lang === currentLang) return;
    setLoading(true);

    try {
      await fetch('/api/i18n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = (lang: Language) => 
    `px-3 py-1 text-sm font-medium rounded transition-colors ${
      currentLang === lang 
        ? 'bg-green-50 text-green-700' 
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1 w-fit">
      <button 
        disabled={loading} 
        onClick={() => switchLang('en')} 
        className={btnClass('en')}
        aria-label="English"
      >
        EN
      </button>
      <button 
        disabled={loading} 
        onClick={() => switchLang('hi')} 
        className={btnClass('hi')}
        aria-label="Hindi"
      >
        हिं
      </button>
      <button 
        disabled={loading} 
        onClick={() => switchLang('mr')} 
        className={btnClass('mr')}
        aria-label="Marathi"
      >
        मर
      </button>
    </div>
  );
}
