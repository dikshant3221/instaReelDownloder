import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiProviders, topics } from "@/db/schema";
import type { RealCandidate } from "@/lib/instagram-real";
import type { TopicSeed } from "@/lib/reels";

interface RefPhoto {
  mime: string;
  base64: string;
}

function parseDataUrl(u: string): RefPhoto | null {
  const m = u.match(/^data:(image\/[a-z0-9.+-]+);base64,(.*)$/i);
  return m ? { mime: m[1], base64: m[2] } : null;
}

/** ALL reference photos for a topic (up to 3) — multi-angle matching. */
async function loadReferencePhotos(topicId: number): Promise<RefPhoto[]> {
  try {
    const row = (
      await db
        .select({ ref: topics.referenceImage, photos: topics.referencePhotos })
        .from(topics)
        .where(eq(topics.id, topicId))
        .limit(1)
    )[0];
    if (!row) return [];
    const out: RefPhoto[] = [];
    for (const u of row.photos ?? []) {
      const p = parseDataUrl(u);
      if (p) out.push(p);
    }
    if (out.length === 0 && row.ref) {
      const p = parseDataUrl(row.ref);
      if (p) out.push(p);
    }
    return out.slice(0, 3);
  } catch {
    return [];
  }
}

export type AiVerdict = "match" | "mismatch" | "uncertain" | "unavailable";

export interface AiReviewResult {
  verdict: AiVerdict;
  confidence: number;
  detectedTopic: string;
  reason: string;
  evidence: string[];
  provider: string;
  attempts: string[];
  /** Sample frame (data URL) of what the AI saw — stored for rejection audit. */
  frameDataUrl?: string;
}

interface ProviderConfig {
  slug: string;
  name: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  active: boolean;
}

// Topic types: deities/temples look alike on camera (AI must NOT try to tell
// them apart), whereas saints are specific people whose discourse we want.
const SAINT_TOPICS = new Set(["premanand-ji-maharaj", "indresh-ji-maharaj", "vinod-baba-ji"]);

const TOPIC_RULES: Record<string, string> = {
  "banke-bihari-ji": "Banke Bihari Ji temple / deity darshan in Vrindavan.",
  "radha-vallabh-ji": "Radha Vallabh Ji temple / deity darshan.",
  "radha-raman-ji": "Radha Raman Ji temple / deity darshan.",
  "radha-govind-dev-ji": "Govind Dev Ji temple / deity darshan.",
  "premanand-ji-maharaj": "Premanand Ji Maharaj giving pravachan (spiritual discourse) / satsang.",
  "indresh-ji-maharaj": "Indresh Upadhyay (Indresh Ji Maharaj) giving Bhagwat Katha / pravachan.",
  "vinod-baba-ji": "Vinod Baba Ji giving pravachan / satsang.",
};

function reviewPrompt(
  c: RealCandidate,
  topic: TopicSeed,
  refCount: number,
  transcript?: string,
): string {
  const name = topic.name.replace(/^Shri\s+/i, "");
  const isSaint = SAINT_TOPICS.has(topic.slug);
  const subject = isSaint ? "saint" : "deity/temple";

  // When the user has provided a reference photo, the model CAN compare.
  const refBlock =
    refCount > 0
      ? `\nIMAGES 1-${refCount} are OFFICIAL REFERENCE PHOTOS of ${name} (the correct ${subject}, multiple angles). All remaining images are frames sampled from the video.
- Compare the video frames against the reference photos.
- "relevant": the same ${subject} as the references appears in the video, OR it is closely related devotional content for it, OR you are unsure.
- "wrong_subject": the video clearly shows a DIFFERENT, specific ${subject} than the references (confidence >= 80).
- "unrelated": clearly non-devotional (ad, product, song/dance, movie, meme).
Use the references to judge identity; still give the benefit of the doubt when unsure.`
      : "";
  const frameBlock = `\nYou see real sampled frames from the video.`;
  void isSaint;
  void frameBlock;

  const verdictKeys = refCount > 0 ? "relevant|wrong_subject|unrelated" : "relevant|unrelated";

  return `You verify whether an Instagram Reel matches a devotional target.

TARGET: ${name} — ${TOPIC_RULES[topic.slug]}
This Reel was found by searching Instagram specifically for "${name}".

Caption: ${c.caption.slice(0, 900)}
Author: ${c.author}
${refBlock}
${transcript ? `\nTRANSCRIPT of what is SPOKEN in the video (strong evidence of the subject): "${transcript.slice(0, 600)}"` : ""}

Default to "relevant" unless you are highly confident (>= 80) it is wrong. confidence = how sure you are (0-100).

Return ONLY strict JSON, no markdown:
{"verdict":"${verdictKeys}","confidence":0,"reason":"one short sentence"}`;
}

