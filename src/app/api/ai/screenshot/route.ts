import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const RequestSchema = z.object({
  imageBase64: z.string().min(10),
});

type ComponentType =
  | "hero"
  | "navbar"
  | "features"
  | "testimonial"
  | "contact"
  | "footer"
  | "textblock"
  | "image"
  | "button"
  | string;

function extractJSONArray(text: string): any[] {
  const trimmed = text.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const start = trimmed.indexOf("[");
    const end = trimmed.lastIndexOf("]");
    if (start >= 0 && end > start) {
      const slice = trimmed.slice(start, end + 1);
      try {
        const parsed = JSON.parse(slice);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}

function mapType(type: ComponentType) {
  switch (type) {
    case "hero":
      return "hero";
    case "navbar":
      return "navbar";
    case "features":
      return "featureCards";
    case "testimonial":
      return "testimonial";
    case "contact":
      return "contactForm";
    case "footer":
      return "footer";
    case "textblock":
      return "text";
    case "image":
      return "image";
    case "button":
      return "button";
    default:
      return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { imageBase64 } = parsed.data;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ components: [] }, { status: 500 });
    }

    const prompt = `Analyze this website screenshot. Return ONLY a JSON array of components
that would recreate this layout. Use these types only:
hero, navbar, features, testimonial, contact, footer, textblock, image, button
Each object: { type, props }`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ components: [] }, { status: 500 });
    }

    const data: any = await response.json().catch(() => ({}));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const components = extractJSONArray(String(text));

    // Map to internal format expected by the editor (types only).
    const mapped = components
      .map((c: any) => {
        const type = mapType(c?.type);
        if (!type) return null;
        return { type, props: c?.props ?? {} };
      })
      .filter(Boolean);

    return NextResponse.json({ components: mapped });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI screenshot failed" }, { status: 500 });
  }
}

