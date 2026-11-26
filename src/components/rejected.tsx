"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, ShieldX, Eye, Heart, Download } from "lucide-react";
import type { TopicRow } from "@/lib/types";
import { cleanTopic, fmtIN, fmtViews } from "@/lib/types";
import { safeFetch } from "@/lib/safe-fetch";

interface RejectedItem {
  id: number;
  videoId: string;
  url: string;
  caption: string;
  author: string;
  viewCount: number;
  likeCount: number;
  istDate: string;
  aiVerdict: string;
  aiProvider: string | null;
  aiConfidence: number | null;
  aiDetectedTopic: string | null;
  aiReason: string | null;
  aiFrame: string | null;
  topicSlug: string;
  topicName: string;
}

interface RejectedResponse {
  items: RejectedItem[];
  total: number;
  page: number;
  pages: number;
}

export default function RejectedView({
  topics,
  refreshKey,
}: {
  topics: TopicRow[];
  refreshKey: number;
}) {
  const [data, setData] = useState<RejectedResponse | null>(null);
  const [topic, setTopic] = useState("all");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams({ topic, page: String(page) });
    void safeFetch<RejectedResponse>(`/api/rejected?${q}`, {}, 1).then((r) => {
      if (!cancelled && r.ok && r.data) setData(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [topic, page, refreshKey, tick]);

  async function requeue(id: number) {
    await safeFetch(`/api/rejected`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "requeue" }),
    });
    setTick((t) => t + 1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="seg max-w-full flex-wrap overflow-x-auto">
        <button onClick={() => { setTopic("all"); setPage(1); }} className={`seg-item ${topic === "all" ? "seg-item-active" : ""}`}>
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
        <a href="/api/export?type=rejected" download className="btn !h-8 !text-[11px]">
          <Download size={12} /> Export CSV
        </a>
      </div>

      {!data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="surface shimmer h-20" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="surface flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-3)]">
            <ShieldX size={20} className="text-[var(--ink-faint)]" />
          </div>
          <div className="text-sm text-[var(--ink-dim)]">No rejected videos.</div>
          <div className="text-xs text-[var(--ink-faint)]">
            The AI only rejects when it is highly confident a clip is the wrong subject.
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              className="surface card-hover p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-danger">Not relevant</span>
                    <span className="text-[13px] font-semibold text-[var(--ink)]">
                      Searched: {cleanTopic(item.topicName)}
                    </span>
                    {item.aiDetectedTopic && item.aiDetectedTopic !== "unknown" && (
                      <span className="text-[12px] text-[var(--ink-dim)]">
                        → AI saw: <span className="font-medium text-[#fb7185]">{item.aiDetectedTopic}</span>
                      </span>
                    )}
                    <span className="badge">{item.aiConfidence ?? 0}% sure</span>
                    {item.aiProvider && <span className="text-[11px] text-[var(--ink-faint)]">· {item.aiProvider}</span>}
                  </div>

                  {item.aiFrame && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.aiFrame}
                      alt="Frame the AI reviewed"
                      className="mt-2 h-24 w-auto rounded-[var(--r-sm)] border border-[var(--line)] object-cover"
                    />
                  )}
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[var(--ink-dim)]">
                    {item.caption || "No caption"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--ink-faint)]">
                    <span className="truncate">{item.author}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {fmtViews(item.viewCount)}</span>
                    <span className="flex items-center gap-1"><Heart size={10} /> {fmtViews(item.likeCount)}</span>
                    <span className="tnum">{item.istDate}</span>
                  </div>

                  {item.aiReason && (
                    <div className="mt-2 rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1.5 text-[11px] leading-snug text-[var(--ink-dim)]">
                      <span className="font-medium text-[var(--ink-faint)]">Reason: </span>
                      {item.aiReason.split(" | ")[0]}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <a href={item.url} target="_blank" rel="noreferrer" className="btn !h-8 !text-[11px]">
                    <ExternalLink size={12} /> Check on Instagram
                  </a>
                  <button
                    className="btn btn-ghost !h-8 !text-[11px]"
                    onClick={() => requeue(item.id)}
                    title="If this was wrongly rejected, re-queue it for the next scan"
                  >
                    Re-queue
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(data?.pages ?? 1) > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button className="btn !h-9 !px-3" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={15} />
          </button>
          <span className="tnum text-xs text-[var(--ink-dim)]">
            Page {data!.page} of {data!.pages} · {fmtIN(data!.total)} rejected
          </span>
          <button className="btn !h-9 !px-3" disabled={page >= (data?.pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
