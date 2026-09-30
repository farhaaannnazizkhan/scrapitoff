import { NextResponse } from 'next/server';
import { assignCollectorToPickup } from '@/lib/db/pickupRequests';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { requestId, collectorId } = data;

    if (!requestId || !collectorId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Basic UUID validation check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(collectorId)) {
      return NextResponse.json({ success: false, error: 'Invalid collector ID format' }, { status: 400 });
    }

    await assignCollectorToPickup(requestId, collectorId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
