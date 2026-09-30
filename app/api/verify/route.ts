import { NextResponse } from 'next/server';
import { getLotById } from '@/lib/db/lots';
import { getBlockchainRecordByLotId } from '@/lib/db/blockchain';
import { prisma } from '@/lib/db/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lotId = searchParams.get('lotId');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!lotId || !uuidRegex.test(lotId)) {
      return NextResponse.json({ success: false, error: 'Invalid Lot ID format' }, { status: 400 });
    }

    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
      include: {
        collector: true,
        recycler: true,
      },
    });
    if (!lot) {
      return NextResponse.json({ success: false, error: 'Lot not found' }, { status: 404 });
    }

    const blockchain = await getBlockchainRecordByLotId(lotId);
    if (!blockchain) {
      return NextResponse.json({ success: false, error: 'Blockchain record not found for this lot' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lot: {
        id: lot.id,
        material_category: lot.material_category,
        weight_kg: lot.weight_kg,
        final_price: lot.final_price,
        status: lot.status,
        created_at: lot.created_at,
      },
      blockchain: {
        hash: blockchain.hash,
        timestamp: blockchain.timestamp,
        transaction_type: blockchain.transaction_type,
      },
      collector: { name: lot.collector?.name ?? "Unknown" },
      recycler: lot.recycler ? { name: lot.recycler.name } : null,
      verified: true
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
