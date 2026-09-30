import { prisma } from './client';

export async function createEarningsLedger(lotId: string, collectorId: string, amount: number, payment_status: "PENDING" | "COMPLETED" | "FAILED", payment_mode: string) {
  return await prisma.earningsLedger.create({
    data: {
      lot_id: lotId,
      collector_id: collectorId,
      amount,
      payment_status,
      payment_mode,
      date: new Date(),
    },
  });
}

export async function updateEarningsPaymentStatus(lotId: string, status: "PENDING" | "COMPLETED" | "FAILED") {
  return await prisma.earningsLedger.updateMany({
    where: { lot_id: lotId },
    data: { payment_status: status },
  });
}
