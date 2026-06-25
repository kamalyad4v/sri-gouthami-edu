import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, url, applicationId } = body;

    if (!name || !url || !applicationId) {
      return NextResponse.json({ error: 'Missing document parameters' }, { status: 400 });
    }

    const doc = await db.documentCreate({
      name,
      url,
      status: 'PENDING',
      applicationId,
    });

    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing document id or status' }, { status: 400 });
    }

    const updated = await db.documentUpdate(id, {
      status,
      rejectionReason: rejectionReason || null,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
