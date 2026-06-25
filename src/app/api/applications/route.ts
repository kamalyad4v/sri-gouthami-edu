import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const campusId = searchParams.get('campusId') || undefined;
    const status = searchParams.get('status') || undefined;

    if (id) {
      const app = await db.applicationFindUnique(id);
      if (!app) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }
      return NextResponse.json(app);
    }

    const list = await db.applicationFindMany({ campusId, status });
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, aiSummary, aiRiskFlags, aiRecommendation } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing application id' }, { status: 400 });
    }

    const updated = await db.applicationUpdate(id, {
      status,
      aiSummary,
      aiRiskFlags,
      aiRecommendation,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
