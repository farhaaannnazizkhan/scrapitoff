import { prisma } from './client';

export async function getFirstCollector() {
  return await prisma.user.findFirst({
    where: { role: 'COLLECTOR' },
  });
}

export async function getFirstRecycler() {
  return await prisma.user.findFirst({
    where: { role: 'RECYCLER' },
  });
}

export async function getFirstCitizen() {
  return await prisma.user.findFirst({
    where: { role: 'CITIZEN' },
  });
}
