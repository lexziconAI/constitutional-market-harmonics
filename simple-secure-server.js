require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'axiom-x-secure-jwt-secret-2025';
const DEV_PASSWORD = process.env.DEV_PASSWORD || 'fractal2025';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (!password || password !== DEV_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    { user: 'local-dev', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: { id: 'local-dev', role: 'admin' },
    expiresIn: '24h'
  });
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
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
        constitutionalScore: 0.87
      }
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'development',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log('🔐 Constitutional Market Harmonics - Secure API Server');
  console.log(`✅ Running on http://127.0.0.1:${PORT}`);
  console.log('💚 Fractal Love: Profit + Ethics + Security');
  console.log('🔑 Authentication: JWT-based');
  console.log('🛡️ API Keys: Server-side only (never exposed to client)');
  console.log('📊 Dashboard: Open dashboard_REAL.html in browser');
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/auth/login - Login (password: fractal2025)');
  console.log('  GET  /api/dashboard - Portfolio data (requires auth)');
  console.log('  GET  /api/health - Health check');
});