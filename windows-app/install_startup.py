"""
Register ViralDarshan with Windows Task Scheduler so it starts hidden at
every logon and resumes missed work (catch-up scan) after any shutdown.

    python install_startup.py            # install
    python install_startup.py --remove   # uninstall

Uses the built-in `schtasks` CLI — no admin rights needed for a per-user
logon task. For packaged installs, point TARGET at dist\\ViralDarshan.exe.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

TASK_NAME = "ViralDarshanAutoStart"

XML = """<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger><Enabled>true</Enabled></LogonTrigger>
  </Triggers>
  <Principals><Principal><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal></Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
  </Settings>
  <Actions><Exec>
    <Command>{cmd}</Command>
    <Arguments>{args}</Arguments>
    <WorkingDirectory>{cwd}</WorkingDirectory>
  </Exec></Actions>
</Task>
"""


def main() -> int:
    if "--remove" in sys.argv:
        subprocess.run(["schtasks", "/Delete", "/TN", TASK_NAME, "/F"], check=False)
        print("Startup task removed.")
        return 0

    cwd = Path(__file__).resolve().parent
    exe = cwd / "dist" / "ViralDarshan.exe"
    if exe.exists():
        cmd, args = str(exe), "--headless"
    else:
        pythonw = Path(sys.executable).with_name("pythonw.exe")
        cmd, args = str(pythonw if pythonw.exists() else sys.executable), "main.py --headless"

    xml_path = cwd / "viraldarshan_startup.xml"
    xml_path.write_text(XML.format(cmd=cmd, args=args, cwd=str(cwd)), encoding="utf-16")
    res = subprocess.run(
        ["schtasks", "/Create", "/TN", TASK_NAME, "/XML", str(xml_path), "/F"],
        capture_output=True, text=True,
    )
    print(res.stdout or res.stderr)
    if res.returncode == 0:
        print(f"\nRegistered '{TASK_NAME}'. The agent now starts at every logon, runs hidden,")
        print("and resumes missing topics automatically (7/day: exactly one per topic, IST).")
    return res.returncode


if __name__ == "__main__":
    raise SystemExit(main())
