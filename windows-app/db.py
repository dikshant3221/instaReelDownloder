"""
Permanent SQLite cache.  This file IS the duplicate-prevention guarantee.

- One row per video, forever. Never purged by updates or daily resets.
- UNIQUE(video_id), UNIQUE(url)  → database-level "never twice".
- sha256 file hash stored as an extra dedupe + integrity signal.
- The daily counter is DERIVED (count of status='completed' WHERE ist_date = today),
  so crashes/reboots can never reset or inflate progress.
"""
from __future__ import annotations

import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

from config import DB_PATH, IST

_LOCK = threading.RLock()

SCHEMA = """
CREATE TABLE IF NOT EXISTS videos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id      TEXT NOT NULL UNIQUE,      -- Instagram shortcode
    url           TEXT NOT NULL UNIQUE,      -- canonical reel URL
    topic         TEXT NOT NULL,
    caption       TEXT DEFAULT '',
    author        TEXT DEFAULT '',
    view_count    INTEGER DEFAULT 0,         -- views at discovery
    like_count    INTEGER DEFAULT 0,
    ist_date      TEXT NOT NULL,             -- YYYY-MM-DD Asia/Kolkata
    file_path     TEXT,
    file_hash     TEXT,                      -- sha256 of final bytes
    file_size     INTEGER,
    status        TEXT NOT NULL,             -- completed|failed|skipped_duplicate
    error         TEXT,
    discovered_at TEXT NOT NULL,
    downloaded_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_videos_ist_date ON videos(ist_date);
CREATE INDEX IF NOT EXISTS idx_videos_status   ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_hash     ON videos(file_hash);

CREATE TABLE IF NOT EXISTS scan_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL, level TEXT NOT NULL, message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ist_date TEXT NOT NULL,
    trigger TEXT NOT NULL,
    candidates INTEGER DEFAULT 0, eligible INTEGER DEFAULT 0,
    downloaded INTEGER DEFAULT 0, duplicates INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    started_at TEXT NOT NULL, finished_at TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY, value TEXT NOT NULL
);
"""


def ist_today() -> str:
    return datetime.now(IST).strftime("%Y-%m-%d")


@contextmanager
def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH, timeout=30, isolation_level=None)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA journal_mode=WAL")       # crash-safe concurrent reads
    con.execute("PRAGMA synchronous=FULL")       # survive power loss mid-write
    try:
        yield con
    finally:
        con.close()


def init() -> None:
    with _LOCK, connect() as con:
        con.executescript(SCHEMA)


# ------------------------------------------------------------ dedupe API ---
def is_known(video_id: str, url: str, file_hash: str | None = None) -> bool:
    """True if this reel (by ID, canonical URL, or file hash) was EVER downloaded."""
    with _LOCK, connect() as con:
        row = con.execute(
            "SELECT 1 FROM videos WHERE status='completed' AND (video_id=? OR url=?)"
            + (" OR file_hash=?" if file_hash else "") + " LIMIT 1",
            (video_id, url, file_hash) if file_hash else (video_id, url),
        ).fetchone()
        return row is not None


def hash_seen(file_hash: str) -> bool:
    with _LOCK, connect() as con:
        return con.execute(
            "SELECT 1 FROM videos WHERE status='completed' AND file_hash=? LIMIT 1",
            (file_hash,),
        ).fetchone() is not None


