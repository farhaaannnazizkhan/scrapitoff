import { prisma } from './client';
import { LotStatus } from '@prisma/client';

export async function createLot(data: { pickup_request_id: string; collector_id: string; material_category: string; weight_kg: number; quoted_price: number }) {
  return await prisma.lot.create({
    data: {
      ...data,
      status: 'CREATED',
    },
  });
}

export async function getLotById(id: string) {
  return await prisma.lot.findUnique({
    where: { id },
  });
}

export async function getLotsByCollector(collectorId: string) {
  return await prisma.lot.findMany({
    where: { collector_id: collectorId },
  });
}

export async function updateLotStatus(id: string, status: "CREATED" | "IN_TRANSIT" | "DELIVERED" | "VERIFIED") {
  return await prisma.lot.update({
    where: { id },
    data: { status },
  });
}
