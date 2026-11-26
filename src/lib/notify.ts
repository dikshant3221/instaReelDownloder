import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings, activityLogs } from "@/db/schema";

/**
 * Telegram alerts — free, instant notifications for the events that matter:
 * daily collection complete, uploads scheduled/failed, quota exhausted.
 *
 * Configure once: create a bot via @BotFather → token; get chat id via
 * @userinfobot. Stored locally, never leaves the machine except to Telegram.
 */

async function getSetting(key: string, fallback = ""): Promise<string> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function telegramConfigured(): Promise<boolean> {
  return Boolean((await getSetting("telegramBotToken", "")) && (await getSetting("telegramChatId", "")));
}

/** Sends a message; never throws — notifications must not break the pipeline. */
export async function notify(message: string): Promise<boolean> {
  try {
    if (!(await telegramConfigured())) return false;
    const token = await getSetting("telegramBotToken", "");
    const chatId = await getSetting("telegramChatId", "");
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: `ViralDarshan\n\n${message}`, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fire-and-forget helper used across the engine (logs success to console only). */
export function notifyAsync(message: string): void {
  void notify(message).catch(() => {});
}

/** Test connectivity for the UI. */
export async function testTelegram(token: string, chatId: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: "ViralDarshan connected. Alerts are ON." }),
      signal: AbortSignal.timeout(10_000),
    });
    const j = (await res.json()) as { ok: boolean; description?: string };
    if (j.ok) {
      await db.insert(activityLogs).values({ level: "ok", message: "Telegram alerts connected." });
      return { ok: true, detail: "Test message delivered — alerts are ON." };
    }
    return { ok: false, detail: j.description ?? "Telegram rejected the request." };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }
}
