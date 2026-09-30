import React from 'react';
import { getFirstCollector } from '@/lib/db/users';
import { getPendingPickups, getPickupsByCollector } from '@/lib/db/pickupRequests';
import { RequestCard } from '@/components/collector/RequestCard';
import { OfflineIndicator } from '@/components/collector/OfflineIndicator';
import { getCollectorMonthlyStats } from '@/lib/db/financials';
import { MonthlySummary } from '@/components/shared/MonthlySummary';

import { getDemoRole } from '@/lib/auth/demoRole';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';
import { AppHeader } from '@/components/shared/AppHeader';
import { SegregationStats } from '@/components/collector/SegregationStats';

export const dynamic = 'force-dynamic';

export default async function CollectorDashboardPage() {
  const collector = await getFirstCollector();
  const currentRole = await getDemoRole();
  const lang = await getLanguage();
  const t = translations[lang];
  
  if (!collector) {
    return <div className="p-8 text-center text-red-500">No collector found in DB. Run the seed script.</div>;
  }

  const pendingPickups = await getPendingPickups();
  const myPickups = await getPickupsByCollector(collector.id);
  const monthlyStats = await getCollectorMonthlyStats(collector.id);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <OfflineIndicator />
      
      <div className="max-w-md mx-auto md:max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
        <AppHeader currentRole={currentRole} currentLang={lang} />
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Collector Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Welcome back, {collector.name}</p>
          </div>
        </header>

        <SegregationStats collectorId={collector.id} />
        
        <MonthlySummary stats={monthlyStats} title="This Month" />

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-amber-400 w-2 h-6 rounded-full inline-block"></span>
            {t.new_requests}
          </h2>
          {pendingPickups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              No new requests right now. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPickups.map(req => (
                <RequestCard key={req.id} request={req} collectorId={collector.id} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
            <span className="bg-amber-500 w-2 h-6 rounded-full inline-block"></span>
            {t.my_active_pickups}
          </h2>
          {myPickups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              You have no active pickups.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPickups.map(req => (
                <RequestCard key={req.id} request={req} collectorId={collector.id} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
