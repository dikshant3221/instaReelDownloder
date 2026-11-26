/**
 * Guardian Bot — client half.
 *
 * Every network call in the app goes through here. It can NEVER throw:
 * empty bodies (server restarting), invalid JSON, timeouts and offline
 * moments are all absorbed, retried with backoff, and surfaced as a
 * friendly { ok, data, error } result. The UI therefore can't crash on
 * "Failed to execute 'json' on 'Response'" ever again.
 */

export interface SafeResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
  status: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  retries = 2,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<SafeResult<T>> {
  let lastError: string | null = null;
  let lastStatus = 0;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: "no-store",
      });
      lastStatus = res.status;

      // text() never throws on empty bodies; empty → treated as "not ready yet"
      const text = await res.text();
      let data: T | null = null;
      if (text.trim().length > 0) {
        try {
          data = JSON.parse(text) as T;
        } catch {
          lastError = "response was not valid JSON (server mid-restart)";
        }
      } else {
        lastError = `empty response (HTTP ${res.status})`;
      }

      if (res.ok && data !== null) {
        return { ok: true, data, error: null, status: res.status };
      }
      const serverMsg =
        data && typeof data === "object" && "error" in data
          ? String((data as { error: unknown }).error)
          : null;
      lastError = serverMsg ?? lastError ?? `server responded ${res.status}`;
    } catch (e) {
      lastError =
        e instanceof Error
          ? e.name === "AbortError"
            ? "request timed out"
            : e.message || "network error"
          : "network error";
    } finally {
      clearTimeout(timer);
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)));
    }
  }

  return { ok: false, data: null, error: lastError ?? "unknown error", status: lastStatus };
}

/** Turns raw technical faults into layman-friendly one-liners. */
export function humanize(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("unexpected end of json") || s.includes("not valid json"))
    return "the app server is reloading its latest code";
  if (s.includes("empty response") || s.includes("mid-restart"))
    return "the server is restarting";
  if (s.includes("failed to fetch") || s.includes("load failed") || s.includes("econnrefused"))
    return "brief connection hiccup with the server";
  if (s.includes("timed out")) return "the server took too long to answer";
  return "a temporary server hiccup";
}
