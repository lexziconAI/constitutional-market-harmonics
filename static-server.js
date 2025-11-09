const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for API calls
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock dashboard data (same as API server)
const getMockDashboardData = () => ({
  portfolio: {
    positions: [
      { symbol: 'MSFT', quantity: 150, avgPrice: 375.42, value: 56313, weight: 0.25, constitutionalScore: 0.82 },
      { symbol: 'AAPL', quantity: 200, avgPrice: 175.25, value: 35050, weight: 0.2, constitutionalScore: 0.75 },
      { symbol: 'GOOGL', quantity: 80, avgPrice: 135.5, value: 10840, weight: 0.18, constitutionalScore: 0.88 },
      { symbol: 'TSLA', quantity: 120, avgPrice: 245.8, value: 29496, weight: 0.15, constitutionalScore: 0.65 },
      { symbol: 'NVDA', quantity: 90, avgPrice: 875.3, value: 78777, weight: 0.12, constitutionalScore: 0.72 }
    ],
    cash: 234567,
    totalValue: 1045231
  },
  performance: {
    roi: 0.0452,
    sharpe: 1.85,
    constitutionalScore: 0.847,
    fractalLoveScore: 0.0383,
    history: []
  },
  chaosSignals: {
    lorenz: { state: [1, 2, 3], signal: 0.65, confidence: 0.78 },
    chen: { state: [4, 5, 6], signal: 0.72, confidence: 0.82 },
    rossler: { state: [7, 8, 9], signal: 0.58, confidence: 0.65 }
  },
  recentTrades: [
    { id: 1, symbol: 'MSFT', action: 'BUY', size: 100, price: 375.42, timestamp: new Date().toISOString(), reasoning: 'Lorenz signal', paperTrade: true }
  ],
  systemHealth: {
    status: 'LIVE',
    uptime: 86400,
    errors: 0,
    lastUpdate: new Date().toISOString()
  }
});

// API endpoints
app.get('/api/dashboard', (req, res) => {
  res.json(getMockDashboardData());
});

app.get('/api/portfolio', (req, res) => {
  res.json(getMockDashboardData().portfolio);
});

app.get('/api/performance', (req, res) => {
  res.json(getMockDashboardData().performance);
});

app.get('/api/trades', (req, res) => {
  res.json(getMockDashboardData().recentTrades);
});

app.get('/api/chaos', (req, res) => {
  res.json(getMockDashboardData().chaosSignals);
});

app.get('/api/constitutional', (req, res) => {
  res.json({ score: getMockDashboardData().performance.constitutionalScore });
});

app.get('/api/risk', (req, res) => {
  res.json({ status: 'LOW', lastUpdate: new Date().toISOString() });
});

// Serve the main dashboard HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Constitutional Market Harmonics Dashboard Server`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/dashboard`);
  console.log(`✅ Server ready and listening on all interfaces`);
});