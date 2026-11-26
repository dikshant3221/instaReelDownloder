import { ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { manualUploads, downloads } from "@/db/schema";
import { istDate } from "@/lib/ist";
import { getInsights } from "@/lib/youtube-stats";

/**
 * Shared peak-time publish scheduler (#13, #10).
 *
 * Used by BOTH the manual link queue and the daily auto-collection so every
 * video on the channel goes out at the same human-looking peak times:
 *   - 12 slots per evening, 21:00–23:45 IST, 15 minutes apart
 *   - natural jitter of 2–10 minutes (never machine-regular)
 *   - manual batches are hard-capped at MANUAL_DAILY_CAP per day
 *   - daily-collection videos share the same slots and avoid collisions but
 *     are limited by their own one-per-topic rule instead
 *   - always picks FUTURE slots; rolls to the next day when full
 */

export const PUBLISH_GAP_MS = 5 * 60 * 1000;
export const MANUAL_DAILY_CAP = 5;

/** 12 evening slots: 21:00 … 23:45 (fits 5 manual + 7 daily per day). */
export const PEAK_SLOTS_IST_MIN: number[] = Array.from({ length: 12 }, (_, i) => 21 * 60 + i * 15);

const MIN_LEAD_MS = 2 * 60_000;
const SEPARATION_MS = 10 * 60_000;

/** Natural jitter (2–10 min) so scheduled times look human, not machine-set. */
function naturalJitter(dayKey: string, slot: number, nth: number): number {
  let h = 5381;
  const seed = `${dayKey}|${slot}|${nth}`;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return (2 + (h % 9)) * 60_000; // 2..10 minutes
}

function istInstantFromKey(dayKey: string, minutes: number): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  return Date.UTC(y, m - 1, d, 0, 0, 0) - 330 * 60_000 + minutes * 60_000;
}

export interface PlanOptions {
  /** Also avoid collisions with already-scheduled daily-collection videos. */
  includeDaily?: boolean;
}

/** Plans `count` future publish slots respecting cap/peak/spacing rules. */
export async function planPublishSlots(
  count: number,
  explicitFirst?: number | null,
  options: PlanOptions = {},
): Promise<number[]> {
  // Cap accounting: manual queue rows only (daily videos have their own cap).
  const manualRows = await db
    .select({ p: manualUploads.publishAt })
    .from(manualUploads)
    .where(ne(manualUploads.status, "failed"));
  const manualTimes = manualRows
    .map((r) => (r.p ? new Date(r.p).getTime() : 0))
    .filter((t) => t > 0);

  // Collision avoidance: also respect daily videos already scheduled.
  let busyTimes = manualTimes.filter((t) => t > Date.now());
  if (options.includeDaily) {
    const dailyRows = await db
      .select({ p: downloads.publishAt })
      .from(downloads)
      .where(sql`${downloads.youtubeStatus} IN ('uploaded','pending') AND ${downloads.publishAt} IS NOT NULL`);
    busyTimes = [
      ...busyTimes,
      ...dailyRows
        .map((r) => (r.p ? new Date(r.p).getTime() : 0))
        .filter((t) => t > Date.now()),
    ];
  }

  const byDay = new Map<string, number>();
  for (const t of manualTimes) {
    const k = istDate(new Date(t));
    byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }

  const assigned: number[] = [];
  const busy = () => [...busyTimes, ...assigned];
  const fits = (t: number): boolean => {
    if (t <= Date.now() + MIN_LEAD_MS) return false;
    const day = istDate(new Date(t));
    if ((byDay.get(day) ?? 0) >= MANUAL_DAILY_CAP) return false;
    if (busy().some((o) => Math.abs(o - t) < SEPARATION_MS)) return false;
    return true;
  };
  const claim = (t: number) => {
    assigned.push(t);
    const day = istDate(new Date(t));
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  };

  // Learn from analytics: try the best-performing hour's slots first.
  let slots = [...PEAK_SLOTS_IST_MIN];
  try {
    const insights = await getInsights();
    if (insights.bestHour !== null) {
      slots = [...slots].sort(
        (a, b) => Math.abs(a - insights.bestHour! * 60) - Math.abs(b - insights.bestHour! * 60),
      );
    }
  } catch {
    /* analytics optional */
  }

  const maxDays = Math.max(90, Math.ceil(count / MANUAL_DAILY_CAP) + 10);
  for (let i = 0; i < count; i++) {
    let chosen: number | undefined;
    if (i === 0 && explicitFirst && fits(explicitFirst)) chosen = explicitFirst;
    if (chosen === undefined) {
      search: for (let dayOffset = 0; dayOffset < maxDays; dayOffset++) {
        const dayKey = istDate(new Date(Date.now() + dayOffset * 86_400_000));
        for (const slot of slots) {
          const nth = byDay.get(dayKey) ?? 0;
          const t = istInstantFromKey(dayKey, slot) + naturalJitter(dayKey, slot, nth);
          if (fits(t)) {
            chosen = t;
            break search;
          }
        }
      }
    }
    if (chosen === undefined) break;
    claim(chosen);
  }
  return assigned;
}