async function extractFrames(filePath: string, videoId: string): Promise<{ dir: string; images: Buffer[] }> {
  const binary = ffmpegPath ? String(ffmpegPath) : "";
  if (!binary) throw new Error("bundled FFmpeg is unavailable");
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), `vd-ai-${videoId}-`));
  const output = path.join(dir, "frame-%02d.jpg");
  await new Promise<void>((resolve, reject) => {
    execFile(
      binary,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-skip_frame",
        "nokey", // decode only keyframes → much faster
        "-i",
        filePath,
        "-an", // ignore audio
        "-vf",
        "scale=440:-2:force_original_aspect_ratio=decrease",
        "-frames:v",
        "3",
        "-vsync",
        "vfr",
        "-q:v",
        "6",
        "-y",
        output,
      ],
      { windowsHide: true, timeout: 30_000, maxBuffer: 1_000_000 },
      (error, _stdout, stderr) => {
        if (error) reject(new Error(`FFmpeg frame extraction failed: ${String(stderr).slice(-250)}`));
        else resolve();
      },
    );
  });
  const names = (await fs.promises.readdir(dir)).filter((n) => n.endsWith(".jpg")).sort();
  const images = await Promise.all(names.slice(0, 3).map((n) => fs.promises.readFile(path.join(dir, n))));
  if (images.length === 0) throw new Error("no frames could be extracted from the MP4");
  return { dir, images };
}

function parseReview(raw: string, provider: string): AiReviewResult {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("provider returned no JSON verdict");
  const value = JSON.parse(match[0]) as Record<string, unknown>;
  const raw3 = String(value.verdict ?? "uncertain").toLowerCase().trim();
  // Map the relevance vocabulary (and any legacy words) to internal verdicts.
  const map: Record<string, AiVerdict> = {
    relevant: "match",
    match: "match",
    yes: "match",
    wrong_topic: "mismatch",
    "wrong-topic": "mismatch",
    wrong_subject: "mismatch",
    "wrong-subject": "mismatch",
    mismatch: "mismatch",
    unrelated: "mismatch",
    no: "mismatch",
    uncertain: "uncertain",
    unknown: "uncertain",
  };
  const verdict = map[raw3] ?? "uncertain";
  return {
    verdict,
    confidence: Math.max(0, Math.min(100, Number(value.confidence) || 0)),
    detectedTopic: String(value.detected_topic ?? "unknown"),
    reason: String(value.reason ?? "No reason supplied").slice(0, 700),
    evidence: Array.isArray(value.evidence) ? value.evidence.map(String).slice(0, 5) : [],
    provider,
    attempts: [],
  };
}

async function callGemini(
  p: ProviderConfig,
  prompt: string,
  images: Buffer[],
  references: RefPhoto[] = [],
): Promise<AiReviewResult> {
  const model = p.model || "gemini-2.5-flash-lite";
  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  for (const ref of references) {
    parts.push({ inline_data: { mime_type: ref.mime, data: ref.base64 } });
  }
  for (const image of images) {
    parts.push({ inline_data: { mime_type: "image/jpeg", data: image.toString("base64") } });
  }
  const res = await fetch(
    `${p.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(p.apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0, maxOutputTokens: 220, responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(25_000),
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 180)}`);
  const j = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = j.candidates?.[0]?.content?.parts?.map((x) => x.text ?? "").join("") ?? "";
  return parseReview(text, p.name);
}

