# 🌀 Constitutional Market Harmonics

**A chaos-theoretic trading system that optimizes both financial returns AND constitutional impact using strange attractors.**

![Fractal Love](https://img.shields.io/badge/Fractal_Love-💚-brightgreen)
![ROI × Ethics](https://img.shields.io/badge/Formula-ROI_×_Ethics-blue)
![Strange Attractors](https://img.shields.io/badge/Chaos-Lorenz_•_Chen_•_Rossler-purple)

## ⚠️ Security Notice

This includes a **secure local dashboard** for monitoring portfolio performance. It is designed for **local development only** and includes proper authentication.

## 🚀 Quick Start

### Option 1: Dashboard Only (Recommended)

```powershell
cd "c:\Users\regan\ID SYSTEM\axiom-x\constitutional-market-harmonics\dashboard"
node working-server.js
```

Then open `dashboard_REAL.html` in your browser and login with password: `fractal2025`

### Option 2: Full System

```bash
# Install dependencies
npm install

# Start the dashboard
cd dashboard
node working-server.js

# In another terminal, start the trading system
npm run cli start
```

## 🔐 Dashboard Features

- **Secure Authentication**: Token-based login system
- **Real-time Portfolio Data**: Live positions and performance metrics
- **Constitutional Scoring**: Ethical alignment analysis
- **Interactive Charts**: Plotly.js visualizations
- **Responsive Design**: Modern Tailwind CSS interface

## 🛡️ Security

- ✅ API keys stored server-side only
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ No client-side secret exposure
- ✅ Local-only operation

## 📊 Dashboard API

```javascript
// Login
const response = await fetch('http://127.0.0.1:3002/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'fractal2025' })
});

// Get portfolio data
const dashboard = await fetch('http://127.0.0.1:3002/api/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🌟 System Overview

Constitutional Market Harmonics is a revolutionary trading system that proves the **"Fractal Love Hypothesis"**: ethical investing doesn't just feel good—it **outperforms** traditional approaches through intelligent signal generation and constitutional alignment.

The system uses **strange attractors** (Lorenz, Chen, Rossler) to generate trading signals while scoring companies against the **Yama principles** of constitutional AI:

- **Ahimsa** (Non-violence)
- **Satya** (Truthfulness)
- **Asteya** (Non-stealing)
- **Brahmacharya** (Moderation)
- **Aparigraha** (Non-attachment)

### 🎯 Core Innovation

**Fractal Love Score = ROI × Constitutional Impact**

This dual optimization creates a powerful feedback loop where:
- ✅ Ethical companies get better signals
- ✅ Better signals lead to higher returns
- ✅ Higher returns enable more ethical investing
- ✅ More ethical investing improves signal quality

## 🌀 Strange Attractors

The system employs three chaotic systems for signal generation:

### Lorenz Attractor
- **Weather-like unpredictability**
- **Best for**: Trend following, momentum signals
- **Parameters**: σ=10, ρ=28, β=8/3

### Chen Attractor
- **Complex spiral dynamics**
- **Best for**: Mean reversion, timing signals
- **Parameters**: a=5, b=-10, c=-0.38

### Rossler Attractor
- **Robust chaos with spirals**
- **Best for**: Oscillation trading, cycle detection
- **Parameters**: a=0.2, b=0.2, c=5.7

## 🕉️ Constitutional Scoring

Companies are evaluated against five Yama principles:

| Principle | Description | Impact on Score |
|-----------|-------------|-----------------|
| **Ahimsa** | Non-violence, harm minimization | Environmental, labor practices |
| **Satya** | Truthfulness, transparency | Financial reporting, governance |
| **Asteya** | Non-stealing, fair practices | Supply chain ethics, competition |
| **Brahmacharya** | Moderation, sustainability | Resource usage, long-term focus |
| **Aparigraha** | Non-attachment, stakeholder balance | Executive compensation, community impact |

## 💰 Counterfactual Impact Modeling

Scale positions from $100K to $10M while modeling market impact:

- **Almgren-Chriss model** for price impact
- **Fractal scaling laws** for size effects
- **Nonlinear effects** at large sizes
- **Counterfactual scenarios** for risk assessment

## 📈 Performance Metrics

### Dual Metrics Tracking
- **Financial ROI**: Traditional return metrics
- **Constitutional Impact**: Ethical alignment score
- **Fractal Love Score**: ROI × Constitutional Impact
- **Benchmark Comparison**: S&P 500, Nasdaq 100

### Risk Management
- **Portfolio Volatility**: Risk-adjusted returns
- **Sharpe Ratio**: Risk-adjusted performance
- **Maximum Drawdown**: Peak-to-trough decline
- **Diversification Ratio**: Portfolio concentration

## 🖥️ Command Line Interface

```bash
# Start trading system
cmh start

# Interactive shell
cmh shell

# Score a company
cmh score AAPL

# Show portfolio
cmh portfolio

# View performance
cmh performance

# Show fractal love history
cmh fractal-love

# Model market impact
cmh impact AAPL --base 100000 --target 10000000

# Rebalance portfolio
cmh rebalance
```

## 🔧 Configuration

Create a `config.json` file:

```json
{
  "portfolioId": "my_portfolio",
  "paperTrading": true,
  "updateInterval": 60000,
  "basePositionSize": 100000,
  "targetPositionSize": 10000000,
  "apiKeys": {
    "alphaVantage": "your_key_here",
    "polygon": "your_key_here"
  }
}
```

## 📊 API Keys

### Alpha Vantage (Free)
```bash
export ALPHA_VANTAGE_API_KEY=your_key_here
```

### Polygon.io (Free tier available)
```bash
export POLYGON_API_KEY=your_key_here
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Test attractors
npm run attractors:test

# Test constitutional scoring
npm run score:test
```

## 🎭 Demo Mode

Run a complete demonstration:

```bash
npm run demo
```

This will:
- Initialize the system
- Score demo companies constitutionally
- Run paper trading for 2 minutes
- Show final performance results

## 📚 Key Concepts

### Fractal Love Hypothesis
> "Ethical investing outperforms because consciousness creates more efficient markets"

### Strange Attractors in Finance
Chaotic systems that generate **deterministic unpredictability** - perfect for modeling market dynamics.

### Constitutional AI Integration
Direct integration with Axiom X's constitutional evolution for ethical decision-making.

### Counterfactual Scaling
Model how $100K positions would impact markets at $10M scale using fractal mathematics.

## 🚨 Important Notes

- **Paper Trading Only**: Start with `paperTrading: true`
- **API Keys**: Required for real market data
- **Risk Warning**: This is experimental software
- **Ethical Focus**: Constitutional alignment is prioritized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is part of the Axiom X ecosystem. See Axiom X documentation for licensing terms.

## 🙏 Acknowledgments

- **Axiom X**: Constitutional AI framework
- **Strange Attractors**: Chaos theory pioneers
- **Yama Principles**: Ancient wisdom for modern ethics
- **Fractal Mathematics**: Benoit Mandelbrot's legacy

---

**"In the dance of chaos and consciousness, ethics becomes the most profitable strategy."**

💚 Built with Fractal Love