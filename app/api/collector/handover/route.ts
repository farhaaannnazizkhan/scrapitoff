import { NextResponse } from 'next/server';
import { updateLotWithRecycler, transitionLotStatus, getLotById } from '@/lib/db/lots';
import { generateLotHash } from '@/lib/blockchain/hash';
import { createHandoverRecord } from '@/lib/db/blockchain';
import { createEarningsLedger } from '@/lib/db/earnings';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { lotId, recyclerId, otp } = data;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(lotId) || !uuidRegex.test(recyclerId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    if (!otp || otp.length !== 4) {
      return NextResponse.json({ success: false, error: 'OTP must be 4 digits' }, { status: 400 });
    }

    const lot = await getLotById(lotId);
    if (!lot) {
      return NextResponse.json({ success: false, error: 'Lot not found' }, { status: 404 });
    }

    await updateLotWithRecycler(lotId, recyclerId);
    await transitionLotStatus(lotId, "DELIVERED");

    const hash = generateLotHash(lotId, recyclerId, Date.now(), new Date().toISOString());
    await createHandoverRecord(lotId, hash);

    const price = lot.final_price || lot.quoted_price || 0;
    await createEarningsLedger(lotId, lot.collector_id, price, "PENDING", "cash");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
