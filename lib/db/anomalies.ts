import { prisma } from './client';

export async function getAnomalies() {
  const lots = await prisma.lot.findMany({
    include: {
      collector: true,
      pickup_request: true
    },
    take: 100
  });

  const anomalies = [];
  
  for (const lot of lots) {
    const final = Number(lot.final_price) || 0;
    const quoted = Number(lot.quoted_price) || 0;
    const weight = Number(lot.weight_kg) || 0;
    
    if (final < 0.7 * quoted || weight > 100) {
      anomalies.push(lot);
    }
    
    if (anomalies.length >= 20) break;
  }
  
  return anomalies;
}
