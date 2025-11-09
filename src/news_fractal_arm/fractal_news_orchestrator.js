#!/usr/bin/env node

/**
 * FRACTAL NEWS ARM - Constitutional Market Harmonics
 * ===================================================
 *
 * Advanced fractal news analysis system that:
 * - Scours web, Twitter, Reddit for market news
 * - Applies 14D fractal analysis to sentiment data
 * - Updates market sentiment database
 * - Influences future trade weighting
 *
 * Scheduling:
 * - News swarms: 3x/day (if system running), 1x/day minimum
 * - Market analysis: Every 5 hours during normal operation
 */

const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');

class FractalNewsArm {
    constructor() {
        this.baseDir = path.join(__dirname, '..', '..');
        this.dataDir = path.join(this.baseDir, 'data', 'news_fractal');
        this.configPath = path.join(this.baseDir, 'config', 'news_fractal_config.json');
        this.lastRunPath = path.join(this.dataDir, 'last_run.json');

        this.sources = {
            web: ['reuters', 'bloomberg', 'cnbc', 'wsj', 'ft'],
            twitter: ['@business', '@markets', '@economy', '@trading'],
            reddit: ['r/investing', 'r/stocks', 'r/wallstreetbets', 'r/finance']
        };

        this.schedule = {
            newsSwarms: {
                targetRuns: 3, // per day
                minimumRuns: 1, // per day minimum
                intervalHours: 8 // every 8 hours for 3 runs
            },
            marketAnalysis: {
                intervalHours: 5, // every 5 hours
                analysisDepth: 14 // 14D fractal analysis
            }
        };
    }

    async initialize() {
        console.log('📰 Initializing Fractal News Arm...');

        // Ensure data directory exists
        await fs.mkdir(this.dataDir, { recursive: true });

        // Load or create configuration
        await this.loadConfig();

        // Initialize database tables
        await this.initializeDatabase();

        console.log('✅ Fractal News Arm initialized');
    }

    async loadConfig() {
        try {
            const configData = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
        } catch (error) {
            // Create default configuration
            this.config = {
                enabled: true,
                apiKeys: {
                    twitter: process.env.TWITTER_API_KEY || '',
                    reddit: {
                        clientId: process.env.REDDIT_CLIENT_ID || '',
                        clientSecret: process.env.REDDIT_CLIENT_SECRET || ''
                    }
                },
                fractalDepth: 14,
                sentimentThreshold: 0.1,
                tradeWeightMultiplier: 1.5,
                lastNewsSwarm: null,
                lastMarketAnalysis: null
            };

            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
            console.log('📝 Created default news fractal configuration');
        }
    }

    async initializeDatabase() {
        const dbPath = path.join(this.baseDir, 'market_harmonics.db');
        const sqlite3 = require('sqlite3').verbose();

        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath);

