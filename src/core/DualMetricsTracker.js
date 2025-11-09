/**
 * Dual Metrics Tracker
 * Tracks both financial ROI and constitutional impact
 * Calculates combined fractal love score: ROI × Constitutional Impact
 */

class DualMetricsTracker {
  constructor(databaseManager, constitutionalScorer) {
    this.db = databaseManager;
    this.constitutionalScorer = constitutionalScorer;
    this.portfolioMetrics = new Map();
    this.performanceHistory = [];
    this.fractalLoveScores = [];
    this.benchmarkMetrics = {
      spy: { returns: [], constitutionalScore: 0.5 }, // S&P 500 benchmark
      qqq: { returns: [], constitutionalScore: 0.4 }  // Nasdaq benchmark
    };
  }

  /**
   * Track portfolio performance with dual metrics
   * @param {string} portfolioId - Portfolio identifier
   * @param {Array} positions - Current positions
   * @param {Object} marketData - Current market data
   */
  async trackPortfolioMetrics(portfolioId, positions, marketData) {
    const timestamp = Date.now();

    // Calculate financial metrics
    const financialMetrics = this.calculateFinancialMetrics(positions, marketData);

    // Calculate constitutional metrics
    const constitutionalMetrics = await this.calculateConstitutionalMetrics(positions);

    // Calculate combined fractal love score
    const fractalLoveScore = this.calculateFractalLoveScore(financialMetrics, constitutionalMetrics);

    // Calculate benchmark comparison
    const benchmarkComparison = this.calculateBenchmarkComparison(financialMetrics, marketData);

    // Create metrics snapshot
    const metricsSnapshot = {
      portfolioId,
      timestamp,
      financialMetrics,
      constitutionalMetrics,
      fractalLoveScore,
      benchmarkComparison,
      positions: positions.map(p => ({ symbol: p.symbol, weight: p.weight })),
      marketRegime: this.detectMarketRegime(marketData),
      riskMetrics: this.calculateRiskMetrics(positions, marketData)
    };

    // Store in memory
    this.portfolioMetrics.set(portfolioId, metricsSnapshot);

    // Store in database
    await this.db.savePerformanceSnapshot(metricsSnapshot);

    // Update performance history
    this.performanceHistory.push(metricsSnapshot);
    this.fractalLoveScores.push(fractalLoveScore);

    // Keep history manageable
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-500);
    }

    return metricsSnapshot;
  }

  /**
   * Calculate financial metrics
   */
  calculateFinancialMetrics(positions, marketData) {
    let totalValue = 0;
    let totalCost = 0;
    let weightedReturn = 0;
    let totalWeight = 0;

    const positionMetrics = [];

    for (const position of positions) {
      const symbol = position.symbol;
      const marketInfo = marketData[symbol];

      if (!marketInfo) continue;

      const currentPrice = marketInfo.lastPrice || marketInfo.close || 100;
      const quantity = position.quantity || (position.value / position.avgPrice);
      const currentValue = quantity * currentPrice;
      const costBasis = quantity * position.avgPrice;
      const unrealizedPnL = currentValue - costBasis;
      const returnPct = (currentPrice - position.avgPrice) / position.avgPrice;

      totalValue += currentValue;
      totalCost += costBasis;
      weightedReturn += returnPct * position.weight;
      totalWeight += position.weight;

      positionMetrics.push({
        symbol,
        quantity,
        avgPrice: position.avgPrice,
        currentPrice,
        currentValue,
        costBasis,
        unrealizedPnL,
        returnPct,
        weight: position.weight
      });
    }

    const totalReturn = totalWeight > 0 ? weightedReturn / totalWeight : 0;
    const totalPnL = totalValue - totalCost;

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalReturn,
      positionMetrics,
      sharpeRatio: this.calculateSharpeRatio(positions, marketData),
      maxDrawdown: this.calculateMaxDrawdown(positions, marketData),
      volatility: this.calculatePortfolioVolatility(positions, marketData)
    };
  }

  /**
   * Calculate constitutional metrics
   */
  async calculateConstitutionalMetrics(positions) {
    const constitutionalScores = [];
    let weightedConstitutionalScore = 0;
    let totalWeight = 0;

    for (const position of positions) {
      try {
        const score = await this.constitutionalScorer.scoreCompany(position.symbol);
        const weightedScore = score.overall * position.weight;

        constitutionalScores.push({
          symbol: position.symbol,
          score: score,
          weight: position.weight,
          weightedScore
        });

        weightedConstitutionalScore += weightedScore;
        totalWeight += position.weight;
      } catch (error) {
        console.error(`Failed to score ${position.symbol}:`, error);
        // Use neutral score as fallback
        weightedConstitutionalScore += 0.5 * position.weight;
        totalWeight += position.weight;
      }
    }

    const overallConstitutionalScore = totalWeight > 0 ? weightedConstitutionalScore / totalWeight : 0.5;

    return {
      overallScore: overallConstitutionalScore,
      constitutionalScores,
      yamaBreakdown: this.aggregateYamaScores(constitutionalScores),
      ethicalAlignment: this.calculateEthicalAlignment(overallConstitutionalScore)
    };
  }

  /**
   * Calculate fractal love score: ROI × Constitutional Impact
   */
  calculateFractalLoveScore(financialMetrics, constitutionalMetrics) {
    const roi = financialMetrics.totalReturn;
    const constitutionalImpact = constitutionalMetrics.overallScore;

    // Fractal love score is the product of ROI and constitutional impact
    // This rewards strategies that are both profitable AND constitutionally aligned
    const fractalLoveScore = roi * constitutionalImpact;

    // Normalize to make it more interpretable
    // Scale so that 10% ROI with perfect constitutional score = 1.0
    const normalizedScore = fractalLoveScore / 0.1;

    return {
      rawScore: fractalLoveScore,
      normalizedScore,
      roi,
      constitutionalImpact,
      scoreComponents: {
        financialPerformance: roi,
        ethicalAlignment: constitutionalImpact,
        synergyBonus: this.calculateSynergyBonus(roi, constitutionalImpact)
      },
      interpretation: this.interpretFractalLoveScore(normalizedScore)
    };
  }

  /**
   * Calculate synergy bonus for aligned strategies
   */
  calculateSynergyBonus(roi, constitutionalImpact) {
    // Bonus for strategies that achieve both financial and ethical goals
    if (roi > 0 && constitutionalImpact > 0.7) {
      return 0.1 * Math.sqrt(roi * constitutionalImpact);
    }
    return 0;
  }

  /**
   * Interpret fractal love score
   */
  interpretFractalLoveScore(score) {
    if (score > 2.0) return 'Exceptional fractal love - outstanding ethical profits';
    if (score > 1.5) return 'Strong fractal love - excellent ethical performance';
    if (score > 1.0) return 'Good fractal love - solid ethical returns';
    if (score > 0.5) return 'Moderate fractal love - decent ethical balance';
    if (score > 0) return 'Weak fractal love - limited ethical impact';
    if (score === 0) return 'Neutral - no ethical-financial alignment';
    return 'Negative fractal love - unethical profits or ethical losses';
  }

  /**
   * Aggregate Yama principle scores across portfolio
   */
  aggregateYamaScores(constitutionalScores) {
    const yamaPrinciples = ['ahimsa', 'satya', 'asteya', 'brahmacharya', 'aparigraha'];
    const aggregated = {};

    for (const principle of yamaPrinciples) {
      let weightedScore = 0;
      let totalWeight = 0;

      for (const score of constitutionalScores) {
        if (score.score.yamaScores && score.score.yamaScores[principle]) {
          weightedScore += score.score.yamaScores[principle] * score.weight;
          totalWeight += score.weight;
        }
      }

      aggregated[principle] = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
    }

    return aggregated;
  }

  /**
   * Calculate ethical alignment level
   */
  calculateEthicalAlignment(score) {
    if (score > 0.8) return 'Transcendent';
    if (score > 0.7) return 'Highly Aligned';
    if (score > 0.6) return 'Well Aligned';
    if (score > 0.5) return 'Moderately Aligned';
    if (score > 0.4) return 'Poorly Aligned';
    return 'Misaligned';
  }

  /**
   * Calculate benchmark comparison
   */
  calculateBenchmarkComparison(financialMetrics, marketData) {
    const portfolioReturn = financialMetrics.totalReturn;
    const comparisons = {};

    // Compare to S&P 500
    const spyData = marketData['SPY'];
    if (spyData) {
      const spyReturn = this.calculateReturnFromData(spyData);
      comparisons.spy = {
        portfolioReturn,
        benchmarkReturn: spyReturn,
        outperformance: portfolioReturn - spyReturn,
        outperformancePct: spyReturn !== 0 ? (portfolioReturn - spyReturn) / Math.abs(spyReturn) : 0
      };
    }

    // Compare to Nasdaq
    const qqqData = marketData['QQQ'];
    if (qqqData) {
      const qqqReturn = this.calculateReturnFromData(qqqData);
      comparisons.qqq = {
        portfolioReturn,
        benchmarkReturn: qqqReturn,
        outperformance: portfolioReturn - qqqReturn,
        outperformancePct: qqqReturn !== 0 ? (portfolioReturn - qqqReturn) / Math.abs(qqqReturn) : 0
      };
    }

    return comparisons;
  }

  /**
   * Calculate return from market data
   */
  calculateReturnFromData(data) {
    if (Array.isArray(data)) {
      // Historical data array
      if (data.length < 2) return 0;
      const firstPrice = data[0].close;
      const lastPrice = data[data.length - 1].close;
      return (lastPrice - firstPrice) / firstPrice;
    } else {
      // Current data object
      return data.return || 0;
    }
  }

  /**
   * Calculate Sharpe ratio
   */
  calculateSharpeRatio(positions, marketData) {
    // Simplified Sharpe ratio calculation
    const returns = positions.map(p => {
      const data = marketData[p.symbol];
      return data ? this.calculateReturnFromData(data) : 0;
    });

    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    // Assume 2% risk-free rate
    const riskFreeRate = 0.02;

    return volatility > 0 ? (avgReturn - riskFreeRate) / volatility : 0;
  }

  /**
   * Calculate maximum drawdown
   */
  calculateMaxDrawdown(positions, marketData) {
    // Simplified drawdown calculation
    let maxDrawdown = 0;
    let peak = 1;

    // This would need actual time series data for proper calculation
    // For now, return a placeholder
    return maxDrawdown;
  }

  /**
   * Calculate portfolio volatility
   */
  calculatePortfolioVolatility(positions, marketData) {
    const returns = positions.map(p => {
      const data = marketData[p.symbol];
      return data ? this.calculateReturnFromData(data) : 0;
    });

    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;

    return Math.sqrt(variance);
  }

  /**
   * Calculate risk metrics
   */
  calculateRiskMetrics(positions, marketData) {
    return {
      volatility: this.calculatePortfolioVolatility(positions, marketData),
      sharpeRatio: this.calculateSharpeRatio(positions, marketData),
      maxDrawdown: this.calculateMaxDrawdown(positions, marketData),
      diversificationRatio: this.calculateDiversificationRatio(positions),
      concentrationRisk: this.calculateConcentrationRisk(positions)
    };
  }

  /**
   * Calculate diversification ratio
   */
  calculateDiversificationRatio(positions) {
    if (positions.length === 0) return 0;

    const weights = positions.map(p => p.weight);
    const avgWeight = 1 / positions.length;

    // Calculate Herfindahl-Hirschman Index
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight, 2), 0);

    // Diversification ratio = 1 / sqrt(HHI)
    return 1 / Math.sqrt(hhi);
  }

  /**
   * Calculate concentration risk
   */
  calculateConcentrationRisk(positions) {
    const maxWeight = Math.max(...positions.map(p => p.weight));
    return maxWeight;
  }

  /**
   * Detect market regime
   */
  detectMarketRegime(marketData) {
    // Simple regime detection based on volatility
    const symbols = Object.keys(marketData);
    if (symbols.length === 0) return 'unknown';

    let totalVolatility = 0;
    let count = 0;

    for (const symbol of symbols) {
      const data = marketData[symbol];
      if (data && data.volatility) {
        totalVolatility += data.volatility;
        count++;
      }
    }

    const avgVolatility = count > 0 ? totalVolatility / count : 0.02;

    if (avgVolatility > 0.05) return 'high_volatility';
    if (avgVolatility > 0.03) return 'moderate_volatility';
    if (avgVolatility < 0.015) return 'low_volatility';
    return 'normal';
  }

  /**
   * Get portfolio metrics
   */
  getPortfolioMetrics(portfolioId) {
    return this.portfolioMetrics.get(portfolioId);
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(limit = 100) {
    return this.performanceHistory.slice(-limit);
  }

  /**
   * Get fractal love score history
   */
  getFractalLoveHistory(limit = 100) {
    return this.fractalLoveScores.slice(-limit);
  }

  /**
   * Calculate cumulative fractal love score
   */
  getCumulativeFractalLoveScore() {
    if (this.fractalLoveScores.length === 0) return 0;

    const cumulative = this.fractalLoveScores.reduce((sum, score) => sum + score, 0);
    return cumulative / this.fractalLoveScores.length;
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(portfolioId) {
    const metrics = this.getPortfolioMetrics(portfolioId);
    const history = this.getPerformanceHistory(30); // Last 30 snapshots
    const fractalLoveHistory = this.getFractalLoveHistory(30);

    if (!metrics) return null;

    return {
      portfolioId,
      currentMetrics: metrics,
      performanceTrends: this.analyzePerformanceTrends(history),
      fractalLoveAnalysis: this.analyzeFractalLoveTrends(fractalLoveHistory),
      recommendations: this.generateRecommendations(metrics, history),
      summary: {
        totalReturn: metrics.financialMetrics.totalReturn,
        constitutionalScore: metrics.constitutionalMetrics.overallScore,
        fractalLoveScore: metrics.fractalLoveScore.normalizedScore,
        benchmarkOutperformance: metrics.benchmarkComparison,
        riskLevel: this.assessRiskLevel(metrics.riskMetrics)
      }
    };
  }

  /**
   * Analyze performance trends
   */
  analyzePerformanceTrends(history) {
    if (history.length < 2) return { trend: 'insufficient_data' };

    const recent = history.slice(-10);
    const older = history.slice(-20, -10);

    const recentAvgReturn = recent.reduce((sum, h) => sum + h.financialMetrics.totalReturn, 0) / recent.length;
    const olderAvgReturn = older.reduce((sum, h) => sum + h.financialMetrics.totalReturn, 0) / older.length;

    const returnTrend = recentAvgReturn > olderAvgReturn ? 'improving' : 'declining';

    return {
      returnTrend,
      recentAverageReturn: recentAvgReturn,
      volatilityTrend: this.calculateVolatilityTrend(history),
      consistencyScore: this.calculateConsistencyScore(history)
    };
  }

  /**
   * Analyze fractal love trends
   */
  analyzeFractalLoveTrends(scores) {
    if (scores.length < 2) return { trend: 'insufficient_data' };

    const recent = scores.slice(-10);
    const older = scores.slice(-20, -10);

    const recentAvg = recent.reduce((sum, s) => sum + s, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, s) => sum + s, 0) / older.length : recentAvg;

    const trend = recentAvg > olderAvg ? 'improving' : 'declining';

    return {
      trend,
      recentAverage: recentAvg,
      fractalLoveVolatility: this.calculateScoreVolatility(scores),
      peakScore: Math.max(...scores),
      averageScore: scores.reduce((sum, s) => sum + s, 0) / scores.length
    };
  }

  /**
   * Calculate volatility trend
   */
  calculateVolatilityTrend(history) {
    // Simplified trend calculation
    return 'stable';
  }

  /**
   * Calculate consistency score
   */
  calculateConsistencyScore(history) {
    if (history.length < 2) return 0;

    const returns = history.map(h => h.financialMetrics.totalReturn);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;

    // Consistency score: lower variance = higher consistency
    return Math.max(0, 1 - Math.sqrt(variance) / 0.1); // Normalize to 0-1
  }

  /**
   * Calculate score volatility
   */
  calculateScoreVolatility(scores) {
    if (scores.length < 2) return 0;

    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;

    return Math.sqrt(variance);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(metrics, history) {
    const recommendations = [];

    const fractalLoveScore = metrics.fractalLoveScore.normalizedScore;
    const constitutionalScore = metrics.constitutionalMetrics.overallScore;
    const financialReturn = metrics.financialMetrics.totalReturn;

    if (fractalLoveScore < 0.5) {
      recommendations.push({
        type: 'rebalance',
        priority: 'high',
        message: 'Consider rebalancing toward more constitutionally aligned investments'
      });
    }

    if (constitutionalScore < 0.6) {
      recommendations.push({
        type: 'ethical_review',
        priority: 'medium',
        message: 'Review portfolio for ethical alignment with Yama principles'
      });
    }

    if (financialReturn < 0) {
      recommendations.push({
        type: 'risk_management',
        priority: 'high',
        message: 'Implement risk management measures for negative returns'
      });
    }

    return recommendations;
  }

  /**
   * Assess risk level
   */
  assessRiskLevel(riskMetrics) {
    const volatility = riskMetrics.volatility;
    const maxDrawdown = riskMetrics.maxDrawdown;
    const concentration = riskMetrics.concentrationRisk;

    if (volatility > 0.05 || maxDrawdown > 0.2 || concentration > 0.3) {
      return 'high';
    } else if (volatility > 0.03 || maxDrawdown > 0.1 || concentration > 0.2) {
      return 'moderate';
    } else {
      return 'low';
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.portfolioMetrics.clear();
    this.performanceHistory = [];
    this.fractalLoveScores = [];
  }
}

module.exports = DualMetricsTracker;