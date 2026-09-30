import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { role, userId } = await req.json();

    if (!["collector", "recycler"].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role for user selection' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set(`scrapitoff_demo_user_${role}`, userId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
