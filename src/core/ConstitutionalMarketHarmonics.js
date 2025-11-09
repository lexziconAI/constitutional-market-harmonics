/**
 * Constitutional Market Harmonics
 * Main orchestrator for the chaos-theoretic trading system
 * Optimizes ROI × Constitutional Impact using strange attractors
 */

const DatabaseManager = require('../database/DatabaseManager');
const ConstitutionalScorer = require('../constitutional/ConstitutionalScorer');
const AttractorManager = require('../attractors/AttractorManager');
const MarketDataManager = require('../market/MarketDataManager');
const CounterfactualImpactModeler = require('../strategies/CounterfactualImpactModeler');
const DualMetricsTracker = require('./DualMetricsTracker');

class ConstitutionalMarketHarmonics {
  constructor(config = {}) {
    this.config = {
      portfolioId: 'constitutional_portfolio',
      basePositionSize: 100000, // $100K
      targetPositionSize: 10000000, // $10M
      updateInterval: 60000, // 1 minute
      paperTrading: true,
      ...config
    };

    this.isRunning = false;
    this.lastUpdate = 0;
    this.portfolio = {
      positions: [],
      cash: 1000000, // $1M starting capital
      totalValue: 1000000
    };

    // Initialize components
    this.initializeComponents();
  }

  /**
   * Initialize all system components
   */
  async initializeComponents() {
    try {
      // Initialize database
      this.db = new DatabaseManager();

      // Initialize constitutional scorer
      this.constitutionalScorer = new ConstitutionalScorer();

      // Initialize attractor manager
      this.attractorManager = new AttractorManager();

      // Initialize market data manager
      this.marketDataManager = new MarketDataManager(this.config.apiKeys);

      // Initialize counterfactual impact modeler
      this.impactModeler = new CounterfactualImpactModeler(this.db);

      // Initialize dual metrics tracker
      this.metricsTracker = new DualMetricsTracker(this.db, this.constitutionalScorer);

      // Initialize attractors
      this.attractorManager.initializeAttractors();

      // Initialize market data connections
      await this.marketDataManager.initialize();

      console.log('Constitutional Market Harmonics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize system components:', error);
      throw error;
    }
  }

