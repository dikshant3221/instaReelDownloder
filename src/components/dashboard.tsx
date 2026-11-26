"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Square,
  Radar,
  FolderOpen,
  KeyRound,
  SlidersHorizontal,
  MonitorDown,
  Eye,
  AlertTriangle,
  Clock,
  LayoutGrid,
  Film,
  Activity,
  Search,
  Bot,
  Loader2,
  ShieldCheck,
  ShieldX,
  MonitorPlay,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import type { Status } from "@/lib/types";
import { fmtIN, fmtViews } from "@/lib/types";
import { safeFetch, humanize } from "@/lib/safe-fetch";
import { ProgressRing, KpiCard, TopicCoverage, ActivityFeed } from "@/components/sections";
import DownloadLibrary from "@/components/library";
import RejectedView from "@/components/rejected";
import YoutubeView from "@/components/youtube";
import ManualUpload from "@/components/manual";
import { ProvidersModal, ReferenceModal, WindowsModal } from "@/components/modals";

type ModalKind = "reference" | "providers" | "windows" | null;
type View = "overview" | "library" | "youtube" | "manual" | "rejected" | "activity";

export default function Dashboard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [view, setView] = useState<View>("overview");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const scanning = busy === "scan" || status?.lastRun?.status === "running";

  const fetchStatus = useCallback(async () => {
    const r = await safeFetch<Status>("/api/status", {}, 2);
    if (r.ok && r.data) {
      setStatus(r.data);
      setError(null);
    } else if (r.error) {
      setError(humanize(r.error));
    }
  }, []);

  useEffect(() => {
    // PWA (#20): installable app + offline shell (API stays network-only).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const first = setTimeout(() => void fetchStatus(), 0);
    const poll = setInterval(() => void fetchStatus(), 4000);
    return () => {
      clearTimeout(first);
      clearInterval(poll);
    };
  }, [fetchStatus]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const warmingUp = Boolean((status as (Status & { warmingUp?: string }) | null)?.warmingUp);

  async function lowerThreshold() {
    const r = await safeFetch<{ ok: boolean; minViews?: number }>("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ minViews: 100_000 }),
    });
    if (r.data?.ok) {
      setToast("Threshold lowered to 100,000 views — scanning now.");
      void fetchStatus();
      void engine("scan");
    }
  }

  async function openDownloadFolder() {
    const r = await safeFetch<{ ok: boolean; folder: string }>("/api/folder", { method: "POST" }, 0);
    setToast(r.data?.folder ? `Download folder: ${r.data.folder}` : "Could not open the folder.");
  }

  async function engine(action: "start" | "stop" | "scan") {
    setBusy(action);
    const r = await safeFetch<{ ok: boolean; outcome?: { message: string }; status?: Status }>(
      "/api/engine",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) },
      1,
      60_000,
    );
    if (r.ok && r.data) {
      if (r.data.outcome) setToast(r.data.outcome.message);
      if (r.data.status) setStatus(r.data.status);
    } else if (r.error) {
      setToast(`${humanize(r.error)} — please try again shortly.`);
    }
    setBusy(null);
    void fetchStatus();
    setRefreshKey((k) => k + 1);
  }

  const running = status?.engineRunning ?? false;
  const today = status?.today;
  const limit = status?.dailyLimit ?? 7;
  const targetMet = (today?.count ?? 0) >= limit;
  const needsKey = Boolean(status && !status.providers.some((p) => p.keySet));

  const navItems: { id: View; label: string; icon: typeof LayoutGrid }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "library", label: "Library", icon: Film },
    { id: "youtube", label: "YouTube", icon: MonitorPlay },
    { id: "manual", label: "Manual Upload", icon: Link2 },
    { id: "rejected", label: "Rejected", icon: ShieldX },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  const settingsItems: { label: string; icon: typeof KeyRound; onClick: () => void; alert?: boolean }[] = [
    { label: "AI Providers", icon: KeyRound, onClick: () => setModal("providers"), alert: needsKey },
    { label: "Reference Photos", icon: ImageIcon, onClick: () => setModal("reference") },
    { label: "Desktop App", icon: MonitorDown, onClick: () => setModal("windows") },
  ];

  function go(v: View) {
    setView(v);
    setNavOpen(false);
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* ===================== Sidebar ===================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[var(--line)] bg-[var(--surface-1)] px-3 py-4 transition-transform lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-2 pb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--accent)]">
            <Film size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="display text-[15px] font-semibold text-[var(--ink)]">ViralDarshan</div>
            <div className="text-[10.5px] font-medium text-[var(--ink-faint)]">Reel Intelligence</div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`nav-item ${view === n.id ? "nav-item-active" : ""}`}
            >
              <n.icon size={16} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
          Configure
        </div>
        <nav className="mt-2 space-y-1">
          {settingsItems.map((s) => (
            <button key={s.label} onClick={s.onClick} className="nav-item">
              <s.icon size={16} />
              <span className="flex-1">{s.label}</span>
              {s.alert && <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2.5 px-1">
          <div className="flex items-center justify-between rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-medium text-[var(--ink-dim)]">
              <span className={`h-2 w-2 rounded-full ${running ? "bg-[var(--success)] pulse-dot" : "bg-[var(--danger)]"}`} />
              {running ? "Running" : "Stopped"}
            </span>
            {running ? (
              <button className="btn btn-danger !h-7 !px-2.5 !text-[11px]" disabled={busy !== null} onClick={() => engine("stop")}>
                {busy === "stop" ? <Loader2 size={12} className="animate-spin" /> : <Square size={11} />}
                Stop
              </button>
            ) : (
              <button className="btn btn-primary !h-7 !px-2.5 !text-[11px]" disabled={busy !== null} onClick={() => engine("start")}>
                {busy === "start" ? <Loader2 size={12} className="animate-spin" /> : <Play size={11} />}
                Start
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-2 text-[10.5px] text-[var(--ink-faint)]">
            <ShieldCheck size={12} className="text-[var(--success)]" />
            Guardian Bot {error ? "· recovering" : "· active"}
          </div>
        </div>
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setNavOpen(false)} />
      )}

      {/* ===================== Main ===================== */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--line)] bg-[rgba(10,14,23,0.8)] px-4 backdrop-blur-xl sm:px-6">
          <button className="btn btn-ghost !h-9 !px-2 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Menu">
            <LayoutGrid size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="display truncate text-[15px] font-semibold capitalize text-[var(--ink)]">{view}</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-1.5 sm:flex">
            <Clock size={13} className="text-[var(--ink-faint)]" />
            <span className="tnum text-xs font-medium text-[var(--ink-dim)]">{status?.istNow ?? "…"}</span>
          </div>
          <button
            className="btn btn-primary !h-9"
            disabled={busy !== null || targetMet || !running}
            onClick={() => engine("scan")}
          >
            {scanning ? <Radar size={14} className="scan-sweep" /> : <Radar size={14} />}
            <span className="hidden sm:inline">{scanning ? "Scanning…" : targetMet ? "Complete" : "Run scan"}</span>
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6">
          {/* Alerts */}
          <div className="space-y-3">
            {warmingUp && (
              <Banner tone="accent" icon={Radar} spin>
                <b>Setting up</b> — preparing the local database. This happens once and takes under a minute.
              </Banner>
            )}
            {error && !warmingUp && (
              <Banner tone="danger" icon={Bot}>
                {error} — <b>Guardian Bot is recovering automatically.</b> Your progress is safe.
              </Banner>
            )}
            {!warmingUp &&
              status?.scanInsight &&
              status.scanInsight.inspected > 0 &&
              status.scanInsight.eligible === 0 &&
              status.scanInsight.belowThreshold + status.scanInsight.noPublicMetric > 0 && (
                <Banner tone="violet" icon={Eye} action={{ label: "Lower to 100K", onClick: () => void lowerThreshold() }}>
                  <b>
                    {status.scanInsight.inspected} real Reels found — none passed your{" "}
                    {fmtIN(status.scanInsight.threshold)}-view threshold.
                  </b>{" "}
                  {status.scanInsight.belowThreshold} below it, {status.scanInsight.noPublicMetric} with views
                  hidden by Instagram (enable browser cookies in Discovery Setup for exact counts).
                </Banner>
              )}
          </div>

          {/* ---------------- Overview ---------------- */}
          {view === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={error || warmingUp ? "mt-3 space-y-4" : "space-y-4"}
            >
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <KpiCard
                  icon={Film}
                  label="Coverage"
                  value={`${today?.count ?? 0}/${limit}`}
                  sub={targetMet ? "All topics collected today" : `${today?.remaining ?? limit} topics remaining`}
                  tone="accent"
                />
                <KpiCard
                  icon={Eye}
                  label="Verified reach"
                  value={fmtViews(today?.viewsTotal ?? 0)}
                  sub="combined public views of today's videos"
                  tone="violet"
                />
                <KpiCard
                  icon={AlertTriangle}
                  label="Rejected / failed"
                  value={fmtIN((today?.aiRejected ?? 0) + (today?.failed ?? 0))}
                  sub={`${today?.aiRejected ?? 0} wrong-topic videos removed`}
                  tone="danger"
                />
                <KpiCard
                  icon={Radar}
                  label="Engine"
                  value={!running ? "Stopped" : targetMet ? "Complete" : scanning ? "Scanning" : "Searching"}
                  sub={
                    !running
                      ? "press Start to begin"
                      : targetMet
                        ? "all topics collected · resets 00:00 IST"
                        : "searching continuously until all 7 are found"
                  }
                  tone={running ? (targetMet ? "success" : "accent") : "danger"}
                />
              </div>

              {/* Ring + topics */}
              <div className="grid gap-4 lg:grid-cols-5">
                <section className="surface flex flex-col items-center justify-center gap-5 p-6 lg:col-span-2">
                  <ProgressRing count={today?.count ?? 0} limit={limit} />
                  <div className="grid w-full grid-cols-2 gap-2.5">
                    <MiniStat label="Yesterday" value={status ? `${status.yesterday.count}/${limit}` : "—"} />
                    <MiniStat label="Lifetime" value={status ? fmtIN(status.lifetime.downloaded) : "—"} />
                  </div>
                  <p className="text-center text-[11px] leading-relaxed text-[var(--ink-faint)]">
                    One AI-approved video per topic · minimum{" "}
                    {fmtViews(status?.minViews ?? 1000000)} views · resets at IST midnight
                  </p>
                </section>

                <section className="surface p-5 lg:col-span-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[var(--ink)]">Topic coverage</h2>
                    <span className="badge">
                      {(today?.byTopic ?? []).filter((t) => t.enabled && t.count >= 1).length}/{limit} done
                    </span>
                  </div>
                  <TopicCoverage topics={(today?.byTopic ?? []).filter((t) => t.enabled)} />
                </section>
              </div>

              {/* Recent activity + quick actions */}
              <div className="grid gap-4 lg:grid-cols-5">
                <section className="surface p-5 lg:col-span-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[var(--ink)]">Recent activity</h2>
                    <button className="btn btn-ghost !h-7 !px-2 !text-[11px]" onClick={() => setView("activity")}>
                      View all
                    </button>
                  </div>
                  <ActivityFeed logs={(status?.logs ?? []).slice(-14)} scanning={Boolean(scanning)} height={236} />
                </section>

                <section className="surface p-5 lg:col-span-2">
                  <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">Quick actions</h2>
                  <div className="space-y-2">
                    <button className="btn w-full justify-start" onClick={() => void openDownloadFolder()}>
                      <FolderOpen size={15} /> Open download folder
                    </button>
                    <button className="btn w-full justify-start" onClick={() => setView("library")}>
                      <Film size={15} /> Browse video library
                    </button>
                    <button className="btn w-full justify-start" onClick={() => setModal("providers")}>
                      <KeyRound size={15} /> Manage AI providers
                    </button>
                  </div>

                  <div className="mt-4 space-y-2 rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] p-3.5 text-[12px]">
                    <Row label="Last scan" value={
                      status?.lastScanAt
                        ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }).format(new Date(status.lastScanAt)) + " IST"
                        : "never"
                    } />
                    <Row label="Save folder" value={`…/${status?.istDate || "today"}/`} title={status?.downloadRoot} />
                    <Row
                      label="Mode"
                      value={running ? (targetMet ? "Idle until midnight" : "Continuous") : "Stopped"}
                      valueClass={running && !targetMet ? "text-[var(--accent-hi)]" : "text-[var(--ink-dim)]"}
                    />
                    <Row label="Duplicate shield" value="Permanent" valueClass="text-[#4ade80]" />
                    {status?.quota && (
                      <Row
                        label="YouTube API today"
                        value={`${fmtIN(status.quota.used)} / ${fmtIN(status.quota.limit)} units`}
                        valueClass={status.quota.exhausted ? "text-[#fb7185]" : "text-[var(--ink-dim)]"}
                        title="Estimated quota — uploads resume at IST midnight if exhausted"
                      />
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* ---------------- Library ---------------- */}
          {view === "library" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-1">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="display text-xl font-semibold text-[var(--ink)]">Video library</h2>
                  <p className="mt-0.5 text-[13px] text-[var(--ink-dim)]">
                    AI-approved MP4s · saved in Downloads/Instagram_Viral_Videos
                  </p>
                </div>
                <span className="badge">{status ? fmtIN(status.lifetime.downloaded) : 0} total</span>
              </div>
              <DownloadLibrary topics={status?.topics ?? []} refreshKey={refreshKey} />
            </motion.div>
          )}

          {/* ---------------- Rejected ---------------- */}
          {view === "rejected" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-1">
              <div className="mb-5">
                <h2 className="display text-xl font-semibold text-[var(--ink)]">Rejected videos</h2>
                <p className="mt-0.5 text-[13px] text-[var(--ink-dim)]">
                  Audit the AI&apos;s decisions — open any clip on Instagram to verify, or re-queue if it was wrongly rejected.
                </p>
              </div>
              <RejectedView topics={status?.topics ?? []} refreshKey={refreshKey} />
            </motion.div>
          )}

          {/* ---------------- YouTube ---------------- */}
          {view === "youtube" && <YoutubeView />}

          {/* ---------------- Manual upload ---------------- */}
          {view === "manual" && <ManualUpload />}

          {/* ---------------- Activity ---------------- */}
          {view === "activity" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="display text-xl font-semibold text-[var(--ink)]">Activity log</h2>
                  <p className="mt-0.5 text-[13px] text-[var(--ink-dim)]">
                    Every scan, verification, duplicate check and download
                  </p>
                </div>
                {status?.lastRun && (
                  <span className="badge">
                    Run #{status.lastRun.id}: {status.lastRun.candidates} found · {status.lastRun.downloaded} saved ·{" "}
                    {status.lastRun.failed} failed
                  </span>
                )}
              </div>
              <ActivityFeed logs={status?.logs ?? []} scanning={Boolean(scanning)} height={560} />
            </motion.div>
          )}
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-[80] w-[min(560px,92vw)] -translate-x-1/2 rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--elevated)] px-4 py-3 text-center text-[13px] text-[var(--ink)] shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal === "providers" && status && (
          <ProvidersModal providers={status.providers} onClose={() => setModal(null)} onChanged={fetchStatus} />
        )}
        {modal === "reference" && status && (
          <ReferenceModal topics={status.topics} onClose={() => setModal(null)} onChanged={fetchStatus} />
        )}
        {modal === "windows" && <WindowsModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- small helpers ---------------- */

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{label}</div>
      <div className="display tnum mt-0.5 text-base font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}

function Row({ label, value, valueClass = "text-[var(--ink-dim)]", title }: { label: string; value: string; valueClass?: string; title?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--ink-faint)]">{label}</span>
      <span className={`max-w-[60%] truncate text-right font-medium ${valueClass}`} title={title}>
        {value}
      </span>
    </div>
  );
}

function Banner({
  tone,
  icon: Icon,
  children,
  action,
  spin,
}: {
  tone: "accent" | "danger" | "violet";
  icon: typeof Radar;
  children: React.ReactNode;
  action?: { label: string; onClick: () => void };
  spin?: boolean;
}) {
  const toneMap = {
    accent: "border-[rgba(96,165,250,0.3)] bg-[var(--accent-soft)] text-[#bfdbfe]",
    danger: "border-[rgba(244,63,94,0.3)] bg-[var(--danger-soft)] text-[#fecdd3]",
    violet: "border-[rgba(167,139,250,0.3)] bg-[rgba(167,139,250,0.1)] text-[#ddd6fe]",
  };
  return (
    <div className={`flex items-center gap-3 rounded-[var(--r)] border px-4 py-3 text-[13px] ${toneMap[tone]}`}>
      <Icon size={16} className={`shrink-0 ${spin ? "scan-sweep" : ""}`} />
      <span className="min-w-0 flex-1">{children}</span>
      {action && (
        <button className="btn btn-primary !h-8 shrink-0 !text-[12px]" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
