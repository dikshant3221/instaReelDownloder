import { execFile } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

/**
 * Perceptual frame hash (aHash): a 64-bit signature of the video's visual
 * content. Unlike sha256 (identical bytes only), a small re-encode of the
 * SAME visual still lands within a few bits — so a reel re-uploaded under a
 * different shortcode is caught as a duplicate.
 */

/** Extracts an 8×8 grayscale signature from ~20% into the video. */
export async function computePerceptualHash(filePath: string): Promise<string | null> {
  const binary = ffmpegPath ? String(ffmpegPath) : "";
  if (!binary) return null;
  return new Promise((resolve) => {
    execFile(
      binary,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        "0.2",
        "-i",
        filePath,
        "-frames:v",
        "1",
        "-vf",
        "select='not(mod(n\\,100))',scale=8:8:flags=area,format=gray",
        "-f",
        "rawvideo",
        "-",
      ],
      { windowsHide: true, timeout: 30_000, maxBuffer: 1_000_000 },
      (err, stdout) => {
        if (err) {
          // Fallback: simple seek without the select filter.
          execFile(
            binary,
            ["-hide_banner", "-loglevel", "error", "-ss", "0.2", "-i", filePath, "-frames:v", "1", "-vf", "scale=8:8:flags=area,format=gray", "-f", "rawvideo", "-"],
            { windowsHide: true, timeout: 30_000, maxBuffer: 1_000_000 },
            (err2, stdout2) => resolve(hashFromBuffer(err2 ? null : Buffer.from(stdout2, "binary"))),
          );
          return;
        }
        resolve(hashFromBuffer(Buffer.from(stdout, "binary")));
      },
    );
  });
}

function hashFromBuffer(buf: Buffer | null): string | null {
  if (!buf || buf.length < 64) return null;
  const pixels = buf.subarray(0, 64);
  let mean = 0;
  for (const p of pixels) mean += p;
  mean /= 64;
  // 64-bit string: pixel >= mean → 1
  let bits = "";
  for (const p of pixels) bits += p >= mean ? "1" : "0";
  return bits;
}

/** Hamming distance between two 64-bit hash strings (null-safe). */
export function hammingDistance(a: string | null, b: string | null): number {
  if (!a || !b || a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

/** Visually similar when ≤ 8 of 64 bits differ. */
export function isVisuallySimilar(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  return hammingDistance(a, b) <= 8;
}
