# Constitutional Market Harmonics Dashboard - Deployment Checklist

**Purpose:** Pre-flight validation to ensure dashboard deploys successfully  
**Version:** 1.0  
**Last Updated:** November 6, 2025  
**Status:** Ready for deployment

---

## Pre-Deployment Checklist

Use this checklist to verify system readiness before deploying to production or sharing with users.

### Phase 1: Environment Setup ✓

- [ ] **Node.js Version Check**
  ```bash
  node --version
  # Expected: v18.0.0 or higher
  ```
  
- [ ] **npm Version Check**
  ```bash
  npm --version
  # Expected: v9.0.0 or higher
  ```

- [ ] **Port Availability**
  ```bash
  # Windows PowerShell:
  netstat -ano | findstr :3000
  netstat -ano | findstr :3001
  netstat -ano | findstr :12345
  # Expected: No processes listening (empty result)
  ```

- [ ] **Dependencies Installed**
  ```bash
  npm list chart.js react-chartjs-2 socket.io next
  # Expected: All packages installed with versions matching package.json
  ```

- [ ] **.env.local Configuration**
  ```bash
  # Required keys present:
  cat .env.local | grep ANTHROPIC_API_KEY
  cat .env.local | grep NODE_ENV
  # Expected: Both keys present and not empty
  ```

- [ ] **API Key Validation**
  ```bash
  # Test Anthropic API key format (should start with 'sk-ant-')
  # Test that it's not the placeholder 'your_actual_api_key_here'
  ```

### Phase 2: Build Verification ✓

- [ ] **Next.js Build**
  ```bash
  npm run build
  # Expected: Build completes successfully
  # Look for: "✓ Compiled successfully"
  # Not expected: TypeScript errors, import errors, bundle errors
  ```

- [ ] **No Build Errors**
  ```bash
  # During build, verify:
  # ✓ No "error TS" messages
  # ✓ No "Cannot find module" messages
  # ✓ No "Unexpected token" messages
  # ✓ Build output size reasonable (<50MB .next folder)
  ```

- [ ] **TypeScript Compilation**
  ```bash
  npx tsc --noEmit
  # Expected: No output (means no TypeScript errors)
  # Not expected: "Type errors" or "Cannot find name" messages
  ```

- [ ] **ESLint Check (optional)**
  ```bash
  npm run lint
  # Expected: 0 errors (warnings okay)
  ```

### Phase 3: Server Startup ✓

**Terminal 1: Next.js Frontend**
- [ ] **Start Next.js Dev Server**
  ```bash
  npm run dev
  # Expected output:
  # ✓ Ready in 2.5s
  # ✓ Local: http://localhost:3000
  # ✓ pressing 'o' opens the browser
  ```

**Terminal 2: Express Backend**
- [ ] **Start Express Server**
  ```bash
  npm run server
  # Or: npm run build && npm start
  # Expected output:
  # ✓ Server listening on port 3001
  # ✓ Socket.IO listening on port 12345
  # ✓ Database connected
  ```

- [ ] **No Startup Errors**
  - Not expected: "Cannot find module"
  - Not expected: "Port already in use"
  - Not expected: "Database connection failed"

### Phase 4: Frontend Accessibility ✓

- [ ] **Browser Access**
  ```
  Open: http://localhost:3000
  Expected: Dashboard loads (not blank, not error)
  ```

- [ ] **Page Load Time**
  ```
  Open DevTools (F12) → Network tab
  - DOMContentLoaded: <1 second
  - Load: <3 seconds
  - If slower: Check API endpoints in server logs
  ```

- [ ] **No Browser Console Errors**
  ```bash
  F12 → Console tab
  Expected: No red error messages
  Expected: Warnings are okay (not errors)
  Look specifically for:
  - "Module not found"
  - "Cannot read property"
  - "Failed to fetch"
  ```

### Phase 5: Socket.IO Real-Time Connection ✓

- [ ] **WebSocket Connection Established**
  - Open browser DevTools (F12)
  - Network tab → Filter "WS"
  - Expected: See `socket.io/?EIO=4&transport=websocket`
  - Status: Green (connected)

- [ ] **Real-Time Data Flowing**
  - Watch Overview tab for 5 seconds
  - Expected: Numbers update (portfolio values, timestamps change)
  - Check console: Look for "✓ WebSocket connected" or similar

