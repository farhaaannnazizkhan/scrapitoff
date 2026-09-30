import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });
}

let prismaClient: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = globalForPrisma.prisma ?? createPrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaClient;
    }
  }
  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});