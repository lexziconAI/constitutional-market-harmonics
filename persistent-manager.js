#!/usr/bin/env node
/**
 * 🔴 PERSISTENT DASHBOARD MANAGER
 * Keeps both backend and frontend servers running indefinitely
 * Auto-restarts on crash, port conflict, or error
 * Runs as Windows service or scheduled task
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const DASHBOARD_DIR = path.resolve(__dirname, '.');
const LOG_DIR = path.join(DASHBOARD_DIR, 'logs');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFile = path.join(LOG_DIR, `dashboard-${TIMESTAMP}.log`);

// Find npm and node paths
const isWindows = process.platform === 'win32';
const shell = isWindows ? 'cmd.exe' : '/bin/bash';

function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n');
}

class ServerManager {
  constructor(name, command, args, port) {
    this.name = name;
    this.command = command;
    this.args = args;
    this.port = port;
    this.process = null;
    this.restartCount = 0;
    this.maxRestarts = 999; // Unlimited restarts
    this.lastRestartTime = null;
  }

  start() {
    if (this.restartCount > 0) {
      log(`⏳ ${this.name}: Waiting 3 seconds before restart attempt ${this.restartCount + 1}...`, 'WAIT');
      return new Promise(resolve => setTimeout(() => this._doStart(resolve), 3000));
    }
    return this._doStart();
  }

  _doStart(resolve = () => {}) {
    log(`🚀 Starting ${this.name}...`, 'START');
    this.lastRestartTime = Date.now();

    // Use shell to properly resolve npx and npm on Windows
    let processArgs;
    if (process.platform === 'win32') {
      processArgs = ['/c', `${this.command} ${this.args.join(' ')}`];
      this.process = spawn('cmd.exe', processArgs, {
        cwd: DASHBOARD_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
      });
    } else {
      this.process = spawn(this.command, this.args, {
        cwd: DASHBOARD_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false
      });
    }

    this.process.stdout.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        log(`[${this.name}] ${message}`, 'OUTPUT');
      }
    });

    this.process.stderr.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        log(`[${this.name}] ${message}`, 'ERROR');
      }
    });

    this.process.on('error', (err) => {
      log(`❌ ${this.name} error: ${err.message}`, 'ERROR');
      this.restart();
    });

    this.process.on('exit', (code) => {
      if (code !== 0) {
        log(`❌ ${this.name} crashed with code ${code}`, 'CRASH');
        this.restart();
      } else {
        log(`⏹️  ${this.name} exited cleanly`, 'EXIT');
      }
    });

    log(`✅ ${this.name} process started (PID: ${this.process.pid})`, 'SUCCESS');
    this.restartCount++;
    resolve?.();
  }

  restart() {
    if (this.restartCount >= this.maxRestarts) {
      log(`⚠️  ${this.name}: Max restart attempts reached`, 'WARN');
      return;
    }
    log(`🔄 Restarting ${this.name}... (Attempt ${this.restartCount + 1})`, 'RESTART');
    this.start();
  }

  stop() {
    if (this.process) {
      log(`⏹️  Stopping ${this.name} (PID: ${this.process.pid})...`, 'STOP');
      this.process.kill('SIGTERM');
      this.process = null;
    }
  }
}

// Create server managers
const backendManager = new ServerManager(
  'BACKEND (port 12345)',
  'npx',
  ['tsx', 'server.ts'],
  12345
);

const frontendManager = new ServerManager(
  'FRONTEND (port 3001)',
  'npm',
  ['run', 'dev'],
  3001
);

async function startAllServers() {
  log('═══════════════════════════════════════════════════════════', 'BANNER');
  log('🌍 CONSTITUTIONAL MARKET HARMONICS DASHBOARD - PERSISTENT MODE', 'BANNER');
  log('═══════════════════════════════════════════════════════════', 'BANNER');
  log(`📁 Dashboard directory: ${DASHBOARD_DIR}`, 'INFO');
  log(`📝 Log file: ${logFile}`, 'INFO');
  log(`⏰ Start time: ${new Date().toISOString()}`, 'INFO');
  log('═══════════════════════════════════════════════════════════', 'BANNER');

  // Start both servers
  await backendManager.start();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between starts
  await frontendManager.start();

  log('✅ All servers started! Dashboard should be accessible at:', 'SUCCESS');
  log('   🌐 Frontend: http://localhost:3001', 'SUCCESS');
  log('   🔗 Backend API: http://localhost:12345', 'SUCCESS');
  log('   📊 WebSocket: ws://localhost:12345', 'SUCCESS');
}

// Graceful shutdown
process.on('SIGINT', () => {
  log('⚠️  Received SIGINT, shutting down gracefully...', 'SHUTDOWN');
  backendManager.stop();
  frontendManager.stop();
  log('✅ Dashboard manager stopped', 'SHUTDOWN');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('⚠️  Received SIGTERM, shutting down gracefully...', 'SHUTDOWN');
  backendManager.stop();
  frontendManager.stop();
  log('✅ Dashboard manager stopped', 'SHUTDOWN');
  process.exit(0);
});

// Health check every 30 seconds
setInterval(() => {
  const backendStatus = backendManager.process && !backendManager.process.killed ? '✅' : '❌';
  const frontendStatus = frontendManager.process && !frontendManager.process.killed ? '✅' : '❌';
  log(`🏥 Health check - Backend: ${backendStatus}, Frontend: ${frontendStatus}`, 'HEALTH');
}, 30000);

// Start everything
startAllServers().catch(err => {
  log(`Fatal error: ${err.message}`, 'FATAL');
  process.exit(1);
});
