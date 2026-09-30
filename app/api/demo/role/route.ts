import { NextResponse } from 'next/server';
import { setDemoRole, DemoRole } from '@/lib/auth/demoRole';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const role = data.role as DemoRole;

    if (!["citizen", "collector", "recycler"].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    await setDemoRole(role);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
