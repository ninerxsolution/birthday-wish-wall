import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      select: {
        id: true,
        revealed: true,
        message: true,
        friend: {
          select: { avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payload = wishes.map(w => ({
      id: w.id,
      avatarUrl: w.friend?.avatarUrl ?? null,
      revealed: w.revealed,
      message: w.revealed ? w.message : undefined
    }));

    return NextResponse.json({ wishes: payload });
  } catch (error) {
    console.error('Error fetching wall data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wall data' },
      { status: 500 }
    );
  }
}


