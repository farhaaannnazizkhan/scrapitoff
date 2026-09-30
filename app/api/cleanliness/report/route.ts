import { NextResponse } from 'next/server';
import { createReport, getAllReports } from '@/lib/db/cleanlinessReports';
import { getFirstCitizen } from '@/lib/db/users';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { category, severity, description, area } = data;

    if (!category || !severity || !description || !area || description.length < 10) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const citizen = await getFirstCitizen();
    if (!citizen) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
    }

    const report = await createReport({ ...data, citizen_id: citizen.id });
    return NextResponse.json({ success: true, id: report.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await getAllReports();
    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
