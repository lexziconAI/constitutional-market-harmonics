/**
 * Attractor Manager
 * Coordinates multiple strange attractors for trading signal generation
 * Combines Lorenz, Chen, and Rossler attractors for robust signals
 */

const LorenzAttractor = require('./LorenzAttractor');
const ChenAttractor = require('./ChenAttractor');
const RosslerAttractor = require('./RosslerAttractor');

class AttractorManager {
  constructor() {
    this.attractors = {
      lorenz: new LorenzAttractor(),
      chen: new ChenAttractor(),
      rossler: new RosslerAttractor()
    };

    this.signalHistory = [];
    this.ensembleWeights = {
      lorenz: 0.4,
      chen: 0.35,
      rossler: 0.25
    };

    this.confidenceThreshold = 0.6;
    this.adaptationRate = 0.1;
  }

  /**
   * Initialize all attractors with different initial conditions
   */
  initializeAttractors() {
    // Lorenz: Classic chaotic conditions
    this.attractors.lorenz.setInitialConditions('classic');

    // Chen: High energy chaotic conditions
    this.attractors.chen.setInitialConditions('high_energy');

    // Rossler: Standard chaotic conditions
    this.attractors.rossler.setInitialConditions('chaotic');

    // Evolve each attractor to establish trajectories
    Object.values(this.attractors).forEach(attractor => {
      for (let i = 0; i < 1000; i++) {
        attractor.evolve();
      }
    });
  }

  /**
   * Generate ensemble trading signal from all attractors
   */
  generateEnsembleSignal(marketData = null) {
    const signals = {};

    // Generate signals from each attractor
    Object.keys(this.attractors).forEach(name => {
      signals[name] = this.attractors[name].generateTradingSignal();
    });

    // Calculate ensemble signal
    const ensembleSignal = this.calculateEnsembleSignal(signals);

    // Adapt weights based on performance (if market data provided)
    if (marketData) {
      this.adaptWeights(signals, marketData);
    }

    // Store signal history
    this.signalHistory.push({
      timestamp: Date.now(),
      individualSignals: signals,
      ensembleSignal: ensembleSignal,
      weights: { ...this.ensembleWeights }
    });

    // Keep history manageable
    if (this.signalHistory.length > 1000) {
      this.signalHistory = this.signalHistory.slice(-500);
    }

    return ensembleSignal;
  }

  /**
   * Calculate ensemble signal from individual attractor signals
   */
  calculateEnsembleSignal(signals) {
    const decisions = Object.keys(signals).map(name => ({
      name,
      decision: signals[name].decision,
      weight: this.ensembleWeights[name],
      confidence: this.calculateSignalConfidence(signals[name])
    }));

    // Convert decisions to numerical values
    const decisionValues = {
      'STRONG_BUY': 2,
      'BUY': 1,
      'HOLD': 0,
      'SELL': -1,
      'STRONG_SELL': -2
    };

    // Calculate weighted ensemble decision
    let weightedSum = 0;
    let totalWeight = 0;
    let totalConfidence = 0;

    decisions.forEach(({ decision, weight, confidence }) => {
      const value = decisionValues[decision] || 0;
      weightedSum += value * weight * confidence;
      totalWeight += weight;
      totalConfidence += confidence;
    });

    const ensembleValue = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const averageConfidence = decisions.length > 0 ? totalConfidence / decisions.length : 0;

    // Convert back to decision
    let ensembleDecision;
    if (ensembleValue > 1.5) ensembleDecision = 'STRONG_BUY';
    else if (ensembleValue > 0.5) ensembleDecision = 'BUY';
    else if (ensembleValue < -1.5) ensembleDecision = 'STRONG_SELL';
    else if (ensembleValue < -0.5) ensembleDecision = 'SELL';
    else ensembleDecision = 'HOLD';

    return {
      timestamp: Date.now(),
      decision: ensembleDecision,
      confidence: averageConfidence,
      ensembleValue: ensembleValue,
      individualSignals: signals,
      attractorProperties: this.getAttractorProperties(),
      marketRegime: this.detectMarketRegime(signals)
    };
  }

  /**
   * Calculate confidence in individual signal
   */
  calculateSignalConfidence(signal) {
    const { chaosStrength, fractalDimension, isChaotic } = signal;

    // Confidence based on chaos strength and fractal properties
    let confidence = 0;

    if (isChaotic) confidence += 0.3;
    if (chaosStrength > 0.5) confidence += 0.3;
    if (fractalDimension > 1.5 && fractalDimension < 2.5) confidence += 0.4;

    return Math.min(1, confidence);
  }

  /**
   * Detect current market regime based on attractor properties
   */
  detectMarketRegime(signals) {
    const lorenzChaos = signals.lorenz.chaosStrength;
    const chenChaos = signals.chen.chaosStrength;
    const rosslerChaos = signals.rossler.chaosStrength;

    const avgChaos = (lorenzChaos + chenChaos + rosslerChaos) / 3;

    if (avgChaos > 0.8) return 'high_volatility';
    if (avgChaos > 0.5) return 'moderate_volatility';
    if (avgChaos > 0.2) return 'low_volatility';
    return 'stable';
  }

