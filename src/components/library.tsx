"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Film,
  BadgeCheck,
  Search,
} from "lucide-react";
import type { HistoryResponse, TopicRow } from "@/lib/types";
import { cleanTopic, fmtIN, fmtViews } from "@/lib/types";
import { safeFetch } from "@/lib/safe-fetch";
import { TopicThumb } from "@/components/sections";

export default function DownloadLibrary({
  topics,
  refreshKey,
}: {
  topics: TopicRow[];
  refreshKey: number;
}) {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [topic, setTopic] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [retryTick, setRetryTick] = useState(0);

  // Debounce the search box before it hits the API.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const params = new URLSearchParams({ topic, page: String(page) });
    if (date) params.set("date", date);
    if (debouncedQ.trim().length >= 2) params.set("q", debouncedQ.trim());
    void safeFetch<HistoryResponse>(`/api/history?${params}`, {}, 1).then((r) => {
      if (cancelled) return;
      if (r.ok && r.data) setData(r.data);
      else retry = setTimeout(() => setRetryTick((t) => t + 1), 2500);
    });
    return () => {
      cancelled = true;
      if (retry) clearTimeout(retry);
    };
  }, [topic, date, page, debouncedQ, refreshKey, retryTick]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search captions, transcripts, titles…"
              className="w-full rounded-[var(--r)] border border-[var(--line-2)] bg-[var(--bg)] py-2.5 pl-9 pr-3 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
          </div>
          <a href="/api/export?type=history" download className="btn !h-9 !text-[12px]">
            <Download size={13} /> Export CSV
          </a>
        </div>
        <div className="seg max-w-full flex-wrap overflow-x-auto">
          <button
            onClick={() => { setTopic("all"); setPage(1); }}
            className={`seg-item ${topic === "all" ? "seg-item-active" : ""}`}
          >
            All topics
          </button>
          {topics.map((t) => (
            <button
              key={t.slug}
              onClick={() => { setTopic(t.slug); setPage(1); }}
              className={`seg-item ${topic === t.slug ? "seg-item-active" : ""}`}
            >
              {cleanTopic(t.name).replace(/ Ji$/, "")}
            </button>
          ))}
        </div>

        {(data?.dates ?? []).length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setDate(""); setPage(1); }}
              className={`badge ${!date ? "badge-accent" : ""}`}
            >
              All dates
            </button>
            {(data?.dates ?? []).map((d) => (
              <button
                key={d}
                onClick={() => { setDate(d); setPage(1); }}
                className={`badge ${date === d ? "badge-accent" : ""}`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {!data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface shimmer h-[260px]" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="surface flex h-52 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-3)]">
            <Film size={20} className="text-[var(--ink-faint)]" />
          </div>
          <div className="text-sm text-[var(--ink-dim)]">No approved videos yet.</div>
          <div className="text-xs text-[var(--ink-faint)]">Run a scan to start today&apos;s collection.</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.35 }}
              className="surface card-hover group flex flex-col overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <TopicThumb
                  slug={item.topicSlug}
                  name={item.topicName}
                  className="h-full w-full !text-3xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,14,23,0.92)] via-transparent to-transparent" />
                <span className="badge absolute left-2.5 top-2.5 !bg-[rgba(10,14,23,0.7)] backdrop-blur">
                  {cleanTopic(item.topicName)}
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2 text-[11px] font-medium text-white">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {item.metricSource === "likes-lower-bound"
                      ? `≥${fmtViews(item.viewCount)}`
                      : fmtViews(item.viewCount)}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--ink-dim)]">
                    <Heart size={11} className="text-[var(--violet)]" />
                    {fmtViews(item.likeCount)}
                  </span>
                  <span className="ml-auto text-[var(--ink-faint)] tnum">{item.istDate}</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-3.5">
                <p className="line-clamp-2 min-h-[2.4em] text-[13px] leading-snug text-[var(--ink)]">
                  {item.caption || "Untitled reel"}
                </p>
                <div className="mt-1.5 truncate text-[11px] text-[var(--ink-faint)]">{item.author}</div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#4ade80]">
                  <BadgeCheck size={13} />
                  Verified {item.aiConfidence ?? 0}%
                  <span className="truncate text-[var(--ink-faint)]">· {item.aiProvider ?? "AI"}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  {item.filePath && (
                    <a
                      href={item.filePath}
                      download={item.fileName ?? true}
                      className="btn btn-primary flex-1 !h-9 !text-[12px]"
                    >
                      <Download size={13} /> Save
                    </a>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn flex-1 !h-9 !text-[12px]"
                  >
                    <ExternalLink size={13} /> Source
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {(data?.pages ?? 1) > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="btn !h-9 !px-3" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={15} />
          </button>
          <span className="tnum text-xs text-[var(--ink-dim)]">
            Page {data!.page} of {data!.pages} · {fmtIN(data!.total)} videos
          </span>
          <button className="btn !h-9 !px-3" disabled={page >= (data?.pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
