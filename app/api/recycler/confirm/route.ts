import { NextResponse } from 'next/server';
import { getLotById, transitionLotStatus } from '@/lib/db/lots';
import { updateEarningsPaymentStatus } from '@/lib/db/earnings';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { lotId } = data;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!lotId || !uuidRegex.test(lotId)) {
      return NextResponse.json({ success: false, error: 'Invalid Lot ID' }, { status: 400 });
    }

    const lot = await getLotById(lotId);
    if (!lot) {
      return NextResponse.json({ success: false, error: 'Lot not found' }, { status: 404 });
    }

    if (lot.status !== 'DELIVERED') {
      return NextResponse.json({ success: false, error: 'Lot is not in DELIVERED status' }, { status: 400 });
    }

    await transitionLotStatus(lotId, "VERIFIED");
    await updateEarningsPaymentStatus(lotId, "COMPLETED");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
