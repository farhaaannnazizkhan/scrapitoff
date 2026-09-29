import { NextResponse } from 'next/server';
import { calculateFairPrice } from '../../../../lib/ai/pricing';
import { createLot } from '../../../../lib/db/lots';
import { generateLotHash } from '../../../../lib/blockchain/hash';
import { createBlockchainRecord } from '../../../../lib/db/blockchain';
import { markPickupCompleted } from '../../../../lib/db/pickupRequests';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { requestId, collectorId, materialCategory, weightKg, condition, baseRatePerKg } = data;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(requestId) || !uuidRegex.test(collectorId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    if (!weightKg || weightKg <= 0) {
      return NextResponse.json({ success: false, error: 'Weight must be > 0' }, { status: 400 });
    }

    if (!["Standard", "Mixed", "Clean"].includes(condition)) {
      return NextResponse.json({ success: false, error: 'Invalid condition' }, { status: 400 });
    }

    const { fairPrice } = calculateFairPrice(weightKg, condition, baseRatePerKg);

    const lot = await createLot({
      pickup_request_id: requestId,
      collector_id: collectorId,
      material_category: materialCategory,
      weight_kg: weightKg,
      quoted_price: fairPrice,
    });

    const timestamp = new Date().toISOString();
    const hash = generateLotHash(lot.id, collectorId, weightKg, timestamp);

    await createBlockchainRecord({
      lot_id: lot.id,
      hash,
      transaction_type: 'LOT_CREATED'
    });

    await markPickupCompleted(requestId);

    return NextResponse.json({ success: true, lotId: lot.id, hash });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
