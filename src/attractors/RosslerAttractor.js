/**
 * Rossler Attractor
 * Chaotic system discovered by Otto Rossler in 1976
 * Simpler than Lorenz but exhibits robust chaos
 * dx/dt = -y - z
 * dy/dt = x + ay
 * dz/dt = b + z(x - c)
 */

const BaseAttractor = require('./BaseAttractor');

class RosslerAttractor extends BaseAttractor {
  constructor(a = 0.2, b = 0.2, c = 5.7) {
    super(3);
    this.setParameters(a, b, c);
    this.bounds = { min: -50, max: 50 };
  }

  /**
   * Set Rossler parameters
   * @param {number} a - System parameter (typically 0.2)
   * @param {number} b - System parameter (typically 0.2)
   * @param {number} c - System parameter (typically 5.7)
   */
  setParameters(a, b, c) {
    this.parameters = { a, b, c };
  }

  /**
   * Calculate derivatives for Rossler system
   */
  calculateDerivatives(state) {
    const [x, y, z] = state;
    const { a, b, c } = this.parameters;

    const dx = -y - z;
    const dy = x + a * y;
    const dz = b + z * (x - c);

    return [dx, dy, dz];
  }

  /**
   * Generate trading signals from Rossler attractor
   * Uses the spiral dynamics for timing signals
   */
  generateTradingSignal() {
    // Evolve attractor multiple steps for stability
    for (let i = 0; i < 12; i++) {
      this.evolve();
    }

    const [x, y, z] = this.state;
    const properties = this.getProperties();

    // Rossler attractor creates spiral patterns useful for timing
    const signal = {
      timestamp: Date.now(),
      attractor: 'rossler',
      primarySignal: x, // X component for main signal
      timingSignal: y, // Y component for timing
      momentumSignal: z, // Z component for momentum
      chaosStrength: properties.lyapunovExponent,
      fractalDimension: properties.fractalDimension,
      isChaotic: properties.isChaotic
    };

    // Normalize signals
    signal.normalizedPrimary = this.normalizeSignal(x);
    signal.normalizedTiming = this.normalizeSignal(y);
    signal.normalizedMomentum = this.normalizeSignal(z);

    // Calculate spiral phase for timing
    signal.spiralPhase = Math.atan2(y, x);
    signal.spiralRadius = Math.sqrt(x*x + y*y);

    // Generate trading decision
    signal.decision = this.generateDecision(signal);

    return signal;
  }

  /**
   * Normalize signal to [-1, 1] range
   */
  normalizeSignal(value) {
    const maxAbs = 25; // Typical Rossler attractor range
    return Math.max(-1, Math.min(1, value / maxAbs));
  }

  /**
   * Generate trading decision based on Rossler signals
   */
  generateDecision(signal) {
    const { normalizedPrimary, normalizedTiming, normalizedMomentum, chaosStrength, spiralPhase } = signal;

    // Rossler signals use spiral dynamics for timing
    const inBullishPhase = spiralPhase > 0 && spiralPhase < Math.PI;
    const inBearishPhase = spiralPhase < 0 || spiralPhase > Math.PI;

    // Strong buy conditions
    if (normalizedPrimary > 0.3 && inBullishPhase && chaosStrength > 0.6 && normalizedMomentum > 0.1) {
      return 'STRONG_BUY';
    }

    // Buy conditions
    if (normalizedPrimary > 0.1 && inBullishPhase && normalizedTiming > 0) {
      return 'BUY';
    }

    // Strong sell conditions
    if (normalizedPrimary < -0.3 && inBearishPhase && chaosStrength > 0.6 && normalizedMomentum < -0.1) {
      return 'STRONG_SELL';
    }

    // Sell conditions
    if (normalizedPrimary < -0.1 && inBearishPhase && normalizedTiming < 0) {
      return 'SELL';
    }

    // Hold for neutral phases
    return 'HOLD';
  }

  /**
   * Get Rossler-specific properties
   */
  getRosslerProperties() {
    const baseProps = this.getProperties();
    const [x, y, z] = this.state;

    return {
      ...baseProps,
      attractorType: 'rossler',
      spiralRadius: Math.sqrt(x*x + y*y),
      spiralPhase: Math.atan2(y, x),
      parameterA: this.parameters.a,
      parameterB: this.parameters.b,
      parameterC: this.parameters.c,
      equilibriumOffset: this.parameters.b,
      chaosThreshold: this.parameters.c
    };
  }

  /**
   * Set initial conditions for different Rossler behaviors
   */
  setInitialConditions(type = 'chaotic') {
    switch (type) {
      case 'chaotic':
        this.setState([1, 1, 1]);
        break;
      case 'periodic':
        this.setState([0.1, 0.1, 0.1]);
        break;
      case 'stable':
        this.setState([0, 0, 0]);
        break;
      case 'large_spiral':
        this.setState([10, 10, 10]);
        break;
      default:
        this.setState([
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]);
    }
  }

  /**
   * Calculate Rossler attractor bifurcation diagram
   */
  calculateBifurcationDiagram(parameterRange = { min: 2, max: 7, steps: 100 }) {
    const bifurcationData = [];

    for (let c = parameterRange.min; c <= parameterRange.max; c += (parameterRange.max - parameterRange.min) / parameterRange.steps) {
      this.setParameters(this.parameters.a, this.parameters.b, c);
      this.reset();
      this.setInitialConditions('chaotic');

      // Evolve to steady state
      for (let i = 0; i < 1000; i++) {
        this.evolve();
      }

      // Collect points for bifurcation diagram
      const points = [];
      for (let i = 0; i < 100; i++) {
        this.evolve();
        points.push(this.state[0]); // x-component
      }

      bifurcationData.push({
        parameter: c,
        values: points,
        lyapunov: this.calculateLyapunovExponent(500)
      });
    }

    return bifurcationData;
  }

  /**
   * Find periodic windows in Rossler attractor
   */
  findPeriodicWindows() {
    const windows = [];
    const bifurcationData = this.calculateBifurcationDiagram();

    for (let i = 1; i < bifurcationData.length - 1; i++) {
      const current = bifurcationData[i];
      const prev = bifurcationData[i-1];
      const next = bifurcationData[i+1];

      // Look for regions with fewer distinct values (periodic windows)
      const currentUnique = new Set(current.values.map(v => Math.round(v * 100) / 100)).size;
      const prevUnique = new Set(prev.values.map(v => Math.round(v * 100) / 100)).size;
      const nextUnique = new Set(next.values.map(v => Math.round(v * 100) / 100)).size;

      if (currentUnique < prevUnique && currentUnique < nextUnique && currentUnique <= 3) {
        windows.push({
          parameter: current.parameter,
          period: currentUnique,
          lyapunov: current.lyapunov
        });
      }
    }

    return windows;
  }
}

module.exports = RosslerAttractor;