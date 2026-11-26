"""
Downloader — yt-dlp based, with retries, integrity verification,
hash-based duplicate checks and topic/date folder organization.

Output layout (inside Windows Downloads):
    Downloads/Instagram_Viral_Videos/<Topic_Folder>/<YYYY-MM-DD>/<file>.mp4
"""
from __future__ import annotations

import hashlib
import re
import shutil
import time
from dataclasses import dataclass
from pathlib import Path

from config import DOWNLOAD_ROOT, MAX_RETRIES
from discovery import Candidate


@dataclass
class DownloadResult:
    ok: bool
    path: Path | None = None
    file_hash: str | None = None
    file_size: int = 0
    error: str | None = None


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _safe(text: str, n: int = 42) -> str:
    text = re.sub(r"[^\w\u0900-\u097F ]+", "", text).strip().replace(" ", "-")
    return text[:n] or "reel"


def target_dir(topic_slug: str, ist_date: str) -> Path:
    folder = topic_by_slug(topic_slug)["folder"]
    d = DOWNLOAD_ROOT / folder / ist_date
    d.mkdir(parents=True, exist_ok=True)
    return d


def _unique_name(directory: Path, candidate: Candidate) -> Path:
    base = f"{candidate.video_id}_{candidate.view_count // 1000}kviews_{_safe(candidate.caption)}"
    path = directory / f"{base}.mp4"
    i = 2
    while path.exists():
        path = directory / f"{base}_{i}.mp4"
        i += 1
    return path


def download(candidate: Candidate, ist_date: str, known_hashes: set[str]) -> DownloadResult:
    """
    Real download via yt-dlp (public MP4) with integrity guarantees.
    Falls back to a clearly-marked demo artifact when yt-dlp is unavailable
    (keeps the engine testable offline; set config flag to disable).
    """
    directory = target_dir(candidate.topic, ist_date)
    dest = _unique_name(directory, candidate)
    try:
        from yt_dlp import YoutubeDL
        ydl_ok = True
    except ImportError:
        ydl_ok = False

    last_err: str | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            if ydl_ok:
                tmp = dest.with_suffix(".part.mp4")
                with YoutubeDL({
                    "quiet": True,
                    "nooverwrites": True,
                    "format": "best[ext=mp4]/best",   # preserve original quality
                    "outtmpl": str(tmp),
                    "retries": 3,
                    "fragment_retries": 3,
                }) as ydl:
                    ydl.download([candidate.url])
                if not tmp.exists():
                    raise RuntimeError("yt-dlp produced no file (access restricted?)")
            else:
                return DownloadResult(
                    ok=False,
                    error="yt-dlp is not installed — refusing to create a fake placeholder",
                )

            # ---- integrity: hash must be stable, file must be non-trivial ----
            file_hash = sha256_of(tmp)
            size = tmp.stat().st_size
            if size < 1024:
                raise RuntimeError(f"suspiciously small file ({size} bytes) — treating as failed")
            if file_hash in known_hashes:
                tmp.unlink(missing_ok=True)
                return DownloadResult(ok=False, error="duplicate content hash — skipped")

            if sha256_of(tmp) != file_hash:          # re-read verification
                raise RuntimeError("integrity check failed (hash changed after write)")
            shutil.move(str(tmp), dest)
            return DownloadResult(ok=True, path=dest, file_hash=file_hash, file_size=size)
        except Exception as exc:                      # noqa: BLE001
            last_err = str(exc)[:300]
            dest.with_suffix(".part.mp4").unlink(missing_ok=True)
            time.sleep(2 ** attempt)                  # 2s, 4s, 8s backoff
    return DownloadResult(ok=False, error=last_err)
