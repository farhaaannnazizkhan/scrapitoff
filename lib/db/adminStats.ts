import { prisma } from './client';

export async function getPlatformStats() {
  const lots = await prisma.lot.findMany();
  let total_weight_kg = 0;
  let total_value = 0;
  
  for (const lot of lots) {
    total_weight_kg += Number(lot.weight_kg) || 0;
    total_value += Number(lot.final_price) || 0;
  }
  
  const total_collectors = await prisma.user.count({ where: { role: 'COLLECTOR' } });
  const total_recyclers = await prisma.user.count({ where: { role: 'RECYCLER' } });
  const total_citizens = await prisma.user.count({ where: { role: 'CITIZEN' } });
  
  const earnings = await prisma.earningsLedger.findMany();
  let pending_earnings = 0;
  let completed_payments = 0;
  for (const e of earnings) {
    if (e.payment_status === 'PENDING') pending_earnings += Number(e.amount);
    if (e.payment_status === 'COMPLETED') completed_payments += Number(e.amount);
  }

  return {
    total_lots: lots.length,
    total_weight_kg,
    total_value,
    total_collectors,
    total_recyclers,
    total_citizens,
    pending_earnings,
    completed_payments
  };
}

export async function getHotspotData() {
  const requests = await prisma.pickupRequest.findMany();
  const counts: Record<string, number> = {};
  
  for (const req of requests) {
    const area = req.address || 'Unknown';
    counts[area] = (counts[area] || 0) + 1;
  }
  
  return Object.entries(counts).map(([area, count]) => ({ area, count })).sort((a, b) => b.count - a.count);
}
