# ViralDarshan — Automated Vrindavan Viral Reel Seva

Automatically discovers and downloads **exactly one approved video per topic — 7 real Instagram
MP4s per IST day**. Once a topic has its video it is not searched again that day. Failed, private, low-metric,
unplayable, placeholder or duplicate files never count.

## Run it

```bash
npm install     # once
npm run dev     # every time
# open http://localhost:3000
```

That is all. The app automatically:

- starts a bundled in-process PostgreSQL-compatible database (PGlite) — no
  database install, port, `.env`, admin rights or binary download
- creates its tables and remembers progress across restarts
- searches public indexed Instagram Reel URLs using Hindi/English topic terms
- verifies exposed public views/plays (or explicitly labels >10k public likes
  as a conservative lower-bound when Instagram hides the exact play count)
- downloads the **real MP4** with yt-dlp, rejects files under 100 KB or without
  an MP4 `ftyp` header, calculates SHA-256 and counts only successful files
- keeps scanning every 30 minutes until the shared daily target is met

## Where the real videos are saved

All successful videos for one day are together in one folder:

```text
C:\Users\<you>\Downloads\Instagram_Viral_Videos\YYYY-MM-DD\
```

Use **Open Download Folder** in the dashboard. Old few-KB metadata placeholders
from earlier builds are removed automatically and their quota is restored.

## AI exact-topic validation (required before a video counts)

Open **API Keys** in the dashboard and add one or more keys. The app samples up
to four frames from the actual MP4 using its bundled FFmpeg, then runs a strict
multimodal review:

- saints: the correct person must visibly appear (another saffron-robed saint is rejected)
- deities/temples: exact deity/temple evidence is required (generic Krishna/Radha is rejected)
- caption and author are supporting evidence only; they cannot approve contradictory frames
- only a ≥75% exact-topic match is saved and counted
- mismatch/uncertain → MP4 deleted, permanent rejection cached, replacement searched
- active provider runs first; rate limit/quota/timeout/uncertain automatically falls through
  to every other enabled provider with a key

Recommended fallback set: Gemini + Mistral + NVIDIA. Agnes and Bazarlink are
supported as configurable OpenAI-compatible vision endpoints. Keys are stored
locally and masked in the UI.

## Getting more reliable public results (optional)

Free public-search discovery works without configuration. Instagram may hide
metrics or restrict anonymous media access, so a scan may download fewer than
10 and continue later, rather than fabricate results.

For more reliable public play counts, create a free Apify token and copy
`.env.example` to `.env.local`:

```text
APIFY_TOKEN=apify_api_your_token
```

Apify free monthly credits: https://console.apify.com/account/integrations

If Instagram requires login for an otherwise-public Reel, you may explicitly
allow yt-dlp to use your own browser session:

```text
INSTAGRAM_COOKIES_FROM_BROWSER=chrome
```

Supported values include `chrome`, `edge`, and `firefox`. This does not bypass
private-account protections; it only uses the session already logged in on your
computer.

You may also add real public Reel URLs to `instagram-reels.txt`; the app still
verifies relevance, metrics, duplicates, playability and the shared daily cap.

## Optional external PostgreSQL

The bundled database needs no `DATABASE_URL`. If you prefer your own server:

```text
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/dbname
```

## Sanity checklist (verified end-to-end)

```bash
npx next typegen && npx tsc --noEmit && npx eslint src && npm run build
python -m py_compile windows-app/*.py windows-app/tests/*.py
```

Confirmed behaviours:

| Check | Result |
| --- | --- |
| Daily cap: exactly one per topic, 7 total | scan refuses at 7/7, completed topics skipped |
| Duplicate protection | `video_id`, `url` and sha256 all block re-insert (SQL unique indexes) |
| Real MP4 only | <100 KB or missing `ftyp` header is rejected and deleted |
| AI wrong-topic video | deleted, permanent `ai_rejected` cache row, not counted, replacement searched |
| AI correct-topic video | file kept, counted, topic attributed |
| Provider failure (429/quota/timeout/bad JSON) | automatically falls through to next keyed provider; all-fail → fail-safe reject |
| No AI key configured | downloads pause with a clear message instead of counting unreviewed videos |
| IST daily rollover | exact at 00:00 Asia/Kolkata; cache never resets |
| Restart recovery | partial progress preserved; dead scan rows reclaimed immediately |
| Custom provider endpoint/model | preserved across scans (never overwritten by seeds) |

`scripts/mock-vision.mjs` simulates a provider (`match`, `mismatch`, `429-once`)
so the AI gate can be tested without spending API credits:

```bash
node scripts/mock-vision.mjs 4598 mismatch
# then set that provider's endpoint to http://127.0.0.1:4598/v1 in API Keys
```

## Compliance

The app only attempts publicly accessible media, spaces and limits discovery,
stops on access restrictions, never bypasses private accounts, and reports
unavailable metrics honestly. Respect Instagram's Terms and creators' rights.
