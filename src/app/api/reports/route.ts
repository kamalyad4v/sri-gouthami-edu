import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = await db.reportFindMany();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, format, generatedBy } = body;

    if (!title || !type || !format || !generatedBy) {
      return NextResponse.json({ error: 'Missing reporting parameters' }, { status: 400 });
    }

    const report = await db.reportCreate({
      title,
      type,
      format,
      generatedBy,
      url: '#',
    });

    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
