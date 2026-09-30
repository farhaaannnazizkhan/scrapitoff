import React from 'react';
import { getDemoRole } from '@/lib/auth/demoRole';
import { getLanguage } from '@/lib/i18n/getLanguage';
import { translations } from '@/lib/i18n/translations';
import { AppHeader } from '@/components/shared/AppHeader';
import { getAllReports, getReportStats } from '@/lib/db/cleanlinessReports';
import { getAllCollectors } from '@/lib/db/users';
import { ReportStatusControl } from '@/components/admin/ReportStatusControl';
import { AssignControl } from '@/components/municipal/AssignControl';
import { StatCard } from '@/components/shared/StatCard';

export const dynamic = 'force-dynamic';

export default async function MunicipalDashboardPage() {
  const currentRole = await getDemoRole();
  const lang = await getLanguage();
  const t = translations[lang];
  
  const rawReports = await getAllReports();
  const reportStats = await getReportStats();
  const workers = await getAllCollectors();
  
  const workerList = workers.map(w => ({ id: w.id, name: w.name }));
  const queueReports = rawReports.slice(0, 30);
  
  const recentResolutions = rawReports
    .filter(r => r.status === 'RESOLVED')
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <AppHeader currentRole={currentRole} currentLang={lang} />
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t.municipal_dashboard || 'Municipal Sanitation Dashboard'}</h1>
          <p className="text-gray-500 mt-1 font-medium">Ward-level cleanliness reports</p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Reports" value={reportStats.total} />
          <StatCard title="Pending" value={reportStats.pending} />
          <StatCard title="In Progress" value={reportStats.in_progress} />
          <StatCard title={t.resolved_this_month || "Resolved This Month"} value={reportStats.resolved_this_month} />
          <StatCard title="High Severity" value={reportStats.high_severity} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <section className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.reports_queue || 'Reports Queue'}</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">{t.assigned_to || 'Assigned To'}</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queueReports.map(r => (
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
                      <td className="px-4 py-3">
                        <AssignControl reportId={r.id} currentAssignedTo={r.assigned_to} workers={workerList} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {queueReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">No reports found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Resolutions</h2>
            {recentResolutions.length > 0 ? (
              <div className="space-y-4">
                {recentResolutions.map(r => {
                  const assignedWorker = workers.find(w => w.id === r.assigned_to)?.name || 'Unknown Worker';
                  return (
                    <div key={r.id} className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{r.category}</h3>
                        <span className="text-xs text-gray-500">{new Date(r.updated_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">📍 {r.area}</p>
                      <p className="text-xs font-medium text-green-800">
                        Resolved by: {assignedWorker}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No recent resolutions.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
