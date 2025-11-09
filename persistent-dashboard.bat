@echo off
REM Constitutional Market Harmonics Dashboard - Persistent Runner
REM Keeps the UI running continuously - DO NOT CLOSE THIS WINDOW!

title Constitutional Market Harmonics Dashboard - PERSISTENT

echo ===============================================
echo CONSTITUTIONAL MARKET HARMONICS DASHBOARD
echo ===============================================
echo.
echo UI will stay running in this window.
echo DO NOT CLOSE THIS WINDOW!
echo.
echo Access the dashboard at: http://localhost:3000
echo.
echo Press Ctrl+C to stop everything.
echo ===============================================
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

:start_servers
echo [%date% %time%] Starting servers...

REM Start backend server
echo Starting backend API server (port 3001)...
start /B npx tsx server.ts

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend server
echo Starting frontend UI server (port 3000)...
start /B npm run dev

echo [%date% %time%] Servers started. Monitoring health...

REM Keep checking if servers are alive
:check_loop
timeout /t 15 /nobreak > nul

echo [%date% %time%] Checking server health...

REM Test backend
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:3001/api/dashboard' -TimeoutSec 5 | Out-Null; echo Backend OK } catch { echo Backend DOWN - restarting...; goto restart_servers }" 2>nul

REM Test frontend
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 | Out-Null; echo Frontend OK } catch { echo Frontend DOWN - restarting...; goto restart_servers }" 2>nul

echo Both servers healthy.
goto check_loop

:restart_servers
echo [%date% %time%] Restarting servers...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak > nul
goto start_servers