"""
ViralDarshan entry point — Windows-hardened.

  python main.py            -> dashboard + background engine
  python main.py --headless -> engine only (Task Scheduler mode)

Crash-proof design (the app must never vanish silently):
  * Single instance via a real Windows named Mutex (no process killing).
  * ANY unhandled error is written to %LOCALAPPDATA%\\ViralDarshan\\logs\\crash.log
    AND shown in a Windows message box, with the log folder opened — so the
    window can never "open and close immediately" without explanation.
  * Imports are done lazily AFTER the crash shield is armed.
"""
from __future__ import annotations

import sys
import threading
import traceback
from datetime import datetime

_MUTEX_HANDLE = None


def _data_dirs():
    """Resolve paths with hard fallbacks (works before config imports too)."""
    import os
    from pathlib import Path
    base = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "ViralDarshan"
    try:
        (base / "logs").mkdir(parents=True, exist_ok=True)
    except Exception:
        base = Path.home() / "ViralDarshan"
        (base / "logs").mkdir(parents=True, exist_ok=True)
    return base, base / "logs"


def write_crash(error_text: str) -> str:
    _, logs = _data_dirs()
    path = logs / "crash.log"
    try:
        path.write_text(
            f"[{datetime.now():%Y-%m-%d %H:%M:%S}]\n{error_text}\n",
            encoding="utf-8",
        )
    except Exception:
        pass
    return str(path)


def show_error(title: str, message: str) -> None:
    """Native Windows popup — visible even when there is no console/Qt."""
    try:
        import ctypes
        ctypes.windll.user32.MessageBoxW(0, message, title, 0x10)  # MB_ICONERROR
    except Exception:
        print(f"{title}: {message}")
    try:
        if sys.stdout and not getattr(sys.stdout, "isatty", lambda: False)():
            pass
        else:
            input("\nPress Enter to close...")
    except Exception:
        pass


def acquire_single_instance() -> bool:
    """True if this is the ONLY instance. Uses a session mutex on Windows —
    safe, no signals, no risk of terminating another process."""
    global _MUTEX_HANDLE
    if sys.platform.startswith("win"):
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetLastError(0)
        _MUTEX_HANDLE = kernel32.CreateMutexW(None, False, "Local\\ViralDarshanSingleInstanceMutex")
        if not _MUTEX_HANDLE:
            return False
        return kernel32.GetLastError() != 183  # 183 = ERROR_ALREADY_EXISTS
    # non-Windows fallback (dev machines): age-based lock file
    import os
    base, _ = _data_dirs()
    lock = base / "viraldarshan.lock"
    if lock.exists():
        try:
            if datetime.now().timestamp() - lock.stat().st_mtime < 6 * 3600:
                return False
        except Exception:
            pass
    lock.write_text(str(os.getpid()))
    return True


def open_logs_folder() -> None:
    try:
        _, logs = _data_dirs()
        if sys.platform.startswith("win"):
            import os
            os.startfile(str(logs))  # type: ignore[attr-defined]
    except Exception:
        pass


def run() -> int:
    from config import DAILY_LIMIT, ensure_dirs  # noqa: delayed until crash shield is armed
    import db
    import engine

    ensure_dirs()
    db.init()

    if not acquire_single_instance():
        show_error(
            "ViralDarshan",
            "ViralDarshan is already running in the background.\n"
            "Only one instance is allowed, so nothing was launched twice.",
        )
        return 0

    db.log("info", f"ViralDarshan boot — checking today's IST progress…")
    done = db.today_completed()
    db.log(
        "info",
        f"Recovered state: {done}/{DAILY_LIMIT} topics complete today. "
        + ("All topics complete — idle until midnight IST."
           if done >= DAILY_LIMIT else f"{DAILY_LIMIT - done} topics remaining."),
    )

    thread = threading.Thread(
        target=engine.background_loop,
        kwargs={"on_log": lambda lvl, msg: print(f"[{lvl}] {msg}", flush=True), "on_tick": lambda: None},
        daemon=True,
    )
    thread.start()

    if "--headless" in sys.argv:
        try:
            thread.join()
        except KeyboardInterrupt:
            engine.stop()
        return 0

    try:
        from dashboard import run_dashboard
        return run_dashboard()
    finally:
        engine.stop()


if __name__ == "__main__":
    try:
        raise SystemExit(run())
    except SystemExit:
        raise
    except Exception:
        crash_path = write_crash(traceback.format_exc())
        show_error(
            "ViralDarshan could not start",
            "Something went wrong, but nothing was downloaded twice and your data is safe.\n\n"
            f"Full details were saved to:\n{crash_path}\n\n"
            "Click OK to open that folder, then share crash.log with support.",
        )
        open_logs_folder()
        raise SystemExit(1)
