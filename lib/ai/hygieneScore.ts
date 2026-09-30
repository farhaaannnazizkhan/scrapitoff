export function computeHygieneScore(recycler: any, stats: { total_handovers: number, safety_cards_completed: number, complaints: number, verification_count: number }) {
  let cleanliness = 70;
  let segregation = 70;
  let hazard_handling = 70;
  let ppe_compliance = 70;

  cleanliness += Math.min(stats.total_handovers, 20) * 0.5;
  hazard_handling += Math.min(stats.safety_cards_completed, 10) * 2;
  cleanliness -= stats.complaints * 5;
  segregation += Math.min(stats.verification_count, 5) * 3;

  // Deterministic offset based on recycler ID hash
  let hash = 0;
  const idStr = String(recycler?.id || "default");
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
    hash = hash & hash;
  }
  const offset = Math.abs(hash) % 10;
  ppe_compliance += offset;

  const clamp = (val: number) => Math.max(0, Math.min(100, val));
  
  cleanliness = clamp(cleanliness);
  segregation = clamp(segregation);
  hazard_handling = clamp(hazard_handling);
  ppe_compliance = clamp(ppe_compliance);

  const overall = Math.round((cleanliness + segregation + hazard_handling + ppe_compliance) / 4);

  return {
    overall,
    cleanliness,
    segregation,
    hazard_handling,
    ppe_compliance
  };
}