  /**
   * Start the trading system
   */
  async start() {
    if (this.isRunning) {
      console.log('System is already running');
      return;
    }

    try {
      this.isRunning = true;
      console.log('Starting Constitutional Market Harmonics trading system...');

      // Set up market data subscriptions for initial universe
      const initialUniverse = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'];
      for (const symbol of initialUniverse) {
        this.marketDataManager.subscribeToSymbol(symbol);
      }

      // Start the main trading loop
      this.startTradingLoop();

      // Start metrics tracking
      this.startMetricsTracking();

      console.log('Constitutional Market Harmonics trading system started successfully');
    } catch (error) {
      console.error('Failed to start trading system:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Stop the trading system
   */
  async stop() {
    if (!this.isRunning) {
      console.log('System is not running');
      return;
    }

    this.isRunning = false;
    console.log('Stopping Constitutional Market Harmonics trading system...');

    // Clean up resources
    if (this.tradingLoopInterval) {
      clearInterval(this.tradingLoopInterval);
    }

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Clean up market data connections
    this.marketDataManager.cleanup();

    console.log('Constitutional Market Harmonics trading system stopped');
  }

  /**
   * Start the main trading loop
   */
  startTradingLoop() {
    this.tradingLoopInterval = setInterval(async () => {
      try {
        await this.tradingLoop();
      } catch (error) {
        console.error('Error in trading loop:', error);
      }
    }, this.config.updateInterval);
  }

  /**
   * Start metrics tracking
   */
  startMetricsTracking() {
    this.metricsInterval = setInterval(async () => {
      try {
        await this.trackMetrics();
      } catch (error) {
        console.error('Error in metrics tracking:', error);
      }
    }, this.config.updateInterval * 10); // Track metrics every 10 updates
  }

  /**
   * Main trading loop
   */
  async tradingLoop() {
    if (!this.isRunning) return;

    const timestamp = Date.now();

    // Get current market data
    const marketData = await this.getCurrentMarketData();

    // Generate attractor signals
    const attractorSignal = this.attractorManager.generateEnsembleSignal(marketData);

    // Evaluate investment universe
    const universe = await this.evaluateInvestmentUniverse(marketData);

    // Generate trading decisions
    const tradingDecisions = await this.generateTradingDecisions(universe, attractorSignal, marketData);

    // Execute trades (paper trading for now)
    if (this.config.paperTrading) {
      await this.executePaperTrades(tradingDecisions, marketData);
    }

    // Update portfolio
    await this.updatePortfolio(marketData);

    this.lastUpdate = timestamp;

    console.log(`Trading loop completed at ${new Date(timestamp).toISOString()}`);
    console.log(`Signal: ${attractorSignal.decision}, Confidence: ${(attractorSignal.confidence * 100).toFixed(1)}%`);
  }

  /**
   * Get current market data for portfolio symbols
   */
  async getCurrentMarketData() {
    const symbols = this.getPortfolioSymbols();
    return await this.marketDataManager.getMarketSnapshot(symbols);
  }

  /**
   * Get all symbols in current portfolio
   */
  getPortfolioSymbols() {
    const symbols = this.portfolio.positions.map(p => p.symbol);
    // Add some base universe symbols
    const baseUniverse = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    return [...new Set([...symbols, ...baseUniverse])];
  }

  /**
   * Evaluate investment universe with constitutional scoring
   */
  async evaluateInvestmentUniverse(marketData) {
    const symbols = Object.keys(marketData);
    const evaluatedCompanies = [];

    for (const symbol of symbols) {
      try {
        const constitutionalScore = await this.constitutionalScorer.scoreCompany(symbol);
        const marketInfo = marketData[symbol];

        evaluatedCompanies.push({
          symbol,
          constitutionalScore,
          marketData: marketInfo,
          fractalLovePotential: this.calculateFractalLovePotential(constitutionalScore, marketInfo)
        });
      } catch (error) {
        console.error(`Failed to evaluate ${symbol}:`, error);
      }
    }

    // Sort by fractal love potential
    return evaluatedCompanies.sort((a, b) => b.fractalLovePotential - a.fractalLovePotential);
  }

  /**
   * Calculate fractal love potential for a company
   */
  calculateFractalLovePotential(constitutionalScore, marketData) {
    const ethicalScore = constitutionalScore.overall;
    const marketScore = this.calculateMarketAttractiveness(marketData);

    // Fractal love potential = ethical alignment × market attractiveness
    return ethicalScore * marketScore;
  }

  /**
   * Calculate market attractiveness score
   */
  calculateMarketAttractiveness(marketData) {
    if (!marketData) return 0.5;

    // Simple attractiveness based on recent performance and liquidity
    let score = 0.5;

    // Recent performance (placeholder - would need historical data)
    if (marketData.return > 0.05) score += 0.2;
    else if (marketData.return < -0.05) score -= 0.2;

    // Liquidity (placeholder)
    if (marketData.volume > 1000000) score += 0.1;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate trading decisions based on signals and universe
   */
  async generateTradingDecisions(universe, attractorSignal, marketData) {
    const decisions = [];

    // Get top constitutional companies
    const topCompanies = universe.slice(0, 10);

    for (const company of topCompanies) {
      const decision = await this.generateCompanyDecision(company, attractorSignal, marketData);

      if (decision.action !== 'HOLD') {
        decisions.push(decision);
      }
    }

    return decisions;
  }

  /**
   * Generate trading decision for a specific company
   */
  async generateCompanyDecision(company, attractorSignal, marketData) {
    const symbol = company.symbol;
    const constitutionalScore = company.constitutionalScore.overall;
    const currentPosition = this.portfolio.positions.find(p => p.symbol === symbol);

    // Model market impact for potential trade
    let impactModel = null;
    try {
      impactModel = await this.impactModeler.modelImpact(
        symbol,
        this.config.basePositionSize,
        this.config.targetPositionSize,
        marketData[symbol]
      );
    } catch (error) {
      console.error(`Failed to model impact for ${symbol}:`, error);
    }

    // Decision logic based on attractor signal and constitutional alignment
    let action = 'HOLD';
    let size = 0;
    let reasoning = [];

    // Strong buy conditions
    if (attractorSignal.decision === 'STRONG_BUY' && constitutionalScore > 0.7) {
      if (!currentPosition) {
        action = 'BUY';
        size = this.config.basePositionSize;
        reasoning.push('Strong attractor signal with high constitutional alignment');
      }
    }

    // Buy conditions
    else if (attractorSignal.decision === 'BUY' && constitutionalScore > 0.6) {
      if (!currentPosition) {
        action = 'BUY';
        size = this.config.basePositionSize * 0.5;
        reasoning.push('Positive attractor signal with good constitutional alignment');
      }
    }

    // Sell conditions
    else if (attractorSignal.decision === 'SELL' || attractorSignal.decision === 'STRONG_SELL') {
      if (currentPosition) {
        action = 'SELL';
        size = currentPosition.value;
        reasoning.push('Negative attractor signal');
      }
    }

    // Constitutional rebalancing
    if (currentPosition && constitutionalScore < 0.4) {
      action = 'SELL';
      size = currentPosition.value;
      reasoning.push('Low constitutional alignment - rebalancing');
    }

    return {
      symbol,
      action,
      size,
      reasoning: reasoning.join('; '),
      attractorSignal: attractorSignal.decision,
      constitutionalScore,
      impactModel,
      timestamp: Date.now()
    };
  }

  /**
   * Execute paper trades
   */
  async executePaperTrades(decisions, marketData) {
    for (const decision of decisions) {
      try {
        if (decision.action === 'BUY') {
          await this.executePaperBuy(decision, marketData);
        } else if (decision.action === 'SELL') {
          await this.executePaperSell(decision, marketData);
        }

        // Record trade in database
        await this.db.saveTrade({
          symbol: decision.symbol,
          action: decision.action,
          size: decision.size,
          price: marketData[decision.symbol]?.lastPrice || 100,
          timestamp: decision.timestamp,
          reasoning: decision.reasoning,
          paperTrade: true
        });

      } catch (error) {
        console.error(`Failed to execute ${decision.action} for ${decision.symbol}:`, error);
      }
    }
  }

  /**
   * Execute paper buy
   */
  async executePaperBuy(decision, marketData) {
    const price = marketData[decision.symbol]?.lastPrice || 100;
    const quantity = decision.size / price;

    // Check if we have enough cash
    if (decision.size > this.portfolio.cash) {
      console.log(`Insufficient cash for ${decision.symbol} purchase`);
      return;
    }

    // Add to portfolio
    const existingPosition = this.portfolio.positions.find(p => p.symbol === decision.symbol);

    if (existingPosition) {
      // Average down/up
      const totalValue = existingPosition.value + decision.size;
      const totalQuantity = existingPosition.quantity + quantity;
      existingPosition.avgPrice = totalValue / totalQuantity;
      existingPosition.quantity = totalQuantity;
      existingPosition.value = totalValue;
    } else {
      // New position
      this.portfolio.positions.push({
        symbol: decision.symbol,
        quantity,
        avgPrice: price,
        value: decision.size,
        weight: 0 // Will be updated in updatePortfolio
      });
    }

    this.portfolio.cash -= decision.size;

    console.log(`Paper BUY: ${decision.symbol} ${quantity.toFixed(2)} shares @ $${price.toFixed(2)}`);
  }

  /**
   * Execute paper sell
   */
  async executePaperSell(decision, marketData) {
    const position = this.portfolio.positions.find(p => p.symbol === decision.symbol);

    if (!position) {
      console.log(`No position found for ${decision.symbol}`);
      return;
    }

    const sellQuantity = Math.min(position.quantity, decision.size / position.avgPrice);
    const sellValue = sellQuantity * position.avgPrice;

    // Remove from portfolio
    position.quantity -= sellQuantity;
    position.value -= sellValue;

    if (position.quantity <= 0) {
      // Remove position entirely
      this.portfolio.positions = this.portfolio.positions.filter(p => p.symbol !== decision.symbol);
    }

    this.portfolio.cash += sellValue;

    console.log(`Paper SELL: ${decision.symbol} ${sellQuantity.toFixed(2)} shares @ $${position.avgPrice.toFixed(2)}`);
  }

  /**
   * Update portfolio with current market prices
   */
  async updatePortfolio(marketData) {
    let totalValue = this.portfolio.cash;

    for (const position of this.portfolio.positions) {
      const price = marketData[position.symbol]?.lastPrice || position.avgPrice;
      position.value = position.quantity * price;
      totalValue += position.value;
    }

    // Update weights
    for (const position of this.portfolio.positions) {
      position.weight = position.value / totalValue;
    }

    this.portfolio.totalValue = totalValue;
  }

  /**
   * Track portfolio metrics
   */
  async trackMetrics() {
    if (!this.isRunning) return;

    const marketData = await this.getCurrentMarketData();
    await this.metricsTracker.trackPortfolioMetrics(
      this.config.portfolioId,
      this.portfolio.positions,
      marketData
    );
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      portfolio: {
        totalValue: this.portfolio.totalValue,
        cash: this.portfolio.cash,
        positions: this.portfolio.positions.length,
        symbols: this.portfolio.positions.map(p => p.symbol)
      },
      components: {
        database: this.db ? 'connected' : 'disconnected',
        marketData: this.marketDataManager.getStatus(),
        attractors: this.attractorManager.getPerformanceMetrics(),
        constitutional: this.constitutionalScorer ? 'loaded' : 'unloaded'
      },
      config: this.config
    };
  }

  /**
   * Get portfolio performance report
   */
  async getPerformanceReport() {
    return await this.metricsTracker.generatePerformanceReport(this.config.portfolioId);
  }

  /**
   * Get fractal love score history
   */
  getFractalLoveHistory(limit = 100) {
    return this.metricsTracker.getFractalLoveHistory(limit);
  }

  /**
   * Get current portfolio
   */
  getPortfolio() {
    return { ...this.portfolio };
  }

  /**
   * Add symbol to watchlist
   */
  addToWatchlist(symbol) {
    this.marketDataManager.subscribeToSymbol(symbol);
  }

  /**
   * Remove symbol from watchlist
   */
  removeFromWatchlist(symbol) {
    this.marketDataManager.unsubscribeFromSymbol(symbol);
  }

  /**
   * Force rebalance portfolio based on constitutional scores
   */
  async rebalancePortfolio() {
    console.log('Rebalancing portfolio based on constitutional alignment...');

    const marketData = await this.getCurrentMarketData();
    const universe = await this.evaluateInvestmentUniverse(marketData);

    // Get target allocations based on constitutional scores
    const targetAllocations = this.calculateTargetAllocations(universe);

    // Generate rebalancing trades
    const rebalancingTrades = this.generateRebalancingTrades(targetAllocations, marketData);

    // Execute rebalancing trades
    if (this.config.paperTrading) {
      await this.executePaperTrades(rebalancingTrades, marketData);
    }

    console.log('Portfolio rebalancing completed');
  }

  /**
   * Calculate target allocations based on constitutional scores
   */
  calculateTargetAllocations(universe) {
    const topCompanies = universe.slice(0, 10);
    const totalScore = topCompanies.reduce((sum, company) => sum + company.constitutionalScore.overall, 0);

    return topCompanies.map(company => ({
      symbol: company.symbol,
      weight: company.constitutionalScore.overall / totalScore,
      score: company.constitutionalScore.overall
    }));
  }

  /**
   * Generate rebalancing trades
   */
  generateRebalancingTrades(targetAllocations, marketData) {
    const trades = [];
    const totalValue = this.portfolio.totalValue;

    for (const target of targetAllocations) {
      const currentPosition = this.portfolio.positions.find(p => p.symbol === target.symbol);
      const targetValue = target.weight * totalValue;
      const currentValue = currentPosition ? currentPosition.value : 0;
      const difference = targetValue - currentValue;

      if (Math.abs(difference) > 1000) { // Minimum trade size
        const price = marketData[target.symbol]?.lastPrice || 100;

        trades.push({
          symbol: target.symbol,
          action: difference > 0 ? 'BUY' : 'SELL',
          size: Math.abs(difference),
          reasoning: `Rebalancing to target weight ${(target.weight * 100).toFixed(1)}%`,
          timestamp: Date.now()
        });
      }
    }

    return trades;
  }

  /**
   * Emergency stop - sell all positions
   */
  async emergencyStop() {
    console.log('Executing emergency stop - selling all positions...');

    const marketData = await this.getCurrentMarketData();
    const sellTrades = this.portfolio.positions.map(position => ({
      symbol: position.symbol,
      action: 'SELL',
      size: position.value,
      reasoning: 'Emergency stop',
      timestamp: Date.now()
    }));

    if (this.config.paperTrading) {
      await this.executePaperTrades(sellTrades, marketData);
    }

    console.log('Emergency stop completed');
  }
}

module.exports = ConstitutionalMarketHarmonics;