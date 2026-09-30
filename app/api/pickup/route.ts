import { NextResponse } from 'next/server';
import { createPickupRequest } from '@/lib/db/pickupRequests';
import { prisma } from '@/lib/db/client';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { material_category, rough_size, address, time_slot } = data;

    if (!material_category || !rough_size || !address || !time_slot) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (address.length < 10) {
      return NextResponse.json({ success: false, error: 'Address must be at least 10 characters' }, { status: 400 });
    }

    // Get the first citizen since auth is not implemented and '1' is not a valid UUID for our schema
    const firstCitizen = await prisma.user.findFirst({ where: { role: 'CITIZEN' } });
    if (!firstCitizen) {
       return NextResponse.json({ success: false, error: 'No citizen found in the database. Please seed the DB.' }, { status: 400 });
    }

    const newRequest = await createPickupRequest({
      citizen_id: firstCitizen.id,
      material_category,
      rough_size,
      address,
      time_slot,
    });

    return NextResponse.json({ success: true, id: newRequest.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
