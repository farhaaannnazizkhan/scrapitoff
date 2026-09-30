import { prisma } from './client';

export async function getCollectorMonthlyStats(collectorId: string) {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const earningsThisMonth = await prisma.earningsLedger.findMany({
    where: {
      collector_id: collectorId,
      date: { gte: firstDayThisMonth }
    }
  });

  let this_month_earnings = 0;
  let pending_earnings = 0;
  
  for (const e of earningsThisMonth) {
    if (e.payment_status === 'COMPLETED') this_month_earnings += Number(e.amount);
    if (e.payment_status === 'PENDING') pending_earnings += Number(e.amount);
  }

  const earningsLastMonth = await prisma.earningsLedger.findMany({
    where: {
      collector_id: collectorId,
      date: { gte: firstDayLastMonth, lt: firstDayThisMonth },
      payment_status: 'COMPLETED'
    }
  });
  
  const last_month_earnings = earningsLastMonth.reduce((sum, e) => sum + Number(e.amount), 0);

  const lotsThisMonth = await prisma.lot.count({
    where: {
      collector_id: collectorId,
      created_at: { gte: firstDayThisMonth }
    }
  });

  const total_pickups_this_month = lotsThisMonth;
  const avg_per_pickup = total_pickups_this_month > 0 ? this_month_earnings / total_pickups_this_month : 0;

  return {
    this_month_earnings,
    pending_earnings,
    total_pickups_this_month,
    avg_per_pickup,
    last_month_earnings
  };
}

export async function getRecyclerMonthlyStats(recyclerId: string) {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const lotsThisMonth = await prisma.lot.findMany({
    where: {
      recycler_id: recyclerId,
      created_at: { gte: firstDayThisMonth },
      status: { in: ['DELIVERED', 'VERIFIED'] }
    },
    include: {
      earnings: true
    }
  });

  let this_month_kg = 0;
  let this_month_payments = 0;
  const supplierIds = new Set<string>();

  for (const lot of lotsThisMonth) {
    this_month_kg += Number(lot.weight_kg) || 0;
    if (lot.collector_id) supplierIds.add(lot.collector_id);
    
    for (const e of lot.earnings) {
      if (e.payment_status === 'COMPLETED') {
        this_month_payments += Number(e.amount);
      }
    }
  }

  const lotsLastMonth = await prisma.lot.findMany({
    where: {
      recycler_id: recyclerId,
      created_at: { gte: firstDayLastMonth, lt: firstDayThisMonth },
      status: { in: ['DELIVERED', 'VERIFIED'] }
    }
  });
  
  const last_month_kg = lotsLastMonth.reduce((sum, lot) => sum + (Number(lot.weight_kg) || 0), 0);

  return {
    this_month_kg,
    this_month_payments,
    active_suppliers: supplierIds.size,
    total_lots_received: lotsThisMonth.length,
    last_month_kg
  };
}

export async function getCitizenMonthlyStats(citizenId: string) {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const lotsThisMonth = await prisma.lot.findMany({
    where: {
      pickup_request: { citizen_id: citizenId },
      created_at: { gte: firstDayThisMonth },
      status: 'VERIFIED'
    }
  });

  let this_month_value_earned = 0;
  let total_kg_diverted = 0;

  for (const lot of lotsThisMonth) {
    this_month_value_earned += Number(lot.final_price) || 0;
    total_kg_diverted += Number(lot.weight_kg) || 0;
  }

  const lotsLastMonth = await prisma.lot.findMany({
    where: {
      pickup_request: { citizen_id: citizenId },
      created_at: { gte: firstDayLastMonth, lt: firstDayThisMonth },
      status: 'VERIFIED'
    }
  });
  
  const last_month_value = lotsLastMonth.reduce((sum, lot) => sum + (Number(lot.final_price) || 0), 0);

  return {
    this_month_value_earned,
    total_kg_diverted,
    total_pickups: lotsThisMonth.length,
    co2_avoided_kg: total_kg_diverted * 1.5,
    last_month_value
  };
}

export async function getPlatformMonthlyStats() {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lotsThisMonth = await prisma.lot.findMany({
    where: {
      created_at: { gte: firstDayThisMonth },
    }
  });

  let this_month_transaction_value = 0;
  let total_kg_processed = 0;
  
  for (const lot of lotsThisMonth) {
    if (lot.status === 'VERIFIED') {
      this_month_transaction_value += Number(lot.final_price) || 0;
      total_kg_processed += Number(lot.weight_kg) || 0;
    }
  }

  const active_collectors = await prisma.user.count({ where: { role: 'COLLECTOR' } });
  const active_recyclers = await prisma.user.count({ where: { role: 'RECYCLER' } });

  return {
    this_month_transaction_value,
    platform_revenue: this_month_transaction_value * 0.01,
    total_kg_processed,
    total_lots: lotsThisMonth.length,
    active_collectors,
    active_recyclers
  };
}
