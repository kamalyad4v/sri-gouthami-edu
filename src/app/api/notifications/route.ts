import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as mockDb from '@/lib/mock-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const list = await db.notificationFindMany(userId);
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Mark all read
    if (db.isMock) {
      const data = mockDb.getMockDb();
      data.notifications = data.notifications.map((n: any) => {
        if (n.userId === userId) {
          return { ...n, isRead: true };
        }
        return n;
      });
      mockDb.saveMockDb(data);
    } else {
      await db.prisma.notification.updateMany({
        where: { userId },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
