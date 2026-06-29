import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = await db.userFindMany();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const created = await db.userCreate({
      name,
      email,
      role,
    });

    return NextResponse.json(created);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
