@echo off
REM ======================================================================
REM   One-click EXE builder - makes a single ViralDarshan.exe file that
REM   runs on ANY Windows PC with NO Python and NO dependencies needed.
REM   Output: windows-app\dist\ViralDarshan.exe
REM ======================================================================
title ViralDarshan - Build EXE
cd /d "%~dp0"
setlocal

if not exist ".venv\Scripts\python.exe" (
    echo   Please run START_ViralDarshan.bat once first, then come back here.
    pause & exit /b 1
)
set "VENVPY=.venv\Scripts\python.exe"

echo   Building ViralDarshan.exe (2-4 minutes)...
"!VENVPY!" -m pip install -q pyinstaller tzdata
REM  --collect-data tzdata        -> Asia/Kolkata works on every Windows PC
REM  --collect-submodules yt_dlp  -> yt-dlp lazy-loads its extractors
REM  --collect-all instaloader    -> full package bundled
REM  NOTE: any crash now shows a popup + writes crash.log (see main.py),
REM        so the exe can never "open and close instantly" without explanation.
"!VENVPY!" -m PyInstaller --noconfirm --onefile --windowed --name ViralDarshan ^
    --collect-data tzdata ^
    --collect-submodules yt_dlp ^
    --collect-all instaloader ^
    --add-data "config.py;." main.py || ( echo   [ERROR] Build failed. & pause & exit /b 1 )

echo.
echo   Installing the exe for Windows auto-start...
"!VENVPY!" install_startup.py

echo.
echo   ============================================================
echo     SUCCESS  -^>  dist\ViralDarshan.exe
echo     Give this ONE file to anyone - they double-click it, done.
echo     (auto-start at every logon is already registered)
echo   ============================================================
pause
endlocal
