import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const answerId = parseInt(id);
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';

  if (!checkRateLimit(ip, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (isNaN(answerId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: { votes: { increment: 1 } }
    });
    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error voting for answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
