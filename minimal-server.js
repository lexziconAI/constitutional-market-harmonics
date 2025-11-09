#!/usr/bin/env node

/**
 * ABSOLUTE MINIMAL TEST SERVER
 * No error handlers, no middleware, just pure Node.js http.createServer
 */

const http = require('http');

const PORT = 3002;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }));
});

console.log(`[INFO] Creating server...`);

server.on('error', (err) => {
  console.error(`[ERROR] Server error:`, err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use!`);
  }
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`[SUCCESS] Server listening on ${addr.address}:${addr.port}`);
});

server.on('clientError', (err, socket) => {
  console.error(`[ERROR] Client error:`, err.message);
});

console.log(`[INFO] Calling server.listen(${PORT}, '${HOST}')...`);

server.listen(PORT, HOST, () => {
  console.log(`[CALLBACK] listen() callback executed`);
});

console.log(`[INFO] listen() call returned, process continuing...`);

// Keep process alive
setInterval(() => {
  console.log(`[HEARTBEAT] Server process alive, checking netstat...`);
}, 5000);
