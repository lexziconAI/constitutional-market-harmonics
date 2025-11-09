#!/usr/bin/env node

/**
 * Constitutional Market Harmonics CLI
 * Command-line interface for the chaos-theoretic trading system
 */

const { Command } = require('commander');
const { createInterface } = require('readline');
const ConstitutionalMarketHarmonics = require('../core/ConstitutionalMarketHarmonics');
const fs = require('fs').promises;
const path = require('path');

class CMHCLI {
  constructor() {
    this.system = null;
    this.program = new Command();
    this.rl = null;
    this.setupCommands();
  }

  /**
   * Setup CLI commands
   */
  setupCommands() {
    this.program
      .name('cmh')
      .description('Constitutional Market Harmonics - Chaos-Theoretic Trading System')
      .version('1.0.0');

    this.program
      .command('start')
      .description('Start the trading system')
      .option('-c, --config <file>', 'Configuration file path')
      .option('--paper', 'Run in paper trading mode (default)')
      .option('--live', 'Run in live trading mode (dangerous!)')
      .action(async (options) => {
        await this.startSystem(options);
      });

    this.program
      .command('stop')
      .description('Stop the trading system')
      .action(async () => {
        await this.stopSystem();
      });

    this.program
      .command('status')
      .description('Show system status')
      .action(async () => {
        await this.showStatus();
      });

    this.program
      .command('portfolio')
      .description('Show current portfolio')
      .action(async () => {
        await this.showPortfolio();
      });

    this.program
      .command('performance')
      .description('Show performance metrics')
      .action(async () => {
        await this.showPerformance();
      });

    this.program
      .command('fractal-love')
      .description('Show fractal love score history')
      .option('-l, --limit <number>', 'Number of data points to show', '50')
      .action(async (options) => {
        await this.showFractalLove(options.limit);
      });

    this.program
      .command('score')
      .description('Score a company constitutionally')
      .argument('<symbol>', 'Stock symbol to score')
      .action(async (symbol) => {
        await this.scoreCompany(symbol);
      });

    this.program
      .command('attractors')
      .description('Show attractor status and signals')
      .action(async () => {
        await this.showAttractors();
      });

    this.program
      .command('rebalance')
      .description('Rebalance portfolio based on constitutional alignment')
      .action(async () => {
        await this.rebalancePortfolio();
      });

    this.program
      .command('watch')
      .description('Add symbol to watchlist')
      .argument('<symbol>', 'Stock symbol to watch')
      .action(async (symbol) => {
        await this.watchSymbol(symbol);
      });

    this.program
      .command('unwatch')
      .description('Remove symbol from watchlist')
      .argument('<symbol>', 'Stock symbol to unwatch')
      .action(async (symbol) => {
        await this.unwatchSymbol(symbol);
      });

    this.program
      .command('impact')
      .description('Model market impact for position scaling')
      .argument('<symbol>', 'Stock symbol')
      .option('-b, --base <size>', 'Base position size', '100000')
      .option('-t, --target <size>', 'Target position size', '10000000')
      .action(async (symbol, options) => {
        await this.modelImpact(symbol, options.base, options.target);
      });

    this.program
      .command('demo')
      .description('Run a demonstration of the system')
      .option('-d, --duration <minutes>', 'Demo duration in minutes', '5')
      .action(async (options) => {
        await this.runDemo(options.duration);
      });

    this.program
      .command('shell')
      .description('Start interactive shell')
      .action(async () => {
        await this.startShell();
      });
  }

