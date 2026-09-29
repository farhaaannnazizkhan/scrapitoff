import { prisma } from './client';

export async function createPickupRequest(data: {
  citizen_id: string;
  material_category: string;
  rough_size: string;
  address: string;
  time_slot: string;
}) {
  return await prisma.pickupRequest.create({
    data: {
      ...data,
      status: 'PENDING',
    },
  });
}

export async function getPickupRequestById(id: string) {
  return await prisma.pickupRequest.findUnique({
    where: { id },
    include: { citizen: true },
  });
}

export async function getPickupRequestsByCitizen(citizenId: string) {
  return await prisma.pickupRequest.findMany({
    where: { citizen_id: citizenId },
    orderBy: { created_at: 'desc' },
    include: { citizen: true },
  });
}

export async function getPendingPickups() {
  return await prisma.pickupRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { created_at: 'asc' },
    include: { citizen: true },
  });
}

export async function getPickupsByCollector(collectorId: string) {
  return await prisma.pickupRequest.findMany({
    where: { 
      status: 'ACCEPTED',
      assigned_collector_id: collectorId 
    },
    orderBy: { created_at: 'desc' },
    include: { citizen: true },
  });
}

export async function assignCollectorToPickup(requestId: string, collectorId: string) {
  return await prisma.pickupRequest.update({
    where: { id: requestId },
    data: {
      status: 'ACCEPTED',
      assigned_collector_id: collectorId,
    }
  });
}

export async function markPickupCompleted(requestId: string) {
  return await prisma.pickupRequest.update({
    where: { id: requestId },
    data: { status: 'COMPLETED' },
  });
}
