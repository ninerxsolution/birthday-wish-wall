import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth, getAdminAuthError } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(getAdminAuthError(), { status: 401 });
  }
  try {
    const { id } = await params;
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

    const friend = await prisma.friend.update({
      where: { id },
      data: {
        name: name.trim(),
        avatarUrl: avatarUrl?.trim() || null,
      },
    });

    return NextResponse.json(friend);
  } catch (error) {
    console.error('Error updating friend:', error);
    return NextResponse.json(
      { error: 'อัปเดตเพื่อนไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(getAdminAuthError(), { status: 401 });
  }
  try {
    const { id } = await params;
    // Delete friend and associated wish (cascade)
    await prisma.friend.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting friend:', error);
    return NextResponse.json(
      { error: 'ลบเพื่อนไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