async function callOpenAiCompatible(
  p: ProviderConfig,
  prompt: string,
  images: Buffer[],
  references: RefPhoto[] = [],
): Promise<AiReviewResult> {
  const content: Array<Record<string, unknown>> = [{ type: "text", text: prompt }];
  const pushImage = (url: string) =>
    content.push(
      p.slug === "mistral"
        ? { type: "image_url", image_url: url }
        : { type: "image_url", image_url: { url } },
    );
  for (const ref of references) pushImage(`data:${ref.mime};base64,${ref.base64}`);
  for (const image of images) {
    pushImage(`data:image/jpeg;base64,${image.toString("base64")}`);
  }
  const res = await fetch(`${p.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${p.apiKey}` },
    body: JSON.stringify({
      model: p.model,
      messages: [{ role: "user", content }],
      temperature: 0,
      max_tokens: 220,
      stream: false,
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 180)}`);
  const j = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  };
  const raw = j.choices?.[0]?.message?.content;
  const text = Array.isArray(raw) ? raw.map((x) => x.text ?? "").join("") : String(raw ?? "");
  return parseReview(text, p.name);
}

async function providersWithKeys(): Promise<ProviderConfig[]> {
  const rows = await db
    .select()
    .from(aiProviders)
    .where(eq(aiProviders.enabled, true))
    .orderBy(desc(aiProviders.active), asc(aiProviders.id));
  return rows
    .filter((p): p is typeof p & { apiKey: string } => Boolean(p.apiKey?.trim()))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      baseUrl: p.baseUrl,
      model: p.model,
      apiKey: p.apiKey,
      active: p.active,
    }));
}

export async function hasVisionProvider(): Promise<boolean> {
  return (await providersWithKeys()).length > 0;
}

/**
 * Active provider is attempted first, then every other enabled keyed provider.
 * HTTP 429, quota, timeout, malformed JSON and uncertain verdicts automatically
 * fall through to the next provider. A decisive high-confidence verdict wins.
 */
export async function reviewDownloadedVideo(
  c: RealCandidate,
  topic: TopicSeed,
  filePath: string,
  transcript?: string,
): Promise<AiReviewResult> {
  const providers = await providersWithKeys();
  if (providers.length === 0) {
    return {
      verdict: "unavailable",
      confidence: 0,
      detectedTopic: "unknown",
      reason: "No AI provider key is configured. Add at least one key in API Keys.",
      evidence: [],
      provider: "none",
      attempts: [],
    };
  }

  let tempDir = "";
  const attempts: string[] = [];
  let anyProviderResponded = false;
  let bestLean: AiReviewResult | null = null; // remembered softer signal for fallback accept
  try {
    const extracted = await extractFrames(filePath, c.videoId);
    tempDir = extracted.dir;
    const references = await loadReferencePhotos(topic.id);
    const prompt = reviewPrompt(c, topic, references.length, transcript);
    // First sampled frame kept as the audit image for rejections (#16).
    const frameDataUrl = extracted.images[0]
      ? `data:image/jpeg;base64,${extracted.images[0].toString("base64")}`
      : undefined;
    for (const p of providers) {
      try {
        const result =
          p.slug === "gemini"
            ? await callGemini(p, prompt, extracted.images, references)
            : await callOpenAiCompatible(p, prompt, extracted.images, references);
        anyProviderResponded = true;
        attempts.push(`${p.name}: ${result.verdict} (${result.confidence}%)`);
        await db
          .update(aiProviders)
          .set({ status: "ok", statusDetail: `Vision review operational (${p.model})`, lastTestedAt: new Date() })
          .where(eq(aiProviders.slug, p.slug));

        // ACCEPT by default: any "relevant" verdict passes immediately.
        if (result.verdict === "match") {
          return { ...result, detectedTopic: topic.slug, attempts };
        }
        // REJECT only when a provider is HIGHLY confident (>=80) that the video
        // clearly shows a different, specific subject or is obviously non-devotional.
        if (result.verdict === "mismatch" && result.confidence >= 85) {
          return { ...result, attempts, frameDataUrl };
        }
        // A weak/uncertain negative is NOT a rejection — we trust the keyword
        // search. Remember it only so the fallback can still accept.
        if (!bestLean) {
          bestLean = { ...result, verdict: "match", detectedTopic: topic.slug };
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        attempts.push(`${p.name}: failed (${message.slice(0, 120)})`);
        await db
          .update(aiProviders)
          .set({ status: "error", statusDetail: message.slice(0, 500), lastTestedAt: new Date() })
          .where(eq(aiProviders.slug, p.slug));
      }
    }

    // Any provider responded without a confident rejection → ACCEPT.
    // The keyword search already established the subject, so we give the
    // video the benefit of the doubt (only obvious wrong matches are blocked).
    if (anyProviderResponded) {
      return {
        frameDataUrl,
        ...(bestLean ?? {
          confidence: 55,
          detectedTopic: topic.slug,
          reason: "Accepted — found via a search specific to this topic.",
          evidence: [],
          provider: "fallback-chain",
          attempts: [],
        }),
        verdict: "match",
        detectedTopic: topic.slug,
        confidence: Math.max(bestLean?.confidence ?? 0, 55),
        reason: bestLean?.reason || "Accepted — found via a search specific to this topic.",
        attempts,
      };
    }

    // No provider actually responded (all errored) → unavailable, keep for retry.
    return {
      verdict: "unavailable",
      confidence: 0,
      detectedTopic: "unknown",
      reason: "All AI providers failed to respond. Will retry on the next scan.",
      evidence: [],
      provider: "fallback-chain",
      attempts,
    };
  } catch (e) {
    return {
      verdict: "unavailable",
      confidence: 0,
      detectedTopic: "unknown",
      reason: e instanceof Error ? e.message : String(e),
      evidence: [],
      provider: "frame-extractor",
      attempts,
    };
  } finally {
    if (tempDir) await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
