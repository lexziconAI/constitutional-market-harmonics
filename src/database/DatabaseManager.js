/**
 * Constitutional Market Harmonics Database Manager
 * Handles SQLite database operations for the trading system
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor(databasePath = './market_harmonics.db') {
    this.databasePath = databasePath;
    this.db = null;
    this.initialized = false;
  }

  /**
   * Initialize database connection and schema
   */
  async initialize() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(this.databasePath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.databasePath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
          return;
        }

        console.log(`🗄️  Connected to SQLite database: ${this.databasePath}`);
        this._initializeSchema()
          .then(() => {
            this.initialized = true;
            resolve();
          })
          .catch(reject);
      });
    });
  }

  /**
   * Initialize database schema
   */
  async _initializeSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    return this.runTransaction(async () => {
      // Split schema into individual statements
      // Handle multi-line statements properly
      const statements = [];
      let currentStatement = '';
      let inMultiLineComment = false;

      const lines = schema.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and single-line comments
        if (!trimmedLine || trimmedLine.startsWith('--')) {
          continue;
        }

        // Handle multi-line comments
        if (trimmedLine.startsWith('/*')) {
          inMultiLineComment = true;
          continue;
        }
        if (trimmedLine.endsWith('*/')) {
          inMultiLineComment = false;
          continue;
        }
        if (inMultiLineComment) {
          continue;
        }

        currentStatement += line + '\n';

        // Check if statement ends with semicolon
        if (trimmedLine.endsWith(';')) {
          statements.push(currentStatement.trim());
          currentStatement = '';
        }
      }

      console.log(`📋 Processing ${statements.length} SQL statements`);

      for (const statement of statements) {
        if (statement.trim()) {
          await this.run(statement);
        }
      }

      console.log('✅ Database schema initialized successfully');
    });
  }

  /**
   * Run database transaction
   */
  async runTransaction(callback) {
    return new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(new Error(`Failed to begin transaction: ${err.message}`));
          return;
        }

        Promise.resolve(callback())
          .then(() => {
            this.db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                reject(new Error(`Failed to commit transaction: ${commitErr.message}`));
              } else {
                resolve();
              }
            });
          })
          .catch((error) => {
            this.db.run('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                console.error('Failed to rollback transaction:', rollbackErr);
              }
              reject(error);
            });
          });
      });
    });
  }

  /**
   * Run a single SQL statement
   */
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(new Error(`SQL execution failed: ${err.message}\nSQL: ${sql}`));
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Run a SELECT query and return all results
   */
  async getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(`Query failed: ${err.message}\nSQL: ${sql}`));
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Run a SELECT query and return first result
   */
  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(new Error(`Query failed: ${err.message}\nSQL: ${sql}`));
        } else {
          resolve(row);
        }
      });
    });
  }

  // ===== PORTFOLIO OPERATIONS =====

  /**
   * Get current portfolio positions
   */
  async getPortfolio() {
    const sql = 'SELECT * FROM portfolio_positions ORDER BY ticker';
    const positions = await this.getAll(sql);

    return positions.map(pos => ({
      ...pos,
      pnl: pos.current_value - pos.entry_value,
      pnl_percent: pos.entry_value > 0 ? ((pos.current_value - pos.entry_value) / pos.entry_value) * 100 : 0
    }));
  }

  /**
   * Update portfolio position
   */
  async updatePosition(ticker, shares, price, value) {
    const sql = `
      INSERT OR REPLACE INTO portfolio_positions
      (ticker, shares, entry_price, entry_value, current_price, current_value, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return await this.run(sql, [
      ticker,
      shares,
      price,
      value,
      price,
      value,
      new Date().toISOString()
    ]);
  }

  /**
   * Get position by ticker
   */
  async getPosition(ticker) {
    const sql = 'SELECT * FROM portfolio_positions WHERE ticker = ?';
    return await this.get(sql, [ticker]);
  }

  // ===== TRADE OPERATIONS =====

  /**
   * Log a trade
   */
  async logTrade(trade) {
    const sql = `
      INSERT INTO trades
      (ticker, action, shares, price, amount, strategy, constitutional_score, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return await this.run(sql, [
      trade.ticker,
      trade.action,
      trade.shares,
      trade.price,
      trade.amount,
      trade.strategy || 'ensemble',
      trade.constitutional_score || 0,
      trade.notes || ''
    ]);
  }

  /**
   * Get trade history
   */
  async getTradeHistory(limit = 100) {
    const sql = 'SELECT * FROM trades ORDER BY timestamp DESC LIMIT ?';
    return await this.getAll(sql, [limit]);
  }

  // ===== CONSTITUTIONAL SCORING =====

  /**
   * Save constitutional score for a company
   */
  async saveConstitutionalScore(score) {
    const sql = `
      INSERT OR REPLACE INTO constitutional_scores
      (ticker, company_name, overall_score, ahimsa_score, satya_score,
       asteya_score, brahmacharya_score, aparigraha_score, data_sources, assessment_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return await this.run(sql, [
      score.ticker,
      score.company_name || '',
      score.overall,
      score.breakdown?.ahimsa || 0,
      score.breakdown?.satya || 0,
      score.breakdown?.asteya || 0,
      score.breakdown?.brahmacharya || 0,
      score.breakdown?.aparigraha || 0,
      JSON.stringify(score.sources || []),
      score.notes || ''
    ]);
  }

  /**
   * Get constitutional score for a ticker
   */
  async getConstitutionalScore(ticker) {
    const sql = 'SELECT * FROM constitutional_scores WHERE ticker = ?';
    const score = await this.get(sql, [ticker]);

    if (!score) return null;

    return {
      ...score,
      breakdown: {
        ahimsa: score.ahimsa_score,
        satya: score.satya_score,
        asteya: score.asteya_score,
        brahmacharya: score.brahmacharya_score,
        aparigraha: score.aparigraha_score
      },
      sources: JSON.parse(score.data_sources || '[]')
    };
  }

  /**
   * Get all constitutional scores
   */
  async getAllConstitutionalScores() {
    const sql = 'SELECT * FROM constitutional_scores ORDER BY ticker';
    const scores = await this.getAll(sql);

    return scores.map(score => ({
      ticker: score.ticker,
      overall: score.overall_score,
      breakdown: {
        ahimsa: score.ahimsa_score,
        satya: score.satya_score,
        asteya: score.asteya_score,
        brahmacharya: score.brahmacharya_score,
        aparigraha: score.aparigraha_score
      }
    }));
  }

  // ===== MARKET DATA =====

  /**
   * Save market data
   */
  async saveMarketData(ticker, data) {
    const sql = `
      INSERT OR REPLACE INTO market_data
      (ticker, timestamp, open_price, high_price, low_price, close_price, volume)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return await this.run(sql, [
      ticker,
      data.timestamp || new Date().toISOString(),
      data.open,
      data.high,
      data.low,
      data.close,
      data.volume
    ]);
  }

  /**
   * Get latest market data for ticker
   */
  async getLatestMarketData(ticker) {
    const sql = 'SELECT * FROM market_data WHERE ticker = ? ORDER BY timestamp DESC LIMIT 1';
    return await this.get(sql, [ticker]);
  }

  // ===== PERFORMANCE TRACKING =====

  /**
   * Save performance snapshot
   */
  async savePerformanceSnapshot(performance) {
    const sql = `
      INSERT INTO performance_snapshots
      (portfolio_value, cash_balance, total_capital, roi, sharpe_ratio,
       max_drawdown, win_rate, total_trades, constitutional_alignment,
       downstream_value, combined_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return await this.run(sql, [
      performance.portfolio_value,
      performance.cash_balance,
      performance.total_capital,
      performance.roi,
      performance.sharpe_ratio,
      performance.max_drawdown,
      performance.win_rate,
      performance.total_trades,
      performance.constitutional_alignment,
      performance.downstream_value,
      performance.combined_score
    ]);
  }

  /**
   * Get performance history
   */
  async getPerformanceHistory(limit = 100) {
    const sql = 'SELECT * FROM performance_snapshots ORDER BY timestamp DESC LIMIT ?';
    return await this.getAll(sql, [limit]);
  }

  // ===== SYSTEM LOGGING =====

  /**
   * Log system event
   */
  async logEvent(eventType, severity, message, details = {}) {
    const sql = `
      INSERT INTO system_events
      (event_type, severity, message, details)
      VALUES (?, ?, ?, ?)
    `;

    return await this.run(sql, [
      eventType,
      severity,
      message,
      JSON.stringify(details)
    ]);
  }

  /**
   * Get system events
   */
  async getSystemEvents(limit = 50) {
    const sql = 'SELECT * FROM system_events ORDER BY timestamp DESC LIMIT ?';
    return await this.getAll(sql, [limit]);
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
        } else {
          console.log('💾 Database connection closed');
        }
      });
    }
  }
}

module.exports = DatabaseManager;