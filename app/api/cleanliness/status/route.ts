import { NextResponse } from 'next/server';
import { updateReportStatus } from '@/lib/db/cleanlinessReports';
import { CleanlinessStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    await updateReportStatus(id, status as CleanlinessStatus);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