- [ ] **Fallback to Polling Works (if WebSocket fails)**
  - Expected: Even if WebSocket unavailable, data still refreshes (via HTTP polling)
  - Slower (5-10 second intervals) but still functional

### Phase 6: Core Component Rendering ✓

**Overview Tab - All 13 components must render:**

- [ ] **Header Component**
  - Visible: Portfolio total value displayed (top left)
  - Visible: Constitutional health score (top center)
  - Visible: System status indicator (top right)

- [ ] **Portfolio Panel**
  - Visible: Holdings list with: Symbol | Quantity | Price | Value | Score
  - Verify: At least 1 position showing
  - Check: Constitutional scores display (0.0 to 1.0 range)

- [ ] **Performance Panel**
  - Visible: ROI, Sharpe ratio, Constitutional Alignment, Fractal Love Score
  - Verify: Numbers not NaN or undefined
  - Check: Chart (if visible) shows data

- [ ] **Activity Panel**
  - Visible: Recent trades list
  - Visible: Chaos signals with confidence levels
  - Check: System health indicator (green = good, yellow = degraded, red = failed)

- [ ] **News Ticker**
  - Visible: Scrolling news headlines at bottom
  - Verify: Headlines auto-scroll
  - Check: At least 3 headlines showing

- [ ] **Constitutional Radar**
  - Visible: 5-point radar chart (Satya, Ahimsa, Asteya, Brahmacharya, Aparigraha)
  - Verify: All 5 axes show (not collapsed or hidden)
  - Check: Values between 0.0 and 1.0

- [ ] **Chaos Visualizer**
  - Visible: 3D visualization of attractors
  - Verify: No black screen or broken WebGL
  - Check: Can rotate with mouse (click and drag)
  - Verify: Shows Lorenz, Chen, Rössler labels

- [ ] **Market Sentiment**
  - Visible: Fear/greed gauge or sentiment indicator
  - Check: Values display (0.0 to 1.0 or percentage)

- [ ] **No Error Boundaries Triggered**
  - Not visible: "Something went wrong" error messages
  - Not visible: Red error overlays
  - Expected: Graceful degradation if components can't load data

### Phase 7: Tab Navigation ✓

Verify all 8 tabs render without errors:

- [ ] **Overview Tab** → No errors, all 13 components load
- [ ] **Portfolio Tab** → Detailed positions, balances, trades display
- [ ] **Performance Tab** → Charts, optimization panel, panachy cycles render
- [ ] **Chaos Tab** → 3D visualizer loads, interactive controls work
- [ ] **Global Markets Tab** → Exchange data, forex panel display
- [ ] **News Tab** → Carousel scrolls, headlines display
- [ ] **Chat Tab** → Chat interface visible (send/receive enabled if API key valid)
- [ ] **Neural Tab** → Neural network analysis component renders

**Check each tab for:**
- No blank screens
- No "undefined" text
- No red console errors
- Data displays (even if mock data)

### Phase 8: Feature-Specific Validation ✓

#### Chat Interface
- [ ] **Chat Button Visible**
  - Location: Bottom-right corner (floating button)
  - Behavior: Always visible across all tabs
  - Appearance: Blue or accent color

- [ ] **Chat Opens Successfully**
  - Click chat button
  - Expected: Chat panel slides in from right
  - Not expected: Blank panel, error message, or 404

- [ ] **Chat Context Includes Portfolio Data**
  - Open chat
  - Ask: "What's my portfolio value?"
  - Expected: Claude responds with actual value (not generic answer)

- [ ] **Claude API Key Validation**
  - If chat responds: ✓ API key working
  - If chat shows error: ✗ Check ANTHROPIC_API_KEY in .env.local
  - Expected error format: "No API key configured" or "Rate limit exceeded"

#### Global Markets
- [ ] **Markets Tab Loads**
  - Click: Global Markets tab
  - Expected: Exchange names display (S&P 500, NASDAQ, etc.)
  - Not expected: "N/A" or "Loading..." for >5 seconds

- [ ] **Exchange Data Shows**
  - At least 3 exchanges with: Name | Values | Indicators
  - Verify: Numbers are reasonable (indices in 10,000+ range)

