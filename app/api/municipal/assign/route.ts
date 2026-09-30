import { NextResponse } from 'next/server';
import { assignReport } from '@/lib/db/cleanlinessReports';

export async function POST(req: Request) {
  try {
    const { reportId, assignedTo } = await req.json();

    if (!reportId) {
      return NextResponse.json({ success: false, error: 'Missing reportId' }, { status: 400 });
    }

    await assignReport(reportId, assignedTo || null);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