def record_download(*, video_id: str, url: str, topic: str, caption: str, author: str,
                    view_count: int, like_count: int, ist_date: str, file_path: str | None,
                    file_hash: str | None, file_size: int | None, status: str,
                    error: str | None = None) -> bool:
    """Insert a finished download. Returns False if a concurrent writer raced it in
    (UNIQUE constraint) — in which case we count it as a duplicate, never twice."""
    with _LOCK, connect() as con:
        try:
            con.execute(
                """INSERT INTO videos (video_id,url,topic,caption,author,view_count,
                       like_count,ist_date,file_path,file_hash,file_size,status,error,
                       discovered_at,downloaded_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (video_id, url, topic, caption, author, view_count, like_count,
                 ist_date, file_path, file_hash, file_size, status, error,
                 datetime.now(IST).isoformat(),
                 datetime.now(IST).isoformat() if status == "completed" else None),
            )
            return True
        except sqlite3.IntegrityError:
            return False


# --------------------------------------------------------- daily counter ---
def today_completed(date: str | None = None) -> int:
    date = date or ist_today()
    with _LOCK, connect() as con:
        return con.execute(
            "SELECT COUNT(*) c FROM videos WHERE ist_date=? AND status='completed'",
            (date,),
        ).fetchone()["c"]


def today_by_topic(date: str | None = None) -> dict[str, int]:
    date = date or ist_today()
    with _LOCK, connect() as con:
        rows = con.execute(
            "SELECT topic, COUNT(*) c FROM videos WHERE ist_date=? AND status='completed'"
            " GROUP BY topic", (date,),
        ).fetchall()
        return {r["topic"]: r["c"] for r in rows}


def stats(date: str | None = None) -> dict:
    date = date or ist_today()
    with _LOCK, connect() as con:
        failed = con.execute(
            "SELECT COUNT(*) c FROM videos WHERE ist_date=? AND status='failed'", (date,)
        ).fetchone()["c"]
        dups = con.execute(
            "SELECT COUNT(*) c FROM videos WHERE ist_date=? AND status='skipped_duplicate'",
            (date,),
        ).fetchone()["c"]
        views = con.execute(
            "SELECT COALESCE(SUM(view_count),0) v FROM videos WHERE ist_date=? AND status='completed'",
            (date,),
        ).fetchone()["v"]
        lifetime = con.execute(
            "SELECT COUNT(*) c FROM videos WHERE status='completed'"
        ).fetchone()["c"]
    return {"failed": failed, "duplicates": dups, "views": views, "lifetime": lifetime}


def history(limit: int = 200, topic: str | None = None) -> list[dict]:
    with _LOCK, connect() as con:
        q = "SELECT * FROM videos WHERE status='completed'"
        args: list = []
        if topic:
            q += " AND topic=?"
            args.append(topic)
        q += " ORDER BY downloaded_at DESC LIMIT ?"
        args.append(limit)
        return [dict(r) for r in con.execute(q, args).fetchall()]


def log(level: str, message: str) -> None:
    with _LOCK, connect() as con:
        con.execute("INSERT INTO scan_log(ts,level,message) VALUES (?,?,?)",
                    (datetime.now(IST).isoformat(), level, message))
        con.execute("""DELETE FROM scan_log WHERE id <
                       (SELECT MIN(id) FROM (SELECT id FROM scan_log ORDER BY id DESC LIMIT 1000))""")


def recent_logs(limit: int = 300) -> list[dict]:
    with _LOCK, connect() as con:
        rows = con.execute("SELECT * FROM scan_log ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in reversed(rows)]


def new_scan(ist_date: str, trigger: str) -> int:
    with _LOCK, connect() as con:
        cur = con.execute("INSERT INTO scans(ist_date,trigger,started_at) VALUES (?,?,?)",
                          (ist_date, trigger, datetime.now(IST).isoformat()))
        return int(cur.lastrowid)


def finish_scan(scan_id: int, **counters) -> None:
    sets = ", ".join(f"{k}=?" for k in counters)
    with _LOCK, connect() as con:
        con.execute(
            f"UPDATE scans SET {sets}, finished_at=? WHERE id=?",
            (*counters.values(), datetime.now(IST).isoformat(), scan_id),
        )


def get_setting(key: str, default: str = "") -> str:
    with _LOCK, connect() as con:
        row = con.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        return row["value"] if row else default


def set_setting(key: str, value: str) -> None:
    with _LOCK, connect() as con:
        con.execute("INSERT INTO settings(key,value) VALUES (?,?) "
                    "ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, value))
