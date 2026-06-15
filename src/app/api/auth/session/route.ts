import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  return NextResponse.json({ user });
}
