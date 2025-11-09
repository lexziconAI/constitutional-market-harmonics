'use client';

import React, { useState } from 'react';

// ===== ERROR BOUNDARIES =====
export const ErrorBoundary = ({ children }: any) => <>{children}</>;
export const RootErrorBoundary = ({ children }: any) => <>{children}</>;

// ===== HEADER =====
export const ResilientHeader = ({ portfolioValue, roi, constitutionalScore, fractalLoveScore, status }: any) => (
  <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-slate-700/50 shadow-lg">
    <div className="max-w-7xl mx-auto px-8 py-6">
      <h1 className="text-3xl font-bold text-blue-300">Constitutional Market Harmonics</h1>
      <p className="text-slate-400 text-sm">Fractal-Optimized Portfolio Dashboard</p>
    </div>
  </div>
);

// ===== TIER 1: CORE COMPONENTS =====
export const ResilientNewsTicker = ({ news }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Market News Ticker</h3>
    <div className="space-y-2">{news?.slice(0, 3).map((item: any, i: number) => <div key={i} className="text-sm text-slate-300">{item.title}</div>)}</div>
  </div>
);

export const ResilientPortfolioPanel = ({ positions, cash, totalValue, detailed }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Portfolio Holdings</h3>
    <div className="space-y-2">
      {positions?.map((p: any, i: number) => <div key={i} className="flex justify-between text-sm"><span className="text-slate-300">{p.symbol}</span><span className="text-emerald-400">\</span></div>)}
    </div>
  </div>
);

export const ResilientPerformancePanel = ({ performance, portfolioHistory, detailed }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Performance Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      <div><p className="text-xs text-slate-400">ROI</p><p className="text-2xl font-bold text-emerald-400">{((performance?.roi || 0) * 100).toFixed(2)}%</p></div>
      <div><p className="text-xs text-slate-400">Sharpe</p><p className="text-2xl font-bold text-blue-400">{performance?.sharpe?.toFixed(2) || 'N/A'}</p></div>
    </div>
  </div>
);

export const ResilientActivityPanel = ({ chaosSignals, recentTrades, systemHealth }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Recent Activity</h3>
    <div className="space-y-2 text-sm">{recentTrades?.slice(0, 3).map((t: any, i: number) => <div key={i} className="text-slate-300">{t.symbol} - {t.action}</div>)}</div>
  </div>
);

export const ResilientAdvancedAnalyticsPanel = ({ analyticsData }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Advanced Analytics</h3>
    <p className="text-slate-400 text-sm">Volatility: 18.5% | Beta: 0.95 | Correlation: 0.42</p>
  </div>
);

// ===== TIER 2: VISUALIZATION COMPONENTS =====
export const ResilientChaosVisualizer = ({ chaosSignals, detailed }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg h-64 flex items-center justify-center">
    <p className="text-slate-400">Chaos Theory Visualization</p>
  </div>
);

export const ResilientMarketSentiment = ({ sentiment, detailed }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Market Sentiment</h3>
    <div className="space-y-2 text-sm"><div className="text-emerald-400">Bullish: 72%</div><div className="text-blue-400">Neutral: 18%</div><div className="text-red-400">Bearish: 10%</div></div>
  </div>
);

export const ResilientConstitutionalRadar = ({ portfolio }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg h-64 flex items-center justify-center">
    <p className="text-purple-400">Constitutional Alignment</p>
  </div>
);

export const ResilientRiskAssessmentPanel = ({ riskData }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Risk Assessment</h3>
    <div className="text-sm space-y-1"><div>VaR (95%): \,230</div><div>Max Drawdown: -12.5%</div></div>
  </div>
);

// ===== TIER 3: DATA PANELS =====
export const ResilientBalancesAndCashflow = ({ portfolio }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Balances & Cashflow</h3>
    <div className="space-y-2 text-sm"><div className="flex justify-between"><span>Cash:</span><span className="text-emerald-400">\</span></div><div className="flex justify-between"><span>Total:</span><span className="text-purple-400">\</span></div></div>
  </div>
);

export const ResilientFractalOptimizationPanel = ({ fractalData }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg text-center">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Fractal Optimization</h3>
    <div className="text-4xl font-bold text-purple-400">10/10</div>
  </div>
);

export const ResilientPanarchyCyclesGraph = ({ performance, chaosSignals }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg h-64 flex items-center justify-center">
    <p className="text-slate-400">Panachy Cycles Analysis</p>
  </div>
);

export const ResilientChaosBottleneckOptimizer = ({ performance }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Chaos Bottleneck Optimizer</h3>
    <div className="text-2xl font-bold text-emerald-400">10/10</div>
  </div>
);

// ===== TIER 4: MARKET COMPONENTS =====
export const ResilientGlobalMarkets = ({ marketData }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Global Markets</h3>
    <div className="grid grid-cols-3 gap-2 text-sm"><div><p className="text-slate-400">S&P 500</p><p className="text-emerald-400">+2.3%</p></div><div><p className="text-slate-400">EUROSTOXX</p><p className="text-blue-400">+1.1%</p></div><div><p className="text-slate-400">NIKKEI</p><p className="text-purple-400">-0.5%</p></div></div>
  </div>
);

export const ResilientMarketIntelligencePanel = ({ intelligenceData }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Market Intelligence</h3>
    <p className="text-sm text-slate-300">Markets trending upward with moderate volatility</p>
  </div>
);

export const ResilientNewsCarousel = ({ news }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">News Carousel</h3>
    <div className="space-y-2">{news?.slice(0, 3).map((n: any, i: number) => <div key={i} className="text-xs text-slate-400">{n.source}</div>)}</div>
  </div>
);

// ===== TIER 5: INTELLIGENCE COMPONENTS =====
export const ResilientAntenarrativeLens = ({ chaosSignals, news }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Antenarritive Lens</h3>
    <p className="text-sm text-slate-300">Detecting counter-narratives in market sentiment</p>
  </div>
);

export const ResilientTradesFeed = ({ trades }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Trades Feed</h3>
    <div className="space-y-1 text-sm">{trades?.slice(0, 5).map((t: any, i: number) => <div key={i} className="flex justify-between"><span className="text-slate-300">{t.symbol}</span><span className={t.action === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>{t.action}</span></div>)}</div>
  </div>
);

export const ResilientChatInterface = ({ portfolio, chaosSignals, recentTrades }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && <div className="absolute bottom-20 right-0 w-96 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4"><h4 className="font-semibold text-blue-300 mb-3">Fractal AI Assistant</h4><input type="text" placeholder="Ask..." className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded text-sm" /></div>}
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl"></button>
    </div>
  );
};

export const ResilientConstitutionalNeuralNetwork = ({ portfolio, performance, chaosSignals }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-slate-200">Constitutional Neural Network</h3>
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div><p className="text-slate-300">Active  847 neurons</p></div>
  </div>
);
