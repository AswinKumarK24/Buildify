import { NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  text: z.string().min(1),
  tone: z.string().min(1).default("professional"),
  context: z.string().optional().default(""),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { text, tone, context } = parsed.data;

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return new Response("Missing GEMINI_API_KEY", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    const rewritePrompt = `Rewrite this text for a website in a ${tone} tone: '${text}'
Context: ${context}
Return ONLY the rewritten text, no explanation, no quotes.`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: rewritePrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      },
    );

    if (!response.ok) {
      return new Response("Gemini request failed", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    const data: any = await response.json().catch(() => ({}));
    const rewritten = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return new Response(String(rewritten).trim(), {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error(e);
    return new Response("AI rewrite failed", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

