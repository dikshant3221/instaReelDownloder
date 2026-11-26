# ViralDarshan — Windows Desktop Agent

> **Which app is primary?** The **web control center** (`npm run dev`) is the
> full-featured app: manual 500-link queue, Strategy Bot, channel-wide
> duplicate protection, analytics learning, playlists, localized titles.
> This Windows agent is the lightweight **background collector** (daily 7-video
> collection + start menu UI). Advanced publishing features live in the web app.

Fully automatic background downloader for viral Instagram Reels about the seven
Vrindavan topics. **Exactly one approved video per topic — 7 videos total per day
(Asia/Kolkata). Once a topic has its video, that topic is not searched again that
day. Every video > 1,000,000 views. Nothing is ever downloaded twice.**

```
windows-app/
├── main.py              # entry: single-instance lock, engine thread, dashboard
├── engine.py            # daily-cap scheduler, catch-up after shutdown, recovery
├── db.py                # PERMANENT SQLite cache (WAL) — the dedupe guarantee
├── discovery.py         # public-content discovery adapters (instaloader/yt-dlp/demo)
├── downloader.py        # yt-dlp download, retries, sha256 integrity, folders
├── ai_providers.py      # Gemini / Mistral / NVIDIA / Agnes / Bazarlink (optional)
├── dashboard.py         # PySide6 UI (status, X/7 coverage, topics, history, buttons)
├── install_startup.py   # Task Scheduler registration (auto-start at logon)
├── config.py            # topics, keywords, limits, paths
├── requirements.txt
└── tests/test_core.py   # pytest: limit, dedupe, IST rollover, classification
```

## 1. Installation — ONE DOUBLE-CLICK (recommended)

**Double-click `START_ViralDarshan.bat`.** Nothing else to do. It automatically:
installs Python (if missing) → creates the environment → installs all
dependencies → registers Windows auto-start → opens the dashboard.
Every next double-click skips setup and opens instantly.
No Python? No problem. No terminal knowledge? No problem.

### Manual installation (optional, for power users)

```bat
cd windows-app
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Sharing with other people: single-file EXE

Run `BUILD_EXE.bat` once → it produces `dist\ViralDarshan.exe`, a single file
that runs on ANY Windows PC with zero prerequisites (it bundles Python,
the Asia/Kolkata timezone database, PySide6, yt-dlp and instaloader), and it
re-registers the Windows startup task automatically.

### If the window ever "opens and closes instantly"

It can't disappear silently anymore: every startup failure pops up a Windows
message box **and** writes a readable file to
`%LOCALAPPDATA%\ViralDarshan\logs\crash.log`. Quick fixes:

1. Turn internet ON and double-click again (first run downloads dependencies).
2. Still failing? Delete the `.venv` folder next to the launcher and
   double-click again — it self-installs fresh.
3. Still failing? Open `logs\crash.log` and share it with support.

## 2. Run

```bat
python main.py             :: dashboard + autonomous engine
python main.py --headless  :: background only (used by Task Scheduler)
```

First run performs a catch-up scan: it counts today's completed downloads in the
permanent DB and searches only the topics still missing their one video for the day.

## 3. Auto-start with Windows

```bat
python install_startup.py
```

Creates the `ViralDarshanAutoStart` logon task (per-user, no admin needed). If the
laptop is off at 5/10 downloaded, the next boot automatically downloads only the
remaining 5 — progress is derived from SQLite, never from memory.

## 4. API configuration (optional)

AI improves keywords/classification but is **not required**. Either paste keys in
the dashboard → "Configure API Keys", or set environment variables:

```bat
set GEMINI_API_KEY=...      :: https://aistudio.google.com/app/apikey (free tier)
set MISTRAL_API_KEY=...     :: https://console.mistral.ai/api-keys (free tier)
set NVIDIA_API_KEY=...      :: https://build.nvidia.com (free dev credits)
set AGNES_API_KEY=...       :: where available
set BAZARLINK_API_KEY=...   :: where available
```

Keys are stored only in `%LOCALAPPDATA%\ViralDarshan\keys.json`, always masked
in the UI, and all calls back off automatically on HTTP 429 rate limits.

## 5. Where files go (non-negotiable layout)

```
C:\Users\<you>\Downloads\Instagram_Viral_Videos\
├── Banke_Bihari_Ji\2026-11-14\<shortcode>_850kviews_<title>.mp4
├── Radha_Vallabh_Ji\2026-11-14\…
├── Radha_Raman_Ji\2026-11-14\…
├── Radha_Govind_Dev_Ji\2026-11-14\…
├── Premanand_Ji_Maharaj\2026-11-14\…
├── Indresh_Ji_Maharaj\2026-11-14\…
└── Vinod_Baba_Ji\2026-11-14\…
```

## 6. Permanent database

`%LOCALAPPDATA%\ViralDarshan\viraldarshan_permanent_cache.db`
Tables: `videos` (video_id, url, topic, caption, view_count, ist_date, file_path,
file_hash, status…), `scans`, `scan_log`, `settings`. Never deleted on update —
reinstalls keep dedupe history.

## 7. Build the .exe

```bat
pyinstaller --noconfirm --onefile --windowed --name ViralDarshan main.py
dist\ViralDarshan.exe --headless
```

`install_startup.py` automatically prefers `dist\ViralDarshan.exe` when present.

## 8. Testing

```bat
cd windows-app
pytest -q
```

The suite proves: (1) one approved video per topic, 7/day maximum (including the
pre-reboot partial-progress scenario), (2) ID/URL/hash duplicates are impossible
(UNIQUE constraints + `is_known` gates), (3) IST-midnight rollover resets the
counter but not the cache, (4) Hindi/English captions classify correctly and
irrelevant reels are rejected.

## 9. Compliance

Only publicly accessible reels are read (instaloader/yt-dlp public endpoints) —
no login, no private-account bypass, polite request spacing, immediate stop on
429/401/403. Reels without an exposed view count are skipped (never assumed
>1,000,000). Respect Instagram's Terms of Use and creators' copyright; this tool is
for personal archival/seva use.
```
