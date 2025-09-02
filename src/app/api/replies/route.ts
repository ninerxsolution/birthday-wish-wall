import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { wishId, message } = await request.json();

    if (!wishId || typeof wishId !== 'string') {
      return NextResponse.json(
        { error: 'ต้องใส่ ID คำอวยพร' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'ต้องใส่ข้อความ' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { error: 'ข้อความต้องไม่เกิน 1000 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Verify the wish exists
    const wish = await prisma.wish.findUnique({
      where: { id: wishId }
    });

    if (!wish) {
      return NextResponse.json(
        { error: 'ไม่พบคำอวยพร' },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newReply = await tx.reply.create({
        data: {
          wishId,
          message: message.trim()
        }
      });

      await tx.wish.update({
        where: { id: wishId },
        data: { revealed: true }
      });

      return newReply;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'สร้างคำตอบไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
