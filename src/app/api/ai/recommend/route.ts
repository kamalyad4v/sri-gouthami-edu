import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { academicBackground, interests, careerGoals } = body;

    if (!academicBackground || !interests || !careerGoals) {
      return NextResponse.json({ error: 'All input parameters are required' }, { status: 400 });
    }

    const output = await aiService.recommendCourses({
      academicBackground,
      interests,
      careerGoals,
    });

    return NextResponse.json(output);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
