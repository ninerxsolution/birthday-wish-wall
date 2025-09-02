import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, avatarUrl } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be maximum 100 characters' },
        { status: 400 }
      );
    }

    const friend = await prisma.friend.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        avatarUrl: avatarUrl?.trim() || null,
      },
    });

    return NextResponse.json(friend);
  } catch (error) {
    console.error('Error updating friend:', error);
    return NextResponse.json(
      { error: 'Failed to update friend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete friend and associated wish (cascade)
    await prisma.friend.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting friend:', error);
    return NextResponse.json(
      { error: 'Failed to delete friend' },
      { status: 500 }
    );
  }
}
