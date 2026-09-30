import { cookies } from 'next/headers';

export type Language = "en" | "hi" | "mr";

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('scrapitoff_lang')?.value;
  if (lang === 'hi' || lang === 'mr') {
    return lang;
  }
  return 'en';
}

export async function setLanguage(lang: Language): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('scrapitoff_lang', lang, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
