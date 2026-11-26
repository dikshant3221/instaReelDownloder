/** Shared Reel types + strict daily constraints. No demo/fake discovery lives here. */

/**
 * Vrindavan channel filter: only reels from recognized temple/spiritual
 * CHANNELS are eligible — personal Instagram accounts are rejected.
 *
 * 1. Positive allowlist of known official Vrindavan temple/darshan handles.
 * 2. Otherwise BOTH the handle AND the caption must carry temple/channel
 *    markers (e.g. "@x_mandir" + "Vrindavan darshan") — a personal handle
 *    posting temple content once does not pass.
 */
export const VRINDAVAN_CHANNELS = new Set(
  [
    "banke_bihari_mandir_official", "bankebiharimandirofficial",
    "vrindavan.reels", "vrindavan_bankebihari", "shri_vrindavan_ji_official",
    "shrihitradhavallabhmandir", "shrihitradhavallabhlal", "shriradhavallabhmandir",
    "office_radharaman", "shri_radharaman_lal_ju", "radharamanji.temple",
    "govind_dev_ji_temple", "govind_dev_ji_", "govinddevji_daily_darshan",
    "premanand__maharaj_official", "premanandji_.maharaj_official",
    "premanand_ji_maharaj_121", "bhaktipath", "jaishreebhagwan1950",
    "vrindavan.darshan", "banke_bihari_bhakt", "bihari_ji_ki_gali",
    "vrindavan_ras", "radhavallabh_prem", "hit_radha_vallabh",
    "seva_kunj_dunj", "seva_kunj_darshan", "vrindavan_satsang",
    "radha_keli_kunj", "shrimad_bhagwat_katha", "braj_ke_sant",
  ].map((h) => h.toLowerCase()),
);

const CHANNEL_MARKER =
  /(mandir|temple|vrindavan|mathura|braj|official|darshan|sanatan|bhakti|satsang|katha|seva)/i;

/** True when this reel comes from a Vrindavan-related channel (not a personal account). */
export function isVrindavanSource(author: string, caption: string): boolean {
  const handle = author.replace(/^@/, "").toLowerCase();
  if (VRINDAVAN_CHANNELS.has(handle)) return true;
  // Heuristic: channel-ish handle AND temple-ish content, both present.
  return CHANNEL_MARKER.test(author) && CHANNEL_MARKER.test(caption);
}


// Daily model: find up to 20 eligible videos/day, UPLOAD only the top 5/day.
export const DAILY_LIMIT = 5;          // uploads per IST day (YouTube budget)
export const FIND_DAILY = 20;          // downloads collected per IST day
export const MIN_VIEWS = 100_000;      // strictly MORE than this (1 lakh+)

export interface TopicSeed {
  id: number;
  slug: string;
  name: string;
  hindiName: string;
  folder: string;
  keywords: string[];
}

export interface Candidate {
  videoId: string;
  url: string;
  topicSlug: string;
  topicId: number;
  caption: string;
  author: string;
  /** Exact views/plays, or an explicitly labelled conservative lower-bound. */
  viewCount: number;
  likeCount: number;
  publishedAgoHrs: number;
}

/**
 * Strict one-per-topic selection.
 *
 * - A topic already completed today is excluded.
 * - Only the highest verified-metric candidate for each missing topic is used.
 * - Therefore one scan and all later scans combined can never select more than
 *   one approved video for any topic on the same IST date.
 * - The database adds a second, race-proof unique constraint on
 *   (topic_id, ist_date) for AI-approved completed rows.
 */
export function selectDiverse<T extends Candidate>(
  fresh: T[],
  quota: number,
  todayByTopic: Map<string, number>,
): T[] {
  const bestMissing = new Map<string, T>();
  for (const candidate of fresh) {
    if ((todayByTopic.get(candidate.topicSlug) ?? 0) >= 1) continue;
    const current = bestMissing.get(candidate.topicSlug);
    if (!current || candidate.viewCount > current.viewCount) {
      bestMissing.set(candidate.topicSlug, candidate);
    }
  }
  return [...bestMissing.values()]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, Math.max(0, quota));
}
