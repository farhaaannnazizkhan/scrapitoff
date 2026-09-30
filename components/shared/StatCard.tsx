import React from 'react';

export function StatCard({ label, value, subtitle, trend }: { label: string, value: string | number, subtitle?: string, trend?: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2">
          {trend === 'up' && <span className="text-green-600 font-bold text-sm">↑</span>}
          {trend === 'down' && <span className="text-red-600 font-bold text-sm">↓</span>}
          {trend === 'neutral' && <span className="text-gray-400 font-bold text-sm">-</span>}
          {subtitle && <span className="text-xs text-gray-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
