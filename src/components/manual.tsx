"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Download,
  RotateCcw,
  Pause,
  Play,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";

interface ManualItem {
  id: number;
  videoId: string;
  url: string;
  status: string;
  filePath: string | null;
  fileSize: number | null;
  publishAt: string | null;
  youtubeId: string | null;
  youtubeUrl: string | null;
  youtubeTitle: string | null;
  error: string | null;
  createdAt: string;
}

interface ManualState {
  items: ManualItem[];
  paused?: boolean;
  etaSeconds?: number;
  dailyCap?: number;
  peakWindow?: string;
  gapMinutes: number;
  youtubeConnected: boolean;
  warmingUp?: boolean;
}

const STATUS_META: Record<string, { label: string; cls: string; Icon: typeof Loader2 }> = {
  queued: { label: "Queued", cls: "", Icon: Clock },
  downloading: { label: "Downloading", cls: "badge-accent", Icon: Loader2 },
  downloaded: { label: "Downloaded", cls: "badge-accent", Icon: CheckCircle2 },
  uploading: { label: "Uploading", cls: "badge-accent", Icon: Loader2 },
  uploaded: { label: "Scheduled", cls: "badge-success", Icon: CheckCircle2 },
  failed: { label: "Failed", cls: "badge-danger", Icon: XCircle },
};

