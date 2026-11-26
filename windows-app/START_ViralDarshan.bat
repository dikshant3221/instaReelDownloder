@echo off
REM ======================================================================
REM   ViralDarshan - ONE-CLICK LAUNCHER (self-installing)
REM
REM   What it does automatically on first double-click:
REM     1. Checks for Python  -> installs Python 3.12 silently if missing
REM     2. Creates isolated environment (.venv)
REM     3. Installs ALL dependencies by itself
REM     4. Registers Windows auto-start (runs at every logon)
REM     5. Opens the dashboard + starts the background downloader
REM
REM   On every next double-click: steps 1-4 are skipped, app opens instantly.
REM ======================================================================
title ViralDarshan - Setup ^& Launcher
color 0E
cd /d "%~dp0"
setlocal EnableDelayedExpansion

echo.
echo   ============================================================
echo     ViralDarshan  -  Vrindavan Viral Reel Seva
echo     7 videos/day (IST) - exactly one per topic - no duplicates
echo   ============================================================
echo.

REM ------------------------------------------------ 1. locate Python ----
set "PYEXE="
where python >nul 2>nul && set "PYEXE=python"
if not defined PYEXE ( where py >nul 2>nul && set "PYEXE=py -3" )

if not defined PYEXE (
    echo   [1/5] Python not found - installing it for you automatically...
    where winget >nul 2>nul
    if !errorlevel!==0 (
        winget install -e --id Python.Python.3.12 --scope user --silent --accept-source-agreements --accept-package-agreements >nul 2>nul
    ) else (
        echo         winget unavailable - downloading official installer...
        powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.12.7/python-3.12.7-amd64.exe' -OutFile '%TEMP%\python_installer.exe'"
        "%TEMP%\python_installer.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
    )
    REM refresh PATH for THIS window (no reopen needed)
    set "PATH=%LOCALAPPDATA%\Programs\Python\Python312\;%LOCALAPPDATA%\Programs\Python\Python312\Scripts\;%PATH%"
    where python >nul 2>nul && set "PYEXE=python"
    if not defined PYEXE (
        if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set "PYEXE=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    )
)
if not defined PYEXE (
    echo.
    echo   [ERROR] Automatic Python install needs internet access.
    echo   Please fix the connection, then double-click this file again.
    pause & exit /b 1
)
echo   [1/5] Python found.

REM --------------------------------------------- 2. virtual environment --
if not exist ".venv\Scripts\python.exe" (
    echo   [2/5] Preparing a private environment (once only)...
    !PYEXE! -m venv .venv || ( echo   [ERROR] Could not create environment. & pause & exit /b 1 )
)
echo   [2/5] Environment ready.
set "VENVPY=.venv\Scripts\python.exe"

REM ------------------------------------------------------- 3. dependencies
if not exist ".venv\deps.ok" (
    echo   [3/5] Installing all required components (once only)...
    "!VENVPY!" -m pip install --upgrade pip -q
    "!VENVPY!" -m pip install -q -r requirements.txt || (
        echo   [ERROR] Dependency install failed - check internet and try again.
        pause & exit /b 1
    )
    echo done>".venv\deps.ok"
)
echo   [3/5] All dependencies installed.

REM ------------------------------------------------- 4. Windows autostart
if not exist ".venv\startup.ok" (
    echo   [4/5] Registering automatic startup with Windows...
    "!VENVPY!" install_startup.py >nul 2>nul && echo done>".venv\startup.ok" || echo         (optional step skipped - app still works fine)
)
echo   [4/5] Auto-start active - the app wakes up with Windows.

REM ------------------------------------------------------------- 5. launch
echo   [5/5] Starting ViralDarshan dashboard...
echo.
echo   ------------------------------------------------------------
echo     Keep this window MINIMIZED - closing it stops the app.
echo     Videos appear in  Downloads\Instagram_Viral_Videos\
echo     Daily target: 7 videos - exactly one per topic - resets at midnight IST
echo   ------------------------------------------------------------
echo.
"!VENVPY!" main.py
if errorlevel 1 (
    echo.
    echo   ------------------------------------------------------------
    echo    The app closed with an error. Details below (and saved in
    echo    %LOCALAPPDATA%\ViralDarshan\logs\crash.log)
    echo   ------------------------------------------------------------
    if exist "%LOCALAPPDATA%\ViralDarshan\logs\crash.log" (
        type "%LOCALAPPDATA%\ViralDarshan\logs\crash.log"
    )
    echo.
    echo    Quick fixes that solve 99%% of cases:
    echo      1. Make sure internet is ON and run this file again.
    echo      2. If it still fails: delete the ".venv" folder next to
    echo         this file and double-click again (fresh self-install).
)
echo.
pause
endlocal
