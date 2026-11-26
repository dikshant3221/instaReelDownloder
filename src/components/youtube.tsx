"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MonitorPlay,
  KeyRound,
  Link2,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Eye,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";
import { fmtViews } from "@/lib/types";

interface UploadRow {
  id: number;
  videoId: string;
  title: string | null;
  url: string | null;
  ytStatus: string;
  publishAt: string | null;
  ytError: string | null;
  viewCount: number;
  topicName: string;
}

interface YtState {
  configured: boolean;
  connected: boolean;
  enabled: boolean;
  publishDelayMinutes: number;
  clientIdSet: boolean;
  clientIdPreview: string | null;
  uploads: UploadRow[];
  error?: string;
  channelTitle?: string | null;
  tokenExpiresInMin?: number | null;
  telegramSet?: boolean;
  copyrightOn?: boolean;
  accounts?: Array<{
    index: number;
    label: string;
    clientIdPreview: string;
    channelTitle: string | null;
    connected: boolean;
    active: boolean;
  }>;
  quota?: { used: number; limit: number; remaining: number; exhausted: boolean; perUploadCost: number } | null;
  insights?: {
    topStrategy: string | null;
    topStrategyAvg: number;
    strategySamples: number;
    bestHour: number | null;
    bestHourAvg: number;
    hourSamples: number;
  } | null;
}

const STATUS_STYLE: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  uploaded: { label: "Scheduled", cls: "badge-accent", Icon: Clock },
  pending: { label: "Pending", cls: "", Icon: Loader2 },
  failed: { label: "Failed", cls: "badge-danger", Icon: XCircle },
  none: { label: "Not uploaded", cls: "", Icon: AlertTriangle },
};

