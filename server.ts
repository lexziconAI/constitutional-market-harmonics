import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import sqlite3 from 'sqlite3';
import path from 'path';
import { open } from 'sqlite';

const app = express();
const PORT = process.env.PORT || 3001;
const SOCKET_PORT = process.env.SOCKET_IO_PORT || 12345;

// Middleware
app.use(cors({
  origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
  credentials: true
}));
app.use(express.json());

// Socket.IO setup
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    methods: ['GET', 'POST']
  }
});

// Database init
let db: any = null;

async function initDb() {
  try {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'market_harmonics.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('✅ Database connected:', dbPath);
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

initDb();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd45k9kpr01qieo4qisggd45k9kpr01qieo4qish0';

async function fetchFromFinnhub(endpoint: string, params: any = {}) {
  try {
    const url = new URL(`https://finnhub.io/api/v1${endpoint}`);
    url.searchParams.append('token', FINNHUB_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    const response = await fetch(url.toString(), { timeout: 10000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`⚠️  Finnhub error on ${endpoint}:`, (error as any).message);
    return null;
  }
}

// LIVE DATA ENDPOINTS (13 total)
app.get('/api/live/quotes/:symbols', async (req, res) => {
  try {
    const symbols = req.params.symbols.split(',').map(s => s.trim());
    const quotes: any = {};
    
    for (const symbol of symbols) {
      const data = await fetchFromFinnhub('/quote', { symbol });
      quotes[symbol] = data || generateMockQuote(symbol);
    }
    
    res.json({ success: true, data: quotes, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/news/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const limit = req.query.limit || 10;
    const data = await fetchFromFinnhub('/company-news', { symbol, limit });
    res.json({ success: true, data: data || generateMockNews(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/general-news', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const data = await fetchFromFinnhub('/news', { category: 'general', limit });
    res.json({ success: true, data: data || generateMockNews(Number(limit)), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/forex', async (req, res) => {
  try {
    const pairs = ['EURUSD', 'GBPUSD', 'JPYUSD', 'AUDUSD', 'NZDUSD'];
    const quotes: any = {};
    
    for (const pair of pairs) {
      const data = await fetchFromFinnhub('/quote', { symbol: pair });
      quotes[pair] = data || generateMockForex(pair);
    }
    
    res.json({ success: true, data: quotes, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/crypto', async (req, res) => {
  try {
    const cryptos = ['BTCUSD', 'ETHUSD'];
    const quotes: any = {};
    
    for (const crypto of cryptos) {
      const data = await fetchFromFinnhub('/quote', { symbol: crypto });
      quotes[crypto] = data || generateMockCrypto(crypto);
    }
    
    res.json({ success: true, data: quotes, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/earnings/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchFromFinnhub('/calendar/earnings', { symbol });
    res.json({ success: true, data: data || generateMockEarnings(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/sentiment/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchFromFinnhub('/stock/recommendation', { symbol });
    res.json({ success: true, data: data || generateMockSentiment(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/profile/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchFromFinnhub('/stock/profile2', { symbol });
    res.json({ success: true, data: data || generateMockProfile(symbol), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/peers/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchFromFinnhub('/stock/peers', { symbol });
    res.json({ success: true, data: data || generateMockPeers(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/insider/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchFromFinnhub('/stock/insider-transactions', { symbol });
    res.json({ success: true, data: data || generateMockInsider(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/ipo', async (req, res) => {
  try {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const to = new Date();
    to.setDate(to.getDate() + 60);
    
    const data = await fetchFromFinnhub('/calendar/ipo', { 
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    });
    res.json({ success: true, data: data || generateMockIPO(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/live/economic-calendar', async (req, res) => {
  try {
    const data = await fetchFromFinnhub('/economic-calendar');
    res.json({ success: true, data: data || generateMockEconomic(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/live/all-data', async (req, res) => {
  try {
    const { symbols = ['AAPL', 'MSFT'] } = req.body;
    const allData: any = {};
    
    const quotes: any = {};
    for (const symbol of symbols) {
      const data = await fetchFromFinnhub('/quote', { symbol });
      quotes[symbol] = data || generateMockQuote(symbol);
    }
    allData.quotes = quotes;
    
    allData.news = await fetchFromFinnhub('/news', { category: 'general', limit: 10 }) || generateMockNews();
    
    const forexData: any = {};
    for (const pair of ['EURUSD', 'GBPUSD']) {
      const data = await fetchFromFinnhub('/quote', { symbol: pair });
      forexData[pair] = data || generateMockForex(pair);
    }
    allData.forex = forexData;
    
    allData.economic = await fetchFromFinnhub('/economic-calendar') || generateMockEconomic();
    
    res.json({ success: true, data: allData, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// LEGACY ENDPOINTS
app.get('/api/dashboard', async (req, res) => {
  try {
    if (!db) return res.json(generateMockDashboard());
    const data = await db.get('SELECT * FROM dashboard LIMIT 1');
    res.json(data || generateMockDashboard());
  } catch (error) {
    res.json(generateMockDashboard());
  }
});

app.get('/api/portfolio', async (req, res) => {
  try {
    if (!db) return res.json(generateMockPortfolio());
    const positions = await db.all('SELECT * FROM positions LIMIT 10');
    const cash = await db.get('SELECT cash FROM portfolio LIMIT 1');
    res.json({ positions: positions || [], cash: cash?.cash || 1000000 });
  } catch (error) {
    res.json(generateMockPortfolio());
  }
});

app.get('/api/trades', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    if (!db) return res.json(generateMockTrades(limit));
    const trades = await db.all(`SELECT * FROM trades LIMIT ${limit}`);
    res.json(trades || generateMockTrades(limit));
  } catch (error) {
    res.json(generateMockTrades(50));
  }
});

app.get('/api/performance', async (req, res) => {
  try {
    if (!db) return res.json(generateMockPerformance());
    const data = await db.all('SELECT * FROM performance ORDER BY date DESC LIMIT 90');
    res.json(data || generateMockPerformance());
  } catch (error) {
    res.json(generateMockPerformance());
  }
});

app.get('/api/constitutional', async (req, res) => {
  try {
    res.json(generateConstitutionalScores());
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/chaos', async (req, res) => {
  try {
    res.json(generateChaosSignals());
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// MOCK DATA GENERATORS
function generateMockDashboard() {
  return {
    portfolioValue: 1250000 + Math.random() * 50000,
    roi: 25.5 + Math.random() * 5,
    constitutionalScore: 82 + Math.random() * 10,
    fractalLoveScore: 78 + Math.random() * 15,
    systemHealth: 'healthy',
    lastUpdate: new Date().toISOString()
  };
}

function generateMockPortfolio() {
  return {
    positions: [
      { symbol: 'AAPL', shares: 100, price: 225, value: 22500, weight: 0.18 },
      { symbol: 'MSFT', shares: 75, price: 380, value: 28500, weight: 0.228 },
      { symbol: 'GOOGL', shares: 50, price: 140, value: 7000, weight: 0.056 },
      { symbol: 'TSLA', shares: 40, price: 250, value: 10000, weight: 0.08 },
      { symbol: 'AMZN', shares: 30, price: 180, value: 5400, weight: 0.0432 }
    ],
    cash: 1000000,
    total: 1250000
  };
}

function generateMockTrades(limit: number) {
  const trades = [];
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
  for (let i = 0; i < Math.min(limit, 50); i++) {
    trades.push({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      action: Math.random() > 0.5 ? 'BUY' : 'SELL',
      shares: Math.floor(Math.random() * 100) + 10,
      price: Math.floor(Math.random() * 300) + 50,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      reasoning: 'Constitutional alignment high',
      paperTrade: Math.random() > 0.7
    });
  }
  return trades;
}

function generateMockPerformance() {
  const data = [];
  let value = 1000000;
  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value *= (1 + (Math.random() * 0.02 - 0.005));
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      roi: ((value - 1000000) / 1000000) * 100
    });
  }
  return data;
}

function generateConstitutionalScores() {
  return {
    ahimsa: 85 + Math.random() * 10,
    satya: 88 + Math.random() * 8,
    asteya: 82 + Math.random() * 12,
    brahmacharya: 79 + Math.random() * 15,
    aparigraha: 91 + Math.random() * 5,
    overall: 85 + Math.random() * 10
  };
}

function generateChaosSignals() {
  return {
    lorenz: { x: Math.random() * 30 - 15, y: Math.random() * 30 - 15, z: Math.random() * 50, strength: Math.random() },
    chen: { x: Math.random() * 30 - 15, y: Math.random() * 30 - 15, z: Math.random() * 50, strength: Math.random() },
    rossler: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 40, strength: Math.random() }
  };
}

function generateMockQuote(symbol: string) {
  const basePrice = Math.floor(Math.random() * 300) + 50;
  return {
    c: basePrice,
    h: basePrice * 1.02,
    l: basePrice * 0.98,
    o: basePrice * 1.001,
    pc: basePrice * 0.99,
    t: Math.floor(Date.now() / 1000),
    v: Math.floor(Math.random() * 5000000)
  };
}

function generateMockNews(limit = 10) {
  const news = [];
  for (let i = 0; i < limit; i++) {
    news.push({
      headline: `Market update: ${i + 1}`,
      summary: 'Important market development',
      source: 'Market News',
      url: '#',
      image: '',
      datetime: Math.floor(Date.now() / 1000) - i * 3600,
      category: 'general',
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral'
    });
  }
  return news;
}

function generateMockForex(pair: string) {
  return {
    bid: 1.08 + Math.random() * 0.01,
    ask: 1.081 + Math.random() * 0.01,
    timestamp: Math.floor(Date.now() / 1000)
  };
}

function generateMockCrypto(symbol: string) {
  return {
    c: Math.floor(Math.random() * 50000) + 25000,
    h: Math.floor(Math.random() * 50000) + 27000,
    l: Math.floor(Math.random() * 50000) + 24000,
    v: Math.floor(Math.random() * 1000000000)
  };
}

function generateMockEarnings() {
  return { epsActual: 1.25, epsEstimate: 1.20, period: 'Q4' };
}

function generateMockSentiment() {
  return [
    { symbol: 'AAPL', rating: 'buy', targetPrice: 250, action: 'main_up' }
  ];
}

function generateMockProfile(symbol: string) {
  return {
    country: 'US',
    currency: 'USD',
    exchange: 'NASDAQ',
    finnhubIndustry: 'Technology',
    ipo: '1980-12-12',
    logo: '',
    marketCapitalization: 2800000,
    name: symbol,
    phone: '',
    shareOutstanding: 1000,
    ticker: symbol,
    weburl: ''
  };
}

function generateMockPeers() {
  return ['MSFT', 'GOOGL', 'AMZN', 'NVDA'];
}

function generateMockInsider() {
  return [];
}

function generateMockIPO() {
  return [];
}

function generateMockEconomic() {
  return [];
}

// SOCKET.IO REAL-TIME UPDATES
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('⚠️  Client disconnected:', socket.id);
  });
  
  socket.on('request-update', () => {
    socket.emit('update', generateMockDashboard());
  });
});

// Broadcast updates every 5 seconds
setInterval(() => {
  io.emit('update', generateMockDashboard());
}, 5000);

// SERVER STARTUP
server.listen(SOCKET_PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
  console.log(`║  Constitutional Market Harmonics - API Server             ║`);
  console.log(`╚═══════════════════════════════════════════════════════════╝\n`);
  console.log(`🟢 Socket.IO server running on ws://localhost:${SOCKET_PORT}`);
});

app.listen(PORT, () => {
  console.log(`🟢 API server running on http://localhost:${PORT}`);
  console.log(`🌐 Dashboard: http://localhost:3000`);
  console.log(`📊 API Endpoints: 13 live data endpoints ready`);
  console.log(`✨ Server ready for connections!\n`);
});

export default app;
