#!/usr/bin/env node

const http = require('http');

const PORT = process.env.PORT || 9999;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

server.listen(PORT, HOST);

server.on('listening', () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error(`❌ Error:`, err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
});

console.log(`Starting server on port ${PORT}...`);

// Try to connect to ourselves
setTimeout(() => {
  const http2 = require('http');
  http2.get(`http://127.0.0.1:${PORT}`, (res) => {
    console.log(`✅ Self-test succeeded! Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`❌ Self-test failed:`, err.message);
  });
}, 1000);