  /**
   * Adapt ensemble weights based on recent performance
   */
  adaptWeights(signals, marketData) {
    if (this.signalHistory.length < 2) return;

    const recentSignals = this.signalHistory.slice(-10);
    const performance = this.calculateAttractorPerformance(recentSignals, marketData);

    // Adjust weights based on performance
    Object.keys(this.ensembleWeights).forEach(name => {
      const perf = performance[name] || 0;
      this.ensembleWeights[name] += this.adaptationRate * perf;

      // Keep weights in reasonable range
      this.ensembleWeights[name] = Math.max(0.1, Math.min(0.6, this.ensembleWeights[name]));
    });

    // Renormalize weights
    const totalWeight = Object.values(this.ensembleWeights).reduce((sum, w) => sum + w, 0);
    Object.keys(this.ensembleWeights).forEach(name => {
      this.ensembleWeights[name] /= totalWeight;
    });
  }

  /**
   * Calculate performance of each attractor
   */
  calculateAttractorPerformance(recentSignals, marketData) {
    const performance = {};

    // Simple performance calculation based on signal consistency
    // In real implementation, this would use actual market returns
    Object.keys(this.attractors).forEach(name => {
      const attractorSignals = recentSignals.map(s => s.individualSignals[name]);
      const consistency = this.calculateSignalConsistency(attractorSignals);
      performance[name] = consistency - 0.5; // Center around 0
    });

    return performance;
  }

  /**
   * Calculate signal consistency
   */
  calculateSignalConsistency(signals) {
    if (signals.length < 2) return 0.5;

    let consistency = 0;
    for (let i = 1; i < signals.length; i++) {
      const prev = signals[i-1].decision;
      const curr = signals[i].decision;

      // Reward consistent signals, penalize whipsaws
      if (prev === curr) consistency += 0.1;
      else if (this.areOppositeDecisions(prev, curr)) consistency -= 0.2;
    }

    return Math.max(0, Math.min(1, 0.5 + consistency));
  }

  /**
   * Check if two decisions are opposites
   */
  areOppositeDecisions(decision1, decision2) {
    const opposites = {
      'STRONG_BUY': 'STRONG_SELL',
      'BUY': 'SELL',
      'SELL': 'BUY',
      'STRONG_SELL': 'STRONG_BUY'
    };

    return opposites[decision1] === decision2;
  }

  /**
   * Get properties of all attractors
   */
  getAttractorProperties() {
    const properties = {};

    Object.keys(this.attractors).forEach(name => {
      const attractor = this.attractors[name];
      properties[name] = attractor.getProperties();

      // Add attractor-specific properties
      if (name === 'lorenz') {
        properties[name] = { ...properties[name], ...attractor.getLorenzProperties() };
      } else if (name === 'chen') {
        properties[name] = { ...properties[name], ...attractor.getChenProperties() };
      } else if (name === 'rossler') {
        properties[name] = { ...properties[name], ...attractor.getRosslerProperties() };
      }
    });

    return properties;
  }

  /**
   * Reset all attractors
   */
  reset() {
    Object.values(this.attractors).forEach(attractor => {
      attractor.reset();
    });

    this.signalHistory = [];
  }

  /**
   * Tune attractor parameters for optimal performance
   */
  tuneParameters(marketConditions) {
    // Adjust parameters based on market conditions
    if (marketConditions.volatility === 'high') {
      // High volatility: increase chaos parameters
      this.attractors.lorenz.setParameters(12, 32, 8/3);
      this.attractors.chen.setParameters(6, -12, -0.4);
      this.attractors.rossler.setParameters(0.25, 0.25, 6.0);
    } else if (marketConditions.volatility === 'low') {
      // Low volatility: decrease chaos parameters
      this.attractors.lorenz.setParameters(8, 24, 8/3);
      this.attractors.chen.setParameters(4, -8, -0.35);
      this.attractors.rossler.setParameters(0.15, 0.15, 5.0);
    }

    // Reset attractors with new parameters
    this.reset();
    this.initializeAttractors();
  }

  /**
   * Get ensemble performance metrics
   */
  getPerformanceMetrics() {
    if (this.signalHistory.length === 0) return null;

    const recentSignals = this.signalHistory.slice(-100);
    const decisions = recentSignals.map(s => s.ensembleSignal.decision);

    // Calculate decision distribution
    const distribution = {};
    decisions.forEach(decision => {
      distribution[decision] = (distribution[decision] || 0) + 1;
    });

    // Calculate confidence statistics
    const confidences = recentSignals.map(s => s.ensembleSignal.confidence);
    const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;

    return {
      totalSignals: recentSignals.length,
      decisionDistribution: distribution,
      averageConfidence: avgConfidence,
      currentWeights: { ...this.ensembleWeights },
      attractorHealth: this.getAttractorProperties()
    };
  }
}

module.exports = AttractorManager;