            // Create news sentiment table
            db.run(`
                CREATE TABLE IF NOT EXISTS news_sentiment (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    source TEXT NOT NULL,
                    symbol TEXT,
                    headline TEXT NOT NULL,
                    content TEXT,
                    sentiment_score REAL,
                    fractal_dimension INTEGER,
                    chaos_signals TEXT,
                    trade_weight REAL,
                    processed BOOLEAN DEFAULT FALSE
                )
            `, (err) => {
                if (err) {
                    console.error('❌ Error creating news_sentiment table:', err);
                    reject(err);
                    return;
                }

                // Create fractal analysis cache table
                db.run(`
                    CREATE TABLE IF NOT EXISTS fractal_cache (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        symbol TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        fractal_dimension INTEGER,
                        attractor_data TEXT,
                        confidence REAL,
                        market_regime TEXT
                    )
                `, (err) => {
                    if (err) {
                        console.error('❌ Error creating fractal_cache table:', err);
                        reject(err);
                        return;
                    }

                    db.close();
                    console.log('🗄️ Database tables initialized');
                    resolve();
                });
            });
        });
    }

    async runNewsSwarm() {
        console.log('🕷️ Launching news swarm...');

        const results = {
            web: [],
            twitter: [],
            reddit: [],
            timestamp: new Date().toISOString()
        };

        // Run web scraping
        try {
            results.web = await this.scrapeWebNews();
        } catch (error) {
            console.error('❌ Web scraping failed:', error.message);
        }

        // Run Twitter analysis
        try {
            results.twitter = await this.analyzeTwitter();
        } catch (error) {
            console.error('❌ Twitter analysis failed:', error.message);
        }

        // Run Reddit analysis
        try {
            results.reddit = await this.analyzeReddit();
        } catch (error) {
            console.error('❌ Reddit analysis failed:', error.message);
        }

        // Process and store results
        await this.processSwarmResults(results);

        // Update last run timestamp
        this.config.lastNewsSwarm = results.timestamp;
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));

        console.log('✅ News swarm completed');
        return results;
    }

    async scrapeWebNews() {
        console.log('🌐 Scraping web news...');

        const results = [];

        for (const source of this.sources.web) {
            try {
                // Use Python script for web scraping
                const headlines = await this.runPythonScript('web_scraper.py', [source]);
                results.push(...headlines);
            } catch (error) {
                console.error(`❌ Failed to scrape ${source}:`, error.message);
            }
        }

        return results;
    }

    async analyzeTwitter() {
        console.log('🐦 Analyzing Twitter sentiment...');

        const results = [];

        for (const account of this.sources.twitter) {
            try {
                const tweets = await this.runPythonScript('twitter_analyzer.py', [account]);
                results.push(...tweets);
            } catch (error) {
                console.error(`❌ Failed to analyze ${account}:`, error.message);
            }
        }

        return results;
    }

    async analyzeReddit() {
        console.log('📱 Analyzing Reddit discussions...');

        const results = [];

        for (const subreddit of this.sources.reddit) {
            try {
                const posts = await this.runPythonScript('reddit_analyzer.py', [subreddit]);
                results.push(...posts);
            } catch (error) {
                console.error(`❌ Failed to analyze ${subreddit}:`, error.message);
            }
        }

        return results;
    }

    async runPythonScript(scriptName, args = []) {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, scriptName);
            const pythonProcess = spawn('python', [scriptPath, ...args], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout);
                        resolve(result);
                    } catch (error) {
                        resolve(stdout.trim());
                    }
                } else {
                    reject(new Error(`Python script failed: ${stderr}`));
                }
            });

            pythonProcess.on('error', (error) => {
                reject(error);
            });
        });
    }

    async processSwarmResults(results) {
        console.log('🔬 Processing swarm results with 14D fractal analysis...');

        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.join(this.baseDir, 'market_harmonics.db');
        const db = new sqlite3.Database(dbPath);

        // Process each news item
        const allNews = [...results.web, ...results.twitter, ...results.reddit];

        for (const item of allNews) {
            try {
                // Apply fractal analysis
                const fractalResult = await this.applyFractalAnalysis(item);

                // Calculate trade weight
                const tradeWeight = this.calculateTradeWeight(fractalResult);

                // Store in database
                await this.storeNewsItem(db, {
                    ...item,
                    ...fractalResult,
                    tradeWeight,
                    timestamp: results.timestamp
                });

            } catch (error) {
                console.error('❌ Failed to process news item:', error.message);
            }
        }

        db.close();
        console.log(`✅ Processed ${allNews.length} news items`);
    }

    async applyFractalAnalysis(newsItem) {
        // Apply 14D fractal analysis to sentiment data
        const sentiment = newsItem.sentiment || 0;

        // Generate fractal attractors based on sentiment
        const attractors = {
            lorenz: this.generateLorenzAttractor(sentiment),
            chen: this.generateChenAttractor(sentiment),
            rossler: this.generateRosslerAttractor(sentiment)
        };

        // Calculate fractal dimension
        const fractalDimension = this.calculateFractalDimension(attractors);

        // Determine market regime
        const marketRegime = this.determineMarketRegime(attractors);

        return {
            fractalDimension,
            attractors: JSON.stringify(attractors),
            marketRegime,
            confidence: this.calculateConfidence(attractors)
        };
    }

    generateLorenzAttractor(sentiment) {
        // Lorenz attractor: σ=10, ρ=28, β=8/3
        const sigma = 10;
        const rho = 28;
        const beta = 8/3;

        let x = sentiment * 10;
        let y = sentiment * 5;
        let z = sentiment * 2;

        const points = [];
        for (let i = 0; i < 1000; i++) {
            const dx = sigma * (y - x);
            const dy = x * (rho - z) - y;
            const dz = x * y - beta * z;

            x += dx * 0.01;
            y += dy * 0.01;
            z += dz * 0.01;

            points.push([x, y, z]);
        }

        return {
            signal: sentiment,
            confidence: Math.abs(sentiment) * 0.8 + 0.2,
            points: points.slice(-100) // Last 100 points
        };
    }

    generateChenAttractor(sentiment) {
        // Chen attractor: a=5, b=10, c=0.38
        const a = 5;
        const b = 10;
        const c = 0.38;

        let x = sentiment * 8;
        let y = sentiment * 3;
        let z = sentiment * 6;

        const points = [];
        for (let i = 0; i < 1000; i++) {
            const dx = a * (y - x);
            const dy = (c - a) * x - x * z + c * y;
            const dz = x * y - b * z;

            x += dx * 0.01;
            y += dy * 0.01;
            z += dz * 0.01;

            points.push([x, y, z]);
        }

        return {
            signal: sentiment * 0.9,
            confidence: Math.abs(sentiment) * 0.7 + 0.3,
            points: points.slice(-100)
        };
    }

    generateRosslerAttractor(sentiment) {
        // Rössler attractor: a=0.2, b=0.2, c=5.7
        const a = 0.2;
        const b = 0.2;
        const c = 5.7;

        let x = sentiment * 2;
        let y = sentiment * 4;
        let z = sentiment * 1;

        const points = [];
        for (let i = 0; i < 1000; i++) {
            const dx = -y - z;
            const dy = x + a * y;
            const dz = b + z * (x - c);

            x += dx * 0.01;
            y += dy * 0.01;
            z += dz * 0.01;

            points.push([x, y, z]);
        }

        return {
            signal: sentiment * 1.1,
            confidence: Math.abs(sentiment) * 0.9 + 0.1,
            points: points.slice(-100)
        };
    }

    calculateFractalDimension(attractors) {
        // Calculate correlation dimension as proxy for fractal dimension
        const points = attractors.lorenz.points;
        const distances = [];

        // Calculate pairwise distances for subset of points
        for (let i = 0; i < Math.min(points.length, 50); i++) {
            for (let j = i + 1; j < Math.min(points.length, 50); j++) {
                const dx = points[i][0] - points[j][0];
                const dy = points[i][1] - points[j][1];
                const dz = points[i][2] - points[j][2];
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                distances.push(distance);
            }
        }

        // Estimate fractal dimension using correlation sum
        distances.sort((a, b) => a - b);
        const r = distances[Math.floor(distances.length * 0.5)]; // median distance

        // Simplified fractal dimension calculation
        const correlationSum = distances.filter(d => d < r).length / distances.length;
        const fractalDim = Math.log(correlationSum) / Math.log(r);

        return Math.max(1, Math.min(14, fractalDim)); // Clamp between 1 and 14
    }

    determineMarketRegime(attractors) {
        const lorenzSignal = attractors.lorenz.signal;
        const chenSignal = attractors.chen.signal;
        const rosslerSignal = attractors.rossler.signal;

        const avgSignal = (lorenzSignal + chenSignal + rosslerSignal) / 3;

        if (avgSignal > 0.3) return 'bullish';
        if (avgSignal < -0.3) return 'bearish';
        return 'neutral';
    }

    calculateConfidence(attractors) {
        const confidences = [
            attractors.lorenz.confidence,
            attractors.chen.confidence,
            attractors.rossler.confidence
        ];

        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }

    calculateTradeWeight(fractalResult) {
        const baseWeight = 1.0;
        const fractalMultiplier = fractalResult.fractalDimension / 7; // Normalize around 7D
        const confidenceMultiplier = fractalResult.confidence;

        let regimeMultiplier = 1.0;
        if (fractalResult.marketRegime === 'bullish') regimeMultiplier = 1.2;
        if (fractalResult.marketRegime === 'bearish') regimeMultiplier = 0.8;

        return baseWeight * fractalMultiplier * confidenceMultiplier * regimeMultiplier * this.config.tradeWeightMultiplier;
    }

    async storeNewsItem(db, item) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO news_sentiment
                (timestamp, source, symbol, headline, content, sentiment_score,
                 fractal_dimension, chaos_signals, trade_weight, processed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                item.timestamp,
                item.source || 'unknown',
                item.symbol || null,
                item.headline || item.title || 'No headline',
                item.content || item.text || '',
                item.sentiment || 0,
                item.fractalDimension,
                item.attractors,
                item.tradeWeight,
                false
            ];

            db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async runMarketAnalysis() {
        console.log('📊 Running market analysis...');

        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.join(this.baseDir, 'market_harmonics.db');
        const db = new sqlite3.Database(dbPath);

        // Get recent news sentiment data
        const recentNews = await this.getRecentNews(db);

        // Apply fractal analysis to aggregated market sentiment
        const marketAnalysis = await this.analyzeMarketSentiment(recentNews);

        // Store market analysis results
        await this.storeMarketAnalysis(db, marketAnalysis);

        // Update trade weights based on analysis
        await this.updateTradeWeights(db, marketAnalysis);

        db.close();

        // Update last analysis timestamp
        this.config.lastMarketAnalysis = new Date().toISOString();
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));

        console.log('✅ Market analysis completed');
        return marketAnalysis;
    }

    async getRecentNews(db) {
        return new Promise((resolve, reject) => {
            const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();

            db.all(`
                SELECT * FROM news_sentiment
                WHERE timestamp > ?
                ORDER BY timestamp DESC
            `, [fiveHoursAgo], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async analyzeMarketSentiment(newsItems) {
        if (newsItems.length === 0) {
            return {
                overallSentiment: 0,
                fractalDimension: 7,
                marketRegime: 'neutral',
                confidence: 0.5,
                tradeWeightAdjustment: 1.0
            };
        }

        // Aggregate sentiment
        const totalSentiment = newsItems.reduce((sum, item) => sum + (item.sentiment_score || 0), 0);
        const overallSentiment = totalSentiment / newsItems.length;

        // Apply fractal analysis to aggregated sentiment
        const fractalResult = await this.applyFractalAnalysis({
            sentiment: overallSentiment,
            source: 'aggregated_market'
        });

        // Calculate trade weight adjustment
        const tradeWeightAdjustment = this.calculateTradeWeight(fractalResult);

        return {
            overallSentiment,
            fractalDimension: fractalResult.fractalDimension,
            marketRegime: fractalResult.marketRegime,
            confidence: fractalResult.confidence,
            tradeWeightAdjustment,
            newsCount: newsItems.length,
            timestamp: new Date().toISOString()
        };
    }

    async storeMarketAnalysis(db, analysis) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO fractal_cache
                (symbol, fractal_dimension, attractor_data, confidence, market_regime)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                'MARKET_OVERALL',
                analysis.fractalDimension,
                JSON.stringify({
                    overall_sentiment: analysis.overallSentiment,
                    news_count: analysis.newsCount
                }),
                analysis.confidence,
                analysis.marketRegime
            ];

            db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async updateTradeWeights(db, analysis) {
        return new Promise((resolve, reject) => {
            // Update unprocessed news items with market analysis adjustment
            const sql = `
                UPDATE news_sentiment
                SET trade_weight = trade_weight * ?,
                    processed = TRUE
                WHERE processed = FALSE
            `;

            db.run(sql, [analysis.tradeWeightAdjustment], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`📈 Updated trade weights for ${this.changes} news items`);
                    resolve(this.changes);
                }
            });
        });
    }

    async scheduleOperations() {
        console.log('⏰ Starting scheduled operations...');

        const checkInterval = 60 * 60 * 1000; // Check every hour

        setInterval(async () => {
            try {
                const now = new Date();
                const lastNewsSwarm = this.config.lastNewsSwarm ?
                    new Date(this.config.lastNewsSwarm) : new Date(0);
                const lastMarketAnalysis = this.config.lastMarketAnalysis ?
                    new Date(this.config.lastMarketAnalysis) : new Date(0);

                const hoursSinceNewsSwarm = (now - lastNewsSwarm) / (1000 * 60 * 60);
                const hoursSinceMarketAnalysis = (now - lastMarketAnalysis) / (1000 * 60 * 60);

                // Check if news swarm should run (every 8 hours for 3x/day target)
                if (hoursSinceNewsSwarm >= this.schedule.newsSwarms.intervalHours) {
                    console.log('🚀 Running scheduled news swarm...');
                    await this.runNewsSwarm();
                }

                // Check if market analysis should run (every 5 hours)
                if (hoursSinceMarketAnalysis >= this.schedule.marketAnalysis.intervalHours) {
                    console.log('📊 Running scheduled market analysis...');
                    await this.runMarketAnalysis();
                }

            } catch (error) {
                console.error('❌ Scheduled operation failed:', error.message);
            }
        }, checkInterval);
    }

    async run() {
        await this.initialize();

        // Run initial operations
        console.log('🚀 Running initial news swarm and market analysis...');
        await this.runNewsSwarm();
        await this.runMarketAnalysis();

        // Start scheduled operations
        await this.scheduleOperations();

        console.log('🎯 Fractal News Arm operational - monitoring market sentiment 24/7');
    }
}

// Run if called directly
if (require.main === module) {
    const newsArm = new FractalNewsArm();
    newsArm.run().catch(console.error);
}

module.exports = FractalNewsArm;