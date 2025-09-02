import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    if (avatarUrl && typeof avatarUrl !== 'string') {
      return NextResponse.json(
        { error: 'avatarUrl must be a string URL' },
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
      { error: 'Failed to create friend' },
      { status: 500 }
    );
  }
}


