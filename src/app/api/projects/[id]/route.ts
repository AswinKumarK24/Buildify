import { NextResponse } from 'next/server';
import { sql, isUsingPlaceholderDb } from '@/lib/buildify/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    
    if (isUsingPlaceholderDb()) {
      return NextResponse.json({ project: { id: resolvedParams.id, name: "Demo", data: { blocks: [] } } });
    }

    const results = await sql`SELECT id, name, data, updated_at FROM projects WHERE id = ${resolvedParams.id} AND user_id = ${user.id}`;
    if (results.length === 0) return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ project: results[0] });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { data } = await req.json();

    if (!isUsingPlaceholderDb()) {
      const results = await sql`UPDATE projects SET data = ${data}::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = ${resolvedParams.id} AND user_id = ${user.id} RETURNING id`;
      if (results.length === 0) return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    if (!isUsingPlaceholderDb()) {
      const results = await sql`DELETE FROM projects WHERE id = ${resolvedParams.id} AND user_id = ${user.id} RETURNING id`;
      if (results.length === 0) return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
