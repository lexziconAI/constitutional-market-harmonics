@echo off
REM Constitutional Market Harmonics Dashboard - Easy Start Script
REM This script starts the persistent dashboard runner

echo Starting Constitutional Market Harmonics Dashboard...
echo.
echo This will keep both frontend (port 3000) and backend (port 3001) servers running.
echo Press Ctrl+C to stop the monitoring (servers will keep running).
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

REM Start the PowerShell runner in a new window so it doesn't block this console
start "Dashboard Runner" powershell.exe -ExecutionPolicy Bypass -File "run-dashboard.ps1"

echo Dashboard runner started in new window.
echo Check the new PowerShell window for status updates.
echo.
echo Dashboard will be available at: http://localhost:3000
echo API available at: http://localhost:3001/api/dashboard
echo.
pause