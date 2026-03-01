import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitize, validateLength, checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = parseInt(id);
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';

  if (!checkRateLimit(ip, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (isNaN(questionId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { body: content, author, honeypot, startTime } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Minimum time-on-page check (3 seconds)
    const now = Date.now();
    if (startTime && now - startTime < 3000) {
      return NextResponse.json({ error: 'Submission too fast' }, { status: 400 });
    }

    // Validation
    if (!validateLength(author, 2, 60)) return NextResponse.json({ error: 'Invalid author name' }, { status: 400 });
    if (!validateLength(content, 20, 3000)) return NextResponse.json({ error: 'Invalid body length' }, { status: 400 });

    const answer = await prisma.answer.create({
      data: {
        body: sanitize(content),
        author: sanitize(author),
        questionId: questionId,
      }
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