- [ ] **Forex Panel Functional**
  - Currency pairs visible (USD, EUR, GBP, etc.)
  - Exchange rates display (e.g., "1 USD = 0.92 EUR")

#### Panachy Cycles
- [ ] **Panachy Cycles Component Renders**
  - Click: Performance tab
  - Verify: "Panachy Cycles" section visible
  - Check: Chart or visualization displays

- [ ] **Market Phases Detected**
  - Expected to see: Bull / Bear / Sideways phase labels
  - With: Confidence percentages

#### Neural Network
- [ ] **Neural Tab Accessible**
  - Click: Neural tab
  - Expected: Component renders (not blank)
  - Not expected: JavaScript errors in console

- [ ] **AI Analysis Displays**
  - Expected: Predictions, patterns, anomalies listed
  - Check: At least one analysis result visible

### Phase 9: Data Persistence ✓

- [ ] **Database Connected**
  ```bash
  # Check backend logs for:
  # ✓ "Database connected" or similar
  # Or verify file exists:
  ls -la market_harmonics.db
  # Expected: File size > 0 bytes
  ```

- [ ] **Data Survives Page Refresh**
  1. Record a value from Overview (e.g., portfolio total)
  2. Press F5 (refresh page)
  3. Expected: Same value displays after refresh
  4. Not expected: Portfolio resets to different value

- [ ] **Trades Saved**
  - Open: Portfolio tab → Trades Feed
  - Verify: Trade history persists across sessions
  - Check: Timestamps and prices accurate

### Phase 10: API Connectivity ✓

- [ ] **Dashboard API Endpoint Responds**
  ```bash
  curl http://localhost:3001/api/dashboard
  # Expected: JSON response with portfolio data
  # Not expected: 404, 500, or timeout
  ```

- [ ] **Optional: Market Data API Keys Tested**
  ```bash
  # If ALPHA_VANTAGE_API_KEY configured:
  curl "http://localhost:3001/api/quote?symbol=AAPL"
  # Expected: Stock price data returns
  
  # If FINNHUB_API_KEY configured:
  curl "http://localhost:3001/api/news"
  # Expected: News headlines return
  ```

### Phase 11: Error Handling ✓

- [ ] **Graceful Degradation When API Down**
  1. Stop backend server (Ctrl+C in Terminal 2)
  2. Refresh dashboard (F5)
  3. Expected: Dashboard still displays (uses mock data or old cache)
  4. Not expected: Completely broken or blank

- [ ] **Error Boundary Catches Errors**
  - Expected behavior: If component crashes, shows error message
  - Not expected: Full page white screen or crash

- [ ] **Invalid API Key Handling**
  - Expected: Chat shows "API key not configured" message
  - Not expected: Silent failure or confusing error

### Phase 12: Performance Benchmarks ✓

- [ ] **Page Load Time**
  ```
  Open DevTools (F12) → Performance tab
  Load page and measure:
  - Expected: First Contentful Paint (FCP) < 1.5s
  - Expected: Largest Contentful Paint (LCP) < 2.5s
  - Expected: Cumulative Layout Shift (CLS) < 0.1
  ```

- [ ] **Data Update Latency**
  ```
  Watch portfolio total value
  Observe update frequency
  Expected: Updates every 5 seconds (or UPDATE_INTERVAL setting)
  Acceptable: Takes <2 seconds to render new data
  ```

- [ ] **Memory Usage**
  ```bash
  # In DevTools Console:
  console.memory
  # Look for usedJSHeapSize
  # Expected: < 100 MB for running dashboard
  # Warning: > 200 MB indicates memory leak
  ```

- [ ] **Network Payload Size**
  ```bash
  DevTools → Network tab
  # API responses should be:
  # - /api/dashboard: < 50 KB
  # - WebSocket updates: < 10 KB per message
  # - Total page size: < 5 MB initial
  ```

### Phase 13: Security & Secrets ✓

- [ ] **No API Keys in Client JavaScript**
  ```bash
  F12 → Sources tab → Search for "sk-ant-"
  # Expected: No secret keys in browsable code
  # Note: NEXT_PUBLIC_ANTHROPIC_API_KEY is visible but marked public
  ```

- [ ] **.env.local Not Committed to Git**
  ```bash
  git status
  # Expected: .env.local NOT listed (in .gitignore)
  # Check: cat .gitignore | grep env
  ```

