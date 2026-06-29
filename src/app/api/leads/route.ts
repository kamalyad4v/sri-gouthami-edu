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
    const counsellorId = searchParams.get('counsellorId') || undefined;

    const list = await db.leadFindMany({ query, campusId, programId, status, counsellorId });
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

    // Auto-assign to a counsellor if not provided
    let assignedCounsellorId = counsellorId || null;
    if (!assignedCounsellorId) {
      const users = await db.userFindMany();
      const counsellors = users.filter((u: any) => u.role === 'COUNSELLOR');
      if (counsellors.length > 0) {
        assignedCounsellorId = counsellors[0].id;
      }
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
      counsellorId: assignedCounsellorId,
    });

    // Auto-create a User account for the student so they can log in
    try {
      const existingUsers = await db.userFindMany();
      const userExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        await db.userCreate({
          name: studentName,
          email: email,
          role: 'STUDENT',
        });
      }
    } catch (userErr) {
      console.warn("Failed to auto-create student user account:", userErr);
    }

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
      let leadIdToUse = id;
      let lead = await db.leadFindUnique(id);

      if (!lead) {
        const user = await db.userFindUnique(id);
        if (user) {
          const potentialLeads = await db.leadFindMany({ query: user.email });
          if (potentialLeads.length > 0) {
            const foundLead = potentialLeads[0];
            leadIdToUse = foundLead.id;
            lead = await db.leadFindUnique(foundLead.id);
          }
        }
      }

      if (!lead) {
        return NextResponse.json({ error: 'Lead not found for note creation' }, { status: 404 });
      }

      const newNote = await db.noteCreate({
        note,
        authorId,
        leadId: leadIdToUse,
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
