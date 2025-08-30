import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { wishId, message } = await request.json();

    if (!wishId || typeof wishId !== 'string') {
      return NextResponse.json(
        { error: 'Wish ID is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Message must be maximum 1000 characters' },
        { status: 400 }
      );
    }

    // Verify the wish exists
    const wish = await prisma.wish.findUnique({
      where: { id: wishId }
    });

    if (!wish) {
      return NextResponse.json(
        { error: 'Wish not found' },
        { status: 404 }
      );
    }

    const reply = await prisma.reply.create({
      data: {
        wishId,
        message: message.trim()
      }
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}
