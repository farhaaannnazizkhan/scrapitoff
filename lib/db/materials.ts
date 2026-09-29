import { prisma } from './client';

export async function getAllMaterials() {
  return await prisma.material.findMany({
    orderBy: {
      category: 'asc',
    },
  });
}

export async function getMaterialByCategory(category: string) {
  return await prisma.material.findFirst({
    where: {
      category,
    },
  });
}
