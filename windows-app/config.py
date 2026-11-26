"""
ViralDarshan — central configuration.

All limits, topics, keywords and paths. Edit only here.
"""
from __future__ import annotations

import os
from pathlib import Path

def _load_ist():
    """Asia/Kolkata timezone. Windows has no IANA tz database, so zoneinfo
    crashes there unless the tzdata package is installed — fall back to a
    fixed +05:30 offset so the app can NEVER fail on import."""
    try:
        from zoneinfo import ZoneInfo
        return ZoneInfo("Asia/Kolkata")
    except Exception:
        from datetime import timezone, timedelta
        return timezone(timedelta(hours=5, minutes=30), name="IST")

# ---------------------------------------------------------------- limits ---
IST = _load_ist()

DAILY_LIMIT = 7           # exactly one successful video for each of 7 topics
MIN_VIEWS = 1_000_000     # a reel must have STRICTLY MORE views than this (1M+)
SCAN_INTERVAL_MIN = 30    # background cadence until the daily target is met
SCAN_INTERVAL_MET_MIN = 60  # heartbeat once target is met (only to detect midnight)
MAX_RETRIES = 3           # per-download transient-failure retries
REQUEST_PAUSE_S = (6, 14)  # polite random delay between network ops

# ----------------------------------------------------------------- paths ---
APP_NAME = "ViralDarshan"
USER_DOWNLOADS = Path(os.environ.get("USERPROFILE", str(Path.home()))) / "Downloads"
DOWNLOAD_ROOT = USER_DOWNLOADS / "Instagram_Viral_Videos"
DATA_DIR = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / APP_NAME
DB_PATH = DATA_DIR / "viraldarshan_permanent_cache.db"   # never deleted by updates
LOG_DIR = DATA_DIR / "logs"
KEYS_PATH = DATA_DIR / "keys.json"                        # local-only API key store
LOCK_PATH = DATA_DIR / "viraldarshan.lock"                # single-instance guard

# ---------------------------------------------------------------- topics ---
#   slug, display name, Windows folder, keyword matrix (EN + HI + hashtag + alts)
TOPICS: list[dict] = [
    {
        "slug": "banke-bihari-ji",
        "name": "Shri Banke Bihari Ji",
        "folder": "Banke_Bihari_Ji",
        "keywords": [
            "Banke Bihari", "Banke Bihari Mandir", "बांके बिहारी", "बिहारी जी",
            "Vrindavan Darshan", "Nidhivan darshan", "#BankeBihari", "#BihariJi",
            "Bankay Bihari",
        ],
    },
    {
        "slug": "radha-vallabh-ji",
        "name": "Shri Radha Vallabh Ji",
        "folder": "Radha_Vallabh_Ji",
        "keywords": [
            "Radha Vallabh", "राधावल्लभ", "RadhaRani", "राधा रानी",
            "Hit Radha Vallabh", "Seva Kunj", "#RadhaVallabh", "Radhavallabh Lal",
        ],
    },
    {
        "slug": "radha-raman-ji",
        "name": "Shri Radha Raman Ji",
        "folder": "Radha_Raman_Ji",
        "keywords": [
            "Radha Raman", "राधारमण", "Radha Raman Mandir", "राधा रमण",
            "Radharaman", "Shaligram deity vrindavan", "#RadhaRaman",
        ],
    },
    {
        "slug": "radha-govind-dev-ji",
        "name": "Shri Radha Govind Dev Ji",
        "folder": "Radha_Govind_Dev_Ji",
        "keywords": [
            "Radha Govind Dev", "गोविन्द देव", "Govind Dev Ji temple",
            "Govindaji vrindavan", "Rupa Goswami deity", "#RadhaGovindDev",
        ],
    },
    {
        "slug": "premanand-ji-maharaj",
        "name": "Premanand Ji Maharaj",
        "folder": "Premanand_Ji_Maharaj",
        "keywords": [
            "Premanand Maharaj", "प्रेमानंद महाराज", "Premanand Ji Maharaj Satsang",
            "Premanand ji pravachan", "Ekantik Vartalap", "Radha Keli Kunj",
            "#PremanandMaharaj", "प्रेमानंद जी महाराज के दर्शन",
        ],
    },
    {
        "slug": "indresh-ji-maharaj",
        "name": "Indresh Ji Maharaj",
        "folder": "Indresh_Ji_Maharaj",
        "keywords": [
            "Indresh Upadhyay", "इंद्रेश उपाध्याय", "Indresh Ji Maharaj Katha",
            "Indresh katha highlights", "Bhagwat Katha Indresh",
            "#IndreshUpadhyay", "इंद्रेश जी महाराज प्रवचन",
        ],
    },
    {
        "slug": "vinod-baba-ji",
        "name": "Vinod Baba Ji",
        "folder": "Vinod_Baba_Ji",
        "keywords": [
            "Vinod Baba", "विनोद बाबा", "Vinod Baba Pravachan",
            "Vinod Bihari Baba", "Braj sant pravachan", "#VinodBabaJi",
            "विनोद बाबा जी के प्रवचन",
        ],
    },
]

def topic_by_slug(slug: str) -> dict:
    return next(t for t in TOPICS if t["slug"] == slug)

def ensure_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    DOWNLOAD_ROOT.mkdir(parents=True, exist_ok=True)
