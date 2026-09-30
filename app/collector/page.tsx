import React from 'react';
import { getFirstCollector } from '@/lib/db/users';
import { getPendingPickups, getPickupsByCollector } from '@/lib/db/pickupRequests';
import { RequestCard } from '@/components/collector/RequestCard';
import { OfflineIndicator } from '@/components/collector/OfflineIndicator';

export const dynamic = 'force-dynamic';

export default async function CollectorDashboardPage() {
  const collector = await getFirstCollector();
  
  if (!collector) {
    return <div className="p-8 text-center text-red-500">No collector found in DB. Run the seed script.</div>;
  }

  const pendingPickups = await getPendingPickups();
  const myPickups = await getPickupsByCollector(collector.id);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <OfflineIndicator />
      
      <div className="max-w-md mx-auto md:max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Collector Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Welcome back, {collector.name}</p>
          </div>
          
          <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1 w-fit">
            <button className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 rounded" aria-label="English">EN</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded" aria-label="Hindi">हिं</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded" aria-label="Marathi">मर</button>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-amber-400 w-2 h-6 rounded-full inline-block"></span>
            New Requests
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
            My Active Pickups
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
