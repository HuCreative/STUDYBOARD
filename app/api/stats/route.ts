import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalQuestions, totalAnswers, totalViews] = await Promise.all([
      prisma.question.count(),
      prisma.answer.count(),
      prisma.question.aggregate({ _sum: { views: true } })
    ]);

    // Subjects are fixed in our app
    const totalSubjects = 8;

    return NextResponse.json({
      totalQuestions,
      totalAnswers,
      totalSubjects,
      totalViews: totalViews._sum.views || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
