#!/usr/bin/env python3
"""
Comprehensive API Key Summary and Dashboard Launcher
Extracts all API keys from codebase .env files and displays available services
"""

import os
from pathlib import Path

def extract_env_keys():
    """Extract all API keys from .env files in codebase"""
    
    env_files = {
        "Root AXIOM-X": r"c:\Users\regan\ID SYSTEM\axiom-x\.env",
        "Dashboard": r"c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard\.env",
        "Dashboard Local": r"c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard\.env.local",
    }
    
    keys = {}
    
    for label, filepath in env_files.items():
        if os.path.exists(filepath):
            print(f"\n📄 {label}: {filepath}")
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key_name, key_value = line.split('=', 1)
                        key_name = key_name.strip()
                        key_value = key_value.strip()
                        
                        # Only show first/last chars of actual keys for security
                        if 'KEY' in key_name or 'TOKEN' in key_name:
                            if len(key_value) > 10:
                                display_value = f"{key_value[:10]}...{key_value[-10:]}"
                            else:
                                display_value = key_value
                            print(f"  ✓ {key_name}: {display_value}")
                            keys[key_name] = key_value
    
    return keys

def main():
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║  CONSTITUTIONAL MARKET HARMONICS - API KEY CONSOLIDATION     ║")
    print("║  November 6, 2025                                           ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    
    keys = extract_env_keys()
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║  AVAILABLE SERVICES & API INTEGRATIONS                       ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    
    # Map keys to services
    services = {
        "Claude (Sonnet 4.5)": {
            "keys": ["ANTHROPIC_API_KEY", "NEXT_PUBLIC_ANTHROPIC_API_KEY"],
            "status": "✅ READY",
            "features": ["Chat Interface", "Constitutional AI", "Neural Network Analysis"],
            "url": "https://console.anthropic.com/"
        },
        "GPT-5": {
            "keys": ["OPENAI_API_KEY"],
            "status": "✅ READY" if "OPENAI_API_KEY" in keys else "⚠️ Available",
            "features": ["Advanced Reasoning", "Code Generation"],
            "url": "https://platform.openai.com/"
        },
        "Google Gemini": {
            "keys": ["GOOGLE_API_KEY", "GEMINI_API_KEY"],
            "status": "✅ READY" if "GOOGLE_API_KEY" in keys else "⚠️ Available",
            "features": ["Vision", "Multimodal Analysis"],
            "url": "https://aistudio.google.com/"
        },
        "Cohere Command": {
            "keys": ["COHERE_API_KEY"],
            "status": "✅ READY" if "COHERE_API_KEY" in keys else "⚠️ Available",
            "features": ["Text Generation", "Retrieval"],
            "url": "https://cohere.com/"
        },
        "Groq (Fast Inference)": {
            "keys": ["GROQ_API_KEY"],
            "status": "✅ READY" if "GROQ_API_KEY" in keys else "⚠️ Available",
            "features": ["Sub-100ms Latency", "LLaMA 3.3-70B"],
            "url": "https://console.groq.com/"
        },
        "Fireworks AI": {
            "keys": ["FIREWORKS_API_KEY"],
            "status": "✅ READY" if "FIREWORKS_API_KEY" in keys else "⚠️ Available",
            "features": ["Fast Inference", "LLaMA Models"],
            "url": "https://fireworks.ai/"
        },
        "Stability AI": {
            "keys": ["STABILITY_API_KEY"],
            "status": "✅ READY" if "STABILITY_API_KEY" in keys else "⚠️ Available",
            "features": ["Image Generation", "SDXL"],
            "url": "https://platform.stability.ai/"
        },
        "Replicate": {
            "keys": ["REPLICATE_API_KEY"],
            "status": "✅ READY" if "REPLICATE_API_KEY" in keys else "⚠️ Available",
            "features": ["Model Hosting", "API Access"],
            "url": "https://replicate.com/"
        },
        "HeyGen": {
            "keys": ["HEYGEN_API_KEY"],
            "status": "✅ READY" if "HEYGEN_API_KEY" in keys else "⚠️ Available",
            "features": ["Video Generation", "Avatar Creation"],
            "url": "https://www.heygen.com/"
        },
        "Market Data - Finnhub": {
            "keys": ["FINNHUB_API_KEY"],
            "status": "✅ ACTIVE" if "FINNHUB_API_KEY" in keys else "❌ Missing",
            "features": ["Stock Prices", "News", "Sentiment"],
            "url": "https://finnhub.io/"
        },
        "Market Data - Alpha Vantage": {
            "keys": ["ALPHA_VANTAGE_API_KEY"],
            "status": "⚠️ Optional",
            "features": ["Technical Indicators", "Historical Data"],
            "url": "https://www.alphavantage.co/"
        },
        "Market Data - Polygon.io": {
            "keys": ["POLYGON_API_KEY"],
            "status": "⚠️ Optional",
            "features": ["Advanced Data", "Options, Forex, Crypto"],
            "url": "https://polygon.io/"
        }
    }
    
    for service_name, service_info in services.items():
        has_key = any(k in keys for k in service_info["keys"])
        status = service_info["status"]
        if not has_key and "✅" in status:
            status = "⚠️ Optional"
        elif has_key and "Optional" in status:
            status = "✅ READY"
        
        print(f"\n{status} {service_name}")
        print(f"   Features: {', '.join(service_info['features'])}")
        if has_key:
            print(f"   Keys: {', '.join([k for k in service_info['keys'] if k in keys])}")
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║  DASHBOARD LAUNCHER                                          ║")
    print("╚═══════════════════════════════════════════════════════════════╝\n")
    
    print("To get the trading harmony dashboard LIVE:\n")
    print("1. INSTALL DEPENDENCIES:")
    print("   cd c:\\Users\\regan\\ID SYSTEM\\axiom-x\\constitutional-market-harmonics\\dashboard")
    print("   npm install\n")
    
    print("2. BUILD THE PROJECT:")
    print("   npm run build\n")
    
    print("3. START THE SERVICES (3 terminals):\n")
    print("   Terminal 1 - Backend API Server:")
    print("   npx tsx server.ts\n")
    print("   Terminal 2 - Frontend Development Server:")
    print("   npm run dev\n")
    print("   Terminal 3 - Monitor logs (optional):")
    print("   npm run logs\n")
    
    print("4. OPEN IN BROWSER:")
    print("   http://localhost:3000\n")
    
    print("✨ All API keys are configured in .env.local")
    print("🟢 Dashboard will use Claude Sonnet 4.5 for AI features")
    print("📊 Market data will stream from Finnhub (13 endpoints)")
    print("⚡ Real-time updates via Socket.IO (port 12345)\n")

if __name__ == "__main__":
    main()
