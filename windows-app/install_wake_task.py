"""
ViralDarshan — Keep working while your laptop sleeps.

Creates a Windows scheduled task that WAKES THE COMPUTER every hour to run
the downloader; the app then goes back to waiting. Combined with the app's
catch-up logic, the daily quota fills even when you are not at the machine.

IMPORTANT — this works from SLEEP/HIBERNATE, NOT from full shutdown
(a powered-off PC cannot be woken by software). So:
  1. Keep the app running (close the window if you like — it runs in the
     background), or run `python main.py --headless`
  2. Sleep your laptop (Start menu -> Sleep) instead of Shut down
  3. Run this script ONCE (enables wake timers + the hourly wake task)

    python install_wake_task.py            # install
    python install_wake_task.py --remove   # uninstall

No admin rights are needed for the task itself; enabling system wake timers
is attempted too (may request elevation).
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

TASK_NAME = "ViralDarshanWakeHourly"

XML = """<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>2026-01-01T00:00:00</StartBoundary>
      <Enabled>true</Enabled>
      <Repetition>
        <Interval>PT1H</Interval>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
    </CalendarTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <WakeToRun>true</WakeToRun>
    <ExecutionTimeLimit>PT2M</ExecutionTimeLimit>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>{cmd}</Command>
      <Arguments>{args}</Arguments>
      <WorkingDirectory>{cwd}</WorkingDirectory>
    </Exec>
  </Actions>
</Task>
"""


def main() -> int:
    cwd = Path(__file__).resolve().parent
    if "--remove" in sys.argv:
        subprocess.run(["schtasks", "/Delete", "/TN", TASK_NAME, "/F"], check=False)
        print("Wake task removed.")
        return 0

    exe = cwd / "dist" / "ViralDarshan.exe"
    if exe.exists():
        cmd, args = str(exe), "--headless"
    else:
        pythonw = Path(sys.executable).with_name("pythonw.exe")
        cmd = str(pythonw if pythonw.exists() else sys.executable)
        args = "main.py --headless"

    xml_path = cwd / "viraldarshan_wake.xml"
    xml_path.write_text(
        XML.format(cmd=cmd, args=args, cwd=str(cwd)), encoding="utf-16"
    )
    res = subprocess.run(
        ["schtasks", "/Create", "/TN", TASK_NAME, "/XML", str(xml_path), "/F"],
        capture_output=True,
        text=True,
    )
    print(res.stdout or res.stderr)

    # Enable Windows wake timers so WakeToRun actually fires (best effort).
    try:
        subprocess.run(
            ["powercfg", "/SETACVALUEINDEX", "SCHEME_CURRENT", "SUB_SLEEP", "RTCWAKE", "1"],
            check=False, capture_output=True,
        )
        subprocess.run(
            ["powercfg", "/SETDCVALUEINDEX", "SCHEME_CURRENT", "SUB_SLEEP", "RTCWAKE", "1"],
            check=False, capture_output=True,
        )
        subprocess.run(["powercfg", "/SETACTIVE", "SCHEME_CURRENT"], check=False, capture_output=True)
        print("Wake timers enabled (AC + battery).")
    except FileNotFoundError:
        print("powercfg not found - enable 'Allow wake timers' manually in Power Options.")

    if res.returncode == 0:
        print(f"""
============================================================
  '{TASK_NAME}' installed: the PC wakes EVERY HOUR,
  the app scans (catch-up), then goes back to sleep.

  RULES:
    * Sleep (or Hibernate) your PC - do NOT Shut down
    * Keep the app running (window can be closed; it runs in background)
    * The daily 7-video quota fills automatically while you are away
============================================================
""")
    return res.returncode


if __name__ == "__main__":
    raise SystemExit(main())
