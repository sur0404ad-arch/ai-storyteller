import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICE_IDS: Record<string, string> = {
  michael: "wBXNqKUATyqu0RtYt25i",
  james: "7Uu6s58Uu5fPHvCtI4QZ",
  robert: "wyWA56cQNU2KqUW4eCsI",
  emma: "qSeXEcewz7tA0Q0qk9fH",
  olivia: "pjcYQlDFKMbcOUp6F5GD",
  sophia: "1WJaWI8vIQrJWzWEqG4i",
};

type PrepareResult = {
  voice: string;
  cacheKey: string;
  status: "cached" | "generated" | "failed";
  error?: string;
};

function createCacheKey(text: string, voiceId: string) {
  return createHash("sha256").update(`${voiceId}:${text}`).digest("hex");
}

async function generateAndCacheAudio(
  text: string,
  voiceId: string
): Promise<Omit<PrepareResult, "voice">> {
  const cacheDir = path.join(process.cwd(), ".cache", "tts");
  const cacheKey = createCacheKey(text, voiceId);
  const cacheFile = path.join(cacheDir, `${cacheKey}.mp3`);

  await mkdir(cacheDir, { recursive: true });

  try {
    await readFile(cacheFile);

    return {
      cacheKey,
      status: "cached",
    };
  } catch {
    // cache miss — нет кэша, создаём аудио
  }

  const elevenlabsVoiceId = VOICE_IDS[voiceId] || VOICE_IDS.michael;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${elevenlabsVoiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.52,
          similarity_boost: 0.86,
          style: 0.22,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    return {
      cacheKey,
      status: "failed",
      error: errorText,
    };
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());

  await writeFile(cacheFile, audioBuffer);

  return {
    cacheKey,
    status: "generated",
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return Response.json(
        {
          error: "Missing ELEVENLABS_API_KEY",
        },
        {
          status: 500,
        }
      );
    }

    const body = await req.json();

    const chunks = Array.isArray(body.chunks) ? body.chunks : [];
    const voices = Array.isArray(body.voices) ? body.voices : ["michael"];

    if (chunks.length === 0) {
      return Response.json(
        {
          error: "No chunks provided",
        },
        {
          status: 400,
        }
      );
    }

    const safeChunks: string[] = chunks
      .map((chunk: unknown) => String(chunk || "").trim())
      .filter((chunk: string) => chunk.length > 0)
      .slice(0, 8);

    const safeVoices: string[] = voices
      .map((voice: unknown) => String(voice || "").trim())
      .filter((voice: string) => Boolean(VOICE_IDS[voice]))
      .slice(0, 6);

    const results: PrepareResult[] = [];

    for (const chunk of safeChunks) {
      for (const voice of safeVoices) {
        const result = await generateAndCacheAudio(chunk, voice);

        results.push({
          voice,
          ...result,
        });
      }
    }

    return Response.json({
      ok: true,
      prepared: results,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Prepare narration failed",
      },
      {
        status: 500,
      }
    );
  }
}