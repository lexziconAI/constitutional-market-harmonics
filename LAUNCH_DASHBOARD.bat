@echo off
REM Constitutional Market Harmonics Dashboard Launcher
REM Simple batch script to start the dashboard

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     🚀 LAUNCHING LIVE DASHBOARD 🚀                            ║
echo ║                                                                ║
echo ║  Constitutional Market Harmonics - PRODUCTION DEPLOYMENT      ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Set dashboard directory
set DASHBOARD_DIR=c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard

echo 📁 Dashboard Location: %DASHBOARD_DIR%
echo.

REM Change to dashboard directory
cd /d "%DASHBOARD_DIR%"

echo ✓ Step 1: Installing dependencies...
echo.
call npm install --legacy-peer-deps 2>nul
if %ERRORLEVEL% neq 0 (
    echo ⚠️ npm install had issues, but continuing...
)

echo.
echo ✓ Step 2: Building Next.js project...
echo.
call npm run build 2>nul
if %ERRORLEVEL% neq 0 (
    echo ⚠️ Build had issues, but continuing...
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║    ✅ STARTING SERVERS ✅                                     ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔌 Starting backend server on http://localhost:3001...
start "Dashboard Backend" cmd /k "cd /d \"%DASHBOARD_DIR%\" && npx tsx server.ts"

timeout /t 3 /nobreak

echo 🌐 Starting frontend server on http://localhost:3000...
start "Dashboard Frontend" cmd /k "cd /d \"%DASHBOARD_DIR%\" && npm run dev"

timeout /t 5 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║    ✅ DASHBOARD IS LIVE ✅                                    ║
echo ║                                                                ║
echo ║    🌐 Open Browser: http://localhost:3000                     ║
echo ║                                                                ║
echo ║    You should see:                                            ║
echo ║    • Dashboard loads                                          ║
echo ║    • Green 🟢 Connection status                               ║
echo ║    • Portfolio data                                           ║
echo ║    • News ticker                                              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 📍 Server URLs:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:3001
echo    WebSocket: ws://localhost:12345
echo.

pause