function fmtIST(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ManualUpload() {
  const [state, setState] = useState<ManualState | null>(null);
  const [urls, setUrls] = useState("");
  const [when, setWhen] = useState(""); // datetime-local, optional
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    const r = await safeFetch<ManualState>("/api/manual", {}, 1);
    if (r.ok && r.data) setState(r.data);
  }

  useEffect(() => {
    const first = setTimeout(() => void load(), 0);
    const poll = setInterval(() => void load(), 4000);
    return () => {
      clearTimeout(first);
      clearInterval(poll);
    };
  }, []);

  async function submit() {
    const lines = urls.split(/\n/).map((s) => s.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setBusy(true);
    setNote(null);
    // datetime-local → ISO (local machine time; server treats it as absolute)
    let publishAt: string | undefined;
    if (when) {
      const d = new Date(when);
      if (!Number.isNaN(d.getTime())) publishAt = d.toISOString();
    }
    const r = await safeFetch<{ ok: boolean; accepted?: number; skipped?: Array<{ url: string; reason: string }>; error?: string }>(
      "/api/manual",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "submit", urls: lines.join("\n"), publishAt }),
      },
      1,
      30_000,
    );
    setBusy(false);
    if (r.ok && r.data?.ok) {
      const skipped = r.data.skipped ?? [];
      setNote(
        `Accepted ${r.data.accepted} link(s). Downloading → AI content check → title → upload.` +
          (skipped.length ? ` Skipped ${skipped.length}: ${skipped[0].reason}` : ""),
      );
      setUrls("");
      void load();
    } else {
      setNote(r.data?.error || r.error || "Submission failed.");
    }
  }

  async function retry(id: number) {
    await safeFetch("/api/manual", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "retry", id }),
    });
    void load();
  }

  const active = state?.items.filter((i) => i.status !== "uploaded" && i.status !== "failed").length ?? 0;
  const pending = state?.items.filter((i) => i.status === "queued" || i.status === "downloaded").length ?? 0;

  async function togglePause() {
    const next = !state?.paused;
    await safeFetch("/api/manual", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: next ? "pause" : "resume" }),
    });
    setNote(next ? "Queue paused — nothing will process until you resume." : "Queue resumed.");
    void load();
  }

  async function move(id: number, dir: -1 | 1) {
    await safeFetch("/api/manual", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "priority", id, dir }),
    });
    void load();
  }

  function fmtEta(sec: number): string {
    if (sec <= 0) return "0m";
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-1 space-y-4">
      {/* Intro */}
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--r)] bg-[var(--accent-soft)]">
            <Link2 size={21} className="text-[var(--accent-hi)]" />
          </div>
          <div>
            <h2 className="display text-lg font-semibold text-[var(--ink)]">Manual Instagram → YouTube</h2>
            <p className="text-[12.5px] text-[var(--ink-dim)]">
              Paste Reel links · downloaded → <b>AI verifies the original content</b> → viral title → uploaded as private,
              auto-public at <b>peak 9–11 PM IST</b> · max <b>5 videos per day</b> · future dates chosen automatically
            </p>
          </div>
        </div>
        <span className={`badge ${state?.youtubeConnected ? "badge-success" : "badge-danger"}`}>
          {state?.youtubeConnected ? "YouTube connected" : "YouTube not connected"}
        </span>
      </div>

      {/* Submit form */}
      <section className="surface p-5">
        <h3 className="text-sm font-semibold text-[var(--ink)]">Add Instagram links</h3>
        <p className="mt-1 text-[12px] text-[var(--ink-faint)]">
          One link per line (up to 500 per batch). Only public Reels/Posts — private or login-only links will fail.
        </p>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={5}
          placeholder={"https://www.instagram.com/reel/ABC123xyz/\nhttps://www.instagram.com/reel/DEF456uvw/"}
          className="console-mono mt-3 w-full resize-y rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--bg)] p-3 text-[12.5px] leading-relaxed text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
        />

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Publish date &amp; time (optional)
            </label>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="mt-1.5 rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none"
            />
            <div className="mt-1 text-[11px] text-[var(--ink-faint)]">
              {when ? "Override: batch starts at this time (still max 5/day — overflow rolls to the next day)." : "Auto: scheduled at peak evening time (9:00–11:00 PM IST), max 5 per day; full days roll to the next day automatically."}
            </div>
          </div>
          <button
            className="btn btn-primary ml-auto !h-11"
            disabled={busy || urls.trim().length === 0}
            onClick={() => void submit()}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Download &amp; queue for YouTube
          </button>
        </div>

        {note && (
          <div className="mt-3 rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--surface-2)] px-3.5 py-2.5 text-[12.5px] text-[var(--ink-dim)]">
            {note}
          </div>
        )}
        {!state?.youtubeConnected && (
          <div className="mt-3 flex items-center gap-2 rounded-[var(--r)] border border-[rgba(244,63,94,0.3)] bg-[var(--danger-soft)] px-3.5 py-2.5 text-[12.5px] text-[#fecdd3]">
            <AlertTriangle size={14} className="shrink-0" />
            Connect YouTube first (YouTube tab) — links will still download now, but upload waits for connection.
          </div>
        )}
      </section>

      {/* Queue */}
      <section className="surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Queue</h3>
          <span className="badge">
            {active > 0 && <Loader2 size={11} className="animate-spin" />}
            {state?.items.length ?? 0} total · {active} in progress
          </span>
        </div>

        {!state || state.items.length === 0 ? (
          <div className="flex h-28 flex-col items-center justify-center gap-2 text-center text-[13px] text-[var(--ink-faint)]">
            <Download size={18} />
            No manual links yet. Paste Instagram Reel URLs above — large batches are queued across future days automatically.
          </div>
        ) : (
          <div className="space-y-2.5">
            {state.items.map((item, i) => {
              const meta = STATUS_META[item.status] ?? STATUS_META.queued;
              const busyStatus = item.status === "downloading" || item.status === "uploading";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  className="rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] p-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`badge ${meta.cls}`}>
                          <meta.Icon size={11} className={busyStatus ? "animate-spin" : ""} />
                          {meta.label}
                        </span>
                        <span className="console-mono text-[12px] text-[var(--ink-dim)]">{item.videoId}</span>
                        {item.fileSize ? (
                          <span className="text-[11px] text-[var(--ink-faint)]">
                            {(item.fileSize / 1_048_576).toFixed(1)} MB
                          </span>
                        ) : null}
                      </div>

                      {item.youtubeTitle && (
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[var(--ink)]">
                          {item.youtubeTitle}
                        </p>
                      )}

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--ink-faint)]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> Public: {fmtIST(item.publishAt)} IST
                        </span>
                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--accent-hi)]">
                          <ExternalLink size={11} /> Instagram
                        </a>
                      </div>

                      {item.error && (
                        <div className="mt-1.5 text-[11px] text-[#fb7185]">{item.error}</div>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-1.5">
                      {(item.status === "queued" || item.status === "downloaded") && (
                        <div className="flex gap-1">
                          <button className="btn !h-7 !px-1.5" title="Process sooner" onClick={() => void move(item.id, -1)}>
                            <ChevronUp size={12} />
                          </button>
                          <button className="btn !h-7 !px-1.5" title="Process later" onClick={() => void move(item.id, 1)}>
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      )}
                      {item.status === "failed" && (
                        <button className="btn !h-8 !text-[11px]" onClick={() => void retry(item.id)}>
                          <RotateCcw size={12} /> Retry
                        </button>
                      )}
                      {item.youtubeUrl && (
                        <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="btn !h-8 !text-[11px]">
                          <ExternalLink size={12} /> YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="surface p-5">
        <h3 className="text-sm font-semibold text-[var(--ink)]">How manual uploads work</h3>
        <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-[var(--ink-dim)]">
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">1</span>
            Direct download of your link — then AI <b>verifies the real video content</b> against its frames before anything is created or published.
          </li>
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">2</span>
            AI writes the viral title + hashtags; a frame from the video becomes the thumbnail.
          </li>
          <li className="flex gap-2.5">
            <span className="badge badge-accent shrink-0">3</span>
            Uploaded as private with location India — public exactly at your chosen date/time, or with
            peak evening times (9–11 PM IST) if you leave it empty — max 5 per day, overflow rolls to the next day.
          </li>
        </ol>
      </section>
    </motion.div>
  );
}
