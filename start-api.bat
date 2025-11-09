@echo off
setlocal enabledelayedexpansion

echo Killing existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Starting API Server...
cd /d "c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"
set PORT=3002
set HOST=127.0.0.1

:restart
node api-server.js
echo Server exited with code %ERRORLEVEL%
echo Restarting in 2 seconds...
timeout /t 2 /nobreak
goto restart
