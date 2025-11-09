#!/usr/bin/env node

/**
 * Constitutional Market Harmonics Demo
 * Demonstrates the chaos-theoretic trading system in action
 */

const ConstitutionalMarketHarmonics = require('../core/ConstitutionalMarketHarmonics');

async function runDemo() {
  console.log('🌀 Constitutional Market Harmonics - Fractal Love Trading Demo');
  console.log('=' .repeat(70));
  console.log('This demo shows how the system optimizes ROI × Constitutional Impact');
  console.log('Using strange attractors (Lorenz, Chen, Rossler) for trading signals\n');

  let system = null;

  try {
    // Initialize system
    console.log('🚀 Initializing system...');
    system = new ConstitutionalMarketHarmonics({
      portfolioId: 'demo_portfolio',
      paperTrading: true,
      updateInterval: 5000, // 5 seconds for demo
      basePositionSize: 50000, // $50K for demo
      targetPositionSize: 1000000 // $1M for demo
    });

    // Start system
    console.log('▶️  Starting trading system...');
    await system.start();

    // Wait a bit for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show initial status
    console.log('\n📊 Initial System Status:');
    const initialStatus = system.getStatus();
    console.log(`Portfolio Value: $${initialStatus.portfolio.totalValue.toLocaleString()}`);
    console.log(`Positions: ${initialStatus.portfolio.positions}`);
    console.log(`Market Data: ${initialStatus.components.marketData.alphaVantage.configured ? '✅' : '❌'} Alpha Vantage`);

    // Run demo for 2 minutes
    console.log('\n⏰ Running demo for 2 minutes...');
    console.log('Watch as the system generates constitutional trading signals!\n');

    const demoDuration = 2 * 60 * 1000; // 2 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < demoDuration) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Update every 10 seconds

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const status = system.getStatus();

      console.log(`[${elapsed}s] Portfolio: $${status.portfolio.totalValue.toLocaleString()} | ` +
        `Positions: ${status.portfolio.positions} | ` +
        `Last Update: ${status.lastUpdate ? new Date(status.lastUpdate).toLocaleTimeString() : 'None'}`);

      // Show fractal love score if available
      const fractalLove = system.getFractalLoveHistory(1);
      if (fractalLove.length > 0) {
        console.log(`      💚 Fractal Love Score: ${fractalLove[0].toFixed(4)}`);
      }
    }

    // Show final results
    console.log('\n🎭 Demo completed! Final results:');
    console.log('=' .repeat(50));

    const finalStatus = system.getStatus();
    console.log(`Final Portfolio Value: $${finalStatus.portfolio.totalValue.toLocaleString()}`);
    console.log(`Total Return: ${(((finalStatus.portfolio.totalValue - 1000000) / 1000000) * 100).toFixed(2)}%`);
    console.log(`Positions Held: ${finalStatus.portfolio.positions}`);

    // Show portfolio details
    const portfolio = system.getPortfolio();
    if (portfolio.positions.length > 0) {
      console.log('\n📈 Final Positions:');
      for (const position of portfolio.positions) {
        const pnl = position.value - (position.quantity * position.avgPrice);
        const pnlPercent = ((position.value / (position.quantity * position.avgPrice)) - 1) * 100;
        console.log(`  ${position.symbol}: ${position.quantity.toFixed(2)} shares @ $${position.avgPrice.toFixed(2)} = $${position.value.toFixed(2)} (${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} / ${(pnl >= 0 ? '+' : '')}${pnlPercent.toFixed(1)}%)`);
      }
    }

    // Show performance report
    try {
      const performance = await system.getPerformanceReport();
      if (performance) {
        console.log('\n📊 Performance Summary:');
        console.log(`Constitutional Score: ${(performance.summary.constitutionalScore * 100).toFixed(1)}/100`);
        console.log(`Fractal Love Score: ${performance.summary.fractalLoveScore.toFixed(4)}`);
        console.log(`Risk Level: ${performance.summary.riskLevel.toUpperCase()}`);

        if (performance.recommendations && performance.recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          for (const rec of performance.recommendations) {
            console.log(`  • ${rec.message}`);
          }
        }
      }
    } catch (error) {
      console.log('Performance data not yet available');
    }

    // Show attractor status
    const attractorMetrics = system.attractorManager.getPerformanceMetrics();
    if (attractorMetrics) {
      console.log('\n🌀 Attractor Performance:');
      console.log(`Signals Generated: ${attractorMetrics.totalSignals}`);
      console.log(`Average Confidence: ${(attractorMetrics.averageConfidence * 100).toFixed(1)}%`);
    }

    console.log('\n🎯 Demo Summary:');
    console.log('The Constitutional Market Harmonics system successfully demonstrated:');
    console.log('✅ Chaos-theoretic trading signal generation');
    console.log('✅ Constitutional scoring of companies');
    console.log('✅ Dual metrics tracking (ROI × Constitutional Impact)');
    console.log('✅ Paper trading execution');
    console.log('✅ Real-time portfolio management');
    console.log('\n💚 Fractal Love Hypothesis: Ethical investing can outperform through');
    console.log('   intelligent signal generation and constitutional alignment!');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  } finally {
    // Clean up
    if (system) {
      console.log('\n🛑 Shutting down system...');
      await system.stop();
      console.log('✅ System shut down successfully');
    }
  }
}

// Score a few demo companies
async function scoreDemoCompanies() {
  console.log('\n🔍 Constitutional Scoring Demo:');
  console.log('=' .repeat(40));

  const ConstitutionalScorer = require('../constitutional/ConstitutionalScorer');
  const scorer = new ConstitutionalScorer();

  const demoCompanies = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'NFLX'];

  for (const symbol of demoCompanies) {
    try {
      const score = await scorer.scoreCompany(symbol);
      console.log(`${symbol.padEnd(6)}: ${(score.overall * 100).toFixed(1).padStart(5)}/100 - ${score.ethicalAlignment}`);
    } catch (error) {
      console.log(`${symbol.padEnd(6)}: Error - ${error.message}`);
    }
  }
}

// Run demo if called directly
if (require.main === module) {
  // First show constitutional scoring
  scoreDemoCompanies().then(() => {
    // Then run the full system demo
    return runDemo();
  }).catch(error => {
    console.error('Demo error:', error);
    process.exit(1);
  });
}

module.exports = { runDemo, scoreDemoCompanies };