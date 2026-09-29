export function calculateFairPrice(weightKg: number, condition: "Standard" | "Mixed" | "Clean", baseRatePerKg: number) {
  const factorMap = {
    Standard: 1.0,
    Mixed: 0.9,
    Clean: 1.1,
  };
  const factor = factorMap[condition] || 1.0;
  
  const rawFairPrice = baseRatePerKg * weightKg * factor;
  const rawMinPrice = rawFairPrice * 0.9;
  const rawMaxPrice = rawFairPrice * 1.1;

  return {
    fairPrice: Number(rawFairPrice.toFixed(2)),
    minPrice: Number(rawMinPrice.toFixed(2)),
    maxPrice: Number(rawMaxPrice.toFixed(2)),
  };
}

export function flagAnomaly(offeredPrice: number, fairPrice: number) {
  return offeredPrice < 0.7 * fairPrice;
}
