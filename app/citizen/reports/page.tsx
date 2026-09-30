import React from 'react';
import Link from 'next/link';
import { getFirstCitizen } from '@/lib/db/users';
import { getReportsByCitizen } from '@/lib/db/cleanlinessReports';

export const dynamic = 'force-dynamic';

export default async function MyReportsPage() {
  const citizen = await getFirstCitizen();
  if (!citizen) return null;

  const reports = await getReportsByCitizen(citizen.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase">In Progress</span>;
      case 'RESOLVED': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold uppercase">Resolved</span>;
      default: return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold uppercase border border-red-200">High Severity</span>;
      case 'MEDIUM': return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase border border-amber-200">Medium Severity</span>;
      case 'LOW': return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold uppercase border border-gray-200">Low Severity</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center pb-4 mb-4 border-b border-gray-200">
        <Link href="/citizen" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
      </header>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4 font-medium">You have not submitted any reports yet.</p>
          <Link href="/citizen/report" className="text-green-600 font-bold hover:underline">
            Submit a new report &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{report.category}</h3>
                <div className="flex gap-2 shrink-0">
                  {getSeverityBadge(report.severity)}
                  {getStatusBadge(report.status)}
                </div>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                📍 {report.area} {report.address ? `(${report.address})` : ''}
              </div>
              <p className="text-gray-700 text-sm line-clamp-2">{report.description}</p>
              <div className="text-xs text-gray-400 mt-2 font-medium">
                {new Date(report.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
