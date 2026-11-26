"""
Instagram public-content discovery.

Compliance-first design:
  * Only publicly accessible reels/hashtag feeds are read.
  * No login credentials are used; private accounts are never touched.
  * Requests are spaced out (REQUEST_PAUSE_S) and stop on HTTP 429/401/403.
  * If Instagram does not expose a view/play count for a reel, the candidate
    is DISCARDED (never assumed >= 1M) and the situation is reported honestly.

Adapters:
  * InstaloaderAdapter  — public hashtag feeds via instaloader (best effort)
  * YtDlpAdapter        — public hashtag/tag pages via yt-dlp metadata
  * DemoAdapter         — offline, deterministic sample feed for testing the
                          daily limit / dedupe / IST rollover without network.
"""
from __future__ import annotations

import hashlib
import random
import time
from dataclasses import dataclass, field

from config import MIN_VIEWS, REQUEST_PAUSE_S, TOPICS
from ai_providers import classify_caption


@dataclass
class Candidate:
    video_id: str          # Instagram shortcode
    url: str               # canonical reel URL
    topic: str             # slug — may be refined by classifier
    caption: str
    author: str
    view_count: int        # 0 == unknown (rejected)
    like_count: int = 0
    extra: dict = field(default_factory=dict)


def _pause() -> None:
    time.sleep(random.uniform(*REQUEST_PAUSE_S))


def _polite_stop(exc: Exception) -> bool:
    """True when Instagram is asking us to slow down / access is restricted."""
    msg = str(exc).lower()
    return any(k in msg for k in ("429", "401", "403", "login", "rate", "checkpoint"))


class InstaloaderAdapter:
    name = "instaloader"

    def discover(self, keywords: list[str], topic_slug: str, per_kw: int = 25) -> list[Candidate]:
        try:
            import instaloader  # optional dependency
        except ImportError:
            return []
        out: list[Candidate] = []
        L = instaloader.Instaloader(download_videos=False, quiet=True, sleep=True)
        for kw in keywords[:6]:
            tag = kw.lstrip("#").replace(" ", "")
            try:
                _pause()
                hashtag = instaloader.Hashtag.from_name(L.context, tag)
                for i, post in enumerate(hashtag.get_top_posts()):
                    if i >= per_kw:
                        break
                    views = getattr(post, "video_view_count", 0) or 0
                    if not post.is_video or views <= MIN_VIEWS:
                        continue                    # unknown/low views → discard
                    out.append(Candidate(
                        video_id=post.shortcode,
                        url=f"https://www.instagram.com/reel/{post.shortcode}/",
                        topic=topic_slug,
                        caption=(post.caption or "")[:900],
                        author=f"@{post.owner_username}",
                        view_count=views,
                        like_count=post.likes or 0,
                    ))
            except Exception as exc:                # noqa: BLE001 — stop politely
                if _polite_stop(exc):
                    break
                continue
        return out


class YtDlpAdapter:
    name = "yt-dlp"

    def discover(self, keywords: list[str], topic_slug: str, per_kw: int = 20) -> list[Candidate]:
        try:
            from yt_dlp import YoutubeDL           # optional dependency
        except ImportError:
            return []
        out: list[Candidate] = []
        for kw in keywords[:4]:
            tag = kw.lstrip("#").replace(" ", "")
            url = f"https://www.instagram.com/explore/tags/{tag}/"
            try:
                _pause()
                with YoutubeDL({"quiet": True, "extract_flat": True,
                                "playlistend": per_kw, "noplaylist": False}) as ydl:
                    info = ydl.extract_info(url, download=False) or {}
                for entry in info.get("entries", []) or []:
                    views = entry.get("view_count") or 0
                    if not views or views <= MIN_VIEWS:
                        continue
                    sc = entry.get("id") or ""
                    out.append(Candidate(
                        video_id=sc,
                        url=entry.get("url") or f"https://www.instagram.com/reel/{sc}/",
                        topic=topic_slug,
                        caption=(entry.get("description") or entry.get("title") or "")[:900],
                        author=f"@{entry.get('uploader') or 'unknown'}",
                        view_count=views,
                        like_count=entry.get("like_count") or 0,
                    ))
            except Exception as exc:                # noqa: BLE001
                if _polite_stop(exc):
                    break
                continue
        return out


class DemoAdapter:
    """Deterministic offline feed — powers the test-suite and demos."""

    name = "demo"

    def discover(self, keywords: list[str], topic_slug: str, per_kw: int = 12) -> list[Candidate]:  # noqa: ARG002
        out = []
        today = time.strftime("%Y-%m-%d")
        for i in range(14):
            h = hashlib.sha256(f"{today}|{topic_slug}|{i}".encode()).digest()
            sc = "".join("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[b % 64]
                         for b in h[:11])
            r = int.from_bytes(h[11:15], "big") / 0xFFFFFFFF
            views = (800 + int(r * 21500) if r < 0.42 else
                     10500 + int((r - 0.42) * 240000) if r < 0.78 else
                     100000 + int((r - 0.78) * 4800000) if r < 0.94 else
                     1000000 + int((r - 0.94) * 66000000))
            out.append(Candidate(
                video_id=sc,
                url=f"https://www.instagram.com/reel/{sc}/",
                topic=topic_slug,
                caption=f"demo reel {topic_slug} #{i}",
                author="@vrindavan.darshan",
                view_count=views,
                like_count=int(views * 0.06),
            ))
        return out


def engines() -> list:
    """Real public-content adapters only. Never generate demo Reel URLs."""
    return [InstaloaderAdapter(), YtDlpAdapter()]


def discover_all(candidates_callable=None) -> list[Candidate]:
    """Fan out across every enabled topic; classify ambiguous captions."""
    found: dict[str, Candidate] = {}              # video_id → candidate (dedupe here too)
    for topic in TOPICS:
        kws = topic["keywords"]
        got: list[Candidate] = []
        for eng in engines():
            got = eng.discover(kws, topic["slug"])
            if got:
                break                             # first adapter that returns data wins
        for c in got:
            if c.video_id in found:               # same reel under 2 topics → keep first
                continue
            refined = classify_caption(c.caption)
            if refined:
                c.topic = refined                 # AI/keyword refinement
            if c.view_count > MIN_VIEWS:
                found[c.video_id] = c
    return sorted(found.values(), key=lambda c: c.view_count, reverse=True)
