import React from 'react';
import { HygieneBadge } from './HygieneBadge';

interface Scores {
  overall: number;
  cleanliness: number;
  segregation: number;
  hazard_handling: number;
  ppe_compliance: number;
}

export function HygienePanel({ scores }: { scores: Scores }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-800 text-lg">Facility Hygiene</h3>
        <div className="flex items-center gap-3">
           <span className="font-extrabold text-gray-900 text-xl">{scores.overall}%</span>
           <HygieneBadge score={scores.overall} />
        </div>
      </div>
      <div className="space-y-4">
        <ScoreBar label="🧹 Cleanliness" score={scores.cleanliness} color="bg-blue-500" />
        <ScoreBar label="♻️ Segregation" score={scores.segregation} color="bg-green-500" />
        <ScoreBar label="⚠️ Hazard handling" score={scores.hazard_handling} color="bg-amber-500" />
        <ScoreBar label="🧤 PPE compliance" score={scores.ppe_compliance} color="bg-purple-500" />
      </div>
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        <span>{label}</span>
        <span>{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${Math.round(score)}%` }}></div>
      </div>
    </div>
  );
}
