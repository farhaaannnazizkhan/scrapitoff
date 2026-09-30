import React from 'react';
import { getDemoRole } from '@/lib/auth/demoRole';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { AppHeader } from '@/components/shared/AppHeader';
import { getPlatformStats, getHotspotData } from '@/lib/db/adminStats';
import { getPlatformMonthlyStats } from '@/lib/db/financials';
import { getAnomalies } from '@/lib/db/anomalies';
import { getAllReports, getReportStats } from '@/lib/db/cleanlinessReports';
import { prisma } from '@/lib/db/client';
import { HotspotMapWrapper } from '@/components/admin/HotspotMapWrapper';
import { ReportStatusControl } from '@/components/admin/ReportStatusControl';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const currentRole = await getDemoRole();
  const lang = await getLanguage();
  
  const stats = await getPlatformStats();
  const monthlyStats = await getPlatformMonthlyStats();
  const hotspots = await getHotspotData();
  const anomalies = await getAnomalies();
  const reportStats = await getReportStats();
  const cleanlinessReports = (await getAllReports()).slice(0, 20);
  
  const recentLots = await prisma.lot.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    include: { collector: true, recycler: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <AppHeader currentRole={currentRole} currentLang={lang} />
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Lots" value={stats.total_lots} />
          <StatCard title="Total Weight" value={`${stats.total_weight_kg.toFixed(1)} kg`} />
          <StatCard title="Total Value" value={`₹${stats.total_value.toFixed(0)}`} />
          <StatCard title="Total Users" value={stats.total_citizens + stats.total_collectors + stats.total_recyclers} />
          <StatCard title="This Month Tx Value" value={`₹${monthlyStats.this_month_transaction_value.toFixed(0)}`} />
          <StatCard title="Platform Revenue" value={`₹${monthlyStats.platform_revenue.toFixed(0)}`} />
        </section>
        <p className="text-xs text-gray-500 text-right -mt-6 mb-8 italic">Revenue at 1% take rate</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hotspots (Map)</h2>
            <HotspotMapWrapper hotspots={hotspots} />
          </section>

          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <span>⚠️</span> Anomaly Flags
            </h2>
            {anomalies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Lot ID</th>
                      <th className="px-4 py-3">Material</th>
                      <th className="px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalies.map(a => (
                      <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-500">{a.id.substring(0,8)}</td>
                        <td className="px-4 py-3 font-medium">{a.material_category}</td>
                        <td className="px-4 py-3 text-red-600 font-bold">
                          {Number(a.weight_kg) > 100 ? 'High Weight' : 'Price Dropped'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No anomalies detected.</p>
            )}
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Lots</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Lot ID</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLots.map(l => (
                  <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500">{l.id.substring(0,8)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{l.material_category}</td>
                    <td className="px-4 py-3">{l.weight_kg} kg</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 px-2 py-1 rounded text-xs font-bold text-blue-700 border border-blue-200">{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cleanliness Reports Queue</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Reports" value={reportStats.total} />
            <StatCard title="Pending" value={reportStats.pending} />
            <StatCard title="In Progress" value={reportStats.in_progress} />
            <StatCard title="Resolved" value={reportStats.resolved} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {cleanlinessReports.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${r.severity === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : r.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.area}</td>
                    <td className="px-4 py-3">
                      <ReportStatusControl reportId={r.id} currentStatus={r.status} />
                    </td>
                  </tr>
                ))}
                {cleanlinessReports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">No reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
