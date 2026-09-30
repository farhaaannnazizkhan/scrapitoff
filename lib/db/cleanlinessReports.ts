import { prisma } from './client';
import { CleanlinessStatus } from '@prisma/client';

export async function createReport(data: any) {
  return await prisma.cleanlinessReport.create({
    data
  });
}

export async function getReportsByCitizen(citizenId: string) {
  return await prisma.cleanlinessReport.findMany({
    where: { citizen_id: citizenId },
    orderBy: { created_at: 'desc' }
  });
}

export async function getAllReports() {
  const reports = await prisma.cleanlinessReport.findMany({
    include: { citizen: true },
    orderBy: [
      { severity: 'asc' }, // Will map dynamically or we can just sort in memory
      { created_at: 'desc' }
    ]
  });

  // Severity HIGH first
  return reports.sort((a, b) => {
    if (a.severity === 'HIGH' && b.severity !== 'HIGH') return -1;
    if (b.severity === 'HIGH' && a.severity !== 'HIGH') return 1;
    return b.created_at.getTime() - a.created_at.getTime();
  });
}

export async function updateReportStatus(id: string, status: CleanlinessStatus) {
  return await prisma.cleanlinessReport.update({
    where: { id },
    data: { status }
  });
}

export async function assignReport(id: string, assignedTo: string | null) {
  return await prisma.cleanlinessReport.update({
    where: { id },
    data: { assigned_to: assignedTo }
  });
}

export async function getReportsByArea(area: string) {
  return await prisma.cleanlinessReport.findMany({
    where: { area },
    orderBy: { created_at: 'desc' }
  });
}

export async function getReportStats() {
  const reports = await prisma.cleanlinessReport.findMany();
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    in_progress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
    resolved_this_month: reports.filter(r => r.status === 'RESOLVED' && r.updated_at >= firstDayThisMonth).length,
    high_severity: reports.filter(r => r.severity === 'HIGH').length
  };
}

export async function getCitizenReportStats(citizenId: string) {
  const reports = await prisma.cleanlinessReport.findMany({
    where: { citizen_id: citizenId }
  });
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    total_reports: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    in_progress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
    resolved_this_month: reports.filter(r => r.status === 'RESOLVED' && r.updated_at >= firstDayThisMonth).length
  };
}
