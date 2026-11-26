"""
Modular AI provider layer.  AI is OPTIONAL — the downloader never depends on it.

Supported providers (free tiers preferred, keys stored locally only):
  1. Google Gemini   — generativelanguage.googleapis.com (free tier)
  2. Mistral AI      — api.mistral.ai (free La Plateforme tier)
  3. NVIDIA NIM      — integrate.api.nvidia.com (OpenAI-compatible, free dev credits)
  4. Agnes AI        — configurable endpoint
  5. Bazarlink       — configurable endpoint

Used for: keyword expansion, Hindi/English caption understanding,
topic classification of ambiguous reels, and irrelevance detection.
Every call is wrapped with rate-limit-aware retries and safe fallbacks.
"""
from __future__ import annotations

import json
import time
import urllib.request
import urllib.error

from config import KEYS_PATH, TOPICS

# ------------------------------------------------------------ key storage ---
def _load_keys() -> dict:
    if KEYS_PATH.exists():
        try:
            return json.loads(KEYS_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def save_key(provider: str, key: str) -> None:
    """Local-only key storage (user profile dir, never synced, masked in UI)."""
    keys = _load_keys()
    keys[provider] = key.strip()
    KEYS_PATH.parent.mkdir(parents=True, exist_ok=True)
    KEYS_PATH.write_text(json.dumps(keys), encoding="utf-8")


def get_key(provider: str) -> str | None:
    import os
    return _load_keys().get(provider) or os.environ.get(f"{provider.upper()}_API_KEY")


def masked(provider: str) -> str:
    k = get_key(provider)
    return ("•" * 8 + k[-4:]) if k else "not set"


# ------------------------------------------------------------ base client ---
class ProviderError(Exception):
    pass


class BaseProvider:
    name = "base"
    base_url = ""
    model = ""

    def available(self) -> bool:
        return bool(get_key(self.name))

    def complete(self, prompt: str, max_tokens: int = 512) -> str:
        raise NotImplementedError

    # ---- rate-limit-aware request loop ----
    def _post(self, url: str, payload: dict, headers: dict, tries: int = 4) -> dict:
        body = json.dumps(payload).encode()
        delay = 2.0
        for attempt in range(tries):
            req = urllib.request.Request(url, data=body, method="POST",
                                         headers={"Content-Type": "application/json", **headers})
            try:
                with urllib.request.urlopen(req, timeout=30) as res:
                    return json.loads(res.read().decode())
            except urllib.error.HTTPError as e:
                if e.code == 429:                      # rate limited → back off
                    time.sleep(delay)
                    delay = min(delay * 2, 30)
                    continue
                raise ProviderError(f"{self.name} HTTP {e.code}: {e.read()[:200]!r}") from e
            except (urllib.error.URLError, TimeoutError) as e:
                if attempt == tries - 1:
                    raise ProviderError(f"{self.name} unreachable: {e}") from e
                time.sleep(delay)
        raise ProviderError(f"{self.name}: persistent HTTP 429 (free-tier limit)")


class GeminiProvider(BaseProvider):
    name = "gemini"
    base_url = "https://generativelanguage.googleapis.com/v1beta"
    model = "gemini-1.5-flash"

    def complete(self, prompt: str, max_tokens: int = 512) -> str:
        key = get_key(self.name)
        url = f"{self.base_url}/models/{self.model}:generateContent?key={key}"
        data = self._post(url, {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": 0.2},
        }, {})
        return data["candidates"][0]["content"]["parts"][0]["text"]


class OpenAICompatProvider(BaseProvider):
    """Mistral, NVIDIA NIM, Agnes, Bazarlink all expose /v1/chat/completions."""
    header_prefix = "Bearer"
    default_model = ""

    def complete(self, prompt: str, max_tokens: int = 512) -> str:
        key = get_key(self.name)
        data = self._post(f"{self.base_url}/chat/completions", {
            "model": self.model or self.default_model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens, "temperature": 0.2,
        }, {"Authorization": f"{self.header_prefix} {key}"})
        return data["choices"][0]["message"]["content"]


class MistralProvider(OpenAICompatProvider):
    name = "mistral"
    base_url = "https://api.mistral.ai/v1"
    default_model = "mistral-small-latest"


class NvidiaProvider(OpenAICompatProvider):
    name = "nvidia"
    base_url = "https://integrate.api.nvidia.com/v1"
    default_model = "meta/llama-3.1-8b-instruct"


class AgnesProvider(OpenAICompatProvider):
    name = "agnes"
    base_url = "https://api.agnes.ai/v1"          # configurable if service changes
    default_model = "agnes-chat"


class BazarlinkProvider(OpenAICompatProvider):
    name = "bazarlink"
    base_url = "https://api.bazarlink.ai/v1"      # configurable if service changes
    default_model = "bazarlink-base"


PROVIDERS: dict[str, BaseProvider] = {
    p.name: p for p in (
        GeminiProvider(), MistralProvider(), NvidiaProvider(),
        AgnesProvider(), BazarlinkProvider(),
    )
}

_active = "gemini"  # default; changeable from the dashboard


def set_active(name: str) -> None:
    global _active
    if name not in PROVIDERS:
        raise ValueError(f"unknown provider {name}")
    _active = name


def active() -> BaseProvider:
    return PROVIDERS[_active]


# ------------------------------------------------------- high-level tasks ---
_TOPIC_LIST = ", ".join(f"{t['name']} ({t['slug']})" for t in TOPICS)


def expand_keywords(topic_name: str, base_keywords: list[str]) -> list[str]:
    """AI keyword expansion with graceful degradation to the built-in matrix."""
    p = active()
    if not p.available():
        return base_keywords
    try:
        text = p.complete(
            "You expand search terms to find viral Instagram Reels about Vrindavan "
            "Hindu temples and saints. Given the topic and seed keywords, return 10 "
            "extra search terms (Hindi + English + hashtags), one per line, no numbering.\n"
            f"Topic: {topic_name}\nSeed: {', '.join(base_keywords)}"
        )
        extra = [ln.strip(" -•\t") for ln in text.splitlines() if ln.strip()]
        return base_keywords + [e for e in extra if 2 < len(e) < 60][:10]
    except ProviderError:
        return base_keywords                      # AI optional → fall back silently


def classify_caption(caption: str) -> str | None:
    """Return the best topic slug for an ambiguous caption, or None when guessed.

    Uses fast builtin keyword match first (free, offline); escalates to AI only
    when nothing matched and a provider key exists.
    """
    low = caption.lower()
    for t in TOPICS:
        for kw in t["keywords"]:
            if kw.lstrip("#").lower() in low:
                return t["slug"]
    p = active()
    if not p.available():
        return None
    try:
        text = p.complete(
            "Classify this Instagram reel caption into exactly one of these topic slugs. "
            "Reply with ONLY the slug, or the word none if it is unrelated to Vrindavan, "
            f"these temples or saints.\nTopics: {_TOPIC_LIST}\nCaption: {caption[:800]}"
        ).strip().lower()
        return text if any(t["slug"] == text for t in TOPICS) else None
    except ProviderError:
        return None
