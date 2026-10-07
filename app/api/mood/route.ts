import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { MoodSchema } from "@/lib/mood";

const client = new Anthropic();

const SYSTEM = `You are a synesthetic art director. The user describes how they feel or what they are coding.
Translate their emotional state into an aurora: pick colors by feeling (anxious → sharp magentas and reds,
calm → teals and deep blues, euphoric → hot pinks and golds, tired → muted violets), set the energy, and choose
the lo-fi stream that would comfort or amplify them. Reply in the same language the user wrote in.`;

export async function POST(req: Request) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text?.trim() || text.length > 1000) {
    return Response.json({ error: "Write 1–1000 characters about your mood." }, { status: 400 });
  }

  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      // If a safety classifier declines, retry server-side on the recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { effort: "low", format: betaZodOutputFormat(MoodSchema) },
      messages: [{ role: "user", content: text }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "Couldn't read that vibe — try describing it differently." }, { status: 422 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Server is missing a valid ANTHROPIC_API_KEY." }, { status: 500 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Too many vibes at once — try again in a moment." }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      return Response.json({ error: `AI error (${err.status})` }, { status: 502 });
    }
    throw err;
  }
}
