"use client";

import React from 'react';
import { StatCard } from './StatCard';

interface MonthlySummaryProps {
  stats: Record<string, any>;
  title: string;
  currency?: boolean;
}

export function MonthlySummary({ stats, title, currency = true }: MonthlySummaryProps) {
  const formatValue = (key: string, val: number) => {
    if (key.includes('earnings') || key.includes('payments') || key.includes('value') || key.includes('revenue')) {
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (key.includes('kg') || key.includes('avg')) {
      return `${val.toFixed(1)} ${key.includes('avg') ? '₹/lot' : 'kg'}`;
    }
    return val.toLocaleString('en-IN');
  };
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).filter(([k]) => !k.includes('last_month')).map(([key, value]) => {
          let label = key.replace(/_/g, ' ').replace('this month', '').trim();
          return (
            <StatCard 
              key={key}
              label={label}
              value={formatValue(key, Number(value))}
            />
          );
        })}
      </div>
    </section>
  );
}
