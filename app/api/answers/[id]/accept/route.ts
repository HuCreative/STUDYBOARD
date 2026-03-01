import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const answerId = parseInt(id);

  if (isNaN(answerId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // First, find the questionId for this answer
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { questionId: true }
    });

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    // Unset any previously accepted answer for this question
    await prisma.answer.updateMany({
      where: { questionId: answer.questionId, isAccepted: true },
      data: { isAccepted: false }
    });

    // Set this answer as accepted
    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true }
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error('Error accepting answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
