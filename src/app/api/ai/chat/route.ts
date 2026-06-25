import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const reply = await aiService.getChatbotReply({
      message,
      history: history || [],
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