  /**
   * Start the trading system
   */
  async startSystem(options) {
    try {
      console.log('🚀 Starting Constitutional Market Harmonics...');

      // Load configuration
      let config = {};
      if (options.config) {
        const configPath = path.resolve(options.config);
        const configData = await fs.readFile(configPath, 'utf8');
        config = JSON.parse(configData);
      }

      // Set trading mode
      config.paperTrading = options.live ? false : true;

      if (!config.paperTrading) {
        console.warn('⚠️  WARNING: Live trading mode enabled! This will execute real trades!');
        const confirmed = await this.confirmAction('Are you sure you want to enable live trading?');
        if (!confirmed) {
          console.log('Live trading cancelled.');
          return;
        }
      }

      // Initialize system
      this.system = new ConstitutionalMarketHarmonics(config);

      // Start system
      await this.system.start();

      console.log('✅ Constitutional Market Harmonics started successfully!');
      console.log(`📊 Trading mode: ${config.paperTrading ? 'Paper Trading' : 'Live Trading'}`);
      console.log('💡 Use "cmh shell" to enter interactive mode');

    } catch (error) {
      console.error('❌ Failed to start system:', error.message);
      process.exit(1);
    }
  }

  /**
   * Stop the trading system
   */
  async stopSystem() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    try {
      console.log('🛑 Stopping Constitutional Market Harmonics...');
      await this.system.stop();
      console.log('✅ System stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop system:', error.message);
    }
  }

  /**
   * Show system status
   */
  async showStatus() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    const status = this.system.getStatus();

    console.log('\n📊 Constitutional Market Harmonics Status');
    console.log('=' .repeat(50));
    console.log(`Running: ${status.isRunning ? '✅ Yes' : '❌ No'}`);
    console.log(`Last Update: ${status.lastUpdate ? new Date(status.lastUpdate).toLocaleString() : 'Never'}`);

    console.log('\n💼 Portfolio:');
    console.log(`  Total Value: $${status.portfolio.totalValue.toLocaleString()}`);
    console.log(`  Cash: $${status.portfolio.cash.toLocaleString()}`);
    console.log(`  Positions: ${status.portfolio.positions}`);
    console.log(`  Symbols: ${status.portfolio.symbols.join(', ') || 'None'}`);

    console.log('\n🔗 Components:');
    console.log(`  Database: ${status.components.database}`);
    console.log(`  Market Data: ${status.components.marketData.alphaVantage.configured ? '✅ Alpha Vantage' : '❌ Alpha Vantage'}`);
    console.log(`  WebSocket: ${status.components.marketData.polygon.websocketConnected ? '✅ Polygon' : '❌ Polygon'}`);
    console.log(`  Attractors: ${status.components.attractors ? '✅ Initialized' : '❌ Not initialized'}`);
    console.log(`  Constitutional: ${status.components.constitutional}`);

    console.log('\n⚙️  Configuration:');
    console.log(`  Portfolio ID: ${status.config.portfolioId}`);
    console.log(`  Paper Trading: ${status.config.paperTrading ? '✅ Yes' : '❌ No'}`);
    console.log(`  Update Interval: ${status.config.updateInterval / 1000}s`);
  }

  /**
   * Show current portfolio
   */
  async showPortfolio() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    const portfolio = this.system.getPortfolio();

    console.log('\n💼 Current Portfolio');
    console.log('=' .repeat(50));
    console.log(`Total Value: $${portfolio.totalValue.toLocaleString()}`);
    console.log(`Cash: $${portfolio.cash.toLocaleString()}`);
    console.log(`Positions: ${portfolio.positions.length}`);

    if (portfolio.positions.length === 0) {
      console.log('\nNo positions held.');
      return;
    }

    console.log('\n📈 Positions:');
    console.log('Symbol    Quantity    Avg Price    Current Value    Weight    P&L');
    console.log('-'.repeat(70));

    for (const position of portfolio.positions) {
      const pnl = position.value - (position.quantity * position.avgPrice);
      const pnlPercent = ((position.value / (position.quantity * position.avgPrice)) - 1) * 100;

      console.log(
        `${position.symbol.padEnd(10)} ` +
        `${position.quantity.toFixed(2).padStart(10)} ` +
        `$${position.avgPrice.toFixed(2).padStart(10)} ` +
        `$${position.value.toFixed(2).padStart(14)} ` +
        `${(position.weight * 100).toFixed(1).padStart(6)}% ` +
        `${(pnl >= 0 ? '+' : '')}$${pnl.toFixed(2).padStart(8)} (${(pnl >= 0 ? '+' : '')}${pnlPercent.toFixed(1)}%)`
      );
    }
  }

  /**
   * Show performance metrics
   */
  async showPerformance() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    try {
      const report = await this.system.getPerformanceReport();

      if (!report) {
        console.log('❌ No performance data available');
        return;
      }

      console.log('\n📊 Performance Report');
      console.log('=' .repeat(50));

      const summary = report.summary;
      console.log(`Total Return: ${(summary.totalReturn * 100).toFixed(2)}%`);
      console.log(`Constitutional Score: ${(summary.constitutionalScore * 100).toFixed(1)}/100`);
      console.log(`Fractal Love Score: ${summary.fractalLoveScore.toFixed(3)}`);
      console.log(`Risk Level: ${summary.riskLevel.toUpperCase()}`);

      if (summary.benchmarkComparison.spy) {
        const spy = summary.benchmarkComparison.spy;
        console.log(`\n📈 Benchmark Comparison (S&P 500):`);
        console.log(`  Outperformance: ${(spy.outperformance * 100).toFixed(2)}%`);
        console.log(`  Outperformance Pct: ${(spy.outperformancePct * 100).toFixed(2)}%`);
      }

      if (report.recommendations && report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        for (const rec of report.recommendations) {
          const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
          console.log(`  ${priorityIcon} ${rec.message}`);
        }
      }

    } catch (error) {
      console.error('❌ Failed to get performance report:', error.message);
    }
  }

  /**
   * Show fractal love score history
   */
  async showFractalLove(limit) {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    const history = this.system.getFractalLoveHistory(parseInt(limit));

    if (history.length === 0) {
      console.log('❌ No fractal love history available');
      return;
    }

    console.log('\n💚 Fractal Love Score History');
    console.log('=' .repeat(50));
    console.log('Score represents ROI × Constitutional Impact');
    console.log('Higher scores indicate better ethical-financial alignment\n');

    // Simple ASCII chart
    const maxScore = Math.max(...history);
    const minScore = Math.min(...history);
    const range = maxScore - minScore || 1;

    for (let i = 0; i < history.length; i++) {
      const score = history[i];
      const normalized = (score - minScore) / range;
      const bars = Math.round(normalized * 20);
      const barChart = '█'.repeat(bars).padEnd(20, '░');

      console.log(`${i.toString().padStart(3)}: ${barChart} ${score.toFixed(4)}`);
    }

    const avgScore = history.reduce((sum, s) => sum + s, 0) / history.length;
    console.log(`\nAverage Fractal Love Score: ${avgScore.toFixed(4)}`);
    console.log(`Score Range: ${minScore.toFixed(4)} - ${maxScore.toFixed(4)}`);
  }

  /**
   * Score a company constitutionally
   */
  async scoreCompany(symbol) {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    try {
      console.log(`\n🔍 Scoring ${symbol} constitutionally...`);
      const score = await this.system.constitutionalScorer.scoreCompany(symbol.toUpperCase());

      console.log('\n📊 Constitutional Score Report');
      console.log('=' .repeat(50));
      console.log(`Company: ${symbol.toUpperCase()}`);
      console.log(`Overall Score: ${(score.overall * 100).toFixed(1)}/100`);
      console.log(`Ethical Alignment: ${score.ethicalAlignment}`);

      console.log('\n🕉️  Yama Principles:');
      const yamaNames = {
        ahimsa: 'Ahimsa (Non-violence)',
        satya: 'Satya (Truthfulness)',
        asteya: 'Asteya (Non-stealing)',
        brahmacharya: 'Brahmacharya (Moderation)',
        aparigraha: 'Aparigraha (Non-attachment)'
      };

      for (const [principle, value] of Object.entries(score.yamaScores)) {
        const name = yamaNames[principle] || principle;
        const score = (value * 100).toFixed(1);
        console.log(`  ${name}: ${score}/100`);
      }

      if (score.recommendation) {
        console.log(`\n💡 Recommendation: ${score.recommendation}`);
      }

    } catch (error) {
      console.error(`❌ Failed to score ${symbol}:`, error.message);
    }
  }

  /**
   * Show attractor status
   */
  async showAttractors() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    const metrics = this.system.attractorManager.getPerformanceMetrics();

    if (!metrics) {
      console.log('❌ No attractor data available');
      return;
    }

    console.log('\n🌀 Strange Attractor Status');
    console.log('=' .repeat(50));
    console.log(`Total Signals: ${metrics.totalSignals}`);
    console.log(`Average Confidence: ${(metrics.averageConfidence * 100).toFixed(1)}%`);

    console.log('\n🎯 Current Weights:');
    for (const [name, weight] of Object.entries(metrics.currentWeights)) {
      console.log(`  ${name.charAt(0).toUpperCase() + name.slice(1)}: ${(weight * 100).toFixed(1)}%`);
    }

    console.log('\n🧠 Attractor Health:');
    for (const [name, props] of Object.entries(metrics.attractorHealth)) {
      console.log(`  ${name.charAt(0).toUpperCase() + name.slice(1)}: ` +
        `Chaos=${props.isChaotic ? '✅' : '❌'} ` +
        `Lyapunov=${props.lyapunovExponent.toFixed(3)} ` +
        `Fractal=${props.fractalDimension.toFixed(3)}`);
    }
  }

  /**
   * Rebalance portfolio
   */
  async rebalancePortfolio() {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    try {
      console.log('🔄 Rebalancing portfolio...');
      await this.system.rebalancePortfolio();
      console.log('✅ Portfolio rebalanced successfully');
    } catch (error) {
      console.error('❌ Failed to rebalance portfolio:', error.message);
    }
  }

  /**
   * Watch a symbol
   */
  async watchSymbol(symbol) {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    this.system.addToWatchlist(symbol.toUpperCase());
    console.log(`👁️  Added ${symbol.toUpperCase()} to watchlist`);
  }

  /**
   * Unwatch a symbol
   */
  async unwatchSymbol(symbol) {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    this.system.removeFromWatchlist(symbol.toUpperCase());
    console.log(`🙈 Removed ${symbol.toUpperCase()} from watchlist`);
  }

  /**
   * Model market impact
   */
  async modelImpact(symbol, baseSize, targetSize) {
    if (!this.system) {
      console.log('❌ System is not running');
      return;
    }

    try {
      console.log(`📊 Modeling impact for ${symbol}...`);

      // Get current market data
      const marketData = await this.system.marketDataManager.getMarketSnapshot([symbol.toUpperCase()]);
      const data = marketData[symbol.toUpperCase()];

      if (!data) {
        console.log(`❌ No market data available for ${symbol}`);
        return;
      }

      const impact = await this.system.impactModeler.modelImpact(
        symbol.toUpperCase(),
        parseFloat(baseSize),
        parseFloat(targetSize),
        data
      );

      console.log('\n💥 Market Impact Model');
      console.log('=' .repeat(50));
      console.log(`Symbol: ${symbol.toUpperCase()}`);
      console.log(`Base Size: $${parseFloat(baseSize).toLocaleString()}`);
      console.log(`Target Size: $${parseFloat(targetSize).toLocaleString()}`);
      console.log(`Scale Ratio: ${impact.scaleRatio.toFixed(1)}x`);

      console.log('\n📈 Impact Estimates:');
      console.log(`  Base Impact: ${(impact.baseImpact.totalEstimatedSlippage * 100).toFixed(3)}%`);
      console.log(`  Scaled Impact: ${(impact.scaledImpact.totalScaledImpact * 100).toFixed(3)}%`);
      console.log(`  Nonlinear Effects: ${(impact.scaledImpact.nonlinearEffects * 100).toFixed(3)}%`);

      console.log('\n🎯 Counterfactual Scenarios:');
      for (const scenario of impact.counterfactuals) {
        const icon = scenario.probability > 0.5 ? '🎯' : scenario.probability > 0.2 ? '🎪' : '💀';
        console.log(`  ${icon} ${scenario.name}: ${(scenario.impact * 100).toFixed(3)}% (${(scenario.probability * 100).toFixed(0)}%)`);
      }

      console.log(`\n🧮 Model Confidence: ${(impact.confidence * 100).toFixed(1)}%`);

    } catch (error) {
      console.error(`❌ Failed to model impact for ${symbol}:`, error.message);
    }
  }

  /**
   * Run a demonstration
   */
  async runDemo(duration) {
    console.log('🎭 Starting Constitutional Market Harmonics Demo...');
    console.log(`Duration: ${duration} minutes`);
    console.log('This will run the system in paper trading mode for demonstration purposes.\n');

    // Start system in demo mode
    await this.startSystem({ paper: true });

    // Wait for demo duration
    const durationMs = parseInt(duration) * 60 * 1000;
    console.log(`⏰ Running demo for ${duration} minutes...`);

    await new Promise(resolve => setTimeout(resolve, durationMs));

    // Show final results
    console.log('\n🎭 Demo completed! Final results:');
    await this.showStatus();
    await this.showPortfolio();
    await this.showPerformance();

    // Stop system
    await this.stopSystem();
  }

  /**
   * Start interactive shell
   */
  async startShell() {
    console.log('🖥️  Constitutional Market Harmonics Interactive Shell');
    console.log('Type "help" for available commands, "exit" to quit\n');

    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'cmh> '
    });

    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const args = line.trim().split(' ');
      const command = args[0].toLowerCase();

      if (command === 'exit' || command === 'quit') {
        console.log('Goodbye! 🫡');
        this.rl.close();
        return;
      }

      if (command === 'help') {
        this.showShellHelp();
      } else if (command === 'status') {
        await this.showStatus();
      } else if (command === 'portfolio') {
        await this.showPortfolio();
      } else if (command === 'performance') {
        await this.showPerformance();
      } else if (command === 'fractal-love') {
        await this.showFractalLove(args[1] || '20');
      } else if (command === 'score' && args[1]) {
        await this.scoreCompany(args[1]);
      } else if (command === 'attractors') {
        await this.showAttractors();
      } else if (command === 'rebalance') {
        await this.rebalancePortfolio();
      } else if (command === 'watch' && args[1]) {
        await this.watchSymbol(args[1]);
      } else if (command === 'unwatch' && args[1]) {
        await this.unwatchSymbol(args[1]);
      } else if (command === '') {
        // Empty line, just prompt again
      } else {
        console.log(`Unknown command: ${command}. Type "help" for available commands.`);
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\nShell closed.');
      process.exit(0);
    });
  }

  /**
   * Show shell help
   */
  showShellHelp() {
    console.log('\n📚 Available Commands:');
    console.log('  status          - Show system status');
    console.log('  portfolio       - Show current portfolio');
    console.log('  performance     - Show performance metrics');
    console.log('  fractal-love [n] - Show fractal love score history (last n points)');
    console.log('  score <symbol>  - Score a company constitutionally');
    console.log('  attractors      - Show attractor status');
    console.log('  rebalance       - Rebalance portfolio constitutionally');
    console.log('  watch <symbol>  - Add symbol to watchlist');
    console.log('  unwatch <symbol> - Remove symbol from watchlist');
    console.log('  help            - Show this help');
    console.log('  exit            - Exit the shell\n');
  }

  /**
   * Confirm dangerous action
   */
  async confirmAction(message) {
    return new Promise((resolve) => {
      this.rl = this.rl || createInterface({
        input: process.stdin,
        output: process.stdout
      });

      this.rl.question(`${message} (y/N): `, (answer) => {
        this.rl.close();
        this.rl = null;
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  /**
   * Run the CLI
   */
  async run() {
    try {
      await this.program.parseAsync();
    } catch (error) {
      console.error('CLI Error:', error.message);
      process.exit(1);
    }
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new CMHCLI();
  cli.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CMHCLI;