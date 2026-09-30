import { cookies } from 'next/headers';
import { prisma } from './client';

export async function getFirstCollector() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scrapitoff_demo_user_collector')?.value;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === 'COLLECTOR') return user;
  }
  return await prisma.user.findFirst({
    where: { role: 'COLLECTOR' },
  });
}

export async function getFirstRecycler() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scrapitoff_demo_user_recycler')?.value;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === 'RECYCLER') return user;
  }
  return await prisma.user.findFirst({
    where: { role: 'RECYCLER' },
  });
}

export async function getFirstCitizen() {
  return await prisma.user.findFirst({
    where: { role: 'CITIZEN' },
  });
}

export async function getAllRecyclers() {
  return await prisma.user.findMany({
    where: { role: 'RECYCLER' },
  });
}

export async function getAllCollectors() {
  return await prisma.user.findMany({
    where: { role: 'COLLECTOR' },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByRole(role: "CITIZEN" | "COLLECTOR" | "RECYCLER") {
  return await prisma.user.findFirst({
    where: { role },
  });
}
