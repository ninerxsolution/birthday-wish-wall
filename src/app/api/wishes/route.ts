import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [
        // First, sort by whether they have replies (no replies first)
        { replies: { _count: 'asc' } },
        // Then by creation date (newest first within each group)
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    return NextResponse.json(
      { error: 'โหลดคำอวยพรไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, message, friendId } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'ต้องใส่ข้อความ' },
        { status: 400 }
      );
    }

    if (name && (typeof name !== 'string' || name.trim().length > 100)) {
      return NextResponse.json(
        { error: 'ชื่อต้องเป็นข้อความและไม่เกิน 100 ตัวอักษร' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { error: 'ข้อความต้องไม่เกิน 1000 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Enforce one-wish-by-friend if friendId is provided
    if (friendId) {
      if (typeof friendId !== 'string') {
        return NextResponse.json(
          { error: 'friendId ต้องเป็นข้อความ' },
          { status: 400 }
        );
      }

      const existing = await prisma.wish.findUnique({ where: { friendId } });
      if (existing) {
        return NextResponse.json(
          { error: 'เพื่อนคนนี้มีคำอวยพรแล้ว' },
          { status: 409 }
        );
      }
    }

    const wish = await prisma.wish.create({
      data: {
        name: name?.trim() || null,
        friendId: friendId || null,
        message: message.trim(),
        revealed: false
      }
    });

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error('Error creating wish:', error);
    return NextResponse.json(
      { error: 'สร้างคำอวยพรไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
