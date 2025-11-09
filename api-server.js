#!/usr/bin/env node

/**
 * CONSTITUTIONAL MARKET HARMONICS - Backend API Server (PURE JavaScript)
 * Converted from TypeScript to eliminate tsx issues
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);
const HOST = process.env.HOST || '127.0.0.1';

console.log(`[INFO] PORT=${PORT}, HOST=${HOST}`);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3002', 'http://127.0.0.1:3002'],
  credentials: true
}));
app.use(express.json());

// Socket.IO setup
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3002', 'http://127.0.0.1:3002'],
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
      volatility: 0.0245
    }
  }
};

// API Routes
app.get('/api/dashboard', (req, res) => {
  res.json(mockDashboard);
});

app.get('/api/global-sentiment', (req, res) => {
  res.json({
    success: true,
    data: { sentiment: 0.67, bullish: 0.71, bearish: 0.29, timestamp: new Date().toISOString() }
  });
});

app.get('/api/cross-market-correlations', (req, res) => {
  res.json({
    success: true,
    data: { crypto_equity: 0.72, equity_bonds: -0.45, crypto_forex: 0.58, timestamp: new Date().toISOString() }
  });
});

app.get('/api/live/news/:symbol', (req, res) => {
  res.json({
    success: true,
    data: [
      { headline: 'Market Update', source: 'Reuters', timestamp: new Date().toISOString() }
    ]
  });
});

app.get('/api/chaos', (req, res) => {
  res.json({
    success: true,
    data: { constitutionalScore: 0.87, timestamp: new Date().toISOString() }
  });
});

app.get('/api/chat', (req, res) => {
  res.json({ success: true, data: 'Chat endpoint', timestamp: new Date().toISOString() });
});

app.post('/api/chat', (req, res) => {
  res.json({ success: true, data: 'Message received', timestamp: new Date().toISOString() });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`[IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[IO] Client disconnected: ${socket.id}`);
  });
});

// Error handlers
server.on('error', (err) => {
  console.error(`[ERROR] Server error:`, err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use!`);
    process.exit(1);
  }
});

server.on('clientError', (err, socket) => {
  console.error(`[ERROR] Client error:`, err.message);
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`\n✅ ═══════════════════════════════════════════════════════`);
  console.log(`✅ CONSTITUTIONAL MARKET HARMONICS - API Server`);
  console.log(`✅ ═══════════════════════════════════════════════════════`);
  console.log(`✅ Status: LISTENING AND ACCEPTING CONNECTIONS`);
  console.log(`✅ Address: ${addr.address}`);
  console.log(`✅ Port: ${addr.port}`);
  console.log(`✅ Family: ${addr.family}`);
  console.log(`✅ ═══════════════════════════════════════════════════════\n`);
  
  console.log(`✅ Endpoints Available:`);
  console.log(`   GET  /api/dashboard`);
  console.log(`   GET  /api/global-sentiment`);
  console.log(`   GET  /api/cross-market-correlations`);
  console.log(`   GET  /api/live/news/:symbol`);
  console.log(`   GET  /api/chaos`);
  console.log(`   GET  /api/chat`);
  console.log(`   POST /api/chat`);
  console.log(`   WebSocket: ws://localhost:${PORT}\n`);
});

// Start server
console.log(`[INFO] Starting server.listen(${PORT}, '${HOST}')...`);
server.listen(PORT, HOST);

console.log(`[INFO] Server.listen() returned, process continuing...\n`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`\n[SHUTDOWN] Received SIGTERM, gracefully shutting down...`);
  server.close(() => {
    console.log(`[SHUTDOWN] Server closed`);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log(`\n[SHUTDOWN] Received SIGINT, gracefully shutting down...`);
  server.close(() => {
    console.log(`[SHUTDOWN] Server closed`);
    process.exit(0);
  });
});

// Prevent crash on unhandled errors
process.on('uncaughtException', (error) => {
  console.error(`[UNCAUGHT] Exception:`, error);
});

process.on('unhandledRejection', (reason) => {
  console.error(`[UNHANDLED] Rejection:`, reason);
});
