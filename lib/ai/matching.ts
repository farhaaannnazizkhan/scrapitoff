export function rankRecyclers(lot: any, recyclers: any[]) {
  return recyclers.map((r) => {
    // Mock calculation
    // - distance: mock as 5km if not found
    // - rate: mock as lot.quoted_price if not found
    // score = (distance 0.3) + (rate 0.3) + (rating 0.2) + (authorization 0.2)
    // distance is 5km => close enough to max score (say 0.8)
    const distanceScore = 0.8 * 0.3; 
    
    // rate is same as quoted => score is 1.0
    const rateScore = 1.0 * 0.3;
    
    // rating normalized (rating/5)
    const ratingScore = ((r.rating || 4.5) / 5) * 0.2;
    
    // auth score: we assume all fetched users are authorized for this mock (0.2)
    const authScore = 0.2;

    const totalScore = distanceScore + rateScore + ratingScore + authScore;

    return {
      ...r,
      matchScore: totalScore.toFixed(2),
    };
  }).sort((a, b) => Number(b.matchScore) - Number(a.matchScore));
}
