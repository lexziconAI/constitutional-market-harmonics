const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/dashboard' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
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
          constitutionalScore: 0.87
        }
      }
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3002, '127.0.0.1', () => {
  console.log('🌀 API Server running on http://localhost:3002');
  console.log('📊 Serving portfolio data');
});