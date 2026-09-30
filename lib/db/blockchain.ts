import { prisma } from './client';

export async function createBlockchainRecord(data: { lot_id: string; hash: string; transaction_type: string }) {
  return await prisma.blockchainRecord.create({
    data: {
      ...data,
      timestamp: new Date(),
    },
  });
}

export async function getBlockchainRecordByLotId(lotId: string) {
  return await prisma.blockchainRecord.findFirst({
    where: { lot_id: lotId },
  });
}

export async function createHandoverRecord(lotId: string, hash: string) {
  return await prisma.blockchainRecord.create({
    data: {
      lot_id: lotId,
      hash,
      transaction_type: 'HANDOVER_CONFIRMED',
      timestamp: new Date(),
    },
  });
}
