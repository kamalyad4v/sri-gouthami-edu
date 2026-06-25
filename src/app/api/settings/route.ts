import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const DB_FILE_PATH = path.join(process.cwd(), 'prisma', 'mock_db_data.json');
    if (fs.existsSync(DB_FILE_PATH)) {
      fs.unlinkSync(DB_FILE_PATH);
    }
    
    // In-memory require cache clearance
    delete require.cache[require.resolve('@/lib/mock-db')];
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
