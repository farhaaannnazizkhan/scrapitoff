"use client";

import React from 'react';
import { safetyTips } from '@/lib/data/safetyTips';
import { translations } from '@/lib/i18n/translations';
import { Language } from '@/lib/i18n/getLanguage';

export function SafetyCard({ materialCategory, lang }: { materialCategory: string, lang: Language }) {
  const tipObj = safetyTips[materialCategory] || safetyTips["default"];
  const text = tipObj[lang];
  const t = translations[lang];

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">⚠️</span>
          <h3 className="font-bold text-amber-900">{t.safety_tips}</h3>
        </div>
        <button 
          onClick={handleListen}
          className="text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Listen"
        >
          <span>🔊</span> Listen
        </button>
      </div>
      <p className="mt-2 text-amber-800 text-sm font-medium">{text}</p>
    </div>
  );
}
