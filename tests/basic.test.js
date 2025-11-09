/**
 * Basic tests for Constitutional Market Harmonics
 */

const ConstitutionalMarketHarmonics = require('../src/core/ConstitutionalMarketHarmonics');
const ConstitutionalScorer = require('../src/constitutional/ConstitutionalScorer');
const AttractorManager = require('../src/attractors/AttractorManager');

describe('Constitutional Market Harmonics', () => {
  let system;

  beforeEach(() => {
    system = new ConstitutionalMarketHarmonics({
      paperTrading: true,
      updateInterval: 1000 // Fast for testing
    });
  });

  afterEach(async () => {
    if (system && system.isRunning) {
      await system.stop();
    }
  });

  test('system initializes correctly', async () => {
    await system.initializeComponents();
    expect(system.db).toBeDefined();
    expect(system.constitutionalScorer).toBeDefined();
    expect(system.attractorManager).toBeDefined();
  });

  test('attractors generate signals', () => {
    const manager = new AttractorManager();
    manager.initializeAttractors();

    const signal = manager.generateEnsembleSignal();
    expect(signal).toHaveProperty('decision');
    expect(signal).toHaveProperty('confidence');
    expect(signal).toHaveProperty('timestamp');
  });

  test('constitutional scorer works', async () => {
    const scorer = new ConstitutionalScorer();

    // Test with a mock company
    const score = await scorer.scoreCompany('TEST');
    expect(score).toHaveProperty('overall');
    expect(score).toHaveProperty('yamaScores');
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(1);
  });

  test('portfolio tracks positions', () => {
    const portfolio = system.getPortfolio();
    expect(portfolio).toHaveProperty('positions');
    expect(portfolio).toHaveProperty('cash');
    expect(portfolio).toHaveProperty('totalValue');
  });

  test('system status is available', () => {
    const status = system.getStatus();
    expect(status).toHaveProperty('isRunning');
    expect(status).toHaveProperty('portfolio');
    expect(status).toHaveProperty('components');
  });
});

describe('AttractorManager', () => {
  let manager;

  beforeEach(() => {
    manager = new AttractorManager();
    manager.initializeAttractors();
  });

  test('generates ensemble signals', () => {
    const signal = manager.generateEnsembleSignal();
    expect(['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL']).toContain(signal.decision);
    expect(signal.confidence).toBeGreaterThanOrEqual(0);
    expect(signal.confidence).toBeLessThanOrEqual(1);
  });

  test('provides performance metrics', () => {
    // Generate some signals first
    for (let i = 0; i < 5; i++) {
      manager.generateEnsembleSignal();
    }

    const metrics = manager.getPerformanceMetrics();
    expect(metrics).toHaveProperty('totalSignals');
    expect(metrics).toHaveProperty('averageConfidence');
    expect(metrics).toHaveProperty('currentWeights');
  });
});

describe('ConstitutionalScorer', () => {
  let scorer;

  beforeEach(() => {
    scorer = new ConstitutionalScorer();
  });

  test('scores companies with yama principles', async () => {
    const score = await scorer.scoreCompany('AAPL');

    expect(score).toHaveProperty('overall');
    expect(score).toHaveProperty('yamaScores');
    expect(score).toHaveProperty('ethicalAlignment');

    // Check Yama principles
    const yamaPrinciples = ['ahimsa', 'satya', 'asteya', 'brahmacharya', 'aparigraha'];
    yamaPrinciples.forEach(principle => {
      expect(score.yamaScores).toHaveProperty(principle);
      expect(score.yamaScores[principle]).toBeGreaterThanOrEqual(0);
      expect(score.yamaScores[principle]).toBeLessThanOrEqual(1);
    });
  });

  test('provides ethical alignment levels', async () => {
    const score = await scorer.scoreCompany('TSLA');

    const alignments = ['Transcendent', 'Highly Aligned', 'Well Aligned', 'Moderately Aligned', 'Poorly Aligned', 'Misaligned'];
    expect(alignments).toContain(score.ethicalAlignment);
  });
});