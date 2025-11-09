@echo off
REM Constitutional Market Harmonics Dashboard - Persistent UI Runner
REM This keeps the dashboard UI running continuously

title Constitutional Market Harmonics Dashboard - UI Runner

echo ===============================================
echo Constitutional Market Harmonics Dashboard
echo ===============================================
echo.
echo Starting persistent dashboard servers...
echo Frontend (UI): http://localhost:3000
echo Backend (API): http://localhost:3001/api/dashboard
echo.
echo This window will keep the servers running.
echo DO NOT CLOSE THIS WINDOW!
echo.
echo Press Ctrl+C to stop all servers.
echo ===============================================
echo.

cd /d "C:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"

:restart_loop
echo [%date% %time%] Starting dashboard servers...

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak > nul

REM Start backend server in background
echo [%date% %time%] Starting backend server (port 3001)...
start /B "Backend-API" npx tsx server.ts

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server in background
echo [%date% %time%] Starting frontend server (port 3000)...
start /B "Frontend-UI" npm run dev

echo [%date% %time%] Both servers started. Monitoring...

REM Monitor servers and restart if they stop
:monitor_loop
timeout /t 10 /nobreak > nul

REM Check if backend is running
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:3001/api/dashboard' -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] Backend server stopped, restarting...
    taskkill /f /im node.exe >nul 2>&1
    goto restart_loop
)

REM Check if frontend is running
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] Frontend server stopped, restarting...
    taskkill /f /im node.exe >nul 2>&1
    goto restart_loop
)

echo [%date% %time%] Both servers running healthy...
goto monitor_loop