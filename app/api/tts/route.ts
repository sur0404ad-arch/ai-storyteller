import { NextRequest } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICE_IDS: Record<string, string> = {
  michael: "wBXNqKUATyqu0RtYt25i", // Adam
  james: "7Uu6s58Uu5fPHvCtI4QZ", // Marcus
  robert: "wyWA56cQNU2KqUW4eCsI", // Clyde
  emma: "qSeXEcewz7tA0Q0qk9fH", // Victoria
  olivia: "pjcYQlDFKMbcOUp6F5GD", // Brittney
  sophia: "1WJaWI8vIQrJWzWEqG4i", // Tris
};

export async function POST(req: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return Response.json(
        { error: "Missing ELEVENLABS_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const text = body.text;
    const voice = body.voice || body.voiceId || "michael";

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const elevenlabsVoiceId = VOICE_IDS[voice] || VOICE_IDS.michael;

    const elevenlabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenlabsVoiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.85,
          },
        }),
      }
    );

    if (!elevenlabsResponse.ok) {
      const errorText = await elevenlabsResponse.text();

      return Response.json(
        {
          error: "ElevenLabs request failed",
          details: errorText,
        },
        { status: 500 }
      );
    }

    return new Response(elevenlabsResponse.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "TTS route failed" }, { status: 500 });
  }
}