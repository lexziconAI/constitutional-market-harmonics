#!/usr/bin/env python3
"""
🔴 FRACTAL RED TEAM ANALYSIS
Constitutional Market Harmonics Dashboard - Dependency Conflict Detection
Identifies conflicts, corrupted modules, and misconfigurations before reinstall
"""

import os
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Set

class FractalRedTeam:
    """Red team analysis to identify all potential conflicts"""
    
    def __init__(self):
        self.dashboard_path = Path("c:/Users/regan/ID SYSTEM/axiom-x/constitutional-market-harmonics/dashboard")
        self.issues = []
        self.conflicts = []
        self.corrupted_files = []
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║            🔴 FRACTAL RED TEAM ANALYSIS 🔴                                   ║
║                                                                              ║
║     Identifying Conflicts & Corrupted Modules Before Reinstall              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
        """)

    def scan_node_modules(self):
        """Scan node_modules for corrupted/incomplete packages"""
        print("\n🔍 LEVEL 1: Scanning node_modules structure...")
        print("━" * 78)
        
        node_modules = self.dashboard_path / "node_modules"
        if not node_modules.exists():
            print("  ✅ node_modules directory doesn't exist (clean start)")
            return
        
        print(f"  📁 node_modules found at: {node_modules}")
        
        # Count packages
        packages = [d for d in node_modules.iterdir() if d.is_dir()]
        print(f"  📦 Total packages found: {len(packages)}")
        
        # Check for corrupted packages (missing package.json)
        print("\n  🔎 Checking for corrupted packages...")
        corrupted = 0
        for pkg in packages[:20]:  # Check first 20
            pkg_json = pkg / "package.json"
            if not pkg_json.exists():
                corrupted += 1
                self.corrupted_files.append(str(pkg))
                print(f"    ❌ CORRUPTED: {pkg.name} (missing package.json)")
        
        if corrupted == 0:
            print(f"    ✅ All checked packages have package.json")
        else:
            print(f"    🔴 FOUND {corrupted} corrupted packages")
            self.issues.append(f"Corrupted packages: {corrupted}")

    def check_package_json(self):
        """Check for duplicate/conflicting dependencies"""
        print("\n🔍 LEVEL 2: Analyzing package.json...")
        print("━" * 78)
        
        pkg_json_path = self.dashboard_path / "package.json"
        if not pkg_json_path.exists():
            print("  ❌ package.json not found!")
            self.issues.append("Missing package.json")
            return
        
        with open(pkg_json_path) as f:
            pkg_data = json.load(f)
        
        deps = pkg_data.get("dependencies", {})
        dev_deps = pkg_data.get("devDependencies", {})
        
        print(f"  📦 Production dependencies: {len(deps)}")
        print(f"  🔧 Dev dependencies: {len(dev_deps)}")
        
        # Check for duplicates
        all_keys = set(deps.keys())
        dup_keys = all_keys.intersection(set(dev_deps.keys()))
        
        if dup_keys:
            print(f"\n  🔴 CONFLICT FOUND: Package in both dependencies:")
            for key in dup_keys:
                print(f"    ❌ {key}")
                self.conflicts.append(f"Duplicate: {key}")
        else:
            print("\n  ✅ No duplicate dependencies found")
        
        # Critical packages
        critical = ["react", "next", "express", "socket.io", "typescript"]
        print(f"\n  🎯 Critical packages status:")
        for pkg in critical:
            if pkg in deps:
                print(f"    ✅ {pkg}: {deps[pkg]}")
            else:
                print(f"    ❌ {pkg}: MISSING")
                self.issues.append(f"Missing critical: {pkg}")

    def check_lock_files(self):
        """Check for conflicting lock files"""
        print("\n🔍 LEVEL 3: Checking lock files...")
        print("━" * 78)
        
        npm_lock = self.dashboard_path / "package-lock.json"
        yarn_lock = self.dashboard_path / "yarn.lock"
        pnpm_lock = self.dashboard_path / "pnpm-lock.yaml"
        
        lock_files = []
        if npm_lock.exists():
            lock_files.append(("npm", npm_lock))
            print(f"  📌 npm-lock.json found (size: {npm_lock.stat().st_size / 1024:.1f}KB)")
        
        if yarn_lock.exists():
            lock_files.append(("yarn", yarn_lock))
            print(f"  📌 yarn.lock found")
            self.issues.append("Multiple lock file managers detected")
        
        if pnpm_lock.exists():
            lock_files.append(("pnpm", pnpm_lock))
            print(f"  📌 pnpm-lock.yaml found")
            self.issues.append("Multiple lock file managers detected")
        
        if len(lock_files) > 1:
            print(f"\n  🔴 CONFLICT: Multiple lock file managers!")
            print(f"    Found: {', '.join([f[0] for f in lock_files])}")
            self.conflicts.append(f"Multiple lock files: {len(lock_files)}")
        elif len(lock_files) == 0:
            print("  ⚠️ No lock files found (npm install needed)")
        else:
            print(f"  ✅ Single lock file manager: {lock_files[0][0]}")

    def check_environment(self):
        """Check environment variables and configs"""
        print("\n🔍 LEVEL 4: Checking environment & configs...")
        print("━" * 78)
        
        # Check .env files
        env_file = self.dashboard_path / ".env"
        env_local = self.dashboard_path / ".env.local"
        env_example = self.dashboard_path / ".env.example"
        
        env_status = {
            ".env": env_file.exists(),
            ".env.local": env_local.exists(),
            ".env.example": env_example.exists()
        }
        
        for name, exists in env_status.items():
            status = "✅" if exists else "❌"
            print(f"  {status} {name}: {exists}")
        
        if env_local.exists():
            with open(env_local) as f:
                content = f.read()
                if "FINNHUB_API_KEY" in content:
                    print("  ✅ API keys configured")
                else:
                    print("  ⚠️ API keys may not be configured")

    def check_typescript_config(self):
        """Check TypeScript configuration"""
        print("\n🔍 LEVEL 5: Checking TypeScript config...")
        print("━" * 78)
        
        tsconfig = self.dashboard_path / "tsconfig.json"
        if not tsconfig.exists():
            print("  ❌ tsconfig.json not found!")
            self.issues.append("Missing tsconfig.json")
            return
        
        with open(tsconfig) as f:
            ts_config = json.load(f)
        
        compiler_opts = ts_config.get("compilerOptions", {})
        strict = compiler_opts.get("strict", False)
        
        print(f"  ✅ tsconfig.json found")
        print(f"  🔧 Strict mode: {strict}")
        print(f"  🎯 Target: {compiler_opts.get('target', 'unknown')}")
        print(f"  📦 Module: {compiler_opts.get('module', 'unknown')}")

    def check_git_status(self):
        """Check git status for uncommitted changes"""
        print("\n🔍 LEVEL 6: Checking git status...")
        print("━" * 78)
        
        try:
            os.chdir(self.dashboard_path)
            result = subprocess.run(
                ["git", "status", "--short"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                if lines and lines[0]:
                    print(f"  ⚠️ Uncommitted changes found: {len(lines)}")
                    for line in lines[:5]:
                        print(f"    {line}")
                    if len(lines) > 5:
                        print(f"    ... and {len(lines) - 5} more")
                else:
                    print("  ✅ All changes committed")
            else:
                print("  ℹ️ Not a git repository")
        except Exception as e:
            print(f"  ℹ️ Git check skipped: {e}")

    def check_file_permissions(self):
        """Check for permission issues"""
        print("\n🔍 LEVEL 7: Checking file permissions...")
        print("━" * 78)
        
        critical_files = [
            "package.json",
            "tsconfig.json",
            "next.config.js",
            "server.ts"
        ]
        
        permission_issues = 0
        for file in critical_files:
            filepath = self.dashboard_path / file
            if filepath.exists():
                try:
                    if os.access(filepath, os.R_OK):
                        print(f"  ✅ {file}: readable")
                    else:
                        print(f"  ❌ {file}: not readable")
                        permission_issues += 1
                except Exception as e:
                    print(f"  ⚠️ {file}: {e}")
            else:
                print(f"  ❌ {file}: not found")
        
        if permission_issues == 0:
            print(f"\n  ✅ All critical files readable")
        else:
            self.issues.append(f"Permission issues: {permission_issues}")

    def generate_report(self):
        """Generate final report"""
        print("\n" + "=" * 78)
        print("🔴 RED TEAM ANALYSIS COMPLETE")
        print("=" * 78)
        
        print(f"\n📊 FINDINGS SUMMARY:")
        print(f"  Total Issues Found: {len(self.issues)}")
        print(f"  Conflicts Detected: {len(self.conflicts)}")
        print(f"  Corrupted Files: {len(self.corrupted_files)}")
        
        if self.issues:
            print(f"\n⚠️ ISSUES:")
            for issue in self.issues:
                print(f"  🔴 {issue}")
        
        if self.conflicts:
            print(f"\n⚠️ CONFLICTS:")
            for conflict in self.conflicts:
                print(f"  🔴 {conflict}")
        
        if self.corrupted_files:
            print(f"\n⚠️ CORRUPTED FILES:")
            for file in self.corrupted_files[:5]:
                print(f"  🔴 {file}")
            if len(self.corrupted_files) > 5:
                print(f"  🔴 ... and {len(self.corrupted_files) - 5} more")
        
        print("\n" + "=" * 78)
        print("🔧 RECOMMENDED ACTIONS:")
        print("=" * 78)
        
        print("\n1️⃣  PURGE OLD MODULES")
        print("""
   PowerShell:
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   Remove-Item yarn.lock -ErrorAction SilentlyContinue
   Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue
        """)
        
        print("2️⃣  CLEAN NPM CACHE")
        print("""
   npm cache clean --force
        """)
        
        print("3️⃣  REINSTALL FRESH")
        print("""
   npm install --legacy-peer-deps
        """)
        
        print("4️⃣  BUILD")
        print("""
   npm run build
        """)
        
        print("5️⃣  LAUNCH")
        print("""
   Terminal 1: npx tsx server.ts
   Terminal 2: npm run dev
   Terminal 3: http://localhost:3000
        """)
        
        if not self.issues and not self.conflicts:
            print("\n✅ NO CRITICAL ISSUES FOUND")
            print("   Dashboard should be ready to install and run!")
        else:
            print("\n🔴 ISSUES DETECTED")
            print("   Running purge and reinstall recommended!")

    def run(self):
        """Run full red team analysis"""
        self.print_banner()
        self.scan_node_modules()
        self.check_package_json()
        self.check_lock_files()
        self.check_environment()
        self.check_typescript_config()
        self.check_git_status()
        self.check_file_permissions()
        self.generate_report()

if __name__ == "__main__":
    red_team = FractalRedTeam()
    red_team.run()
