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

export async function getAllRecyclers() {
  return await prisma.user.findMany({
    where: { role: 'RECYCLER' },
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
