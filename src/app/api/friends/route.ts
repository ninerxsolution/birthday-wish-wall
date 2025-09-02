import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, avatarUrl } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'ต้องใส่ชื่อ' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'ชื่อต้องไม่เกิน 100 ตัวอักษร' },
        { status: 400 }
      );
    }

    if (avatarUrl && typeof avatarUrl !== 'string') {
      return NextResponse.json(
        { error: 'avatarUrl ต้องเป็น URL ข้อความ' },
        { status: 400 }
      );
    }

    const friend = await prisma.friend.create({
      data: {
        name: name.trim(),
        // avatarUrl may be a URL or an emoji string
        avatarUrl: avatarUrl?.trim() || null
      },
      select: { id: true }
    });

    return NextResponse.json({ friendId: friend.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating friend:', error);
    return NextResponse.json(
      { error: 'สร้างเพื่อนไม่สำเร็จ' },
      { status: 500 }
    );
  }
}


