import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiProviders } from "@/db/schema";

/**
 * Spoken-content transcript (Gemini audio understanding).
 *
 * Why: for pravachan/saint videos, WHAT is said is the strongest proof of
 * topic — far stronger than frames. The transcript is stored on the video
 * row, fed to the AI content check as extra evidence, and makes the library
 * searchable by spoken words.
 *
 * Only Google Gemini reliably accepts audio input — used only when that key
 * exists. Everything is best-effort: a missing transcript never blocks a video.
 */

function geminiKey(): { key: string; model: string } | null {
  return null; // populated async below
}

async function geminiProvider(): Promise<{ key: string; model: string } | null> {
  try {
    const rows = await db
      .select()
      .from(aiProviders)
      .where(eq(aiProviders.slug, "gemini"))
      .limit(1);
    const p = rows[0];
    if (!p?.apiKey || !p.enabled) return null;
    return { key: p.apiKey, model: p.model || "gemini-2.5-flash-lite" };
  } catch {
    return null;
  }
}

/** Extracts the first ~50s of audio as MP3 (small payload for the API). */
async function extractAudio(filePath: string, outPath: string): Promise<boolean> {
  const binary = ffmpegPath ? String(ffmpegPath) : "";
  if (!binary) return false;
  return new Promise((resolve) => {
    execFile(
      binary,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-t",
        "50",
        "-i",
        filePath,
        "-vn",
        "-ac",
        "1",
        "-b:a",
        "32k",
        "-f",
        "mp3",
        "-y",
        outPath,
      ],
      { windowsHide: true, timeout: 30_000 },
      (err) => resolve(!err),
    );
  });
}

/**
 * Best-effort transcript of the video's spoken content.
 * Returns "" when unavailable (no Gemini key, no audio, API failure).
 */
export async function transcribeVideo(filePath: string): Promise<string> {
  try {
    const provider = await geminiProvider();
    if (!provider) return "";
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "vd-tts-"));
    const audio = path.join(dir, "clip.mp3");
    try {
      if (!(await extractAudio(filePath, audio))) return "";
      const size = (await fs.promises.stat(audio)).size;
      if (size < 2_000) return ""; // effectively silent clip
      const b64 = (await fs.promises.readFile(audio)).toString("base64");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}:generateContent?key=${encodeURIComponent(provider.key)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: "Transcribe this Hindi devotional discourse/audio EXACTLY as spoken, preserving names of saints and temples. If it is only music with no speech, reply with SILENT. Reply with ONLY the transcript." },
                  { inline_data: { mime_type: "audio/mpeg", data: b64 } },
                ],
              },
            ],
            generationConfig: { temperature: 0, maxOutputTokens: 700 },
          }),
          signal: AbortSignal.timeout(45_000),
        },
      );
      if (!res.ok) return "";
      const j = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = j.candidates?.[0]?.content?.parts?.map((x) => x.text ?? "").join("").trim() ?? "";
      if (!text || /^silent$/i.test(text)) return "";
      return text.slice(0, 2000);
    } finally {
      await fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  } catch {
    return "";
  }
}

export async function hasTranscriptProvider(): Promise<boolean> {
  return (await geminiProvider()) !== null;
}

// silence unused-helper lint (kept for future provider expansion)
void geminiKey;
