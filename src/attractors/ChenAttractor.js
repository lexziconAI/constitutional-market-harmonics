/**
 * Chen Attractor
 * Chaotic system discovered by Chen and Yang in 1999
 * More complex than Lorenz with higher-dimensional chaos
 * dx/dt = a(y - x)
 * dy/dt = (c - a)x - xz + cy
 * dz/dt = xy - bz
 */

const BaseAttractor = require('./BaseAttractor');

class ChenAttractor extends BaseAttractor {
  constructor(a = 5, b = -10, c = -0.38) {
    super(3);
    this.setParameters(a, b, c);
    this.bounds = { min: -100, max: 100 };
  }

  /**
   * Set Chen parameters
   * @param {number} a - System parameter (typically 5)
   * @param {number} b - System parameter (typically -10)
   * @param {number} c - System parameter (typically -0.38)
   */
  setParameters(a, b, c) {
    this.parameters = { a, b, c };
  }

  /**
   * Calculate derivatives for Chen system
   */
  calculateDerivatives(state) {
    const [x, y, z] = state;
    const { a, b, c } = this.parameters;

    const dx = a * (y - x);
    const dy = (c - a) * x - x * z + c * y;
    const dz = x * y - b * z;

    return [dx, dy, dz];
  }

  /**
   * Generate trading signals from Chen attractor
   * Uses complex dynamics for sophisticated signal generation
   */
  generateTradingSignal() {
    // Evolve attractor multiple steps for stability
    for (let i = 0; i < 15; i++) {
      this.evolve();
    }

    const [x, y, z] = this.state;
    const properties = this.getProperties();

    // Chen attractor has more complex dynamics than Lorenz
    const signal = {
      timestamp: Date.now(),
      attractor: 'chen',
      primarySignal: x * y, // Product of x and y for complex signals
      confirmationSignal: z, // Z component as confirmation
      momentumSignal: x - y, // Difference for momentum
      chaosStrength: properties.lyapunovExponent,
      fractalDimension: properties.fractalDimension,
      isChaotic: properties.isChaotic
    };

    // Normalize signals
    signal.normalizedPrimary = this.normalizeSignal(signal.primarySignal);
    signal.normalizedConfirmation = this.normalizeSignal(z);
    signal.normalizedMomentum = this.normalizeSignal(signal.momentumSignal);

    // Generate trading decision
    signal.decision = this.generateDecision(signal);

    return signal;
  }

  /**
   * Normalize signal to [-1, 1] range
   */
  normalizeSignal(value) {
    const maxAbs = 50; // Typical Chen attractor range
    return Math.max(-1, Math.min(1, value / maxAbs));
  }

  /**
   * Generate trading decision based on Chen signals
   */
  generateDecision(signal) {
    const { normalizedPrimary, normalizedConfirmation, normalizedMomentum, chaosStrength } = signal;

    // Chen attractor signals are more complex and sensitive
    const primaryWeight = 0.4;
    const confirmationWeight = 0.3;
    const momentumWeight = 0.3;

    const weightedSignal = primaryWeight * normalizedPrimary +
                          confirmationWeight * normalizedConfirmation +
                          momentumWeight * normalizedMomentum;

    // Strong buy conditions
    if (weightedSignal > 0.4 && chaosStrength > 0.7 && normalizedMomentum > 0.2) {
      return 'STRONG_BUY';
    }

    // Buy conditions
    if (weightedSignal > 0.2 && normalizedConfirmation > 0.1) {
      return 'BUY';
    }

    // Strong sell conditions
    if (weightedSignal < -0.4 && chaosStrength > 0.7 && normalizedMomentum < -0.2) {
      return 'STRONG_SELL';
    }

    // Sell conditions
    if (weightedSignal < -0.2 && normalizedConfirmation < -0.1) {
      return 'SELL';
    }

    // Hold for neutral or low confidence signals
    return 'HOLD';
  }

  /**
   * Get Chen-specific properties
   */
  getChenProperties() {
    const baseProps = this.getProperties();
    const [x, y, z] = this.state;

    return {
      ...baseProps,
      attractorType: 'chen',
      systemComplexity: Math.abs(x * y * z),
      parameterA: this.parameters.a,
      parameterB: this.parameters.b,
      parameterC: this.parameters.c,
      equilibriumDistance: Math.sqrt(x*x + y*y + z*z),
      dynamicRange: Math.max(Math.abs(x), Math.abs(y), Math.abs(z))
    };
  }

  /**
   * Set initial conditions for different Chen behaviors
   */
  setInitialConditions(type = 'chaotic') {
    switch (type) {
      case 'chaotic':
        this.setState([5, 10, 0.5]);
        break;
      case 'periodic':
        this.setState([1, 1, 1]);
        break;
      case 'stable':
        this.setState([0, 0, 0]);
        break;
      case 'high_energy':
        this.setState([20, -15, 5]);
        break;
      default:
        this.setState([
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        ]);
    }
  }

  /**
   * Calculate Chen attractor bifurcation points
   */
  calculateBifurcationPoints() {
    const bifurcationPoints = [];
    const testRange = { min: -20, max: 20, steps: 100 };

    for (let a = testRange.min; a <= testRange.max; a += (testRange.max - testRange.min) / testRange.steps) {
      this.setParameters(a, this.parameters.b, this.parameters.c);
      this.reset();
      this.setInitialConditions('chaotic');

      // Evolve and check for chaos
      for (let i = 0; i < 1000; i++) {
        this.evolve();
      }

      const lyapunov = this.calculateLyapunovExponent(500);
      if (lyapunov > 0.1) { // Chaotic region
        bifurcationPoints.push({ parameter: a, lyapunov, type: 'chaotic' });
      } else {
        bifurcationPoints.push({ parameter: a, lyapunov, type: 'stable' });
      }
    }

    return bifurcationPoints;
  }
}

module.exports = ChenAttractor;