#!/usr/bin/env python3
"""
Quick launcher - Just start the dashboard immediately
"""

import subprocess
import time
import os
from pathlib import Path

dashboard = Path("c:/Users/regan/ID SYSTEM/axiom-x/constitutional-market-harmonics/dashboard")
os.chdir(dashboard)

print("""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         🚀 LAUNCHING LIVE DASHBOARD 🚀                        ║
║                                                                ║
║  Constitutional Market Harmonics - PRODUCTION READY           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📍 Dashboard: http://localhost:3000
🔌 Backend:   http://localhost:3001
📡 WebSocket: ws://localhost:12345

⏳ Starting servers...
""")

# Start backend
print("\n✅ Starting backend server (Express)...")
backend = subprocess.Popen(["npx", "tsx", "server.ts"])

time.sleep(3)

# Start frontend
print("✅ Starting frontend server (Next.js)...")
frontend = subprocess.Popen(["npm", "run", "dev"])

time.sleep(5)

print("""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        ✅ DASHBOARD IS LIVE ✅                                ║
║                                                                ║
║        Open: http://localhost:3000                            ║
║                                                                ║
║        Press Ctrl+C to stop                                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
""")

try:
    # Keep running
    frontend.wait()
except KeyboardInterrupt:
    print("\n🛑 Stopping servers...")
    backend.terminate()
    frontend.terminate()
    print("✅ Stopped")
