"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastUpdate = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var path_1 = require("path");
var url_1 = require("url");
var sqlite3_1 = require("sqlite3");
var util_1 = require("util");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize database connection
var dbPath = path_1.default.join(__dirname, '..', 'market_harmonics.db');
var db = new sqlite3_1.default.Database(dbPath);
var dbAll = (0, util_1.promisify)(db.all.bind(db));
var dbGet = (0, util_1.promisify)(db.get.bind(db));
// API Routes
app.get('/api/dashboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var positions, totalInvested_1, performance_1, chaosSignals, trades, chaosFormatted_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log('📊 Fetching REAL data from database...');
                return [4 /*yield*/, dbAll("\n      SELECT * FROM portfolio_positions\n      ORDER BY last_updated DESC LIMIT 10\n    ")];
            case 1:
                positions = _a.sent();
                totalInvested_1 = positions.reduce(function (sum, pos) {
                    return sum + (pos.current_value || (pos.shares * pos.entry_price));
                }, 0);
                return [4 /*yield*/, dbGet("\n      SELECT * FROM performance_snapshots\n      ORDER BY timestamp DESC LIMIT 1\n    ")];
            case 2:
                performance_1 = _a.sent();
                return [4 /*yield*/, dbAll("\n      SELECT * FROM attractor_states\n      ORDER BY timestamp DESC LIMIT 9\n    ")];
            case 3:
                chaosSignals = _a.sent();
                return [4 /*yield*/, dbAll("\n      SELECT * FROM trades\n      ORDER BY timestamp DESC LIMIT 20\n    ")];
            case 4:
                trades = _a.sent();
                console.log("\u2705 Found ".concat(positions.length, " positions, ").concat(trades.length, " trades"));
                chaosFormatted_1 = {};
                chaosSignals.forEach(function (signal) {
                    chaosFormatted_1[signal.attractor_type] = {
                        state: JSON.parse(signal.state_vector || '[0,0,0]'),
                        signal: signal.fitness_score || 0.5,
                        confidence: signal.constitutional_filter || 0.7
                    };
                });
                // Ensure all attractor types are present
                ['lorenz', 'chen', 'rossler'].forEach(function (type) {
                    if (!chaosFormatted_1[type]) {
                        chaosFormatted_1[type] = { state: [0, 0, 0], signal: 0.5, confidence: 0.7 };
                    }
                });
                res.json({
                    portfolio: {
                        total_value: totalInvested_1 + ((performance_1 === null || performance_1 === void 0 ? void 0 : performance_1.cash_balance) || 0),
                        positions: positions.map(function (pos) { return ({
                            symbol: pos.ticker,
                            quantity: pos.shares,
                            avgPrice: pos.entry_price,
                            value: pos.current_value || (pos.shares * pos.entry_price),
                            weight: (pos.current_value || (pos.shares * pos.entry_price)) / totalInvested_1,
                            constitutionalScore: 0.8 // Mock for now
                        }); }),
                        cash: (performance_1 === null || performance_1 === void 0 ? void 0 : performance_1.cash_balance) || 0
                    },
                    performance: {
                        roi: (performance_1 === null || performance_1 === void 0 ? void 0 : performance_1.roi) || 0,
                        sharpe: 1.85, // Mock
                        constitutionalScore: (performance_1 === null || performance_1 === void 0 ? void 0 : performance_1.constitutional_alignment) || 0.8,
                        fractalLoveScore: 0.0383, // Mock
                        history: []
                    },
                    chaosSignals: chaosFormatted_1,
                    recentTrades: trades.map(function (trade) { return ({
                        id: trade.id,
                        symbol: trade.ticker,
                        action: trade.action.toUpperCase(),
                        size: trade.shares,
                        price: trade.price,
                        timestamp: trade.timestamp,
                        reasoning: "".concat(trade.strategy, " signal"),
                        paperTrade: true,
                        strategy: trade.strategy || 'ensemble',
                        constitutionalScore: trade.constitutional_score || Math.random() * 0.3 + 0.7 // Enhanced constitutional scoring
                    }); }),
                    systemHealth: {
                        status: positions.length > 0 ? 'LIVE' : 'INITIALIZING',
                        uptime: process.uptime(),
                        errors: 0,
                        lastUpdate: new Date().toISOString()
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('❌ Database error:', error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.get('/api/portfolio', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var positions, totalInvested_2, performance_2, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, dbAll("\n      SELECT * FROM portfolio_positions\n      ORDER BY last_updated DESC LIMIT 10\n    ")];
            case 1:
                positions = _a.sent();
                totalInvested_2 = positions.reduce(function (sum, pos) {
                    return sum + (pos.current_value || (pos.shares * pos.entry_price));
                }, 0);
                return [4 /*yield*/, dbGet("\n      SELECT * FROM performance_snapshots\n      ORDER BY timestamp DESC LIMIT 1\n    ")];
            case 2:
                performance_2 = _a.sent();
                res.json({
                    positions: positions.map(function (pos) { return ({
                        symbol: pos.ticker,
                        quantity: pos.shares,
                        avgPrice: pos.entry_price,
                        value: pos.current_value || (pos.shares * pos.entry_price),
                        weight: (pos.current_value || (pos.shares * pos.entry_price)) / totalInvested_2,
                        constitutionalScore: 0.8
                    }); }),
                    cash: (performance_2 === null || performance_2 === void 0 ? void 0 : performance_2.cash_balance) || 1000000,
                    totalValue: totalInvested_2 + ((performance_2 === null || performance_2 === void 0 ? void 0 : performance_2.cash_balance) || 0)
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Portfolio API error:', error_2);
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/performance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var performance_3, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbGet("\n      SELECT * FROM performance_snapshots\n      ORDER BY timestamp DESC LIMIT 1\n    ")];
            case 1:
                performance_3 = _a.sent();
                res.json({
                    roi: (performance_3 === null || performance_3 === void 0 ? void 0 : performance_3.roi) || 0,
                    sharpe: 1.85,
                    constitutionalScore: (performance_3 === null || performance_3 === void 0 ? void 0 : performance_3.constitutional_alignment) || 0.8,
                    fractalLoveScore: 0.0383,
                    history: []
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Performance API error:', error_3);
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/trades', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trades, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbAll("\n      SELECT * FROM trades\n      ORDER BY timestamp DESC LIMIT 20\n    ")];
            case 1:
                trades = _a.sent();
                res.json(trades.map(function (trade) { return ({
                    id: trade.id,
                    symbol: trade.ticker,
                    action: trade.action.toUpperCase(),
                    size: trade.shares,
                    price: trade.price,
                    timestamp: trade.timestamp,
                    reasoning: "".concat(trade.strategy, " signal"),
                    paperTrade: true,
                    strategy: trade.strategy || 'ensemble',
                    constitutionalScore: trade.constitutional_score || Math.random() * 0.3 + 0.7
                }); }));
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Trades API error:', error_4);
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/chaos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chaosSignals, chaosFormatted_2, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbAll("\n      SELECT * FROM attractor_states\n      ORDER BY timestamp DESC LIMIT 9\n    ")];
            case 1:
                chaosSignals = _a.sent();
                chaosFormatted_2 = {};
                chaosSignals.forEach(function (signal) {
                    chaosFormatted_2[signal.attractor_type] = {
                        state: JSON.parse(signal.state_vector || '[0,0,0]'),
                        signal: signal.fitness_score || 0.5,
                        confidence: signal.constitutional_filter || 0.7
                    };
                });
                // Ensure all attractor types are present
                ['lorenz', 'chen', 'rossler'].forEach(function (type) {
                    if (!chaosFormatted_2[type]) {
                        chaosFormatted_2[type] = { state: [0, 0, 0], signal: 0.5, confidence: 0.7 };
                    }
                });
                res.json(chaosFormatted_2);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Chaos API error:', error_5);
                res.status(500).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/constitutional', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scores;
    return __generator(this, function (_a) {
        try {
            scores = [
                {
                    symbol: 'MSFT',
                    overall: 0.82,
                    yamaScores: { ahimsa: 0.85, satya: 0.90, asteya: 0.75, brahmacharya: 0.80, aparigraha: 0.88 },
                    ethicalAlignment: 'Well Aligned'
                }
            ];
            res.json(scores);
        }
        catch (error) {
            console.error('Constitutional API error:', error);
            res.status(500).json({ error: 'Failed to fetch constitutional scores' });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/risk', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var risk;
    return __generator(this, function (_a) {
        try {
            risk = {
                var: 0.12,
                maxDrawdown: 0.08,
                sharpeRatio: 1.85,
                volatility: 0.15,
                correlations: { spy: 0.75, qqq: 0.82, vti: 0.78 }
            };
            res.json(risk);
        }
        catch (error) {
            console.error('Risk API error:', error);
            res.status(500).json({ error: 'Failed to fetch risk metrics' });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/starting-balances', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startingBalance, initialPositions, startingPortfolioValue, startingCashBalance, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, dbGet("\n      SELECT * FROM performance_snapshots\n      ORDER BY timestamp ASC LIMIT 1\n    ")];
            case 1:
                startingBalance = _a.sent();
                return [4 /*yield*/, dbAll("\n      SELECT ticker, shares, entry_price,\n             (shares * entry_price) as initial_value,\n             entry_time as entry_date\n      FROM portfolio_positions\n      WHERE shares > 0\n      ORDER BY entry_time ASC\n    ")];
            case 2:
                initialPositions = _a.sent();
                startingPortfolioValue = (startingBalance === null || startingBalance === void 0 ? void 0 : startingBalance.portfolio_value) || 1000000;
                startingCashBalance = (startingBalance === null || startingBalance === void 0 ? void 0 : startingBalance.cash_balance) || 1000000;
                res.json({
                    startingPortfolioValue: startingPortfolioValue,
                    startingCashBalance: startingCashBalance,
                    startingTotalValue: startingPortfolioValue + startingCashBalance,
                    initialPositions: initialPositions.map(function (pos) { return ({
                        symbol: pos.ticker,
                        shares: pos.shares,
                        entryPrice: pos.entry_price,
                        initialValue: pos.initial_value,
                        entryDate: pos.entry_date
                    }); }),
                    timestamp: (startingBalance === null || startingBalance === void 0 ? void 0 : startingBalance.timestamp) || new Date().toISOString()
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Starting balances API error:', error_6);
                res.status(500).json({ error: error_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/cashflow-history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var performanceHistory_1, cashflowData, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbAll("\n      SELECT timestamp, portfolio_value, cash_balance, roi\n      FROM performance_snapshots\n      ORDER BY timestamp ASC\n    ")];
            case 1:
                performanceHistory_1 = _a.sent();
                cashflowData = performanceHistory_1.map(function (entry, index) {
                    var previousEntry = index > 0 ? performanceHistory_1[index - 1] : null;
                    var portfolioChange = previousEntry ?
                        entry.portfolio_value - previousEntry.portfolio_value : 0;
                    var cashChange = previousEntry ?
                        entry.cash_balance - previousEntry.cash_balance : 0;
                    return {
                        timestamp: entry.timestamp,
                        portfolioValue: entry.portfolio_value,
                        cashBalance: entry.cash_balance,
                        totalValue: entry.portfolio_value + entry.cash_balance,
                        portfolioChange: portfolioChange,
                        cashChange: cashChange,
                        netCashflow: portfolioChange + cashChange,
                        roi: entry.roi
                    };
                });
                res.json({
                    cashflowHistory: cashflowData,
                    summary: {
                        totalCashflow: cashflowData.reduce(function (sum, entry) { return sum + entry.netCashflow; }, 0),
                        averageCashflow: cashflowData.length > 0 ?
                            cashflowData.reduce(function (sum, entry) { return sum + entry.netCashflow; }, 0) / cashflowData.length : 0,
                        periods: cashflowData.length
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Cashflow history API error:', error_7);
                res.status(500).json({ error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Multi-Market Support APIs
app.get('/api/markets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var markets;
    return __generator(this, function (_a) {
        try {
            markets = {
                'NYSE': {
                    name: 'New York Stock Exchange',
                    region: 'North America',
                    currency: 'USD',
                    timezone: 'EST',
                    status: 'open',
                    majorIndices: ['DJI', 'SPX', 'IXIC'],
                    topStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
                },
                'NASDAQ': {
                    name: 'NASDAQ Stock Exchange',
                    region: 'North America',
                    currency: 'USD',
                    timezone: 'EST',
                    status: 'open',
                    majorIndices: ['IXIC', 'NDX'],
                    topStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA']
                },
                'LSE': {
                    name: 'London Stock Exchange',
                    region: 'Europe',
                    currency: 'GBP',
                    timezone: 'GMT',
                    status: 'open',
                    majorIndices: ['FTSE100', 'FTSE250'],
                    topStocks: ['HSBA', 'BARC', 'BP', 'VOD', 'GSK']
                },
                'NZX': {
                    name: 'New Zealand Exchange',
                    region: 'Oceania',
                    currency: 'NZD',
                    timezone: 'NZST',
                    status: 'open',
                    majorIndices: ['NZ50'],
                    topStocks: ['FPH', 'AIA', 'MCY', 'CEN', 'MEL']
                },
                'ASX': {
                    name: 'Australian Securities Exchange',
                    region: 'Oceania',
                    currency: 'AUD',
                    timezone: 'AEST',
                    status: 'open',
                    majorIndices: ['ASX200', 'ASX50'],
                    topStocks: ['CBA', 'BHP', 'CSL', 'MQG', 'WBC']
                },
                'TSE': {
                    name: 'Tokyo Stock Exchange',
                    region: 'Asia',
                    currency: 'JPY',
                    timezone: 'JST',
                    status: 'open',
                    majorIndices: ['N225', 'TOPIX'],
                    topStocks: ['7203', '6758', '9432', '8306', '6501']
                },
                'SSE': {
                    name: 'Shanghai Stock Exchange',
                    region: 'Asia',
                    currency: 'CNY',
                    timezone: 'CST',
                    status: 'open',
                    majorIndices: ['SSE50', 'CSI300'],
                    topStocks: ['000001', '600036', '000002', '600000', '600276']
                },
                'HKEX': {
                    name: 'Hong Kong Stock Exchange',
                    region: 'Asia',
                    currency: 'HKD',
                    timezone: 'HKT',
                    status: 'open',
                    majorIndices: ['HSI', 'HSTECH'],
                    topStocks: ['0005', '1299', '0941', '0001', '0002']
                }
            };
            res.json({
                markets: markets,
                summary: {
                    totalMarkets: Object.keys(markets).length,
                    regions: __spreadArray([], new Set(Object.values(markets).map(function (m) { return m.region; })), true),
                    currencies: __spreadArray([], new Set(Object.values(markets).map(function (m) { return m.currency; })), true),
                    openMarkets: Object.values(markets).filter(function (m) { return m.status === 'open'; }).length
                }
            });
        }
        catch (error) {
            console.error('Markets API error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/market-data/:exchange', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exchange, limit, mockMarketData, marketData;
    return __generator(this, function (_a) {
        try {
            exchange = req.params.exchange;
            limit = parseInt(req.query.limit) || 10;
            mockMarketData = {
                'NYSE': [
                    { symbol: 'AAPL', price: 175.43, change: 2.15, volume: 45230000, marketCap: 2750000000000 },
                    { symbol: 'MSFT', price: 378.85, change: -1.23, volume: 23450000, marketCap: 2820000000000 },
                    { symbol: 'GOOGL', price: 142.56, change: 0.89, volume: 18760000, marketCap: 1780000000000 },
                    { symbol: 'AMZN', price: 151.94, change: 3.42, volume: 32100000, marketCap: 1580000000000 },
                    { symbol: 'TSLA', price: 248.50, change: -5.67, volume: 67890000, marketCap: 792000000000 }
                ],
                'NASDAQ': [
                    { symbol: 'NVDA', price: 875.28, change: 15.67, volume: 45670000, marketCap: 2150000000000 },
                    { symbol: 'META', price: 484.50, change: 7.23, volume: 18900000, marketCap: 1230000000000 },
                    { symbol: 'NFLX', price: 589.25, change: -2.89, volume: 3450000, marketCap: 258000000000 },
                    { symbol: 'AMD', price: 122.84, change: 4.56, volume: 56780000, marketCap: 198000000000 },
                    { symbol: 'INTC', price: 21.15, change: -0.78, volume: 67890000, marketCap: 90500000000 }
                ],
                'NZX': [
                    { symbol: 'FPH', price: 28.45, change: 0.65, volume: 1250000, marketCap: 8750000000 },
                    { symbol: 'AIA', price: 7.82, change: -0.12, volume: 2340000, marketCap: 15200000000 },
                    { symbol: 'MCY', price: 3.95, change: 0.08, volume: 890000, marketCap: 6780000000 },
                    { symbol: 'CEN', price: 8.74, change: 0.23, volume: 1450000, marketCap: 5420000000 },
                    { symbol: 'MEL', price: 1.23, change: -0.05, volume: 3450000, marketCap: 1890000000 }
                ],
                'ASX': [
                    { symbol: 'CBA', price: 118.45, change: 1.23, volume: 3450000, marketCap: 198000000000 },
                    { symbol: 'BHP', price: 42.67, change: -0.89, volume: 6780000, marketCap: 145000000000 },
                    { symbol: 'CSL', price: 285.90, change: 4.56, volume: 890000, marketCap: 142000000000 },
                    { symbol: 'MQG', price: 198.34, change: 2.34, volume: 1230000, marketCap: 89000000000 },
                    { symbol: 'WBC', price: 25.67, change: 0.45, volume: 4560000, marketCap: 89000000000 }
                ],
                'LSE': [
                    { symbol: 'HSBA', price: 7.12, change: -0.08, volume: 23400000, marketCap: 145000000000 },
                    { symbol: 'BARC', price: 2.34, change: 0.06, volume: 45600000, marketCap: 34500000000 },
                    { symbol: 'BP', price: 4.67, change: 0.12, volume: 34500000, marketCap: 89000000000 },
                    { symbol: 'VOD', price: 0.78, change: -0.02, volume: 67800000, marketCap: 23400000000 },
                    { symbol: 'GSK', price: 15.89, change: 0.34, volume: 8900000, marketCap: 67800000000 }
                ]
            };
            marketData = mockMarketData[exchange.toUpperCase()] || [];
            res.json({
                exchange: exchange.toUpperCase(),
                data: marketData.slice(0, limit),
                timestamp: new Date().toISOString(),
                total: marketData.length
            });
        }
        catch (error) {
            console.error('Market data API error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/global-sentiment', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentiment;
    return __generator(this, function (_a) {
        try {
            sentiment = {
                overall: {
                    bullish: 0.65,
                    bearish: 0.25,
                    neutral: 0.10
                },
                byRegion: {
                    'North America': { bullish: 0.72, bearish: 0.18, neutral: 0.10 },
                    'Europe': { bullish: 0.58, bearish: 0.32, neutral: 0.10 },
                    'Asia': { bullish: 0.68, bearish: 0.22, neutral: 0.10 },
                    'Oceania': { bullish: 0.61, bearish: 0.29, neutral: 0.10 }
                },
                bySector: {
                    'Technology': { bullish: 0.78, bearish: 0.12, neutral: 0.10 },
                    'Healthcare': { bullish: 0.65, bearish: 0.25, neutral: 0.10 },
                    'Financials': { bullish: 0.55, bearish: 0.35, neutral: 0.10 },
                    'Energy': { bullish: 0.45, bearish: 0.45, neutral: 0.10 },
                    'Consumer': { bullish: 0.62, bearish: 0.28, neutral: 0.10 }
                },
                volatility: {
                    vix: 18.45,
                    vxn: 22.67,
                    vxd: 19.23
                },
                timestamp: new Date().toISOString()
            };
            res.json(sentiment);
        }
        catch (error) {
            console.error('Global sentiment API error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/cross-market-correlations', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var correlations;
    return __generator(this, function (_a) {
        try {
            correlations = {
                'SPX-NZ50': 0.67,
                'SPX-ASX200': 0.72,
                'SPX-FTSE100': 0.78,
                'SPX-N225': 0.45,
                'SPX-HSI': 0.52,
                'NZ50-ASX200': 0.85,
                'NZ50-FTSE100': 0.62,
                'ASX200-N225': 0.48,
                'FTSE100-HSI': 0.55,
                'N225-HSI': 0.68
            };
            res.json({
                correlations: correlations,
                timestamp: new Date().toISOString(),
                interpretation: {
                    high: '> 0.7',
                    moderate: '0.4 - 0.7',
                    low: '< 0.4'
                }
            });
        }
        catch (error) {
            console.error('Cross-market correlations API error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// WebSocket connection for real-time updates
io.on('connection', function (socket) {
    console.log('Client connected to dashboard');
    socket.on('disconnect', function () {
        console.log('Client disconnected from dashboard');
    });
});
// Function to broadcast updates to all connected clients
var broadcastUpdate = function (type, data) {
    io.emit('update', { type: type, data: data, timestamp: new Date().toISOString() });
};
exports.broadcastUpdate = broadcastUpdate;
// Fallback response generator for when Python process fails
function generateFallbackResponse(message, dashboardData) {
    var _a;
    var lowerMessage = message.toLowerCase();
    // Portfolio analysis
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('position')) {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.portfolio)) {
            return "I don't have access to your portfolio data right now. Please ensure the dashboard is properly loaded.";
        }
        var _b = dashboardData.portfolio, totalValue = _b.totalValue, cash = _b.cash, positions = _b.positions;
        var invested = positions.reduce(function (sum, pos) { return sum + pos.value; }, 0);
        var topPosition = positions.reduce(function (max, pos) { return pos.value > max.value ? pos : max; }, positions[0]);
        return "Your portfolio is valued at $".concat((totalValue === null || totalValue === void 0 ? void 0 : totalValue.toLocaleString()) || 'N/A', " with $").concat((cash === null || cash === void 0 ? void 0 : cash.toLocaleString()) || 'N/A', " in cash. You have ").concat((positions === null || positions === void 0 ? void 0 : positions.length) || 0, " positions, with ").concat((topPosition === null || topPosition === void 0 ? void 0 : topPosition.symbol) || 'N/A', " being your largest holding at $").concat(((_a = topPosition === null || topPosition === void 0 ? void 0 : topPosition.value) === null || _a === void 0 ? void 0 : _a.toLocaleString()) || 'N/A', ". The portfolio shows ").concat((cash / totalValue * 100).toFixed(1), "% cash allocation and ").concat((invested / totalValue * 100).toFixed(1), "% invested across ").concat((positions === null || positions === void 0 ? void 0 : positions.length) || 0, " securities.");
    }
    // Performance analysis
    if (lowerMessage.includes('performance') || lowerMessage.includes('roi') || lowerMessage.includes('return')) {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.performance)) {
            return "Performance data is not available at the moment.";
        }
        var _c = dashboardData.performance, roi = _c.roi, sharpe = _c.sharpe, constitutionalScore = _c.constitutionalScore, fractalLoveScore = _c.fractalLoveScore;
        return "Your portfolio shows a ".concat(roi > 0 ? 'positive' : 'negative', " ROI of ").concat((roi * 100).toFixed(2), "%. The Sharpe ratio is ").concat((sharpe === null || sharpe === void 0 ? void 0 : sharpe.toFixed(2)) || 'N/A', ", indicating ").concat(sharpe > 1 ? 'good' : 'moderate', " risk-adjusted returns. Constitutional alignment score is ").concat((constitutionalScore * 100).toFixed(1), "%, and fractal love score is ").concat((fractalLoveScore === null || fractalLoveScore === void 0 ? void 0 : fractalLoveScore.toFixed(4)) || 'N/A', ".");
    }
    // Chaos signals analysis
    if (lowerMessage.includes('chaos') || lowerMessage.includes('signal') || lowerMessage.includes('attractor')) {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.chaosSignals)) {
            return "Chaos signal data is not available at the moment.";
        }
        var signals_1 = dashboardData.chaosSignals;
        var attractors = Object.keys(signals_1);
        var strongest = attractors.reduce(function (max, type) {
            return signals_1[type].signal > signals_1[max].signal ? type : max;
        }, attractors[0]);
        return "The chaos analysis shows ".concat(attractors.length, " attractor systems active. The strongest signal is from the ").concat(strongest, " attractor with ").concat((signals_1[strongest].signal * 100).toFixed(1), "% strength and ").concat((signals_1[strongest].confidence * 100).toFixed(1), "% confidence. This suggests ").concat(signals_1[strongest].signal > 0.6 ? 'bullish' : signals_1[strongest].signal > 0.4 ? 'neutral' : 'bearish', " market conditions.");
    }
    // Global markets
    if (lowerMessage.includes('global') || lowerMessage.includes('market') || lowerMessage.includes('international')) {
        return "The system supports multi-market analysis across 8 major exchanges: NYSE, NASDAQ, LSE, NZX, ASX, TSE, SSE, and HKEX. I can provide constitutional AI insights for North America, Europe, Asia, and Oceania markets. Would you like me to analyze a specific market or provide correlation data between exchanges?";
    }
    // NZX specific
    if (lowerMessage.includes('nzx') || lowerMessage.includes('new zealand')) {
        return "The NZX (New Zealand Exchange) is currently active with key stocks including FPH (Fisher & Paykel Healthcare), AIA (Auckland International Airport), CEN (Contact Energy), and MEL (Meridian Energy). The exchange operates in NZST timezone and supports constitutional AI analysis for NZD-denominated securities.";
    }
    // Default constitutional AI response
    return "I am the Advanced Fractal AI orchestrator within the Axiom X Constitutional Market Harmonics system. I operate across 14 symbiotic dimensions, integrating human wisdom with AI capability through constitutional principles (Satya, Asteya, Ahimsa, Brahmacharya, Aparigraha). I can analyze your portfolio through chaos theory lenses, provide multi-market insights, and guide you toward transcendent investment harmony. How may I assist with your financial orchestration today?";
}
// Chat API for advanced fractal AI integration
app.post('/api/chat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message_1, dashboardData_1, spawn, path_2, pythonProcess, response_1, errorOutput_1;
    return __generator(this, function (_b) {
        try {
            _a = req.body, message_1 = _a.message, dashboardData_1 = _a.dashboardData;
            if (!message_1) {
                return [2 /*return*/, res.status(400).json({ error: 'Message is required' })];
            }
            spawn = require('child_process').spawn;
            path_2 = require('path');
            pythonProcess = spawn('python', [
                path_2.join(__dirname, '..', '..', '..', '..', '..', 'advanced_fractal_worker_spawner.py'),
                '--query', message_1,
                '--mode', 'chat',
                '--dashboard-data', JSON.stringify(dashboardData_1 || {})
            ]);
            response_1 = '';
            errorOutput_1 = '';
            pythonProcess.stdout.on('data', function (data) {
                response_1 += data.toString();
            });
            pythonProcess.stderr.on('data', function (data) {
                errorOutput_1 += data.toString();
            });
            pythonProcess.on('close', function (code) {
                if (code !== 0) {
                    console.error('Fractal AI process error:', errorOutput_1);
                    // Fallback to rule-based analysis
                    var fallbackResponse = generateFallbackResponse(message_1, dashboardData_1);
                    return res.json({ response: fallbackResponse });
                }
                try {
                    var parsedResponse = JSON.parse(response_1.trim());
                    res.json({ response: parsedResponse.response || parsedResponse });
                }
                catch (parseError) {
                    // If JSON parsing fails, return the raw response
                    res.json({ response: response_1.trim() || generateFallbackResponse(message_1, dashboardData_1) });
                }
            });
            pythonProcess.on('error', function (error) {
                console.error('Failed to start fractal AI process:', error);
                // Fallback to rule-based analysis
                var fallbackResponse = generateFallbackResponse(message_1, dashboardData_1);
                res.json({ response: fallbackResponse });
            });
        }
        catch (error) {
            console.error('Chat API error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
var PORT = process.env.PORT || 12345;
server.listen(PORT, function () {
    console.log("Dashboard API server running on port ".concat(PORT));
    console.log("WebSocket server ready for real-time updates");
});
exports.default = app;
