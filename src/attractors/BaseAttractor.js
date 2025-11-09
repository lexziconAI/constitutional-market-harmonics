/**
 * Base Strange Attractor
 * Abstract base class for chaos-theoretic attractors used in trading strategies
 */

const math = require('mathjs');

class BaseAttractor {
  constructor(dimensions = 3) {
    this.dimensions = dimensions;
    this.state = new Array(dimensions).fill(0);
    this.parameters = {};
    this.bounds = { min: -100, max: 100 };
    this.trajectory = [];
    this.lyapunovHistory = [];
    this.fractalHistory = [];
  }

  /**
   * Set attractor parameters
   */
  setParameters(...params) {
    // Override in subclasses
  }

  /**
   * Set initial state
   */
  setState(state) {
    if (state.length !== this.dimensions) {
      throw new Error(`State must have ${this.dimensions} dimensions`);
    }
    this.state = [...state];
    this.trajectory = [this.state];
  }

  /**
   * Evolve attractor by one step
   */
  evolve() {
    const derivatives = this.calculateDerivatives(this.state);
    const dt = 0.01; // Time step

    // Runge-Kutta 4th order integration
    const k1 = derivatives.map(d => d * dt);
    const k2 = this.calculateDerivatives(
      this.state.map((s, i) => s + k1[i] / 2)
    ).map(d => d * dt);
    const k3 = this.calculateDerivatives(
      this.state.map((s, i) => s + k2[i] / 2)
    ).map(d => d * dt);
    const k4 = this.calculateDerivatives(
      this.state.map((s, i) => s + k3[i])
    ).map(d => d * dt);

    // Update state
    this.state = this.state.map((s, i) =>
      s + (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) / 6
    );

    // Apply bounds
    this.applyBounds();

    // Store trajectory
    this.trajectory.push([...this.state]);

    // Keep trajectory manageable
    if (this.trajectory.length > 10000) {
      this.trajectory = this.trajectory.slice(-5000);
    }

    return this.state;
  }

  /**
   * Calculate derivatives (override in subclasses)
   */
  calculateDerivatives(state) {
    throw new Error('calculateDerivatives must be implemented by subclass');
  }

  /**
   * Apply bounds to prevent numerical instability
   */
  applyBounds() {
    this.state = this.state.map(s => {
      if (s > this.bounds.max) return this.bounds.max;
      if (s < this.bounds.min) return this.bounds.min;
      return s;
    });
  }

  /**
   * Calculate Lyapunov exponent
   */
  calculateLyapunovExponent(trajectoryLength = 1000) {
    if (this.trajectory.length < trajectoryLength) {
      // Need more data
      for (let i = 0; i < trajectoryLength - this.trajectory.length; i++) {
        this.evolve();
      }
    }

    const recentTrajectory = this.trajectory.slice(-trajectoryLength);
    let lyapunovSum = 0;
    let count = 0;

    // Calculate local Lyapunov exponents
    for (let i = 1; i < recentTrajectory.length; i++) {
      const dist = math.distance(recentTrajectory[i], recentTrajectory[i-1]);
      if (dist > 0) {
        lyapunovSum += Math.log(dist);
        count++;
      }
    }

    const lyapunov = count > 0 ? lyapunovSum / count : 0;
    this.lyapunovHistory.push(lyapunov);

    // Keep history manageable
    if (this.lyapunovHistory.length > 100) {
      this.lyapunovHistory = this.lyapunovHistory.slice(-50);
    }

    return lyapunov;
  }

  /**
   * Calculate fractal dimension using sandbox method
   */
  calculateFractalDimension(trajectoryLength = 2000) {
    if (this.trajectory.length < trajectoryLength) {
      for (let i = 0; i < trajectoryLength - this.trajectory.length; i++) {
        this.evolve();
      }
    }

    const trajectory = this.trajectory.slice(-trajectoryLength);

    // Sandbox method for fractal dimension
    const scales = [2, 4, 8, 16, 32];
    const counts = [];

    for (const scale of scales) {
      let count = 0;
      const boxes = new Set();

      for (const point of trajectory) {
        const box = point.map(coord =>
          Math.floor(coord / scale)
        ).join(',');

        if (!boxes.has(box)) {
          boxes.add(box);
          count++;
        }
      }

      counts.push(count);
    }

    // Linear regression to find slope (fractal dimension)
    const logScales = scales.map(s => Math.log(1/s));
    const logCounts = counts.map(c => Math.log(c));

    const dimension = this.linearRegressionSlope(logScales, logCounts);
    this.fractalHistory.push(dimension);

    // Keep history manageable
    if (this.fractalHistory.length > 100) {
      this.fractalHistory = this.fractalHistory.slice(-50);
    }

    return dimension;
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
   * Get attractor properties
   */
  getProperties() {
    const lyapunov = this.calculateLyapunovExponent();
    const fractal = this.calculateFractalDimension();

    return {
      dimensions: this.dimensions,
      currentState: [...this.state],
      trajectoryLength: this.trajectory.length,
      lyapunovExponent: lyapunov,
      fractalDimension: fractal,
      isChaotic: lyapunov > 0,
      parameters: { ...this.parameters },
      bounds: { ...this.bounds }
    };
  }

  /**
   * Reset attractor
   */
  reset() {
    this.state = new Array(this.dimensions).fill(0);
    this.trajectory = [];
    this.lyapunovHistory = [];
    this.fractalHistory = [];
  }

  /**
   * Clone attractor
   */
  clone() {
    const cloned = new this.constructor();
    cloned.setState([...this.state]);
    cloned.parameters = { ...this.parameters };
    cloned.bounds = { ...this.bounds };
    return cloned;
  }
}

module.exports = BaseAttractor;