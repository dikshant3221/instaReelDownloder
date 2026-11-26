"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  X,
  KeyRound,
  FlaskConical,
  CircleDot,
  Plus,
  Trash2,
  Bot,
  MonitorDown,
  TerminalSquare,
  Database,
  CalendarClock,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  BadgeCheck,
  Search,
  Globe2,
  ShieldCheck,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { ProviderRow, TopicRow } from "@/lib/types";
import { safeFetch } from "@/lib/safe-fetch";

function Shell({
  title,
  sub,
  icon: Icon,
  onClose,
  children,
  wide,
}: {
  title: string;
  sub: string;
  icon: LucideIcon;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(5,8,14,0.72)] p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`surface max-h-[88vh] w-full overflow-hidden !bg-[var(--surface-1)] shadow-2xl ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <div className="flex items-start justify-between border-b border-[var(--line)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--r)] border border-[rgba(96,165,250,0.25)] bg-[var(--accent-soft)]">
              <Icon size={17} className="text-[var(--accent-hi)]" />
            </div>
            <div>
              <div className="display text-lg font-semibold text-[var(--ink)]">{title}</div>
              <div className="text-xs text-[var(--ink-faint)]">{sub}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost !h-9 !px-2.5" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="scroll-slim max-h-[calc(86vh-88px)] overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Providers                                                        */
/* ------------------------------------------------------------------ */

export function ProvidersModal({
  providers,
  onClose,
  onChanged,
}: {
  providers: ProviderRow[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [models, setModels] = useState<Record<string, string>>(
    Object.fromEntries(providers.map((p) => [p.slug, p.model])),
  );
  const [endpoints, setEndpoints] = useState<Record<string, string>>(
    Object.fromEntries(providers.map((p) => [p.slug, p.baseUrl])),
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<Record<string, string>>({});

  async function act(slug: string, payload: Record<string, unknown>) {
    setBusy(slug + JSON.stringify(payload));
    await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...payload }),
    });
    setBusy(null);
    onChanged();
  }

  async function test(slug: string, hasKey: boolean) {
    if (!hasKey && !(keys[slug] ?? "").trim()) {
      setTestMsg((m) => ({ ...m, [slug]: "Paste an API key first, then test." }));
      return;
    }
    if ((keys[slug] ?? "").trim()) {
      await act(slug, {
        action: "set-key",
        apiKey: keys[slug]!.trim(),
        model: models[slug],
        baseUrl: endpoints[slug],
      });
    }
    setBusy(slug + "-test");
    const res = await fetch("/api/providers/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const j = await res.json();
    setTestMsg((m) => ({ ...m, [slug]: j.detail ?? j.error ?? "Tested." }));
    setBusy(null);
    onChanged();
  }

  return (
    <Shell title="AI Vision Provider Studio" sub="Add one or more keys · automatic fallback · exact-topic approval required before counting" icon={Bot} onClose={onClose} wide>
      <div className="mb-4 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] px-4 py-3 text-xs leading-relaxed text-[#a8c9b2]">
        <b>Keys are cached permanently</b> in this app&apos;s local database — they survive restarts,
        reboots and updates; you never re-enter them, they are always masked, and they never leave this
        machine except to their own provider. &nbsp;·&nbsp;
        <b>Strict multiframe topic gate:</b> the app samples actual frames from every downloaded MP4.
        The active provider is tried first; HTTP 429, quota, timeout, malformed or uncertain replies
        automatically fall through to every other enabled provider with a saved key. Only a ≥75%
        exact-topic visual match is kept and counted. Rejected MP4s are deleted and replaced.
      </div>
      <div className="space-y-4">
        {providers.map((p) => (
          <div
            key={p.slug}
            className={`rounded-2xl border p-4 ${
              p.active ? "border-[rgba(59,130,246,0.55)] bg-[rgba(59,130,246,0.05)]" : "border-[var(--line)]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-[var(--ink)]">{p.name}</span>
                {p.active && (
                  <span className="chip !border-[rgba(59,130,246,0.6)] !bg-[rgba(59,130,246,0.14)] !text-[var(--ink)]">
                    <CircleDot size={9} /> active
                  </span>
                )}
                <span
                  className="chip"
                  style={
                    p.status === "ok"
                      ? { borderColor: "rgba(34,197,94,.5)", color: "#86efac" }
                      : p.status === "error"
                        ? { borderColor: "rgba(239,68,68,.5)", color: "#fca5a5" }
                        : {}
                  }
                >
                  {p.keySet ? p.keyPreview : p.status === "untested" ? "no key" : p.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!p.active && (
                  <button className="btn !py-1.5 !text-[11px]" onClick={() => act(p.slug, { action: "activate" })}>
                    Set active
                  </button>
                )}
                <a href={p.docsUrl} target="_blank" rel="noreferrer" className="btn !py-1.5 !text-[11px]">
                  Get key
                </a>
              </div>
            </div>
            <div className="mt-1.5 text-[11px] text-[var(--ink-faint)]">{p.freeTier}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                value={models[p.slug] ?? p.model}
                onChange={(e) => setModels((m) => ({ ...m, [p.slug]: e.target.value }))}
                placeholder="Vision model ID"
                className="rounded-xl border border-[var(--line)] bg-[rgba(5,10,20,0.6)] px-3 py-2 text-[11px] text-[var(--ink)] outline-none"
              />
              <input
                value={endpoints[p.slug] ?? p.baseUrl}
                onChange={(e) => setEndpoints((m) => ({ ...m, [p.slug]: e.target.value }))}
                placeholder="API endpoint"
                className="rounded-xl border border-[var(--line)] bg-[rgba(5,10,20,0.6)] px-3 py-2 text-[11px] text-[var(--ink)] outline-none"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <KeyRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
                <input
                  value={keys[p.slug] ?? ""}
                  onChange={(e) => setKeys((k) => ({ ...k, [p.slug]: e.target.value }))}
                  placeholder={p.keySet ? "Replace saved key (leave blank to keep)" : "Paste API key…"}
                  type="password"
                  autoComplete="off"
                  className="w-full rounded-xl border border-[var(--line)] bg-[rgba(5,10,20,0.6)] py-2.5 pl-9 pr-3 text-xs text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--line-strong)]"
                />
              </div>
              <button
                className="btn !text-[11px]"
                disabled={busy !== null || (!(keys[p.slug] ?? "").trim() && !p.keySet)}
                onClick={() =>
                  act(p.slug, {
                    action: "set-key",
                    apiKey: keys[p.slug]?.trim() ?? "",
                    model: models[p.slug] ?? p.model,
                    baseUrl: endpoints[p.slug] ?? p.baseUrl,
                  })
                }
              >
                Save vision config
              </button>
              <button className="btn !text-[11px]" disabled={busy !== null} onClick={() => test(p.slug, p.keySet)}>
                <FlaskConical size={12} className={busy === p.slug + "-test" ? "pulse-dot" : ""} />
                Test
              </button>
            </div>
            {(testMsg[p.slug] || p.statusDetail) && (
              <div className="mt-2 text-[11px] leading-relaxed text-[var(--ink-dim)]">
                {testMsg[p.slug] ?? p.statusDetail}
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Deity reference photos + viral threshold (single mandir scope)      */
/* ------------------------------------------------------------------ */

export function ReferenceModal({
  topics,
  onClose,
  onChanged,
}: {
  topics: TopicRow[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [refVersion, setRefVersion] = useState<Record<string, number>>({});
  const [refCount, setRefCount] = useState<Record<string, number>>(
    Object.fromEntries(topics.map((t) => [t.slug, t.referenceImageSet ? 1 : 0])),
  );
  const [refBusy, setRefBusy] = useState<string | null>(null);
  const [thresholdM, setThresholdM] = useState("0.1");
  const [savingThreshold, setSavingThreshold] = useState(false);

  useEffect(() => {
    void fetch("/api/settings")
      .then((r) => r.json())
      .then((j) => {
        if (typeof j.minViews === "number") setThresholdM(String(j.minViews / 1_000_000));
      })
      .catch(() => {});
  }, []);

  async function uploadReference(slug: string, file: File) {
    if (file.size > 2_500_000) {
      alert("Please choose an image under 2.5 MB.");
      return;
    }
    if ((refCount[slug] ?? 0) >= 3) {
      alert("Maximum 3 reference photos per topic — remove one first.");
      return;
    }
    setRefBusy(slug);
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const res = await fetch("/api/topics/reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "set", dataUrl }),
    });
    const j = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean; count?: number; error?: string };
    setRefBusy(null);
    if (j.ok) {
      setRefCount((s) => ({ ...s, [slug]: j.count ?? (s[slug] ?? 0) + 1 }));
      setRefVersion((v) => ({ ...v, [slug]: (v[slug] ?? 0) + 1 }));
      onChanged();
    } else {
      alert(j.error || "Upload failed.");
    }
  }

  async function removeReference(slug: string, index: number) {
    setRefBusy(slug);
    const res = await fetch("/api/topics/reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "remove", index }),
    });
    const j = (await res.json().catch(() => ({ ok: false }))) as { count?: number };
    setRefBusy(null);
    if (j.count !== undefined) {
      setRefCount((s) => ({ ...s, [slug]: j.count! }));
      setRefVersion((v) => ({ ...v, [slug]: (v[slug] ?? 0) + 1 }));
      onChanged();
    }
  }

  async function saveThreshold() {
    const m = Number(thresholdM);
    if (!Number.isFinite(m) || m < 0) {
      alert("Enter a number in millions (e.g. 0.1 for 100,000 views).");
      return;
    }
    setSavingThreshold(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minViews: Math.round(m * 1_000_000) }),
    });
    setSavingThreshold(false);
    onChanged();
  }

  return (
    <Shell title="Deity reference photos & viral filter" sub="Upload Vrindavan god images so the AI can verify the final download · set the view threshold" icon={FolderTree} onClose={onClose} wide>
      {/* Viral threshold */}
      <div className="mb-4 rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
        <div className="text-sm font-semibold text-[var(--ink)]">Viral threshold (in millions)</div>
        <div className="mt-0.5 text-[12px] text-[var(--ink-faint)]">
          Only keep videos with more than this many views. 0.1 = 100,000 (1 lakh) · 1 = 1,000,000.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={thresholdM}
              onChange={(e) => setThresholdM(e.target.value)}
              className="w-28 rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--ink-faint)]">
              M
            </span>
          </div>
          <span className="text-[12px] text-[var(--ink-dim)]">
            = {Number(thresholdM || 0) > 0 ? (Number(thresholdM) * 1_000_000).toLocaleString("en-IN") : "0"} views
          </span>
          <div className="ml-auto flex gap-1.5">
            {[0.1, 0.5, 1].map((m) => (
              <button key={m} className="badge" onClick={() => setThresholdM(String(m))}>
                {m}M
              </button>
            ))}
          </div>
          <button className="btn btn-primary !h-9" disabled={savingThreshold} onClick={() => void saveThreshold()}>
            {savingThreshold ? "Saving…" : "Save threshold"}
          </button>
        </div>
      </div>

      {/* Reference photos per topic */}
      <div className="space-y-4">
        {topics.map((t) => {
          const count = refCount[t.slug] ?? 0;
          const ver = refVersion[t.slug] ?? 0;
          const thumbs = Array.from({ length: count });
          return (
            <div key={t.slug} className="rounded-2xl border border-[var(--line)] p-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex gap-1.5">
                    {thumbs.map((_, i) => (
                      <div
                        key={i}
                        className="group relative h-16 w-16 overflow-hidden rounded-[var(--r-sm)] border border-[var(--line-2)] bg-[var(--surface-2)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/topics/reference?slug=${t.slug}&idx=${i}&v=${ver}`}
                          alt={`${t.name} reference ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-[rgba(5,8,14,0.75)] text-[10px] font-semibold text-[#fb7185] opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => void removeReference(t.slug, i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {count === 0 && (
                      <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-[var(--r-sm)] border border-dashed border-[var(--line-2)] text-[var(--ink-faint)]">
                        <ImageIcon size={16} />
                        <span className="text-[9px]">No photo</span>
                      </div>
                    )}
                  </div>
                  <label className="btn mt-2 w-full cursor-pointer justify-center !h-7 !px-1 !text-[10px]">
                    {refBusy === t.slug ? "…" : count >= 3 ? "Full (3/3)" : `Add photo (${count}/3)`}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      disabled={count >= 3 || refBusy === t.slug}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void uploadReference(t.slug, f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[var(--ink)]">{t.name}</div>
                  <div className="mt-1 text-[12px] leading-relaxed text-[var(--ink-faint)]">
                    Upload 1–3 clear photos of the deity/temple. The AI compares every final download
                    against these images before it is allowed to upload — so only genuine Vrindavan
                    deity videos reach your YouTube channel.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}


/* ------------------------------------------------------------------ */
/* Windows desktop app guide                                           */
/* ------------------------------------------------------------------ */

function Step({ n, title, cmd, desc }: { n: number; title: string; desc: string; cmd?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] p-4">
      <div className="flex items-center gap-2.5">
        <span className="display flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-sm font-semibold text-[var(--gold)]">
          {n}
        </span>
        <span className="text-sm font-semibold text-[var(--ink)]">{title}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--ink-dim)]">{desc}</p>
      {cmd && (
        <pre className="console-mono mt-2.5 overflow-x-auto rounded-xl border border-[var(--line)] bg-[rgba(5,10,20,0.7)] p-3 text-[11px] leading-relaxed text-[#e6c98f]">
          {cmd}
        </pre>
      )}
    </div>
  );
}

export function WindowsModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell
      title="Windows Desktop Agent — Installation"
      sub="Complete Python + PySide6 source ships in windows-app/ of this project"
      icon={MonitorDown}
      onClose={onClose}
      wide
    >
      <div className="mb-4 space-y-2 rounded-2xl border border-[var(--line)] bg-[rgba(96,165,250,0.04)] p-4">
        {(
          [
            { Icon: FolderTree, text: "PySide6 dashboard · engine.py scheduler · db.py permanent SQLite cache · discovery.py (public-content adapters) · downloader.py (yt-dlp + sha256 integrity) · ai_providers.py (Gemini / Mistral / NVIDIA / Agnes / Bazarlink)" },
            { Icon: CalendarClock, text: "Task Scheduler starts at logon and resumes missing topics after shutdown — completed topics are never downloaded twice" },
            { Icon: Database, text: "SQLite stores video ID, canonical URL, topic, caption, views, IST date, path, status, sha256 — never purged on update" },
            { Icon: BadgeCheck, text: "pytest suite enforces: ≤10/day TOTAL cap, no duplicate IDs/URLs/hashes, IST-midnight rollover, Hindi/English topic classification" },
          ] as { Icon: LucideIcon; text: string }[]
        ).map(({ Icon, text }, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ink-dim)]">
            <Icon size={13} className="mt-0.5 shrink-0 text-[var(--gold)]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Step n={1} title="Install Python 3.11+ and dependencies" desc="From the repo root on Windows:" cmd={"cd windows-app\npy -m venv .venv && .venv\\Scripts\\activate\npip install -r requirements.txt"} />
        <Step n={2} title="Configure API keys (optional)" desc="AI is optional. Launch the dashboard → API Keys tab, or set them before first run:" cmd={"set GEMINI_API_KEY=your-key\nset MISTRAL_API_KEY=your-key\nset NVIDIA_API_KEY=your-key"} />
        <Step n={3} title="Register Windows startup" desc="Creates a Task Scheduler entry so the agent starts hidden at every logon and survives reboots:" cmd={"python install_startup.py"} />
        <Step n={4} title="Run it" desc="First run checks which of the 7 topics already have an approved video today and searches only for the missing topics." cmd={"python main.py            :: dashboard + engine\npython main.py --headless  :: background only"} />
        <Step n={5} title="Build the .exe" desc="Single-file Windows executable with hidden console for background operation:" cmd={"pyinstaller --noconfirm --onefile --windowed --name ViralDarshan main.py\n:: output: dist\\ViralDarshan.exe"} />
        <Step n={6} title="Test before trusting" desc={"pytest -q\n:: tests enforce: 7/day, one approved video per topic, no duplicates,\n:: IST-midnight rollover and multilingual topic classification"} />
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.07)] px-4 py-3 text-[11px] leading-relaxed text-[#fca5a5]">
        <TerminalSquare size={13} className="mt-0.5 shrink-0" />
        Compliance: the agent only touches publicly accessible content via yt-dlp&apos;s public endpoints,
        never logs in or bypasses private/account protections, spaces requests, and stops on rate
        limiting. If Instagram does not expose a view count, the reel is skipped (never guesses ≥1M).
      </div>
    </Shell>
  );
}
