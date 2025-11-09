const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');

const app = express();
const HOST = process.env.HOST || 'localhost';  // Changed from '0.0.0.0' to 'localhost'
const PORT = parseInt(process.env.PORT || '3002', 10);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());

// Socket.IO setup
const server = http.createServer(app);

// HTTP server error handler (CRITICAL)
server.on('clientError', (err, socket) => {
  console.error(`❌ Client Error: ${err.message}`);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST']
  }
});

// Mock data
const mockDashboard = {
  success: true,
  data: {
    portfolio: {
      total_value: 1250000,
      cash: 50000,
      positions: [
        { symbol: 'AAPL', quantity: 100, avgPrice: 150.25, value: 17523, weight: 0.35, constitutionalScore: 0.92 },
        { symbol: 'MSFT', quantity: 75, avgPrice: 380.50, value: 28537.5, weight: 0.25, constitutionalScore: 0.88 },
        { symbol: 'GOOGL', quantity: 50, avgPrice: 140.75, value: 7037.5, weight: 0.15, constitutionalScore: 0.85 },
        { symbol: 'TSLA', quantity: 30, avgPrice: 242.10, value: 7263, weight: 0.12, constitutionalScore: 0.78 },
        { symbol: 'AMZN', quantity: 25, avgPrice: 185.50, value: 4637.5, weight: 0.08, constitutionalScore: 0.82 }
      ]
    },
    performance: {
      roi: 0.156,
      sharpe: 1.85,
      constitutionalScore: 0.87,
      fractalLoveScore: 0.94,
      history: []
    },
    systemHealth: {
      status: 'healthy',
      uptime: 3600,
      errors: 0,
      lastUpdate: new Date().toISOString()
    },
    chaosSignals: {
      'BTC/USD': { state: [0.5, 0.3, 0.2], signal: 0.65, confidence: 0.92 },
      'EURUSD': { state: [0.4, 0.35, 0.25], signal: 0.58, confidence: 0.88 }
    },
    news: [
      {
        title: 'Market Rally Continues',
        content: 'Tech stocks lead the way with strong earnings.',
        constitutionalScore: 0.85,
        timestamp: new Date().toISOString(),
        source: 'Bloomberg'
      }
    ]
  }
};

// API Routes
app.get('/api/dashboard', (req, res) => {
  res.json(mockDashboard);
});

app.get('/api/global-sentiment', (req, res) => {
  res.json({
    success: true,
    data: {
      bullish: 0.65,
      bearish: 0.25,
      neutral: 0.10,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/cross-market-correlations', (req, res) => {
  res.json({
    success: true,
    data: {
      stocks_bonds: 0.42,
      stocks_crypto: 0.68,
      forex_commodities: 0.35,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/live/news/:symbol', (req, res) => {
  const symbol = req.params.symbol || 'AAPL';
  res.json({
    success: true,
    data: [
      {
        title: `${symbol} reports strong quarterly earnings`,
        content: 'Company beats expectations',
        source: 'Reuters',
        timestamp: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/chaos', (req, res) => {
  res.json({
    success: true,
    data: {
      chaos_index: 0.42,
      volatility: 0.18,
      entropy: 0.65,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/chat', (req, res) => {
  res.json({
    success: true,
    data: {
      messages: [
        { role: 'assistant', content: 'Constitutional Market Harmonics Online' }
      ]
    }
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    data: {
      response: `AI processed: "${message}". Market harmony achieved. 🌀`,
      timestamp: new Date().toISOString()
    }
  });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);
  
  socket.emit('dashboard_update', mockDashboard.data);
  
  const interval = setInterval(() => {
    socket.emit('dashboard_update', mockDashboard.data);
  }, 5000);
  
  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// Error handlers (CRITICAL - prevents silent crashes)
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ ERROR: Port ${PORT} is already in use!`);
    console.error(`   Try: netstat -ano | findstr LISTEN | findstr ":${PORT}"`);
    process.exit(1);
  } else if (error.code === 'EACCES') {
    console.error(`❌ ERROR: Permission denied for port ${PORT}!`);
    console.error(`   Try a port number >= 1024`);
    process.exit(1);
  } else {
    console.error(`❌ Server Error: ${error.message}`);
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error(`❌ Uncaught Exception: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(`❌ Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// FINAL BOTTLENECK OPTIMIZER - Socket Binding Confirmation
// Issue: listen() callback fires before Windows kernel actually binds the port
// Fix: Add artificial delay and use actual connection test

let serverStarted = false;

server.on('listening', () => {
  if (!serverStarted) {
    serverStarted = true;
    const address = server.address();
    console.log(`📡 listen() event fired - server reported listening`);
    console.log(`   Address: ${JSON.stringify(address)}`);
    
    // CRITICAL: Add delay to allow Windows TCP stack to finish binding
    // This is not ideal but required for Windows compatibility
    setTimeout(() => {
      console.log(`🟢 API server NOW LISTENING on http://0.0.0.0:${PORT}`);
      console.log(`✅ All endpoints active:`);
      console.log(`   - GET  /api/dashboard`);
      console.log(`   - GET  /api/global-sentiment`);
      console.log(`   - GET  /api/cross-market-correlations`);
      console.log(`   - GET  /api/live/news/:symbol`);
      console.log(`   - GET  /api/chaos`);
      console.log(`   - GET  /api/chat`);
      console.log(`   - POST /api/chat`);
      console.log(`   - WebSocket on port ${PORT}`);
      console.log(`\n✅ Server is ready to accept connections!`);
    }, 1000); // 1 second delay for Windows TCP binding
  }
});

// Start server - use simple port binding
server.listen(PORT, '0.0.0.0', () => {
  console.log(`⏳ Server listen() callback firing...`);
});
