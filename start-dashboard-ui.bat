@echo off
REM Quick Start - Constitutional Market Harmonics Dashboard
REM This will keep the UI running persistently

echo Starting Constitutional Market Harmonics Dashboard...
echo.
echo The dashboard UI will stay open and running.
echo Visit: http://localhost:3000
echo.
echo DO NOT close the "Dashboard Runner" window that opens!
echo That window keeps the servers running.
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

REM Start the persistent runner
start "Dashboard Runner - KEEP THIS WINDOW OPEN!" cmd /k "keep-dashboard-alive.bat"

echo.
echo Dashboard runner started!
echo The UI will be available at: http://localhost:3000
echo.
echo To stop: Close the "Dashboard Runner" window
echo.
pause