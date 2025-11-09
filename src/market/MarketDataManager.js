/**
 * Market Data Manager
 * Handles real-time market data integration with Alpha Vantage and Polygon.io APIs
 * Provides WebSocket streaming and REST API access for trading signals
 */

const axios = require('axios');
const WebSocket = require('ws');

class MarketDataManager {
  constructor(apiKeys = {}) {
    this.apiKeys = {
      alphaVantage: apiKeys.alphaVantage || process.env.ALPHA_VANTAGE_API_KEY,
      polygon: apiKeys.polygon || process.env.POLYGON_API_KEY
    };

    this.baseUrls = {
      alphaVantage: 'https://www.alphavantage.co/query',
      polygon: 'https://api.polygon.io'
    };

    this.webSocketConnections = new Map();
    this.marketData = new Map();
    this.subscriptions = new Set();
    this.updateCallbacks = [];

    // Rate limiting
    this.lastRequests = new Map();
    this.rateLimits = {
      alphaVantage: { requests: 5, window: 60000 }, // 5 requests per minute
      polygon: { requests: 5, window: 60000 }
    };

    // Data caching
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  /**
   * Initialize market data connections
   */
  async initialize() {
    try {
      // Test API connections
      await this.testConnections();

      // Initialize WebSocket connections for real-time data
      await this.initializeWebSockets();

      console.log('Market Data Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Market Data Manager:', error);
      throw error;
    }
  }

  /**
   * Test API connections
   */
  async testConnections() {
    const tests = [];

    // Test Alpha Vantage
    if (this.apiKeys.alphaVantage) {
      tests.push(this.testAlphaVantage());
    }

    // Test Polygon
    if (this.apiKeys.polygon) {
      tests.push(this.testPolygon());
    }

    await Promise.all(tests);
  }

  /**
   * Test Alpha Vantage connection
   */
  async testAlphaVantage() {
    try {
      const response = await this.makeRequest('alphaVantage', {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'AAPL',
        interval: '1min',
        outputsize: 'compact'
      });

      if (response.status === 200) {
        console.log('Alpha Vantage connection successful');
      }
    } catch (error) {
      console.warn('Alpha Vantage connection failed:', error.message);
    }
  }

  /**
   * Test Polygon connection
   */
  async testPolygon() {
    try {
      const response = await this.makeRequest('polygon', '/v2/aggs/ticker/AAPL/range/1/minute/20230101/20230102', 'GET', {}, false);
      if (response.status === 200) {
        console.log('Polygon connection successful');
      }
    } catch (error) {
      console.warn('Polygon connection failed:', error.message);
    }
  }

  /**
   * Initialize WebSocket connections
   */
  async initializeWebSockets() {
    if (this.apiKeys.polygon) {
      await this.initializePolygonWebSocket();
    }
  }

  /**
   * Initialize Polygon WebSocket for real-time data
   */
  async initializePolygonWebSocket() {
    const wsUrl = `wss://socket.polygon.io/stocks`;

    try {
      const ws = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.polygon}`
        }
      });

      ws.on('open', () => {
        console.log('Polygon WebSocket connected');
        this.webSocketConnections.set('polygon', ws);

        // Authenticate
        ws.send(JSON.stringify({
          action: 'auth',
          params: this.apiKeys.polygon
        }));
      });

      ws.on('message', (data) => {
        this.handlePolygonMessage(data);
      });

      ws.on('error', (error) => {
        console.error('Polygon WebSocket error:', error);
      });

      ws.on('close', () => {
        console.log('Polygon WebSocket closed');
        this.webSocketConnections.delete('polygon');
      });

    } catch (error) {
      console.error('Failed to initialize Polygon WebSocket:', error);
    }
  }

  /**
   * Handle Polygon WebSocket messages
   */
  handlePolygonMessage(data) {
    try {
      const message = JSON.parse(data.toString());

      if (message.ev === 'T') { // Trade message
        this.processTradeData(message);
      } else if (message.ev === 'AM') { // Aggregate minute
        this.processAggregateData(message);
      } else if (message.ev === 'status') {
        console.log('Polygon status:', message.message);
      }
    } catch (error) {
      console.error('Error processing Polygon message:', error);
    }
  }

  /**
   * Process trade data from WebSocket
   */
  processTradeData(trade) {
    const symbol = trade.sym;
    const price = trade.p;
    const volume = trade.s;
    const timestamp = trade.t;

    const marketData = this.marketData.get(symbol) || {
      symbol,
      trades: [],
      aggregates: [],
      lastUpdate: 0
    };

    marketData.trades.push({
      price,
      volume,
      timestamp,
      type: 'trade'
    });

    // Keep only recent trades
    if (marketData.trades.length > 100) {
      marketData.trades = marketData.trades.slice(-50);
    }

    marketData.lastUpdate = Date.now();
    this.marketData.set(symbol, marketData);

    // Notify subscribers
    this.notifySubscribers(symbol, marketData);
  }

  /**
   * Process aggregate data from WebSocket
   */
  processAggregateData(aggregate) {
    const symbol = aggregate.sym;
    const data = {
      open: aggregate.o,
      high: aggregate.h,
      low: aggregate.l,
      close: aggregate.c,
      volume: aggregate.v,
      timestamp: aggregate.s,
      type: 'aggregate'
    };

    const marketData = this.marketData.get(symbol) || {
      symbol,
      trades: [],
      aggregates: [],
      lastUpdate: 0
    };

    marketData.aggregates.push(data);

    // Keep only recent aggregates
    if (marketData.aggregates.length > 100) {
      marketData.aggregates = marketData.aggregates.slice(-50);
    }

    marketData.lastUpdate = Date.now();
    this.marketData.set(symbol, marketData);

    // Notify subscribers
    this.notifySubscribers(symbol, marketData);
  }

  /**
   * Notify subscribers of data updates
   */
  notifySubscribers(symbol, data) {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(symbol, data);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  /**
   * Subscribe to real-time market data
   */
  subscribeToSymbol(symbol) {
    if (this.subscriptions.has(symbol)) return;

    this.subscriptions.add(symbol);

    // Subscribe via WebSocket if available
    const polygonWs = this.webSocketConnections.get('polygon');
    if (polygonWs && polygonWs.readyState === WebSocket.OPEN) {
      polygonWs.send(JSON.stringify({
        action: 'subscribe',
        params: `T.${symbol},AM.${symbol}`
      }));
    }
  }

  /**
   * Unsubscribe from market data
   */
  unsubscribeFromSymbol(symbol) {
    this.subscriptions.delete(symbol);

    const polygonWs = this.webSocketConnections.get('polygon');
    if (polygonWs && polygonWs.readyState === WebSocket.OPEN) {
      polygonWs.send(JSON.stringify({
        action: 'unsubscribe',
        params: `T.${symbol},AM.${symbol}`
      }));
    }
  }

  /**
   * Add update callback
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  /**
   * Remove update callback
   */
  removeUpdateCallback(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Get historical market data
   */
  async getHistoricalData(symbol, timeframe = '1D', limit = 100) {
    const cacheKey = `historical_${symbol}_${timeframe}_${limit}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      let data;

      if (this.apiKeys.polygon) {
        data = await this.getPolygonHistoricalData(symbol, timeframe, limit);
      } else if (this.apiKeys.alphaVantage) {
        data = await this.getAlphaVantageHistoricalData(symbol, timeframe, limit);
      } else {
        throw new Error('No API keys configured for historical data');
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Failed to get historical data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get historical data from Polygon
   */
  async getPolygonHistoricalData(symbol, timeframe, limit) {
    const now = new Date();
    const past = new Date();

    // Calculate date range based on timeframe
    switch (timeframe) {
      case '1D':
        past.setDate(now.getDate() - limit);
        break;
      case '1H':
        past.setHours(now.getHours() - limit);
        break;
      case '1M':
        past.setMinutes(now.getMinutes() - limit);
        break;
      default:
        past.setDate(now.getDate() - limit);
    }

    const from = past.toISOString().split('T')[0];
    const to = now.toISOString().split('T')[0];

    const multiplier = timeframe === '1D' ? 1 : timeframe === '1H' ? 1 : 1;
    const timespan = timeframe === '1D' ? 'day' : timeframe === '1H' ? 'hour' : 'minute';

    const response = await this.makeRequest('polygon',
      `/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`,
      'GET', {}, false
    );

    if (response.status === 200 && response.data.results) {
      return response.data.results.map(bar => ({
        timestamp: bar.t,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v
      }));
    }

    return [];
  }

  /**
   * Get historical data from Alpha Vantage
   */
  async getAlphaVantageHistoricalData(symbol, timeframe, limit) {
    const interval = timeframe === '1D' ? 'daily' : timeframe === '1H' ? '60min' : '1min';
    const outputsize = limit > 100 ? 'full' : 'compact';

    const response = await this.makeRequest('alphaVantage', {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol.toUpperCase(),
      interval: interval,
      outputsize: outputsize
    });

    if (response.status === 200 && response.data[`Time Series (${interval})`]) {
      const timeSeries = response.data[`Time Series (${interval})`];
      return Object.entries(timeSeries)
        .slice(0, limit)
        .map(([timestamp, data]) => ({
          timestamp: new Date(timestamp).getTime(),
          open: parseFloat(data['1. open']),
          high: parseFloat(data['2. high']),
          low: parseFloat(data['3. low']),
          close: parseFloat(data['4. close']),
          volume: parseFloat(data['5. volume'])
        }));
    }

    return [];
  }

  /**
   * Get current market data for symbol
   */
  getCurrentData(symbol) {
    return this.marketData.get(symbol) || null;
  }

  /**
   * Get market snapshot for multiple symbols
   */
  async getMarketSnapshot(symbols) {
    const snapshot = {};

    for (const symbol of symbols) {
      try {
        const data = this.getCurrentData(symbol);
        if (data) {
          snapshot[symbol] = data;
        } else {
          // Try to fetch historical data as fallback
          const historical = await this.getHistoricalData(symbol, '1D', 1);
          if (historical.length > 0) {
            snapshot[symbol] = {
              symbol,
              lastPrice: historical[0].close,
              lastUpdate: historical[0].timestamp,
              type: 'historical'
            };
          }
        }
      } catch (error) {
        console.error(`Failed to get data for ${symbol}:`, error);
      }
    }

    return snapshot;
  }

  /**
   * Make rate-limited API request
   */
  async makeRequest(provider, endpoint, method = 'GET', params = {}, isAlphaVantage = true) {
    // Rate limiting check
    const now = Date.now();
    const lastRequest = this.lastRequests.get(provider) || 0;
    const limit = this.rateLimits[provider];

    if (now - lastRequest < limit.window / limit.requests) {
      throw new Error(`Rate limit exceeded for ${provider}`);
    }

    this.lastRequests.set(provider, now);

    const config = {
      method,
      url: isAlphaVantage ? this.baseUrls[provider] : `${this.baseUrls[provider]}${endpoint}`,
      timeout: 10000
    };

    if (isAlphaVantage) {
      config.params = {
        apikey: this.apiKeys[provider],
        ...params
      };
    } else {
      config.headers = {
        'Authorization': `Bearer ${this.apiKeys[provider]}`
      };
      if (method === 'GET') {
        config.params = params;
      } else {
        config.data = params;
      }
    }

    return axios(config);
  }

  /**
   * Clean up connections
   */
  cleanup() {
    this.webSocketConnections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    this.webSocketConnections.clear();
    this.marketData.clear();
    this.subscriptions.clear();
    this.updateCallbacks = [];
    this.cache.clear();
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      alphaVantage: {
        configured: !!this.apiKeys.alphaVantage,
        connected: true // REST API, always "connected"
      },
      polygon: {
        configured: !!this.apiKeys.polygon,
        websocketConnected: this.webSocketConnections.get('polygon')?.readyState === WebSocket.OPEN,
        subscriptions: Array.from(this.subscriptions)
      },
      activeSymbols: Array.from(this.marketData.keys()),
      cacheSize: this.cache.size
    };
  }
}

module.exports = MarketDataManager;