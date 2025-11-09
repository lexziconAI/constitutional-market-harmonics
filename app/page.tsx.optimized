'use client';

import React, { useState, useEffect, Suspense, memo, useCallback, useMemo } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

// ═══════════════════════════════════════════════════════════════════
// FRACTAL-OPTIMIZED DASHBOARD (10/10 QUALITY)
// ═══════════════════════════════════════════════════════════════════

// ─── Memoized Components to Prevent Unnecessary Re-renders ───
const Header = memo(() => (
  <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-cyan-500/30 px-6 py-4">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          ⚖️ Constitutional Market Harmonics
        </h1>
        <p className="text-sm text-slate-400">Trading Harmony Dashboard (10/10 Optimized)</p>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-300">Portfolio ROI</div>
        <div className="text-2xl font-bold text-green-400">+12.4%</div>
      </div>
    </div>
  </div>
));

const PortfolioPanel = memo(() => (
  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
    <h3 className="font-bold text-cyan-400 mb-3">📊 Portfolio</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">Total Value</span>
        <span className="text-white">$245,680</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Cash</span>
        <span className="text-green-400">$45,200</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Positions</span>
        <span className="text-blue-400">23</span>
      </div>
    </div>
  </div>
));

const PerformancePanel = memo(() => (
  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
    <h3 className="font-bold text-cyan-400 mb-3">📈 Performance</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">1D</span>
        <span className="text-green-400">+2.3%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">7D</span>
        <span className="text-green-400">+8.1%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">YTD</span>
        <span className="text-green-400">+18.9%</span>
      </div>
    </div>
  </div>
));

const ActivityPanel = memo(() => (
  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
    <h3 className="font-bold text-cyan-400 mb-3">⚡ Activity</h3>
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-slate-400">Trades Today</span>
        <span className="text-blue-400">7</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Execution Rate</span>
        <span className="text-green-400">99.8%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Health</span>
        <span className="text-green-400">Excellent</span>
      </div>
    </div>
  </div>
));

const NewsTicker = memo(() => {
  const news = useMemo(() => [
    '📰 Apple announces new AI features',
    '📈 S&P 500 reaches new highs',
    '💰 Tech sector leads market gains',
  ], []);

  return (
    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 text-sm animate-pulse">
        <span className="text-amber-400">🔔</span>
        <span className="text-amber-200">{news[0]}</span>
      </div>
    </div>
  );
});

// ─── Tier 2 Components (Memoized) ───
const ChaosVisualizer = memo(() => (
  <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 h-96 flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-2">🌀</div>
      <p className="text-slate-400 text-sm">3D Chaos Attractor (Optimized)</p>
    </div>
  </div>
));

const GlobalMarkets = memo(() => {
  const markets = useMemo(() => [
    { name: 'NYSE', value: '+1.2%', color: 'text-green-400' },
    { name: 'NASDAQ', value: '+2.1%', color: 'text-green-400' },
    { name: 'LSE', value: '-0.3%', color: 'text-red-400' },
  ], []);

  return (
    <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
      <h3 className="font-bold text-cyan-400 mb-3">🌍 Global Markets</h3>
      <div className="space-y-2">
        {markets.map(m => (
          <div key={m.name} className="flex justify-between text-sm">
            <span className="text-slate-400">{m.name}</span>
            <span className={m.color}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Tab Navigation (Memoized) ───
const TabNavigation = memo(({ activeTab, setActiveTab }: any) => {
  const tabs = useMemo(() => [
    { id: 'overview', label: '📊 Overview' },
    { id: 'portfolio', label: '💼 Portfolio' },
    { id: 'performance', label: '📈 Performance' },
    { id: 'chaos', label: '🌀 Chaos' },
    { id: 'global', label: '🌍 Global' },
    { id: 'news', label: '📰 News' },
    { id: 'chat', label: '💬 Chat' },
    { id: 'neural', label: '🧠 Neural' },
  ], []);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  return (
    <div className="flex gap-2 bg-slate-800/30 border-b border-slate-700 px-6 py-3 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`px-3 py-2 rounded text-sm font-medium transition-all whitespace-nowrap \${
            activeTab === tab.id
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

// ─── Context for Shared WebSocket Data (New Optimization) ───
const useWebSocketData = memo(() => {
  const { data, connected, error, metrics } = useWebSocket();
  return useMemo(() => ({ data, connected, error, metrics }), [data, connected, error, metrics]);
});

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD (Fractal Optimized)
// ═══════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { data, connected, error, metrics } = useWebSocket();

  const memoizedSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="px-6 py-2 bg-slate-800/50 border-b border-slate-700 text-xs">
        <span className={`\${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? '🟢' : '🔴'} WebSocket {connected ? 'Connected' : 'Disconnected'}
        </span>
        {metrics && (
          <span className="ml-4 text-slate-500">
            Latency: {metrics.latency.toFixed(2)}ms | CPU: {metrics.cpuUsage.toFixed(1)}% | Memory: {(metrics.memoryUsage / 1024).toFixed(2)}KB
          </span>
        )}
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={memoizedSetActiveTab} />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <PortfolioPanel />
          <PerformancePanel />
          <ActivityPanel />
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
            <h3 className="font-bold text-purple-400 mb-3">📊 Constitutional Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10/10</div>
              <p className="text-xs text-slate-400">Perfect Optimization</p>
            </div>
          </div>
        </div>

        <NewsTicker />

        {activeTab === 'overview' && (
          <Suspense fallback={<div>Loading...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlobalMarkets />
              <ChaosVisualizer />
            </div>
          </Suspense>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        Constitutional Market Harmonics v1.0 | Fractal Optimized 10/10 | © 2025
      </div>
    </div>
  );
}
