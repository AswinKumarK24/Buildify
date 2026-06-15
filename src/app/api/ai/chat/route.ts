import { z } from "zod";

export const runtime = "nodejs";

const RequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.string().min(1),
      content: z.string(),
    }),
  ),
});

type ChatMessage = { role: string; content: string };

// Minimal equivalent of "StreamingTextResponse" so we can stream tokens without
// adding extra dependencies.
function StreamingTextResponse(stream: ReadableStream<Uint8Array>, init?: ResponseInit) {
  return new Response(stream, {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response("Invalid request", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    const { messages } = parsed.data as { messages: ChatMessage[] };

    const systemMessage = "You are a helpful assistant.";
    const ollamaMessages: ChatMessage[] = [{ role: "system", content: systemMessage }, ...messages];

    let ollamaRes: Response;
    try {
      ollamaRes = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          stream: true,
          messages: ollamaMessages,
        }),
        signal: req.signal,
      });
    } catch (e) {
      return new Response(
        "Ollama is not running (or localhost:11434 is unreachable). Start Ollama and try again.",
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
    }

    if (!ollamaRes.ok) {
      return new Response(`Ollama request failed with status ${ollamaRes.status}.`, {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (!ollamaRes.body) {
      return new Response("Ollama response body was empty.", {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = ollamaRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (!value) continue;

            buffer += decoder.decode(value, { stream: true });

            // Ollama streaming typically emits NDJSON (one JSON object per line).
            const parts = buffer.split("\n");
            buffer = parts.pop() ?? "";

            for (const part of parts) {
              const trimmed = part.trim();
              if (!trimmed) continue;

              const jsonText = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
              if (!jsonText) continue;

              try {
                const parsedChunk = JSON.parse(jsonText) as any;

                const token =
                  typeof parsedChunk?.message?.content === "string"
                    ? parsedChunk.message.content
                    : typeof parsedChunk?.response === "string"
                      ? parsedChunk.response
                      : "";

                if (token) controller.enqueue(encoder.encode(token));

                if (parsedChunk?.done === true) {
                  // Don't immediately close; sometimes more chunks arrive.
                }
              } catch {
                // Ignore malformed partial lines; they'll be completed in later chunks.
              }
            }
          }

          // Flush any remaining buffered JSON.
          const remaining = buffer.trim();
          if (remaining) {
            const jsonText = remaining.startsWith("data:") ? remaining.slice(5).trim() : remaining;
            try {
              const parsedChunk = JSON.parse(jsonText) as any;
              const token =
                typeof parsedChunk?.message?.content === "string"
                  ? parsedChunk.message.content
                  : typeof parsedChunk?.response === "string"
                    ? parsedChunk.response
                    : "";
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Ignore.
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return new Response("AI chat failed.", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