export default function YoutubeView() {
  const [state, setState] = useState<YtState | null>(null);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [now, setNow] = useState(0); // set by interval — keeps render pure
  const [tgToken, setTgToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [tgSet, setTgSet] = useState(false);
  const [tgBusy, setTgBusy] = useState(false);
  const [tgNote, setTgNote] = useState<string | null>(null);
  const [copyrightOn, setCopyrightOn] = useState(true);
  const [acctLabel, setAcctLabel] = useState("");
  const [acctId, setAcctId] = useState("");
  const [acctSecret, setAcctSecret] = useState("");

  async function load() {
    const r = await safeFetch<YtState>("/api/youtube", {}, 1);
    if (r.ok && r.data) {
      setState(r.data);
      if (r.data.error) setNote(r.data.error);
      setTgSet(Boolean((r.data as YtState & { telegramSet?: boolean }).telegramSet));
      setCopyrightOn((r.data as YtState & { copyrightOn?: boolean }).copyrightOn !== false);
    }
  }

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    // Defer so no state is set synchronously inside the effect body.
    const first = setTimeout(() => {
      void load();
      const p = new URLSearchParams(window.location.search);
      const yt = p.get("yt");
      if (yt) {
        const msg =
          yt === "connected"
            ? "YouTube connected successfully! Enable auto-upload to publish today's collection."
            : yt === "denied"
              ? "Authorization was declined at Google."
              : yt === "state"
                ? "Security check failed (state mismatch) — please try connecting again."
                : yt === "error"
                  ? "Connection failed — check the Client ID/Secret and redirect URI."
                  : "Invalid authorization response.";
        setNote(msg);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }, 0);
    return () => {
      clearTimeout(first);
      clearInterval(tick);
    };
  }, []);

  async function action(payload: Record<string, unknown>, label: string) {
    setBusy(label);
    setNote(null);
    const r = await safeFetch<{ ok: boolean; error?: string; url?: string; uploaded?: number; failed?: number }>(
      "/api/youtube",
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) },
      1,
      label === "upload-now" ? 240_000 : 30_000,
    );
    setBusy(null);
    if (r.ok && r.data?.url) {
      window.location.href = r.data.url; // redirect to Google consent
      return;
    }
    if (r.ok && r.data?.uploaded !== undefined) {
      setNote(`Upload finished: ${r.data.uploaded} scheduled, ${r.data.failed ?? 0} failed.`);
      void load();
      return;
    }
    if (r.ok) {
      setNote(label === "enable" ? "Auto-upload updated." : "Saved.");
      void load();
      return;
    }
    setNote(r.data?.error || r.error || "Request failed.");
  }

  async function saveTelegram(mode: "save" | "test") {
    setTgBusy(true);
    setTgNote(null);
    const r = await safeFetch<{ ok: boolean; detail?: string; error?: string }>(
      "/api/youtube",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "telegram", token: tgToken, chatId: tgChatId, mode }),
      },
      1,
      20_000,
    );
    setTgBusy(false);
    setTgNote(r.data?.detail || r.data?.error || r.error || "Saved.");
    if (r.data?.ok) setTgSet(true);
  }

  async function addAccount() {
    setBusy("add-account");
    const r = await safeFetch<{ ok: boolean; url?: string; error?: string }>(
      "/api/youtube",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "add-account", label: acctLabel, clientId: acctId, clientSecret: acctSecret }),
      },
      1,
      30_000,
    );
    setBusy(null);
    if (r.ok && r.data?.url) {
      window.location.href = r.data.url; // consent for the new project
      return;
    }
    setNote(r.data?.error || r.error || "Could not add account.");
  }

  async function switchAccount(index: number) {
    setBusy(`switch-${index}`);
    const r = await safeFetch<{ ok: boolean; error?: string }>(
      "/api/youtube",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "switch-account", index }),
      },
      1,
    );
    setBusy(null);
    setNote(r.ok ? "Switched active Google account." : r.data?.error || "Switch failed.");
    void load();
  }

  async function toggleCopyright() {
    setBusy("copyright");
    const r = await safeFetch<{ ok: boolean; enabled?: boolean }>(
      "/api/youtube",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "copyright", enabled: !copyrightOn }),
      },
      1,
    );
    setBusy(null);
    if (r.data?.ok) setCopyrightOn(Boolean(r.data.enabled));
  }

  const scheduledCount = state?.uploads.filter((u) => u.ytStatus === "uploaded").length ?? 0;
  const totalApproved = state?.uploads.length ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-1 space-y-4">
      {/* Hero */}
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--r)] bg-[rgba(255,0,0,0.12)]">
            <MonitorPlay size={22} className="text-[#ff4d4d]" />
          </div>
          <div>
            <h2 className="display text-lg font-semibold text-[var(--ink)]">YouTube publishing</h2>
            <p className="text-[12.5px] text-[var(--ink-dim)]">
              Auto-uploads the day&apos;s collection only after every topic is complete · title + hashtags by AI ·
              thumbnail from the video · location India · published at peak evening times (9–11 PM IST)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state?.channelTitle && (
            <span className="badge badge-accent" title="Connected YouTube channel">
              {state.channelTitle}
            </span>
          )}
          {state?.connected && state?.tokenExpiresInMin != null && (
            <span
              className="badge"
              title="OAuth token freshness — auto-refreshes on every use"
              style={
                state.tokenExpiresInMin < 120
                  ? { borderColor: "rgba(245,158,11,0.45)", color: "#fbbf24" }
                  : undefined
              }
            >
              token {state.tokenExpiresInMin > 60
                ? `${Math.round(state.tokenExpiresInMin / 60)}h`
                : `${state.tokenExpiresInMin}m`}{" "}
              (auto-refresh)
            </span>
          )}
          <span className={`badge ${state?.connected ? "badge-success" : ""}`}>
            {state?.connected ? "Connected" : state?.configured ? "Not connected" : "Not configured"}
          </span>
          <span className={`badge ${state?.enabled ? "badge-accent" : ""}`}>
            {state?.enabled ? "Auto-upload ON" : "Auto-upload OFF"}
          </span>
        </div>
      </div>

      {note && (
        <div className="rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--surface-2)] px-4 py-3 text-[13px] text-[var(--ink-dim)]">
          {note}
        </div>
      )}

      {/* Quota meter (#1) + Strategy insights (#4) */}
      {(state?.quota || state?.insights) && (
        <div className="grid gap-4 md:grid-cols-2">
          {state?.quota && (
            <section className="surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <Gauge size={15} className="text-[var(--accent-hi)]" /> API quota (estimated)
                </h3>
                <span className="tnum text-[12px] text-[var(--ink-dim)]">
                  {fmtViews(state.quota.used)} / {fmtViews(state.quota.limit)}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
                <div
                  className={`h-full rounded-full ${state.quota.exhausted ? "bg-[#f43f5e]" : "bg-[var(--accent)]"}`}
                  style={{ width: `${Math.min(100, (state.quota.used / state.quota.limit) * 100)}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[12px]">
                <span className="text-[var(--ink-faint)]">
                  ≈ {Math.floor(state.quota.remaining / state.quota.perUploadCost)} more full upload(s) today
                </span>
                <span className={state.quota.exhausted ? "text-[#fb7185]" : "text-[#4ade80]"}>
                  {state.quota.exhausted ? "resets at IST midnight" : "healthy"}
                </span>
              </div>
              <p className="mt-2 text-[10.5px] leading-snug text-[var(--ink-faint)]">
                Google&apos;s default budget is 10,000 units/day ≈ 6 uploads (video insert = 1,600).
                Need more? Request a quota increase in Google Cloud Console — it&apos;s free.
              </p>
            </section>
          )}

          {state?.insights && (
            <section className="surface p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <TrendingUp size={15} className="text-[#4ade80]" /> Strategy learning
              </h3>
              {state.insights.topStrategy && state.insights.strategySamples > 0 ? (
                <div className="mt-3 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--ink-dim)]">Best formula</span>
                    <span className="font-semibold text-[var(--ink)]">{state.insights.topStrategy}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--ink-dim)]">Its average reach</span>
                    <span className="tnum font-semibold text-[#4ade80]">
                      {fmtViews(state.insights.topStrategyAvg)} views ({state.insights.strategySamples} video
                      {state.insights.strategySamples === 1 ? "" : "s"})
                    </span>
                  </div>
                  {state.insights.bestHour !== null && state.insights.hourSamples >= 2 && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[var(--ink-dim)]">Best publish hour</span>
                      <span className="tnum font-semibold text-[var(--ink)]">
                        {String(state.insights.bestHour).padStart(2, "0")}:00 IST
                        <span className="text-[var(--ink-faint)]"> · {fmtViews(state.insights.bestHourAvg)} avg</span>
                      </span>
                    </div>
                  )}
                  <p className="pt-1 text-[10.5px] leading-snug text-[var(--ink-faint)]">
                    The Strategy Bot now weights its formula choices and schedule by this real
                    performance data — it learns from what your audience actually watches.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--ink-faint)]">
                  Insights appear after your first uploads pass their +1 hour checkpoint (analytics
                  collects views at +1h, +6h and +24h).
                </p>
              )}
            </section>
          )}
        </div>
      )}

      {/* Setup */}
      <section className="surface p-5">
        <h3 className="text-sm font-semibold text-[var(--ink)]">1. Google OAuth setup</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-faint)]">
          In Google Cloud Console create an OAuth 2.0 Client (type: Web application), enable the
          <b className="text-[var(--ink-dim)]"> YouTube Data API v3</b>, and add this redirect URI:
          <code className="mx-1 rounded bg-[var(--bg)] px-1.5 py-0.5 text-[11px] text-[var(--accent-hi)]">
            {typeof window !== "undefined" ? `${window.location.origin}/api/youtube/callback` : "…/api/youtube/callback"}
          </code>
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder={state?.clientIdPreview ? `Client ID (${state.clientIdPreview})` : "OAuth Client ID"}
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="OAuth Client Secret"
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
          <input
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            placeholder="Redirect URI (optional override)"
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="btn btn-primary"
            disabled={busy !== null || !clientId.trim() || !clientSecret.trim()}
            onClick={() => void action({ action: "save-client", clientId, clientSecret, redirectUri }, "save")}
          >
            {busy === "save" ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            Save credentials
          </button>
          <button
            className="btn"
            disabled={busy !== null || !state?.clientIdSet}
            onClick={() => void action({ action: "connect" }, "connect")}
          >
            {busy === "connect" ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
            {state?.connected ? "Re-authorize Google" : "Connect Google account"}
          </button>
          {state?.connected && (
            <button className="btn" disabled={busy !== null} onClick={() => void action({ action: "disconnect" }, "disconnect")}>
              Disconnect
            </button>
          )}
        </div>
      </section>

      {/* Credential pool — the QUOTA_EXHAUSTED fix (#1) */}
      <section className="surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">Google accounts — quota pool</h3>
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-[var(--ink-faint)]">
              Every Google Cloud project has its own free budget of <b className="text-[var(--ink-dim)]">10,000 units/day ≈ 6 uploads</b>.
              Add a second project below (free) and the app <b className="text-[var(--ink-dim)]">rotates automatically</b> when one is
              spent — <span className="text-[#86efac]">QUOTA_EXHAUSTED never stops uploads again</span> while a fresh credential exists.
              Prefer one project? Request a free quota increase from Google instead.
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {(state?.accounts ?? []).map((a) => (
            <div key={a.index} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={`badge ${a.active ? "badge-success" : ""}`}>{a.active ? "Active" : "Standby"}</span>
                <span className="truncate text-[13px] font-semibold text-[var(--ink)]">{a.label}</span>
                {a.channelTitle && <span className="truncate text-[12px] text-[var(--ink-faint)]">→ {a.channelTitle}</span>}
                <span className="text-[11px] text-[var(--ink-faint)]">{a.clientIdPreview}</span>
              </div>
              <div className="flex gap-2">
                {a.connected && !a.active && (
                  <button className="btn !h-7 !text-[11px]" disabled={busy !== null} onClick={() => void switchAccount(a.index)}>
                    Switch to this
                  </button>
                )}
                {!a.connected && <span className="badge">authorize on connect</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <input value={acctLabel} onChange={(e) => setAcctLabel(e.target.value)} placeholder="Label (e.g. Project 2)"
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]" />
          <input value={acctId} onChange={(e) => setAcctId(e.target.value)} placeholder="OAuth Client ID"
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]" />
          <input type="password" value={acctSecret} onChange={(e) => setAcctSecret(e.target.value)} placeholder="OAuth Client Secret"
            className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]" />
          <button className="btn btn-primary" disabled={busy !== null || !acctId.trim() || !acctSecret.trim()} onClick={() => void addAccount()}>
            {busy === "add-account" ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            Add &amp; authorize
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[var(--ink-faint)]">
          Create the second project at console.cloud.google.com → new project → enable YouTube Data API v3 →
          OAuth consent + Web client (add the same redirect URI), then paste its credentials here.
        </p>
      </section>

      {/* Auto-upload control */}
      <section className="surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">2. Auto-upload</h3>
            <p className="mt-1 text-[12px] text-[var(--ink-faint)]">
              Runs only after <b className="text-[var(--ink-dim)]">all {totalApproved || "daily"} videos are downloaded</b> ·
              uploads as <b className="text-[var(--ink-dim)]">private</b>, auto-publishes at the next free{" "}
              peak slot (9–11 PM IST, natural jitter) · location India
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className={`btn ${state?.enabled ? "btn-danger" : "btn-primary"}`}
              disabled={busy !== null || !state?.connected}
              onClick={() => void action({ action: "enable", enabled: !state?.enabled }, "enable")}
            >
              {busy === "enable" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {state?.enabled ? "Disable auto-upload" : "Enable auto-upload"}
            </button>
            <button
              className="btn"
              disabled={busy !== null || !state?.connected}
              onClick={() => void action({ action: "upload-now" }, "upload-now")}
            >
              {busy === "upload-now" ? <Loader2 size={14} className="animate-spin" /> : <MonitorPlay size={14} />}
              Upload now
            </button>
          </div>
        </div>
      </section>

      {/* Upload status list */}
      <section className="surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--ink)]">3. Today&apos;s uploads</h3>
          <span className="badge">
            {scheduledCount}/{totalApproved} scheduled
          </span>
        </div>

        {!state || state.uploads.length === 0 ? (
          <div className="flex h-28 flex-col items-center justify-center gap-2 text-center text-[13px] text-[var(--ink-faint)]">
            <Eye size={18} />
            No approved videos for today yet. Uploads appear here once the daily collection is complete.
          </div>
        ) : (
          <div className="space-y-2.5">
            {state.uploads.map((u, i) => {
              const st = STATUS_STYLE[u.ytStatus] ?? STATUS_STYLE.none;
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] p-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`badge ${st.cls}`}>
                          <st.Icon size={11} className={u.ytStatus === "pending" ? "animate-spin" : ""} />
                          {st.label}
                        </span>
                        <span className="text-[12px] font-medium text-[var(--ink)]">{u.topicName.replace(/^Shri\s+/i, "")}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[var(--ink-faint)]">
                          <Eye size={11} /> {fmtViews(u.viewCount)}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[var(--ink-dim)]">
                        {u.title || "Title will be generated by AI at upload time"}
                      </p>
                      {u.publishAt && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--accent-hi)]">
                          <Clock size={11} />
                          Goes public {new Date(u.publishAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
                          {now > 0 && new Date(u.publishAt).getTime() > now && (
                            <span className="text-[var(--ink-faint)]">
                              (in {Math.max(1, Math.round((new Date(u.publishAt).getTime() - now) / 60000))} min)
                            </span>
                          )}
                        </div>
                      )}
                      {u.ytError && (
                        <div className="mt-1.5 text-[11px] text-[#fb7185]">{u.ytError}</div>
                      )}
                    </div>
                    {u.url && (
                      <a href={u.url} target="_blank" rel="noreferrer" className="btn !h-8 shrink-0 !text-[11px]">
                        <ExternalLink size={12} /> Open on YouTube
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Alerts (#15) + copyright posture (#26) */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="surface p-5">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Telegram alerts</h3>
          <p className="mt-1 text-[12px] text-[var(--ink-faint)]">
            Instant phone alerts for collection complete, uploads and quota — free via @BotFather bot.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              type="password"
              value={tgToken}
              onChange={(e) => setTgToken(e.target.value)}
              placeholder={tgSet ? "Token saved (enter to replace)" : "Bot token from @BotFather"}
              className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
            <input
              value={tgChatId}
              onChange={(e) => setTgChatId(e.target.value)}
              placeholder={tgSet ? "Chat ID saved" : "Chat ID (from @userinfobot)"}
              className="rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="btn" disabled={busy !== null} onClick={() => void saveTelegram("test")}>
              {tgBusy ? <Loader2 size={13} className="animate-spin" /> : null}
              Save & send test
            </button>
            {tgSet && (
              <span className="badge badge-success self-center">alerts ON</span>
            )}
          </div>
          {tgNote && <p className="mt-2 text-[12px] text-[var(--ink-dim)]">{tgNote}</p>}
        </section>

        <section className="surface p-5">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Copyright posture</h3>
          <p className="mt-1 text-[12px] text-[var(--ink-faint)]">
            Claim-safe mode appends full credit + a fair-use/removal notice to every description.
          </p>
          <button
            className={`btn mt-3 ${copyrightOn ? "btn-primary" : ""}`}
            disabled={busy !== null}
            onClick={() => void toggleCopyright()}
          >
            {copyrightOn ? "Claim-safe mode: ON" : "Claim-safe mode: OFF"}
          </button>
          <p className="mt-2 text-[10.5px] leading-snug text-[var(--ink-faint)]">
            Re-uploading others&apos; reels can trigger Content ID claims. Keep this ON: it credits
            original creators in every description and provides a removal-contact notice.
          </p>
        </section>
      </div>

      {/* How it works */}
      <section className="surface p-5">
        <h3 className="text-sm font-semibold text-[var(--ink)]">How publishing works</h3>
        <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-[var(--ink-dim)]">
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">1</span>
            Searches continuously until every enabled topic has one AI-approved video.
          </li>
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">2</span>
            AI writes a viral title + hashtags for each video.
          </li>
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">3</span>
            A clear frame from the video becomes the thumbnail.
          </li>
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">4</span>
            Uploaded as private with location India, scheduled to go public after{" "}
            {state?.publishDelayMinutes ?? 15} minutes.
          </li>
        </ol>
      </section>
    </motion.div>
  );
}
