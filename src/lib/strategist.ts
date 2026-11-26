/**
 * Upload Strategy Bot — thinks like a top 1% YouTube strategist.
 *
 * For every video it selects ONE proven viral formula (rotated deterministically
 * per video so uploads never repeat a structure), and injects that formula into
 * the AI copywriting prompt so title/description follow a deliberate strategy
 * instead of generic "amazing video" copy.
 *
 * Formulas are drawn from what actually works on Indian devotional Shorts:
 * FOMO, curiosity gaps, social proof, blessings, emotional transformation,
 * concrete specifics, direct questions, and end-reveals.
 */

export interface Strategy {
  id: string;
  name: string;
  /** Instruction injected into the AI prompt — the video MUST follow this. */
  instruction: string;
}

const FORMULAS: Strategy[] = [
  {
    id: "fomo",
    name: "FOMO / urgency",
    instruction:
      "Use an urgency hook: 'Don't scroll', 'Watch before it's gone', 'Wait for the ending' — make the viewer fear missing out.",
  },
  {
    id: "curiosity",
    name: "Curiosity gap",
    instruction:
      "Open a curiosity gap: 'Why is this…', 'What happens when…', 'You won't believe…' — the answer must feel one tap away.",
  },
  {
    id: "social-proof",
    name: "Social proof",
    instruction:
      "Imply massive popularity: 'Millions watched this', 'Everyone is sharing', 'Viral across India' — people follow the crowd.",
  },
  {
    id: "blessing",
    name: "Devotional blessing",
    instruction:
      "Promise a spiritual payoff: 'Watch for darshan blessing', 'Peace will fill your heart', 'Radha Rani's blessing today' — devotional viewers click blessings.",
  },
  {
    id: "transformation",
    name: "Emotional transformation",
    instruction:
      "Promise an emotional shift: 'This will make your day', 'Tears of joy guaranteed', 'Your mood will change' — emotion drives shares.",
  },
  {
    id: "specific",
    name: "Specific detail",
    instruction:
      "Lead with ONE concrete detail from this caption (a place, moment, number, or event) — specificity beats vagueness.",
  },
  {
    id: "question",
    name: "Direct question",
    instruction:
      "Make the title a direct question to the viewer about this exact content — questions pull comments, which lift reach.",
  },
  {
    id: "reveal",
    name: "Hidden reveal",
    instruction:
      "Promise a reveal: 'The last frame is priceless', 'Watch till the very end', 'Stay for the final darshan' — completion rate is king.",
  },
];

function hashOf(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Picks the formula for a video.
 *
 * - Without performance data: deterministic rotation (same video → same
 *   strategy; different videos → different strategies).
 * - With performance weights (from real post-publish stats): weighted random
 *   so formulas that ACTUALLY earn more views on this channel get picked
 *   more often — the Strategy Bot learns from your own analytics.
 */
export function pickStrategy(seed: string, weights?: Record<string, number>): Strategy {
  const h = hashOf(seed);
  if (weights && Object.keys(weights).length >= 2) {
    const values = FORMULAS.map((f) => weights[f.id] ?? 0);
    const known = values.filter((v) => v > 0);
    const fallbackWeight = known.length
      ? known.reduce((a, b) => a + b, 0) / known.length
      : 1;
    const total = values.reduce((acc, v) => acc + (v > 0 ? v : fallbackWeight), 0);
    let target = ((h >>> 0) / 0xffffffff) * total;
    for (let i = 0; i < FORMULAS.length; i++) {
      const w = values[i] > 0 ? values[i] : fallbackWeight;
      target -= w;
      if (target <= 0) return FORMULAS[i];
    }
  }
  return FORMULAS[h % FORMULAS.length];
}

/** Human-readable name for logs/dashboard. */
export function describeStrategy(s: Strategy): string {
  return `${s.name} (${s.id})`;
}
