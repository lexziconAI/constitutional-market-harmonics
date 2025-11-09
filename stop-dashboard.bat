@echo off
REM Constitutional Market Harmonics Dashboard - Stop Script

echo Stopping Constitutional Market Harmonics Dashboard...
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

REM Stop the servers using PowerShell
powershell.exe -ExecutionPolicy Bypass -Command "& { .\run-dashboard.ps1 -Stop }"

echo.
echo Dashboard servers stopped.
echo.
pause