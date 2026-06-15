import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }
    const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are an expert website landing page designer API working on the "Buildify" application.
Your job is to read the user's string prompt, and strictly output a RAW JSON Array of components to build the layout they requested, aligning loosely to the style: "${style}".

Available Buildify Block components you can use: 
"navbar", "hero", "heading", "text", "image", "gallery", "split", "stats", "pricing", "featureCards", "testimonial", "faq", "newsletter", "contactForm", "footer", "buttonGroup", "logos", "video"

CRITICAL INSTRUCTIONS:
1. ONLY return a raw JSON array. DO NOT wrap the payload in \`\`\`json markdown blocks. Just the array.
2. Formulate realistic contextual prose/text (e.g if they ask for a bakery, write bakery titles, bakery FAQ answers, etc.) and inject them inside the "props" object.

Output Format Example:
[
  { "type": "navbar", "props": {} },
  { "type": "hero", "props": { "title": "Artisan Breads", "subtitle": "Baked fresh daily in Brooklyn", "buttonText": "Order Now" } },
  { "type": "featureCards", "props": { "features": [{ "title": "Sourdough", "desc": "Fermented for 48 hours." }, { "title": "Croissants", "desc": "Flaky buttery perfection." }] } },
  { "type": "footer", "props": {} }
]`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: `Build me a layout for: ${prompt}` }]}],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
    };

    const res = await fetch(modelUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Gemini API Error");

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const blocks = JSON.parse(text);

    return NextResponse.json({ blocks });
  } catch(e: any) {
    console.error("AI Gen Error:", e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
