import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = parseInt(id);
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';

  if (!checkRateLimit(ip, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (isNaN(questionId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { votes: { increment: 1 } }
    });
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error voting for question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
