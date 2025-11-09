@echo off
REM 🌍 PERSISTENT DASHBOARD LAUNCHER
REM Run this to keep the dashboard online 24/7
REM Can be added to Windows Task Scheduler to auto-start on boot

setlocal enabledelayedexpansion

REM Get the directory of this script
cd /d "%~dp0"

REM Kill existing Node processes
echo [*] Cleaning up existing Node processes...
taskkill /f /im node.exe 2>nul

REM Wait for cleanup
timeout /t 2 /nobreak

REM Check and kill any lingering processes
for /f "tokens=2" %%A in ('tasklist ^| findstr node.exe') do (
    taskkill /f /pid %%A 2>nul
)

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Log file with timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set timestamp=%mydate%-%mytime%
set logfile=logs\startup-%timestamp%.log

echo [+] Starting PERSISTENT DASHBOARD MANAGER
echo [+] Timestamp: %date% %time% >> %logfile%
echo [+] Working directory: %cd% >> %logfile%

REM Start the persistent manager
echo [*] Starting persistent manager...
echo [*] Dashboard will restart automatically if it crashes
echo [*] Access dashboard at: http://localhost:3001
echo [*] Backend API at: http://localhost:12345
echo [*] Press Ctrl+C to stop
echo.

node persistent-manager.js >> %logfile% 2>&1

echo [!] Persistent manager stopped
echo [!] Check logs\%timestamp%.log for details
timeout /t 10

endlocal
