/**
 * Lorenz Attractor
 * Classic chaotic system used for weather modeling and trading signals
 * dx/dt = σ(y - x)
 * dy/dt = x(ρ - z) - y
 * dz/dt = xy - βz
 */

const BaseAttractor = require('./BaseAttractor');

class LorenzAttractor extends BaseAttractor {
  constructor(sigma = 10, rho = 28, beta = 8/3) {
    super(3);
    this.setParameters(sigma, rho, beta);
    this.bounds = { min: -50, max: 50 };
  }

  /**
   * Set Lorenz parameters
   * @param {number} sigma - Prandtl number (typically 10)
   * @param {number} rho - Rayleigh number (typically 28)
   * @param {number} beta - Geometric factor (typically 8/3)
   */
  setParameters(sigma, rho, beta) {
    this.parameters = { sigma, rho, beta };
  }

  /**
   * Calculate derivatives for Lorenz system
   */
  calculateDerivatives(state) {
    const [x, y, z] = state;
    const { sigma, rho, beta } = this.parameters;

    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;

    return [dx, dy, dz];
  }

  /**
   * Generate trading signals from Lorenz attractor
   * Uses the x-component as primary signal, z-component as confirmation
   */
  generateTradingSignal() {
    // Evolve attractor multiple steps for stability
    for (let i = 0; i < 10; i++) {
      this.evolve();
    }

    const [x, y, z] = this.state;
    const properties = this.getProperties();

    // Signal generation based on attractor dynamics
    const signal = {
      timestamp: Date.now(),
      attractor: 'lorenz',
      primarySignal: x, // Main trading direction
      confirmationSignal: z, // Confirmation signal
      volatility: Math.abs(y), // Market volatility proxy
      chaosStrength: properties.lyapunovExponent,
      fractalDimension: properties.fractalDimension,
      isChaotic: properties.isChaotic
    };

    // Normalize signals to [-1, 1] range
    signal.normalizedPrimary = this.normalizeSignal(x);
    signal.normalizedConfirmation = this.normalizeSignal(z);
    signal.normalizedVolatility = Math.min(1, Math.abs(y) / 20);

    // Generate trading decision
    signal.decision = this.generateDecision(signal);

    return signal;
  }

  /**
   * Normalize signal to [-1, 1] range
   */
  normalizeSignal(value) {
    const maxAbs = 30; // Typical Lorenz range
    return Math.max(-1, Math.min(1, value / maxAbs));
  }

  /**
   * Generate trading decision based on signals
   */
  generateDecision(signal) {
    const { normalizedPrimary, normalizedConfirmation, chaosStrength } = signal;

    // Strong buy signal
    if (normalizedPrimary > 0.3 && normalizedConfirmation > 0.2 && chaosStrength > 0.5) {
      return 'STRONG_BUY';
    }

    // Buy signal
    if (normalizedPrimary > 0.1 && normalizedConfirmation > 0) {
      return 'BUY';
    }

    // Strong sell signal
    if (normalizedPrimary < -0.3 && normalizedConfirmation < -0.2 && chaosStrength > 0.5) {
      return 'STRONG_SELL';
    }

    // Sell signal
    if (normalizedPrimary < -0.1 && normalizedConfirmation < 0) {
      return 'SELL';
    }

    // Hold signal
    return 'HOLD';
  }

  /**
   * Get Lorenz-specific properties
   */
  getLorenzProperties() {
    const baseProps = this.getProperties();
    const [x, y, z] = this.state;

    return {
      ...baseProps,
      attractorType: 'lorenz',
      wingPosition: z > this.parameters.rho - 1 ? 'upper' : 'lower',
      convectionStrength: Math.abs(x),
      temperatureDifference: y,
      geometricFactor: this.parameters.beta,
      rayleighNumber: this.parameters.rho,
      prandtlNumber: this.parameters.sigma
    };
  }

  /**
   * Set initial conditions for different Lorenz behaviors
   */
  setInitialConditions(type = 'classic') {
    switch (type) {
      case 'classic':
        this.setState([1, 1, 1]);
        break;
      case 'symmetric':
        this.setState([0, 1, 0]);
        break;
      case 'periodic':
        this.setState([Math.sqrt(this.parameters.beta * (this.parameters.rho - 1)), Math.sqrt(this.parameters.beta * (this.parameters.rho - 1)), this.parameters.rho - 1]);
        break;
      case 'fixed_point':
        this.setState([0, 0, 0]);
        break;
      default:
        this.setState([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]);
    }
  }
}

module.exports = LorenzAttractor;