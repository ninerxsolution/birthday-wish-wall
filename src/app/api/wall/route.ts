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
        },
        replies: {
          select: {
            id: true,
            message: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payload = wishes.map(w => ({
      id: w.id,
      avatarUrl: w.friend?.avatarUrl ?? null,
      revealed: w.revealed,
      message: w.revealed ? w.message : undefined,
      replies: w.replies
    }));

    return NextResponse.json({ wishes: payload });
  } catch (error) {
    console.error('Error fetching wall data:', error);
    return NextResponse.json(
      { error: 'โหลดข้อมูลกำแพงไม่สำเร็จ' },
      { status: 500 }
    );
  }
}


