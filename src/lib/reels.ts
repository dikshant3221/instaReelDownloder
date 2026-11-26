/** Shared Reel types + strict daily constraints. No demo/fake discovery lives here. */

export const DAILY_LIMIT = 7; // exactly one approved video for each of 7 topics
export const MIN_VIEWS = 1_000_000; // strictly MORE than this verified public metric (1M+)

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
