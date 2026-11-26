"""
Engine — the autonomous heart of ViralDarshan.

Guarantees (all enforced here, re-verified in tests/test_core.py):
  * Exactly one successful download for each of 7 topics per IST day
    (DAILY_LIMIT=7 total).
  * Only reels with strictly more than MIN_VIEWS views are downloaded.
  * Permanent dedupe: video_id / canonical URL / sha256 — never twice, even
    across days, restarts and multi-topic appearances.
  * Crash / shutdown recovery: daily progress lives in SQLite (WAL+FULL sync);
    on restart the engine recounts completed rows — it can never lose or
    double-count progress. Missed scan windows trigger an immediate catch-up.
  * Daily reset at 00:00 Asia/Kolkata; the duplicate cache never resets.
"""
from __future__ import annotations

import threading
import time
from datetime import datetime, timedelta

from config import DAILY_LIMIT, IST, MIN_VIEWS, SCAN_INTERVAL_MIN, TOPICS
import db
from discovery import Candidate, discover_all
from downloader import download

_scan_lock = threading.Lock()
_stop_event = threading.Event()


def today_counts(date: str | None = None) -> tuple[int, dict[str, int]]:
    date = date or db.ist_today()
    return db.today_completed(date), db.today_by_topic(date)


def _pick_diverse(fresh: list[Candidate], quota: int) -> list[Candidate]:
    """Pick at most one highest-view candidate for each topic still missing today."""
    _, today_by_topic = today_counts()
    best: dict[str, Candidate] = {}
    for c in fresh:
        if today_by_topic.get(c.topic, 0) >= 1:
            continue
        if c.topic not in best or c.view_count > best[c.topic].view_count:
            best[c.topic] = c
    return sorted(best.values(), key=lambda c: c.view_count, reverse=True)[:quota]


def run_scan(trigger: str = "scheduled", on_log=lambda lvl, msg: None) -> dict:  # noqa: E731
    def log(level: str, msg: str):
        db.log(level, msg)
        on_log(level, msg)

    if not _scan_lock.acquire(blocking=False):
        log("warn", "Scan already running — single-instance guard prevented a parallel scan.")
        return {"status": "busy"}

    try:
        ist = db.ist_today()
        done, _ = today_counts(ist)
        remaining = max(0, DAILY_LIMIT - done)
        scan_id = db.new_scan(ist, trigger)
        log("info", f"Scan #{scan_id} ({trigger}) IST={ist}: {done}/{DAILY_LIMIT} used, "
                    f"{remaining} slots remaining ACROSS ALL TOPICS.")

        if remaining <= 0:
            db.finish_scan(scan_id, candidates=0, eligible=0, downloaded=0, duplicates=0, failed=0)
            log("ok", "Daily coverage complete: 7/7 topics — sleeping until midnight IST.")
            return {"status": "target-met", "downloaded": 0}

        candidates = discover_all()
        eligible = [c for c in candidates if c.view_count > MIN_VIEWS]
        log("info", f"{len(candidates)} candidates → {len(eligible)} eligible (>1,000,000 views).")

        fresh, duplicates = [], 0
        for c in eligible:
            if db.is_known(c.video_id, c.url):     # permanent cache check
                duplicates += 1
                db.record_download(video_id=c.video_id + f"#dup{scan_id}", url=c.url + f"#dup{scan_id}",
                                   topic=c.topic, caption=c.caption, author=c.author,
                                   view_count=c.view_count, like_count=c.like_count,
                                   ist_date=ist, file_path=None, file_hash=None, file_size=None,
                                   status="skipped_duplicate")
            else:
                fresh.append(c)
        if duplicates:
            log("warn", f"Duplicate shield: {duplicates} cached video(s) skipped.")

        selected = _pick_diverse(fresh, remaining)
        known_hashes: set[str] = set()
        downloaded, failed = 0, 0
        for c in selected:
            if db.today_completed(ist) >= DAILY_LIMIT:   # hard mid-scan stop
                log("ok", "Hard stop — 7/7 topics complete.")
                break
            if db.today_by_topic(ist).get(c.topic, 0) >= 1:
                log("warn", f"{c.topic} already has today's video — extra candidate skipped.")
                continue
            res = download(c, ist, known_hashes)
            if not res.ok:
                if "duplicate content hash" in (res.error or ""):
                    duplicates += 1
                    log("warn", f"{c.video_id}: {res.error}")
                else:
                    failed += 1
                    db.record_download(video_id=c.video_id, url=c.url, topic=c.topic,
                                       caption=c.caption, author=c.author,
                                       view_count=c.view_count, like_count=c.like_count,
                                       ist_date=ist, file_path=None, file_hash=None,
                                       file_size=None, status="failed", error=res.error)
                    log("error", f"FAILED {c.video_id}: {res.error} (not counted)")
                continue
            known_hashes.add(res.file_hash)
            inserted = db.record_download(
                video_id=c.video_id, url=c.url, topic=c.topic, caption=c.caption,
                author=c.author, view_count=c.view_count, like_count=c.like_count,
                ist_date=ist, file_path=str(res.path), file_hash=res.file_hash,
                file_size=res.file_size, status="completed")
            if not inserted:
                duplicates += 1
                log("warn", f"{c.video_id} already in permanent cache (race) — not downloaded twice.")
                continue
            downloaded += 1
            log("ok", f"Saved {res.path.name} — {c.view_count:,} views, sha256 {res.file_hash[:10]}…")

        after = db.today_completed(ist)
        db.finish_scan(scan_id, candidates=len(candidates), eligible=len(eligible),
                       downloaded=downloaded, duplicates=duplicates, failed=failed)
        msg = (f"Daily target reached {after}/{DAILY_LIMIT} — stopping until IST midnight."
               if after >= DAILY_LIMIT else
               f"{downloaded} saved; {DAILY_LIMIT - after} slots remain — next scan in "
               f"{SCAN_INTERVAL_MIN} min." if downloaded else
               "No new eligible reels this scan — retrying on schedule.")
        log("ok" if after >= DAILY_LIMIT else "info", msg)
        return {"status": "finished", "downloaded": downloaded, "remaining": DAILY_LIMIT - after}
    finally:
        _scan_lock.release()


def seconds_until_midnight_ist() -> float:
    now = datetime.now(IST)
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    return max(5.0, (midnight - now).total_seconds())


def background_loop(on_log=lambda lvl, msg: None, on_tick=lambda: None) -> None:  # noqa: E731
    """Autonomous scheduler. Survives missed windows: any time it wakes and the
    target is unmet and the interval elapsed, it catches up immediately —
    including right after a laptop shutdown/restart."""
    last_scan = 0.0
    while not _stop_event.is_set():
        done, _ = today_counts()
        target_met = done >= DAILY_LIMIT
        interval = seconds_until_midnight_ist() if target_met else SCAN_INTERVAL_MIN * 60
        if time.time() - last_scan >= interval:
            try:
                run_scan("scheduled", on_log=on_log)
            except Exception as exc:                # noqa: BLE001 — never die
                db.log("error", f"Scan crashed safely: {exc!r} — will retry next window.")
            last_scan = time.time()
        on_tick()
        _stop_event.wait(5)                        # heartbeat; graceful stop


def stop() -> None:
    _stop_event.set()
