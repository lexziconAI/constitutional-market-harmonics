@echo off
REM Constitutional Market Harmonics Dashboard - Simple Persistent Runner
REM Starts both servers in separate windows and keeps them running

echo Starting Constitutional Market Harmonics Dashboard...
echo.
echo Frontend (Next.js): http://localhost:3000
echo Backend (API): http://localhost:3001/api/dashboard
echo.
echo Press Ctrl+C in each window to stop individual servers
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

echo Starting Backend Server (Port 3001)...
start "Backend Server - Constitutional Market Harmonics" cmd /k "echo Backend Server - Press Ctrl+C to stop && npx tsx server.ts"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 3000)...
start "Frontend Server - Constitutional Market Harmonics" cmd /k "echo Frontend Server - Press Ctrl+C to stop && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Close the windows to stop the servers.
echo.
echo Dashboard will be available at: http://localhost:3000
echo.
pause