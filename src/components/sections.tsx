"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Info,
  Bot,
  AlertTriangle,
  Radar,
  Clock,
  Check,
  type LucideIcon,
} from "lucide-react";
import type { LogRow, TopicStatus } from "@/lib/types";
import { TOPIC_ART, cleanTopic, fmtViews } from "@/lib/types";

const THUMB_GRADIENTS: Record<string, string> = {
  "banke-bihari-ji": "linear-gradient(135deg,#1e3a8a,#312e81)",
  "radha-vallabh-ji": "linear-gradient(135deg,#9d174d,#831843)",
  "radha-raman-ji": "linear-gradient(135deg,#9a3412,#7c2d12)",
  "radha-govind-dev-ji": "linear-gradient(135deg,#b45309,#78350f)",
  "premanand-ji-maharaj": "linear-gradient(135deg,#166534,#14532d)",
  "indresh-ji-maharaj": "linear-gradient(135deg,#6d28d9,#4c1d95)",
  "vinod-baba-ji": "linear-gradient(135deg,#0f766e,#134e4a)",
};

/** Topic thumbnail with a graceful gradient-initial fallback if the image fails. */
export function TopicThumb({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = cleanTopic(name).charAt(0).toUpperCase();
  if (failed || !TOPIC_ART[slug]) {
    return (
      <div
        className={`flex items-center justify-center text-sm font-bold text-white/90 ${className}`}
        style={{ background: THUMB_GRADIENTS[slug] ?? "linear-gradient(135deg,#1e293b,#0f172a)" }}
      >
        {initial}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={TOPIC_ART[slug]}
      alt={cleanTopic(name)}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ---------------- Circular progress ring ---------------- */

export function ProgressRing({
  count,
  limit,
  size = 176,
}: {
  count: number;
  limit: number;
  size?: number;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = limit > 0 ? Math.min(1, count / limit) : 0;
  const done = count >= limit;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? "#22c55e" : "#3b82f6"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - c * pct }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display tnum text-4xl font-semibold text-[var(--ink)]">
          {count}
          <span className="text-2xl text-[var(--ink-faint)]">/{limit}</span>
        </div>
        <div className="mt-1 text-[11px] font-medium text-[var(--ink-dim)]">
          {done ? "All topics done" : "topics collected"}
        </div>
      </div>
    </div>
  );
}

/* ---------------- KPI card ---------------- */

export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "accent" | "success" | "danger" | "violet";
}) {
  const toneMap: Record<string, string> = {
    default: "text-[var(--ink-dim)]",
    accent: "text-[var(--accent-hi)]",
    success: "text-[#4ade80]",
    danger: "text-[#fb7185]",
    violet: "text-[var(--violet)]",
  };
  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Icon size={15} className={toneMap[tone]} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
          {label}
        </span>
      </div>
      <div className="display tnum mt-3 text-[26px] font-semibold leading-none text-[var(--ink)]">
        {value}
      </div>
      {sub && <div className="mt-2 text-xs leading-snug text-[var(--ink-dim)]">{sub}</div>}
    </div>
  );
}

/* ---------------- Topic coverage list ---------------- */

export function TopicCoverage({ topics }: { topics: TopicStatus[] }) {
  return (
    <div className="divide-y divide-[var(--line)]">
      {topics.map((t, i) => {
        const done = t.count >= 1;
        return (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <TopicThumb
              slug={t.slug}
              name={t.name}
              className="h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border border-[var(--line-2)]"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-[var(--ink)]">
                {cleanTopic(t.name)}
              </div>
              <div className="text-[11px] text-[var(--ink-faint)]">
                {done ? `${fmtViews(t.views)} reach` : "searching for a match"}
              </div>
            </div>
            {done ? (
              <span className="badge badge-success shrink-0">
                <Check size={11} /> Collected
              </span>
            ) : (
              <span className="badge shrink-0 text-[var(--ink-faint)]">Pending</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------- Activity feed ---------------- */

const LOG_STYLE: Record<string, { color: string; Icon: LucideIcon }> = {
  ok: { color: "#4ade80", Icon: CheckCircle2 },
  info: { color: "#8aa0bd", Icon: Info },
  warn: { color: "#fbbf24", Icon: AlertTriangle },
  error: { color: "#fb7185", Icon: XCircle },
  ai: { color: "#a78bfa", Icon: Bot },
};

function logTime(ts: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export function ActivityFeed({
  logs,
  scanning,
  height = 300,
}: {
  logs: LogRow[];
  scanning: boolean;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs.length, scanning]);

  return (
    <div
      ref={ref}
      className="console-mono scroll-slim space-y-1.5 overflow-y-auto rounded-[var(--r)] border border-[var(--line)] bg-[var(--bg)] p-4 text-[12px] leading-relaxed"
      style={{ height }}
    >
      <AnimatePresence initial={false}>
        {logs.map((l) => {
          const s = LOG_STYLE[l.level] ?? LOG_STYLE.info;
          return (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2.5"
            >
              <s.Icon size={13} className="mt-[2px] shrink-0" style={{ color: s.color }} />
              <span className="shrink-0 text-[var(--ink-faint)] tnum">{logTime(l.ts)}</span>
              <span className="min-w-0 break-words text-[var(--ink-dim)]">{l.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {scanning && (
        <div className="flex items-center gap-2.5 text-[var(--accent-hi)]">
          <Radar size={13} className="scan-sweep" />
          <span>scanning remaining topics…</span>
        </div>
      )}
      {logs.length === 0 && !scanning && (
        <div className="flex h-full items-center justify-center gap-2 text-[var(--ink-faint)]">
          <Clock size={14} /> No activity yet. Start the engine to begin.
        </div>
      )}
    </div>
  );
}
