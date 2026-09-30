import React from 'react';
import VerifyForm from './VerifyForm';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';

export const dynamic = 'force-dynamic';

export default async function VerifyPage() {
  const lang = await getLanguage();
  const t = translations[lang];

  return <VerifyForm translations={t} />;
}
