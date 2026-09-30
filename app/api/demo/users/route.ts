import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  if (role !== 'collector' && role !== 'recycler') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const roleEnum = role === 'collector' ? 'COLLECTOR' : 'RECYCLER';
  
  const users = await prisma.user.findMany({
    where: { role: roleEnum },
    select: { id: true, name: true, area: true }
  });

  return NextResponse.json(users);
}
