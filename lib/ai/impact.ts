export function computeImpact(lots: any[], reportStats?: any) {
  let total_kg = 0;
  let recycled_kg = 0;
  let reused_kg = 0;
  let safely_disposed_kg = 0;

  for (const lot of lots) {
    const w = Number(lot.weight_kg) || 0;
    total_kg += w;
    const cat = lot.material_category || '';
    if (['Plastic', 'Paper', 'Metal', 'Glass', 'Cardboard'].some(c => cat.includes(c))) {
       recycled_kg += w;
    } else if (['E-Waste', 'Electronics'].some(c => cat.includes(c))) {
       reused_kg += w * 0.2;
       safely_disposed_kg += w * 0.8;
    } else {
       safely_disposed_kg += w;
    }
  }

  const co2_avoided_kg = total_kg * 1.5;
  const green_score = Math.min(100, Math.floor(total_kg));

  const badges: string[] = [];
  if (total_kg >= 1) badges.push("🥉 First Segregation");
  if (recycled_kg >= 10) badges.push("♻️ 10 kg Recycled");
  if (total_kg >= 50) badges.push("🌱 50 kg Diverted");
  if (green_score >= 80) badges.push("🏆 Responsible Disposer");
  if (reportStats && reportStats.total_reports >= 3 && reportStats.resolved >= 1) badges.push("🏛️ Civic Champion");

  return {
    total_kg,
    recycled_kg,
    reused_kg,
    safely_disposed_kg,
    co2_avoided_kg,
    green_score,
    badges
  };
}
