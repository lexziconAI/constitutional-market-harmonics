@echo off
echo Starting Axiom X Constitutional Market Harmonics Dashboard...
echo.

REM Kill any existing node processes
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

REM Start backend server
echo Starting backend server on port 3001...
start "Backend Server" cmd /c "cd /d ""c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"" && npx tsx server.ts"

REM Wait for backend to start
timeout /t 5 >nul

REM Start frontend server
echo Starting frontend server on port 3000...
start "Frontend Server" cmd /c "cd /d ""c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"" && npm run dev"

REM Wait for frontend to start
timeout /t 10 >nul

REM Test both servers
echo.
echo Testing servers...
curl -s http://localhost:3001/api/dashboard >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API: http://localhost:3001 - RUNNING
) else (
    echo ❌ Backend API: FAILED
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend Dashboard: http://localhost:3000 - RUNNING
) else (
    echo ❌ Frontend Dashboard: FAILED
)

echo.
echo Dashboard URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001
echo.
echo Press Ctrl+C to stop servers
pause >nul