- [ ] **CORS Properly Configured**
  ```bash
  # Test from different origin:
  # Should only allow configured origins
  # Default: localhost:3000, localhost:3001
  ```

### Phase 14: Browser Compatibility ✓

Test in at least these browsers (if time permits):

- [ ] **Chrome/Chromium** (v90+)
  - Dashboard loads and functions normally
  - 3D visualizer renders (WebGL support)
  - No console errors

- [ ] **Firefox** (v88+)
  - Dashboard loads and functions normally
  - WebSocket connections work
  - No console errors

- [ ] **Edge** (v90+)
  - Dashboard loads and functions normally
  - Performance acceptable

- [ ] **Safari** (v14+ on Mac/iOS)
  - Dashboard loads and functions normally
  - 3D visualizer renders if WebGL supported

### Phase 15: Post-Deployment Monitoring ✓

- [ ] **Set Up Error Monitoring**
  - If ERROR_REPORTING_URL configured in .env:
    - Verify errors sent to monitoring service
    - Test by triggering an error in console
  
- [ ] **Monitor Resource Usage**
  - Watch backend CPU usage (should be <5% idle)
  - Watch memory usage (should remain stable)
  - Watch database size (should not grow indefinitely)

- [ ] **Check Log Aggregation**
  - Backend logs accessible (Terminal 2 output)
  - Frontend errors captured (browser console)
  - Consider: Set up centralized logging for production

- [ ] **Performance Monitoring**
  - Track API response times
  - Monitor WebSocket connection stability
  - Watch for slow queries or timeouts

---

## Rapid Deployment Checklist (5-Minute Version)

Quick checklist for experienced teams:

```
☐ npm install && npm run build (succeeds)
☐ Ports 3000, 3001, 12345 available
☐ .env.local has ANTHROPIC_API_KEY
☐ npm run dev (Terminal 1)
☐ npm run server (Terminal 2)
☐ http://localhost:3000 loads (no errors)
☐ Overview tab: All 13 components render
☐ Portfolio tab: Data displays
☐ Chat works (ask "What's my portfolio?")
☐ Global Markets tab: Exchanges show
☐ Chaos visualizer: 3D renders
☐ curl http://localhost:3001/api/dashboard (200 OK)
☐ DevTools console: No red errors
☐ Page load: < 3 seconds
✓ READY FOR DEPLOYMENT
```

---

## Troubleshooting Guide

### Build Fails with "Cannot find module"
```bash
# Solution:
npm install
npm run build

# If still fails:
rm -r node_modules package-lock.json
npm install
npm run build
```

### "Port already in use" error
```bash
# Find process using port:
netstat -ano | findstr :3000

# Kill it:
taskkill /PID <PID> /F
# Or use different port:
PORT=3002 npm run dev
```

### Chat interface not responding
```bash
# Check API key:
cat .env.local | grep ANTHROPIC_API_KEY

# Verify format (should start with sk-ant-):
# If not: Invalid key, replace it

# Check network:
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Dashboard shows all mock data
```bash
# Symptoms: Portfolio values same every refresh, no real data
# Cause: API keys not configured or API rate limited

# Solution:
# 1. Check .env.local for market data API keys
# 2. Add ALPHA_VANTAGE_API_KEY if not present
# 3. Restart backend: npm run server
# 4. Wait 10 seconds for new data
```

### WebSocket connects then disconnects repeatedly
```bash
# Check backend logs for:
# - CORS errors
# - Port conflicts
# - Database issues

# Solution:
# 1. Verify CORS_ORIGINS in .env.local includes localhost:3000
# 2. Check port 12345 is free: netstat -ano | findstr :12345
# 3. Check backend database connection: npm run server logs
```

---

## Sign-Off

**Pre-Flight Checklist Completed By:** ________________  
**Date:** ________________  
**Time:** ________________  

**System Status:**
- ☐ Ready for Production Deployment
- ☐ Ready for Staging Deployment
- ☐ Needs Additional Testing
- ☐ Not Ready - Issues Found

**Issues Found (if any):**
```
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
```

**Action Items Before Deployment:**
```
☐ _____________________________________________________________
☐ _____________________________________________________________
☐ _____________________________________________________________
```

**Verified By:** ________________  
**Authorized For Deployment:** ________________  

---

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Status:** Ready for Use ✅
