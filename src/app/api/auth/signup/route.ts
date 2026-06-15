import { NextResponse } from "next/server";
import { sql, isUsingPlaceholderDb } from "@/lib/buildify/db";
import { hashPassword, signJwt, isValidEmail, JWT_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (isUsingPlaceholderDb()) {
      return NextResponse.json({ error: "Database is not configured. Set DATABASE_URL in .env.local." }, { status: 500 });
    }

    await sql`CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    const existing = await sql`SELECT email FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    await sql`INSERT INTO users (email, password_hash, display_name) VALUES (${email}, ${passwordHash}, ${displayName || ""})`;

    const token = await signJwt({ id: email, email, displayName: displayName || "" });
    const response = NextResponse.json({ user: { email, displayName: displayName || "" } }, { status: 201 });

    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
