import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
    }

    const output = await aiService.generateApplicationSummary(applicationId);
    return NextResponse.json(output);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
