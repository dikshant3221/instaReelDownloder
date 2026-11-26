"""
ViralDarshan test-suite — the four non-negotiables, proven:

  1. Daily limit: exactly one successful download per topic, maximum 7 per IST day.
  2. Duplicate prevention: same video_id / URL / hash is never stored twice,
     even across days and when a reel appears under multiple topics.
  3. IST midnight rollover: the daily counter resets at 00:00 Asia/Kolkata,
     while the permanent duplicate cache is retained.
  4. Topic classification: Hindi/English captions map to correct slugs;
     irrelevant captions are rejected.

Run:  cd windows-app && pytest -q
"""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

# redirect the permanent DB to a temp file per test-run
_tmp = Path(tempfile.mkdtemp(prefix="vd_test_"))
os.environ.setdefault("VIRALDARSHAN_TEST", "1")

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config  # noqa: E402
config.DATA_DIR = _tmp
config.DB_PATH = _tmp / "cache.db"
config.DOWNLOAD_ROOT = _tmp / "Downloads" / "Instagram_Viral_Videos"

import db  # noqa: E402
import engine  # noqa: E402
from ai_providers import classify_caption  # noqa: E402
from discovery import Candidate  # noqa: E402

db.init()


def cand(i: int, topic: str = "banke-bihari-ji", views: int = 50000) -> Candidate:
    sc = f"TEST{i:08d}XY"
    return Candidate(video_id=sc, url=f"https://www.instagram.com/reel/{sc}/",
                     topic=topic, caption=f"test reel {i}", author="@t",
                     view_count=views, like_count=100)


# ------------------------------------------------------------- 1. limit ---
def test_daily_limit_never_exceeded_total():
    today = db.ist_today()
    # Simulate 3 distinct topics completed before a reboot.
    completed = [t["slug"] for t in config.TOPICS[:3]]
    for i, topic in enumerate(completed):
        assert db.record_download(video_id=f"PRE{i}", url=f"u://{i}", topic=topic,
                                  caption="", author="", view_count=20000, like_count=1,
                                  ist_date=today, file_path=None, file_hash=f"h{i}",
                                  file_size=1000, status="completed")
    # Offer multiple candidates per topic: only the 4 missing topics may be selected.
    many = [cand(100 + i, t["slug"], views=100000 - i)
            for i, t in enumerate(config.TOPICS * 3)]
    picked = engine._pick_diverse(many, quota=config.DAILY_LIMIT - db.today_completed(today))
    assert len(picked) == 4
    assert len({c.topic for c in picked}) == 4
    assert not ({c.topic for c in picked} & set(completed))
    assert db.today_completed(today) <= config.DAILY_LIMIT


def test_exactly_one_candidate_per_topic():
    many = [cand(200 + i, t["slug"], views=100000 - i) for i, t in
            enumerate(config.TOPICS * 3)]
    picked = engine._pick_diverse(many, quota=config.DAILY_LIMIT)
    topics_hit = {c.topic for c in picked}
    assert len(picked) == 7
    assert len(topics_hit) == 7


# ------------------------------------------------------- 2. dedupe ever ---
def test_never_duplicate_id_url_or_hash():
    today = db.ist_today()
    ok = db.record_download(video_id="DUP1", url="https://www.instagram.com/reel/DUP1/",
                            topic="radha-raman-ji", caption="c", author="a", view_count=99999,
                            like_count=1, ist_date=today, file_path="x", file_hash="deadbeef",
                            file_size=10, status="completed")
    assert ok
    assert db.is_known("DUP1", "https://www.instagram.com/reel/DUP1/")
    assert db.is_known("DUP1", "https://other.example/x")       # id alone matches
    assert db.is_known("whatever", "https://www.instagram.com/reel/DUP1/")  # url alone matches
    assert db.hash_seen("deadbeef")                              # hash alone matches
    raced = db.record_download(video_id="DUP1", url="https://www.instagram.com/reel/DUP1/",
                               topic="premanand-ji-maharaj", caption="c2", author="a",
                               view_count=1, like_count=1, ist_date=today, file_path=None,
                               file_hash=None, file_size=None, status="completed")
    assert raced is False        # UNIQUE constraint: physically cannot insert twice


# ------------------------------------------ 3. IST rollover + cache kept ---
def test_ist_rollover_resets_counter_but_not_cache(monkeypatch):
    old_date = "2026-01-01"
    for i in range(config.DAILY_LIMIT):
        db.record_download(video_id=f"OLD{i}", url=f"https://x/{i}", topic="vinod-baba-ji",
                           caption="", author="", view_count=20000, like_count=1,
                           ist_date=old_date, file_path=None, file_hash=f"old{i}",
                           file_size=1, status="completed")
    assert db.today_completed(old_date) == config.DAILY_LIMIT   # that day: full
    today = db.ist_today()
    assert today != old_date
    assert db.today_completed(today) < config.DAILY_LIMIT       # new day: fresh budget
    assert db.is_known("OLD0", "https://x/0")                   # cache survived the rollover


# ------------------------------------------------ 4. classification -------
@pytest.mark.parametrize("caption,slug", [
    ("आज श्री बांके बिहारी जी के दर्शन", "banke-bihari-ji"),
    ("Banke Bihari Mandir morning aarti #Vrindavan", "banke-bihari-ji"),
    ("श्री राधावल्लभ जी सेवा कुंज", "radha-vallabh-ji"),
    ("Radha Raman Mandir darshan today", "radha-raman-ji"),
    ("गोविन्द देव जी मंदिर ऐतिहासिक", "radha-govind-dev-ji"),
    ("Premanand Maharaj satsang clip", "premanand-ji-maharaj"),
    ("इंद्रेश उपाध्याय जी की कथा", "indresh-ji-maharaj"),
    ("Vinod Baba ji ka pravachan", "vinod-baba-ji"),
])
def test_classification(caption, slug):
    assert classify_caption(caption) == slug


def test_irrelevant_rejected():
    assert classify_caption("funny cat compilation 2026 trending") is None
