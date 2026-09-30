import { NextResponse } from 'next/server';
import { setLanguage, Language } from '@/lib/i18n/getLanguage';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lang = data.lang as Language;

    if (!["en", "hi", "mr"].includes(lang)) {
      return NextResponse.json({ success: false, error: 'Invalid language' }, { status: 400 });
    }

    await setLanguage(lang);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
