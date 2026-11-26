/**
 * India Standard Time (Asia/Kolkata) utilities.
 * The daily 7-video counter (one per topic) is keyed on the IST calendar date and resets
 * automatically at IST midnight — the permanent duplicate cache never resets.
 */

const IST_OFFSET_MIN = 330; // UTC+5:30

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const fullFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

export function istDate(d: Date = new Date()): string {
  return dateFmt.format(d); // YYYY-MM-DD in IST
}

/** Yesterday's IST date — used to surface yesterday's final tally after reset. */
export function istYesterdayDate(d: Date = new Date()): string {
  return istDate(new Date(d.getTime() - 24 * 3600 * 1000));
}

export function istClock(d: Date = new Date()): string {
  return timeFmt.format(d);
}

export function istFull(d: Date): string {
  return fullFmt.format(d);
}

/** Millis since epoch of the NEXT IST midnight (daily reset moment). */
export function nextIstMidnight(from: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(from);
  const y = Number(parts.find((p) => p.type === "year")!.value);
  const m = Number(parts.find((p) => p.type === "month")!.value);
  const day = Number(parts.find((p) => p.type === "day")!.value);
  // Wall-clock ms for the day AFTER the current IST date (UTC reading),
  // then subtract the IST offset so the instant equals 00:00:00 IST.
  return Date.UTC(y, m - 1, day + 1, 0, 0, 0) - IST_OFFSET_MIN * 60_000;
}

export function fmtCountdown(ms: number): string {
  if (ms <= 0) return "due now";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${ss}s`;
  return `${ss}s`;
}
