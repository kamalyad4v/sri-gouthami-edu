import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const lead = await db.leadFindUnique(id);
      if (!lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      return NextResponse.json(lead);
    }

    const query = searchParams.get('query') || undefined;
    const campusId = searchParams.get('campusId') || undefined;
    const programId = searchParams.get('programId') || undefined;
    const status = searchParams.get('status') || undefined;

    const list = await db.leadFindMany({ query, campusId, programId, status });
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, parentName, mobile, email, address, campusId, programId, courseId, counsellorId } = body;

    if (!studentName || !parentName || !mobile || !email || !campusId || !programId || !courseId) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const created = await db.leadCreate({
      studentName,
      parentName,
      mobile,
      email,
      address: address || '',
      status: 'NEW',
      campusId,
      programId,
      courseId,
      counsellorId: counsellorId || null,
    });

    return NextResponse.json(created);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, note, authorId, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
    }

    // If it's a note append request
    if (note && authorId) {
      const newNote = await db.noteCreate({
        note,
        authorId,
        leadId: id,
      });
      return NextResponse.json({ success: true, note: newNote });
    }

    // Standard field update
    const updated = await db.leadUpdate(id, fields);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
