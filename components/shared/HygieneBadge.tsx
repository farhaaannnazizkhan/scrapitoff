import React from 'react';

export function HygieneBadge({ score }: { score: number }) {
  if (score >= 85) {
    return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200" title="Hygiene & handling score">Safe Handling ✓</span>;
  }
  if (score >= 70) {
    return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded border border-amber-200" title="Hygiene & handling score">Moderate</span>;
  }
  return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded border border-red-200" title="Hygiene & handling score">Needs Review</span>;
}
