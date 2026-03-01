import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitize, validateLength, checkRateLimit } from '@/lib/security';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const sort = searchParams.get('sort'); // newest, voted, answered
  const search = searchParams.get('search');

  let where: any = {};
  if (tag) where.tag = tag;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { body: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'voted') orderBy = { votes: 'desc' };
  if (sort === 'answered') {
    // Prisma doesn't support sorting by relation count directly in orderBy easily without aggregate
    // We'll handle this by fetching and sorting if needed, or just default to newest for now
    // Actually, we can use _count
    orderBy = {
      answers: {
        _count: 'desc'
      }
    };
  }

  try {
    const questions = await prisma.question.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { answers: true }
        }
      }
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  
  if (!checkRateLimit(ip, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { title, body: content, tag, author, honeypot, startTime } = body;

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
    if (!validateLength(title, 15, 200)) return NextResponse.json({ error: 'Invalid title length' }, { status: 400 });
    if (!validateLength(author, 2, 60)) return NextResponse.json({ error: 'Invalid author name' }, { status: 400 });
    if (content && !validateLength(content, 0, 2000)) return NextResponse.json({ error: 'Invalid body length' }, { status: 400 });

    const question = await prisma.question.create({
      data: {
        title: sanitize(title),
        body: content ? sanitize(content) : '',
        tag: sanitize(tag),
        author: sanitize(author),
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
