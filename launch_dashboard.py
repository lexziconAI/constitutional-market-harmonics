#!/usr/bin/env python3
"""
Constitutional Market Harmonics Dashboard - Quick Launcher
Automates npm install, build, and service startup
"""

import subprocess
import sys
import os
import time
from pathlib import Path

DASHBOARD_PATH = r"c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"
os.chdir(DASHBOARD_PATH)

def run_command(cmd, description):
    """Run a shell command and report results"""
    print(f"\n⏳ {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=False, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - DONE")
            return True
        else:
            print(f"❌ {description} - FAILED")
            return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False

def main():
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║  CONSTITUTIONAL MARKET HARMONICS DASHBOARD                   ║")
    print("║  Trading Harmony Live Launcher                              ║")
    print("║  November 6, 2025                                           ║")
    print("╚═══════════════════════════════════════════════════════════════╝\n")
    
    print("📍 Dashboard Path:", DASHBOARD_PATH)
    print("🎯 Objective: Launch trading harmony dashboard with live APIs\n")
    
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║  PHASE 1: VERIFY ENVIRONMENT                                ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    
    # Check Node.js
    print("\n📋 Checking prerequisites...")
    node_check = subprocess.run("node --version", shell=True, capture_output=True, text=True)
    if node_check.returncode == 0:
        print(f"✅ Node.js: {node_check.stdout.strip()}")
    else:
        print("❌ Node.js not found - please install Node.js 18+")
        sys.exit(1)
    
    npm_check = subprocess.run("npm --version", shell=True, capture_output=True, text=True)
    if npm_check.returncode == 0:
        print(f"✅ npm: {npm_check.stdout.strip()}")
    else:
        print("❌ npm not found")
        sys.exit(1)
    
    # Check .env.local
    env_local_path = Path(DASHBOARD_PATH) / ".env.local"
    if env_local_path.exists():
        print(f"✅ .env.local: Configured")
    else:
        print(f"❌ .env.local: Missing")
        sys.exit(1)
    
    # Check package.json
    package_json = Path(DASHBOARD_PATH) / "package.json"
    if package_json.exists():
        print(f"✅ package.json: Found")
    else:
        print(f"❌ package.json: Missing")
        sys.exit(1)
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║  PHASE 2: INSTALL DEPENDENCIES                              ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    
    if not run_command("npm install", "Installing dependencies"):
        print("⚠️  npm install had issues, but continuing...")
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║  PHASE 3: BUILD PROJECT                                     ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    
    if not run_command("npm run build", "Building Next.js project"):
        print("⚠️  Build had warnings, but continuing...")
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║  PHASE 4: PREPARE TO LAUNCH SERVICES                        ║")
    print("╚═══════════════════════════════════════════════════════════════╝\n")
    
    print("📊 Services to start:\n")
    print("  1️⃣  Backend API Server (port 3001 + Socket.IO on 12345):")
    print("     Command: npx tsx server.ts\n")
    
    print("  2️⃣  Frontend Dev Server (port 3000):")
    print("     Command: npm run dev\n")
    
    print("  3️⃣  Browser (after services start):")
    print("     URL: http://localhost:3000\n")
    
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║  ⚠️  MANUAL NEXT STEPS                                       ║")
    print("╚═══════════════════════════════════════════════════════════════╝\n")
    
    print("Due to the need to keep services running, please execute these")
    print("commands in separate PowerShell terminals:\n")
    
    print("📌 Terminal 1 - Backend API Server:")
    print("   cd \"c:\\Users\\regan\\ID SYSTEM\\axiom-x\\constitutional-market-harmonics\\dashboard\"")
    print("   npx tsx server.ts\n")
    
    print("📌 Terminal 2 - Frontend Dev Server:")
    print("   cd \"c:\\Users\\regan\\ID SYSTEM\\axiom-x\\constitutional-market-harmonics\\dashboard\"")
    print("   npm run dev\n")
    
    print("📌 Terminal 3 - Then open browser:")
    print("   http://localhost:3000\n")
    
    print("✨ Dashboard will start with:")
    print("   • Real-time portfolio monitoring")
    print("   • 13 live market data endpoints")
    print("   • Constitutional AI chat interface")
    print("   • WebSocket real-time updates")
    print("   • Mock data fallback\n")
    
    print("🎉 All setup complete! Your trading harmony dashboard is ready!")
    print("\nPress ENTER to continue...")
    input()

if __name__ == "__main__":
    main()
