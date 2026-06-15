import { NextResponse } from "next/server";
import { z } from "zod";

import type { AiGenerateResponse, AiGenerateRequest, Block, StylePreset } from "@/lib/buildify/types";
import { createBlock } from "@/lib/buildify/templates";

export const runtime = "nodejs";

const RequestSchema = z.object({
  prompt: z.string().default(""),
  style: z.enum(["Portfolio", "Business", "Landing Page", "Blog", "Restaurant", "Agency"]),
});

type GeminiType =
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
    // Try to locate a JSON array inside the text.
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

function mapGeminiToBlockType(type: GeminiType): Block["type"] | null {
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

function normalizePropsForBlock(blockType: Block["type"], rawProps: unknown): Record<string, unknown> {
  const p = (rawProps && typeof rawProps === "object") ? (rawProps as Record<string, unknown>) : {};

  if (blockType === "navbar") {
    const brandText = (typeof p.logo === "string" ? p.logo : typeof p.brandText === "string" ? p.brandText : "Buildify") as string;
    const links = Array.isArray(p.links) ? p.links.filter((x) => typeof x === "string") : ["Home", "Services", "Contact"];
    return { brandText, links: links.slice(0, 5) };
  }

  if (blockType === "hero") {
    const headline = typeof p.headline === "string" ? p.headline : "Your Amazing Headline";
    const subheadline = typeof p.subheadline === "string" ? p.subheadline : "A short paragraph that supports your headline and guides your visitors.";
    const ctaText = (typeof p.cta === "string" ? p.cta : typeof p.ctaText === "string" ? p.ctaText : "Get Started") as string;

    const bg = typeof p.bg === "string" ? p.bg : undefined;
    const useGradient = bg ? bg.toLowerCase().includes("linear-gradient") : true;
    const backgroundColor = !useGradient && bg ? bg : "#16213e";
    return { headline, subheadline, ctaText, useGradient, backgroundColor };
  }

  if (blockType === "text") {
    const text = typeof (p as any).text === "string" ? (p as any).text : "Tell your story here.";
    const color = typeof (p as any).color === "string" ? (p as any).color : "#0a0a0f";
    const fontSize = typeof (p as any).fontSize === "number" ? (p as any).fontSize : 16;
    const align = (p as any).align === "center" || (p as any).align === "right" ? (p as any).align : "left";
    return { text, color, fontSize: Math.max(12, Math.min(28, Number(fontSize))), align };
  }

  if (blockType === "featureCards") {
    const cards = Array.isArray((p as any).cards) ? (p as any).cards : [];
    const normalizedCards = cards.slice(0, 3).map((c: any) => ({
      emoji: typeof c?.emoji === "string" ? c.emoji : "✨",
      title: typeof c?.title === "string" ? c.title : "Feature",
      desc: typeof c?.desc === "string" ? c.desc : "Description",
    }));
    return { cards: normalizedCards };
  }

  if (blockType === "testimonial") {
    const quote = typeof (p as any).quote === "string" ? (p as any).quote : "This product is incredible.";
    const author = typeof (p as any).author === "string" ? (p as any).author : "Author Name";
    const role = typeof (p as any).role === "string" ? (p as any).role : "Role / Title";
    return { quote, author, role };
  }

  if (blockType === "contactForm") {
    const submitText = typeof (p as any).submitText === "string" ? (p as any).submitText : typeof (p as any).cta === "string" ? (p as any).cta : "Send Message";
    return { submitText };
  }

  if (blockType === "image") {
    const url = typeof (p as any).url === "string" ? (p as any).url : "https://placehold.co/800x400/1a1a2e/00d4ff?text=Image";
    const alt = typeof (p as any).alt === "string" ? (p as any).alt : "Image";
    const radius = typeof (p as any).radius === "number" ? (p as any).radius : 16;
    const widthPct = typeof (p as any).widthPct === "number" ? (p as any).widthPct : 90;
    return { url, alt, radius: Math.max(0, Math.min(48, Number(radius))), widthPct: Math.max(30, Math.min(100, Number(widthPct))) };
  }

  if (blockType === "button") {
    const label = typeof (p as any).label === "string" ? (p as any).label : typeof (p as any).text === "string" ? (p as any).text : "Learn More";
    const bgColor = typeof (p as any).bgColor === "string" ? (p as any).bgColor : typeof (p as any).bg === "string" ? (p as any).bg : "#00d4ff";
    const radius = typeof (p as any).radius === "number" ? (p as any).radius : 14;
    const linkUrl = typeof (p as any).linkUrl === "string" ? (p as any).linkUrl : typeof (p as any).href === "string" ? (p as any).href : typeof (p as any).link === "string" ? (p as any).link : "#";
    return { label, bgColor, radius: Math.max(0, Math.min(28, Number(radius))), linkUrl };
  }

  if (blockType === "footer") {
    const copyright = typeof (p as any).copyright === "string" ? (p as any).copyright : `© ${new Date().getFullYear()} My Website`;
    const socials = Array.isArray((p as any).socials) ? (p as any).socials.filter((x: any) => typeof x === "string") : (Array.isArray((p as any).links) ? (p as any).links.filter((x: any) => typeof x === "string") : ["X", "IG", "YT"]);
    return { copyright, socials: socials.slice(0, 4) };
  }

  return {};
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const reqData = parsed.data as AiGenerateRequest;
    const style = reqData.style as StylePreset;

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      // Fail safely: return empty layout so the frontend fallback can handle UX.
      return NextResponse.json({ blocks: [] } satisfies AiGenerateResponse);
    }

    const prompt = reqData.prompt?.trim() ? reqData.prompt.trim() : "";
    const description = prompt
      ? `${prompt}\nStyle preset: ${style}`
      : `Style preset: ${style}`;

    const geminiPrompt = `You are a website layout generator. Based on this description: ${description}
Return ONLY a valid JSON array of component objects. No explanation, no markdown.
Each object must have: { type, props }
Available types: hero, navbar, features, testimonial, contact, footer, textblock, image, button
Example output:
[
  {
    type: 'navbar',
    props: { logo: 'MySite', links: ['Home','About','Contact'] }
  },
  {
    type: 'hero',
    props: {
      headline: 'Welcome to MySite',
      subheadline: 'We build amazing things',
      cta: 'Get Started',
      bg: 'linear-gradient(135deg, #1a1a2e, #16213e)'
    }
  }
]`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ blocks: [] } satisfies AiGenerateResponse, { status: 500 });
    }

    const data: any = await response.json().catch(() => ({}));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const components = extractJSONArray(String(text));

    const blocks: Block[] = components
      .map((c: any) => {
        const rawType: GeminiType = c?.type;
        const mappedType = mapGeminiToBlockType(rawType);
        if (!mappedType) return null;

        const baseBlock = createBlock(mappedType, style);
        const normalizedProps = normalizePropsForBlock(mappedType, c?.props);
        baseBlock.props = { ...baseBlock.props, ...normalizedProps };
        return baseBlock;
      })
      .filter(Boolean) as Block[];

    return NextResponse.json({ blocks } satisfies AiGenerateResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}

