import React from 'react';
import { getFirstRecycler } from '@/lib/db/users';
import { getLotsByRecycler } from '@/lib/db/lots';
import { getDemoRole } from '@/lib/auth/demoRole';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';
import { AppHeader } from '@/components/shared/AppHeader';
import { IncomingLotCard } from '@/components/recycler/IncomingLotCard';
import { getRecyclerMonthlyStats } from '@/lib/db/financials';
import { MonthlySummary } from '@/components/shared/MonthlySummary';

export const dynamic = 'force-dynamic';

export default async function RecyclerDashboardPage() {
  const currentRole = await getDemoRole();
  const recycler = await getFirstRecycler();
  const lang = await getLanguage();
  const t = translations[lang];

  if (!recycler) {
    return <div className="p-8 text-center text-red-500">No recycler found in DB. Run the seed script.</div>;
  }

  const lots = await getLotsByRecycler(recycler.id);
  const monthlyStats = await getRecyclerMonthlyStats(recycler.id);

  const incomingLots = lots.filter(lot => lot.status === "DELIVERED");
  const completedLots = lots.filter(lot => lot.status === "VERIFIED");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
        <AppHeader currentRole={currentRole} currentLang={lang} />
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recycler Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">{recycler.name}</p>
          </div>
        </header>

        <MonthlySummary stats={monthlyStats} title="This Month" />

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-400 w-2 h-6 rounded-full inline-block"></span>
            {t.incoming_lots}
          </h2>
          {incomingLots.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              No incoming lots assigned to you right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingLots.map(lot => (
                <IncomingLotCard key={lot.id} lot={lot} confirmLabel={t.confirm_payment} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
            <span className="bg-green-500 w-2 h-6 rounded-full inline-block"></span>
            {t.completed}
          </h2>
          {completedLots.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              You have no completed lots.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedLots.map(lot => (
                <div key={lot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Lot ID: {lot.id.split('-')[0]}</p>
                      <h3 className="font-bold text-gray-900 text-lg">{lot.material_category}</h3>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">VERIFIED</span>
                  </div>

                  <div className="text-sm text-gray-600 flex flex-col gap-1">
                    <p><strong>Weight:</strong> {lot.weight_kg} kg</p>
                    <p><strong>Paid:</strong> ₹{lot.final_price || lot.quoted_price}</p>
                    <p><strong>Collector:</strong> {lot.collector?.name || 'Unknown'}</p>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded inline-block">Payment COMPLETED</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
