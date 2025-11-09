/**
 * Counterfactual Impact Modeler
 * Simulates market impact of scaling positions from $100K to $10M
 * Uses chaos theory and fractal analysis for impact prediction
 */

const math = require('mathjs');

class CounterfactualImpactModeler {
  constructor(databaseManager) {
    this.db = databaseManager;
    this.impactModels = new Map();
    this.historicalImpacts = [];
    this.fractalDimensions = new Map();
    this.liquidityProfiles = new Map();
  }

  /**
   * Model market impact for scaling a position
   * @param {string} symbol - Stock symbol
   * @param {number} baseSize - Base position size ($100K)
   * @param {number} targetSize - Target position size ($10M)
   * @param {Object} marketData - Current market data
   */
  async modelImpact(symbol, baseSize, targetSize, marketData) {
    try {
      // Get historical data for the symbol
      const historicalData = await this.db.getHistoricalData(symbol, '1D', 252); // 1 year

      // Calculate base impact at $100K
      const baseImpact = await this.calculateBaseImpact(symbol, baseSize, marketData, historicalData);

      // Scale to $10M using fractal scaling laws
      const scaledImpact = this.scaleImpactFractally(baseImpact, baseSize, targetSize, historicalData);

      // Calculate counterfactual scenarios
      const counterfactuals = this.generateCounterfactualScenarios(symbol, scaledImpact, historicalData);

      // Store impact model
      const impactModel = {
        symbol,
        timestamp: Date.now(),
        baseSize,
        targetSize,
        baseImpact,
        scaledImpact,
        counterfactuals,
        fractalDimension: this.calculateFractalDimension(historicalData),
        marketRegime: this.detectMarketRegime(historicalData),
        confidence: this.calculateModelConfidence(scaledImpact, historicalData)
      };

      this.impactModels.set(symbol, impactModel);
      await this.db.saveCounterfactualImpact(impactModel);

      return impactModel;
    } catch (error) {
      console.error(`Failed to model impact for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Calculate base market impact at $100K position size
   */
  async calculateBaseImpact(symbol, size, marketData, historicalData) {
    // Get average daily volume and volatility
    const avgVolume = this.calculateAverageVolume(historicalData);
    const volatility = this.calculateVolatility(historicalData);
    const currentPrice = marketData?.lastPrice || historicalData[historicalData.length - 1]?.close || 100;

    // Calculate participation rate (percentage of daily volume)
    const participationRate = size / (currentPrice * avgVolume);

    // Use Almgren-Chriss model for market impact
    const impact = this.calculateAlmgrenChrissImpact(participationRate, volatility);

    // Add liquidity-based adjustments
    const liquidityAdjustment = this.calculateLiquidityAdjustment(symbol, participationRate, historicalData);

    return {
      participationRate,
      priceImpact: impact.permanent + impact.temporary,
      permanentImpact: impact.permanent,
      temporaryImpact: impact.temporary,
      spreadCost: this.calculateSpreadCost(size, currentPrice, historicalData),
      marketCap: await this.getMarketCap(symbol),
      avgVolume,
      volatility,
      liquidityAdjustment,
      totalEstimatedSlippage: impact.permanent + impact.temporary + liquidityAdjustment
    };
  }

  /**
   * Almgren-Chriss market impact model
   */
  calculateAlmgrenChrissImpact(participationRate, volatility) {
    // Simplified Almgren-Chriss model
    // Permanent impact: proportional to square root of participation
    const permanentImpact = 0.5 * volatility * Math.sqrt(participationRate);

    // Temporary impact: proportional to participation rate
    const temporaryImpact = 0.3 * volatility * participationRate;

    return {
      permanent: permanentImpact,
      temporary: temporaryImpact
    };
  }

  /**
   * Calculate liquidity adjustment based on order book depth
   */
  calculateLiquidityAdjustment(symbol, participationRate, historicalData) {
    // Estimate based on volume profile and volatility
    const volumeVolatility = this.calculateVolumeVolatility(historicalData);

    // Higher volume volatility means thinner liquidity
    const liquidityFactor = Math.max(0.1, 1 - volumeVolatility);

    // Adjustment increases with participation rate for illiquid stocks
    return participationRate * (1 - liquidityFactor) * 0.001; // 0.1% max adjustment
  }

  /**
   * Scale impact using fractal scaling laws
   */
  scaleImpactFractally(baseImpact, baseSize, targetSize, historicalData) {
    const scaleRatio = targetSize / baseSize;
    const fractalDimension = this.calculateFractalDimension(historicalData);

    // Fractal scaling: Impact scales with size^(fractal_dimension - 1)
    // For 2D markets, impact should scale with sqrt(size)
    // But real markets are fractal with dimension between 1.2-1.8
    const fractalExponent = fractalDimension - 1;

    // Scale participation rate
    const scaledParticipationRate = baseImpact.participationRate * scaleRatio;

    // Scale impacts using fractal laws
    const scaledPermanentImpact = baseImpact.permanentImpact * Math.pow(scaleRatio, fractalExponent);
    const scaledTemporaryImpact = baseImpact.temporaryImpact * Math.pow(scaleRatio, fractalExponent * 0.8);

    // Calculate nonlinear effects at large sizes
    const nonlinearEffects = this.calculateNonlinearEffects(scaleRatio, historicalData);

    return {
      scaleRatio,
      scaledParticipationRate,
      scaledPermanentImpact,
      scaledTemporaryImpact,
      nonlinearEffects,
      totalScaledImpact: scaledPermanentImpact + scaledTemporaryImpact + nonlinearEffects,
      fractalScaling: {
        dimension: fractalDimension,
        exponent: fractalExponent,
        efficiency: this.calculateScalingEfficiency(scaleRatio, fractalDimension)
      }
    };
  }

  /**
   * Calculate nonlinear effects at large position sizes
   */
  calculateNonlinearEffects(scaleRatio, historicalData) {
    // Nonlinear effects become significant above certain thresholds
    let nonlinearImpact = 0;

    if (scaleRatio > 10) { // Above 1M from 100K base
      // Price pressure effects
      nonlinearImpact += 0.001 * Math.log(scaleRatio);

      // Information leakage effects
      nonlinearImpact += 0.0005 * Math.sqrt(scaleRatio - 10);
    }

    if (scaleRatio > 50) { // Above 5M
      // Market maker withdrawal
      nonlinearImpact += 0.002 * Math.log(scaleRatio / 50);

      // Institutional attention effects
      nonlinearImpact += 0.001 * Math.sqrt(scaleRatio - 50);
    }

    return nonlinearImpact;
  }

  /**
   * Generate counterfactual impact scenarios
   */
  generateCounterfactualScenarios(symbol, scaledImpact, historicalData) {
    const scenarios = [];
    const baseImpact = scaledImpact.totalScaledImpact;

    // Best case: Perfect execution, minimal market impact
    scenarios.push({
      name: 'optimal_execution',
      probability: 0.1,
      impact: baseImpact * 0.7,
      description: 'Perfect VWAP execution with minimal slippage'
    });

    // Expected case: Normal market conditions
    scenarios.push({
      name: 'normal_conditions',
      probability: 0.6,
      impact: baseImpact,
      description: 'Typical market conditions with standard impact'
    });

    // Worst case: Adverse market conditions
    scenarios.push({
      name: 'adverse_conditions',
      probability: 0.2,
      impact: baseImpact * 1.5,
      description: 'High volatility or low liquidity conditions'
    });

    // Black swan: Extreme adverse conditions
    scenarios.push({
      name: 'black_swan',
      probability: 0.05,
      impact: baseImpact * 3.0,
      description: 'Extreme market dislocation or flash crash conditions'
    });

    // Algorithmic advantage: Using chaos-based timing
    scenarios.push({
      name: 'chaos_optimized',
      probability: 0.8,
      impact: baseImpact * 0.8,
      description: 'Using strange attractor timing for optimal execution'
    });

    return scenarios;
  }

  /**
   * Calculate fractal dimension of price series
   */
  calculateFractalDimension(data) {
    if (data.length < 100) return 1.5; // Default assumption

    const prices = data.map(d => d.close);
    const scales = [2, 4, 8, 16, 32];
    const measures = [];

    for (const scale of scales) {
      let count = 0;
      const boxes = new Set();

      for (let i = 0; i < prices.length; i += scale) {
        const box = Math.floor(prices[i] / scale);
        boxes.add(box);
      }

      measures.push(boxes.size);
    }

    // Linear regression on log-log plot
    const logScales = scales.map(s => Math.log(1/s));
    const logMeasures = measures.map(m => Math.log(m));

    const dimension = this.linearRegressionSlope(logScales, logMeasures);
    return Math.max(1.0, Math.min(2.0, dimension)); // Clamp to reasonable range
  }

  /**
   * Linear regression slope calculation
   */
  linearRegressionSlope(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  /**
   * Calculate scaling efficiency based on fractal dimension
   */
  calculateScalingEfficiency(scaleRatio, fractalDimension) {
    // Efficiency decreases as fractal dimension increases
    // Perfect 2D market would have 100% efficiency
    const idealEfficiency = 1.0;
    const actualEfficiency = Math.pow(scaleRatio, 2 - fractalDimension);

    return Math.min(1.0, actualEfficiency / scaleRatio);
  }

  /**
   * Calculate average daily volume
   */
  calculateAverageVolume(data) {
    if (data.length === 0) return 1000000; // Default assumption

    const volumes = data.map(d => d.volume);
    return volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  }

  /**
   * Calculate price volatility
   */
  calculateVolatility(data) {
    if (data.length < 2) return 0.02; // Default 2% volatility

    const returns = [];
    for (let i = 1; i < data.length; i++) {
      const ret = Math.log(data[i].close / data[i-1].close);
      returns.push(ret);
    }

    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;

    return Math.sqrt(variance * 252); // Annualized volatility
  }

  /**
   * Calculate volume volatility
   */
  calculateVolumeVolatility(data) {
    if (data.length < 2) return 0.5;

    const volumes = data.map(d => d.volume);
    const mean = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - mean, 2), 0) / volumes.length;

    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  /**
   * Calculate spread cost
   */
  calculateSpreadCost(size, price, data) {
    // Estimate bid-ask spread based on price and volume
    const avgVolume = this.calculateAverageVolume(data);
    const dollarVolume = price * avgVolume;

    // Spread typically 0.01% for large cap, 0.1% for small cap
    const spreadBps = dollarVolume > 10000000 ? 1 : 10; // 1-10 basis points
    const spreadPercent = spreadBps / 10000;

    return size * spreadPercent;
  }

  /**
   * Detect market regime
   */
  detectMarketRegime(data) {
    const volatility = this.calculateVolatility(data);
    const volumeVolatility = this.calculateVolumeVolatility(data);

    if (volatility > 0.05 && volumeVolatility > 0.8) return 'high_volatility';
    if (volatility > 0.03 && volumeVolatility > 0.6) return 'moderate_volatility';
    if (volatility < 0.02 && volumeVolatility < 0.4) return 'low_volatility';
    return 'normal';
  }

  /**
   * Calculate model confidence
   */
  calculateModelConfidence(scaledImpact, historicalData) {
    let confidence = 0.5; // Base confidence

    // More historical data increases confidence
    if (historicalData.length > 252) confidence += 0.2;
    else if (historicalData.length > 100) confidence += 0.1;

    // Lower volatility increases confidence
    const volatility = this.calculateVolatility(historicalData);
    if (volatility < 0.02) confidence += 0.1;
    else if (volatility > 0.05) confidence -= 0.1;

    // Reasonable impact estimates increase confidence
    if (scaledImpact.totalScaledImpact < 0.1) confidence += 0.1; // Less than 10% impact
    else if (scaledImpact.totalScaledImpact > 0.5) confidence -= 0.2; // More than 50% impact

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Get market cap (placeholder - would integrate with actual API)
   */
  async getMarketCap(symbol) {
    // Placeholder - in real implementation, would fetch from API
    // For now, return reasonable default based on symbol
    const largeCaps = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    const midCaps = ['NVDA', 'META', 'NFLX'];

    if (largeCaps.includes(symbol.toUpperCase())) return 1000000000000; // $1T
    if (midCaps.includes(symbol.toUpperCase())) return 500000000000; // $500B

    return 10000000000; // $10B default
  }

  /**
   * Get impact model for symbol
   */
  getImpactModel(symbol) {
    return this.impactModels.get(symbol);
  }

  /**
   * Get all impact models
   */
  getAllImpactModels() {
    return Array.from(this.impactModels.values());
  }

  /**
   * Clear impact models
   */
  clearModels() {
    this.impactModels.clear();
  }
}

module.exports = CounterfactualImpactModeler;