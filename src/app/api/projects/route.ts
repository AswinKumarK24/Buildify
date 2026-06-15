import { NextResponse } from 'next/server';
import { sql, isUsingPlaceholderDb } from '@/lib/buildify/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (isUsingPlaceholderDb()) {
      return NextResponse.json({ projects: [] });
    }

    await sql`CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    const projects = await sql`SELECT id, name, updated_at FROM projects WHERE user_id = ${user.id} ORDER BY updated_at DESC`;
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, data } = await req.json();
    if (!name) return NextResponse.json({ message: "Name required" }, { status: 400 });

    if (isUsingPlaceholderDb()) {
      return NextResponse.json({ project: { id: "placeholder-uuid", name } });
    }

    await sql`CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    const defaultData = data || { blocks: [] };
    const inserted = await sql`INSERT INTO projects (user_id, name, data) VALUES (${user.id}, ${name}, ${defaultData}::jsonb) RETURNING id`;
    
    return NextResponse.json({ project: { id: inserted[0].id, name } });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
