export interface TopicStatus {
  slug: string;
  name: string;
  hindiName: string;
  folder: string;
  enabled: boolean;
  keywords: string[];
  count: number;
  views: number;
}

export interface TopicRow {
  id: number;
  slug: string;
  name: string;
  hindiName: string;
  folder: string;
  keywords: string[];
  enabled: boolean;
  sortOrder: number;
  referenceImageSet?: boolean;
}

export interface ProviderRow {
  id: number;
  slug: string;
  name: string;
  baseUrl: string;
  docsUrl: string;
  freeTier: string;
  model: string;
  active: boolean;
  enabled: boolean;
  status: string;
  statusDetail: string;
  lastTestedAt: string | null;
  keySet: boolean;
  keyPreview: string | null;
}

export interface LogRow {
  id: number;
  ts: string;
  level: string;
  message: string;
}

export interface ScanRunRow {
  id: number;
  trigger: string;
  status: string;
  istDate: string;
  candidates: number;
  eligible: number;
  fresh: number;
  downloaded: number;
  duplicates: number;
  failed: number;
  quotaBefore: number;
  message: string;
  aiProvider: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface Status {
  istNow: string;
  istDate: string;
  engineRunning: boolean;
  dailyLimit: number;
  minViews: number;
  today: {
    count: number;
    remaining: number;
    duplicatesSkipped: number;
    failed: number;
    aiRejected: number;
    aiPending: number;
    viewsTotal: number;
    byTopic: TopicStatus[];
  };
  yesterday: { date: string; count: number };
  lifetime: { downloaded: number };
  lastScanAt: number;
  nextScanAt: number;
  lastRun: ScanRunRow | null;
  scanInsight?: {
    inspected: number;
    eligible: number;
    belowThreshold: number;
    noPublicMetric: number;
    unavailable: number;
    exactViews?: number;
    threshold: number;
    at: number;
  } | null;
  quota?: {
    used: number;
    limit: number;
    remaining: number;
    exhausted: boolean;
    perUploadCost: number;
  } | null;
  insights?: {
    topStrategy: string | null;
    topStrategyAvg: number;
    strategySamples: number;
    bestHour: number | null;
    bestHourAvg: number;
    hourSamples: number;
  } | null;
  topics: TopicRow[];
  providers: ProviderRow[];
  logs: LogRow[];
  downloadRoot: string;
}

export interface HistoryItem {
  id: number;
  videoId: string;
  url: string;
  caption: string;
  author: string;
  viewCount: number;
  likeCount: number;
  metricSource: "views" | "plays" | "likes-lower-bound";
  aiVerdict: "match" | "mismatch" | "uncertain" | "pending";
  aiProvider: string | null;
  aiConfidence: number | null;
  aiDetectedTopic: string | null;
  aiReason: string | null;
  istDate: string;
  filePath: string | null;
  fileName: string | null;
  fileHash: string | null;
  fileSize: number | null;
  downloadedAt: string | null;
  topicSlug: string;
  topicName: string;
  topicFolder: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  pages: number;
  dates: string[];
}

export const TOPIC_ART: Record<string, string> = {
  "banke-bihari-ji": "/topic-art/banke-bihari-ji.jpg",
  "radha-vallabh-ji": "/topic-art/radha-vallabh-ji.jpg",
  "radha-raman-ji": "/topic-art/radha-raman-ji.jpg",
  "radha-govind-dev-ji": "/topic-art/radha-govind-dev-ji.jpg",
  "premanand-ji-maharaj": "/topic-art/premanand-ji-maharaj.jpg",
  "indresh-ji-maharaj": "/topic-art/indresh-ji-maharaj.jpg",
  "vinod-baba-ji": "/topic-art/vinod-baba-ji.jpg",
};

/** Display name without the honorific prefix (e.g. "Shri Banke Bihari Ji" → "Banke Bihari Ji"). */
export function cleanTopic(name: string): string {
  return name.replace(/^shri\s+/i, "").trim();
}

export function fmtIN(n: number): string {
  return n.toLocaleString("en-IN");
}

export function fmtViews(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)} L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
