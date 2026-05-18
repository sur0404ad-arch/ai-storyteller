import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICE_IDS: Record<string, string> = {
  michael: "wBXNqKUATyqu0RtYt25i",
  james: "7Uu6s58Uu5fPHvCtI4QZ",
  robert: "wyWA56cQNU2KqUW4eCsI",
  emma: "qSeXEcewz7tA0Q0qk9fH",
  olivia: "pjcYQlDFKMbcOUp6F5GD",
  sophia: "1WJaWI8vIQrJWzWEqG4i",
};

const TEST_TEXT =
  "Welcome to AI Storyteller. This is a short premium voice test.";

export async function POST(req: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return Response.json(
        { error: "Missing ELEVENLABS_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const voice = body.voice || "michael";

    const elevenlabsVoiceId = VOICE_IDS[voice];

    if (!elevenlabsVoiceId) {
      return Response.json(
        { error: "Unknown voice" },
        { status: 400 }
      );
    }

    const elevenlabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenlabsVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: TEST_TEXT,
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

    const audioBuffer = Buffer.from(
      await elevenlabsResponse.arrayBuffer()
    );

    const outputDir = path.join(
      process.cwd(),
      "public",
      "generated"
    );

    await mkdir(outputDir, { recursive: true });

    const fileName = `test-${voice}.mp3`;
    const filePath = path.join(outputDir, fileName);

    await writeFile(filePath, audioBuffer);

    return Response.json({
      success: true,
      file: `/generated/${fileName}`,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Generate voice failed" },
      { status: 500 }
    );
  }
}