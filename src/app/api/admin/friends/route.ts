import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const friends = await prisma.friend.findMany({
      include: {
        wish: {
          select: {
            id: true,
            message: true,
            revealed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'โหลดรายชื่อเพื่อนไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
