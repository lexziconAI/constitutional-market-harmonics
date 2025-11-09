-- Constitutional Market Harmonics Database Schema
-- SQLite 3.0+ compatible

-- Portfolio positions
CREATE TABLE IF NOT EXISTS portfolio_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  shares REAL NOT NULL,
  entry_price REAL NOT NULL,
  entry_value REAL NOT NULL,
  current_price REAL,
  current_value REAL,
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ticker)
);

-- Trade history
CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  action TEXT NOT NULL, -- 'buy', 'sell'
  shares REAL NOT NULL,
  price REAL NOT NULL,
  amount REAL NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  strategy TEXT, -- 'lorenz', 'chen', 'rossler', 'ensemble'
  constitutional_score REAL,
  notes TEXT
);

-- Constitutional company scores
CREATE TABLE IF NOT EXISTS constitutional_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT UNIQUE NOT NULL,
  company_name TEXT,
  overall_score REAL NOT NULL, -- 0.0 to 1.0
  ahimsa_score REAL, -- Non-harm
  satya_score REAL, -- Truthfulness
  asteya_score REAL, -- Non-stealing
  brahmacharya_score REAL, -- Self-discipline
  aparigraha_score REAL, -- Non-hoarding
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_sources TEXT, -- JSON array of sources
  assessment_notes TEXT
);

-- Market data cache
CREATE TABLE IF NOT EXISTS market_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  open_price REAL,
  high_price REAL,
  low_price REAL,
  close_price REAL,
  volume INTEGER,
  UNIQUE(ticker, timestamp)
);

-- Performance snapshots
CREATE TABLE IF NOT EXISTS performance_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  portfolio_value REAL NOT NULL,
  cash_balance REAL NOT NULL,
  total_capital REAL NOT NULL,
  roi REAL, -- Return on investment
  sharpe_ratio REAL,
  max_drawdown REAL,
  win_rate REAL,
  total_trades INTEGER,
  constitutional_alignment REAL,
  downstream_value REAL,
  combined_score REAL
);

-- Attractor states (for debugging/analysis)
CREATE TABLE IF NOT EXISTS attractor_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attractor_type TEXT NOT NULL, -- 'lorenz', 'chen', 'rossler'
  state_vector TEXT, -- JSON array of state values
  fitness_score REAL,
  constitutional_filter REAL,
  market_conditions TEXT -- JSON of market state
);

-- Strategy signals
CREATE TABLE IF NOT EXISTS strategy_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  strategy TEXT NOT NULL,
  signal_type TEXT NOT NULL, -- 'buy', 'sell', 'hold'
  ticker TEXT,
  confidence REAL, -- 0.0 to 1.0
  reasoning TEXT,
  market_state TEXT, -- JSON
  constitutional_context TEXT -- JSON
);

-- Counterfactual impact assessments
CREATE TABLE IF NOT EXISTS counterfactual_impacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ticker TEXT NOT NULL,
  paper_position REAL, -- $100K position
  scaled_position REAL, -- Hypothetical scaled position
  scale_factor REAL, -- e.g., 100 for $10M
  direct_impact REAL, -- Price impact percentage
  downstream_impact REAL, -- Broader market effects
  constitutional_signal REAL, -- Ethical signaling value
  assessment_data TEXT -- JSON with full analysis
);

-- System events and logs
CREATE TABLE IF NOT EXISTS system_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL, -- 'startup', 'shutdown', 'error', 'trade', 'sync'
  severity TEXT, -- 'info', 'warning', 'error', 'critical'
  message TEXT,
  details TEXT -- JSON with additional context
);

-- Configuration settings
CREATE TABLE IF NOT EXISTS configuration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance (all tables created above, so indexes can be created now)
CREATE INDEX IF NOT EXISTS idx_portfolio_ticker ON portfolio_positions(ticker);
CREATE INDEX IF NOT EXISTS idx_trades_ticker ON trades(ticker);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp);
CREATE INDEX IF NOT EXISTS idx_constitutional_ticker ON constitutional_scores(ticker);
CREATE INDEX IF NOT EXISTS idx_market_ticker_time ON market_data(ticker, timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_time ON performance_snapshots(timestamp);
CREATE INDEX IF NOT EXISTS idx_attractor_type_time ON attractor_states(attractor_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_signals_strategy_time ON strategy_signals(strategy, timestamp);
CREATE INDEX IF NOT EXISTS idx_impacts_ticker_time ON counterfactual_impacts(ticker, timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type_time ON system_events(event_type, timestamp);