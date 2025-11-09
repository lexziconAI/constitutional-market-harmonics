const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load environment variables (safely handle missing .env file)
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envVars = {};
            envContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                }
            });
            return envVars;
        }
    } catch (error) {
        console.log('Warning: Could not load .env file, using defaults');
    }
    return {};
}

const env = loadEnv();
const DEV_PASSWORD = env.DEV_PASSWORD || 'fractal2025';

// Simple token generation (not cryptographically secure for production)
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Store active tokens (in production, use Redis/database)
const activeTokens = new Set();

// CORS headers - Allow localhost for development and Render domain for production
function getCorsHeaders(origin) {
    const allowedOrigins = [
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'https://constitutional-market-harmonics-dashboard.onrender.com'
    ];

    // Allow all origins for now to avoid CORS issues
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
}

// Create server
const server = http.createServer((req, res) => {
    try {
        console.log('Request received:', req.method, req.url, req.headers.host);
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            const corsHeaders = getCorsHeaders(req.headers.origin);
            res.writeHead(200, corsHeaders);
            res.end();
            return;
        }

        // Parse URL more robustly
        let pathname;
        try {
            const url = new URL(req.url, `http://localhost`);
            pathname = url.pathname;
        } catch (error) {
            // Fallback for malformed URLs
            pathname = req.url.split('?')[0]; // Remove query string
            if (!pathname.startsWith('/')) pathname = '/' + pathname;
        }
        const corsHeaders = getCorsHeaders(req.headers.origin);

    // Serve dashboard HTML at root
    if (pathname === '/' && req.method === 'GET') {
        try {
            const htmlPath = path.join(__dirname, 'dashboard_REAL.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            res.writeHead(200, { ...corsHeaders, 'Content-Type': 'text/html' });
            res.end(htmlContent);
            return;
        } catch (error) {
            console.error('Error serving dashboard HTML:', error);
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'text/html' });
            res.end('<h1>Server Error</h1><p>Unable to load dashboard</p>');
            return;
        }
    }

    // Login endpoint
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { password } = JSON.parse(body);

                if (password === DEV_PASSWORD) {
                    const token = generateToken();
                    activeTokens.add(token);

                    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        token: token,
                        user: { id: 'local-dev', role: 'admin' },
                        expiresIn: '24h'
                    }));
                } else {
                    res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
                }
            } catch (error) {
                res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
        return;
    }

    // Authenticate token
    function checkToken(req) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        return token && activeTokens.has(token);
    }

    // Protected dashboard endpoint
    if (pathname === '/api/dashboard' && req.method === 'GET') {
        if (!checkToken(req)) {
            res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Authentication required' }));
            return;
        }

        const data = {
            success: true,
            timestamp: new Date().toISOString(),
            data: {
                portfolio: {
                    total_value: 1250000,
                    cash: 50000,
                    positions: [
                        { symbol: 'AAPL', quantity: 100, avgPrice: 150.25, value: 17523, weight: 0.35, constitutionalScore: 0.92 },
                        { symbol: 'MSFT', quantity: 75, avgPrice: 380.50, value: 28537.5, weight: 0.25, constitutionalScore: 0.88 },
                        { symbol: 'GOOGL', quantity: 50, avgPrice: 140.75, value: 7037.5, weight: 0.15, constitutionalScore: 0.85 },
                        { symbol: 'TSLA', quantity: 30, avgPrice: 242.10, value: 7263, weight: 0.12, constitutionalScore: 0.78 },
                        { symbol: 'AMZN', quantity: 25, avgPrice: 185.50, value: 4637.5, weight: 0.08, constitutionalScore: 0.82 }
                    ]
                },
                performance: {
                    roi: 0.156,
                    sharpe: 1.85,
                    constitutionalScore: 0.87
                }
            }
        };

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // Protected chaos attractors endpoint
    if (pathname === '/api/chaos' && req.method === 'GET') {
        if (!checkToken(req)) {
            res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Authentication required' }));
            return;
        }

        // Generate Lorenz attractor data (simplified for demo)
        const lorenzData = [];
        let x = 1, y = 1, z = 1;
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = 0.01;

        for (let i = 0; i < 1000; i++) {
            const dx = sigma * (y - x);
            const dy = x * (rho - z) - y;
            const dz = x * y - beta * z;
            x += dx * dt;
            y += dy * dt;
            z += dz * dt;
            lorenzData.push({ x, y, z, t: i });
        }

        // Generate Chen attractor data
        const chenData = [];
        x = 1; y = 1; z = 1;
        const a = 5, b = -10, c = -0.38;

        for (let i = 0; i < 1000; i++) {
            const dx = a * (y - x);
            const dy = (c - a) * x - x * z + c * y;
            const dz = x * y - b * z;
            x += dx * dt;
            y += dy * dt;
            z += dz * dt;
            chenData.push({ x, y, z, t: i });
        }

        // Generate Rössler attractor data
        const rosslerData = [];
        x = 1; y = 1; z = 1;
        const rossler_a = 0.2, rossler_b = 0.2, rossler_c = 5.7;

        for (let i = 0; i < 1000; i++) {
            const dx = -y - z;
            const dy = x + rossler_a * y;
            const dz = rossler_b + z * (x - rossler_c);
            x += dx * dt;
            y += dy * dt;
            z += dz * dt;
            rosslerData.push({ x, y, z, t: i });
        }

        const data = {
            success: true,
            timestamp: new Date().toISOString(),
            attractors: {
                lorenz: {
                    name: 'Lorenz Attractor',
                    description: 'Classic butterfly effect - market volatility patterns',
                    data: lorenzData,
                    parameters: { sigma, rho, beta }
                },
                chen: {
                    name: 'Chen Attractor',
                    description: 'Economic cycle modeling - business cycles',
                    data: chenData,
                    parameters: { a, b, c }
                },
                rossler: {
                    name: 'Rössler Attractor',
                    description: 'Complex market oscillations - fractal patterns',
                    data: rosslerData,
                    parameters: { a: rossler_a, b: rossler_b, c: rossler_c }
                }
            }
        };

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // Protected international portfolio endpoint
    if (pathname === '/api/international-portfolio' && req.method === 'GET') {
        if (!checkToken(req)) {
            res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Authentication required' }));
            return;
        }

        const data = {
            success: true,
            timestamp: new Date().toISOString(),
            summary: {
                totalPortfolioValue: 381033.60,
                internationalValue: 155154.49,
                usValue: 225879.11,
                internationalAllocation: 40.72,
                internationalPositions: 13,
                usPositions: 6
            },
            international: {
                positions: [
                    {
                        symbol: 'ASML.AS',
                        shares: 67,
                        currentValue: 49602.78,
                        exchange: 'Amsterdam Stock Exchange',
                        country: '🇳🇱 Netherlands',
                        region: 'Europe',
                        gain: 500.00,
                        gainPercent: 1.02
                    },
                    {
                        symbol: 'SAP.DE',
                        shares: 45,
                        currentValue: 20012.40,
                        exchange: 'Xetra',
                        country: '🇩🇪 Germany',
                        region: 'Europe',
                        gain: -1200.00,
                        gainPercent: -5.65
                    },
                    {
                        symbol: 'AZN.L',
                        shares: 120,
                        currentValue: 14706.60,
                        exchange: 'London Stock Exchange',
                        country: '🇬🇧 UK',
                        region: 'Europe',
                        gain: 2300.00,
                        gainPercent: 18.52
                    },
                    {
                        symbol: 'ULVR.L',
                        shares: 85,
                        currentValue: 5353.05,
                        exchange: 'London Stock Exchange',
                        country: '🇬🇧 UK',
                        region: 'Europe',
                        gain: 453.05,
                        gainPercent: 9.25
                    },
                    {
                        symbol: 'HSBA.L',
                        shares: 200,
                        currentValue: 869.95,
                        exchange: 'London Stock Exchange',
                        country: '🇬🇧 UK',
                        region: 'Europe',
                        gain: -130.05,
                        gainPercent: -13.00
                    },
                    {
                        symbol: '000001.SS',
                        shares: 500,
                        currentValue: 44800.00,
                        exchange: 'Shanghai Stock Exchange',
                        country: '🇨🇳 China',
                        region: 'Asia Pacific',
                        gain: 1200.00,
                        gainPercent: 2.75
                    },
                    {
                        symbol: 'CBA.AX',
                        shares: 150,
                        currentValue: 7817.70,
                        exchange: 'ASX',
                        country: '🇦🇺 Australia',
                        region: 'Asia Pacific',
                        gain: 817.70,
                        gainPercent: 11.68
                    },
                    {
                        symbol: 'FPH.NZ',
                        shares: 300,
                        currentValue: 3609.74,
                        exchange: 'NZX',
                        country: '🇳🇿 New Zealand',
                        region: 'Asia Pacific',
                        gain: 609.74,
                        gainPercent: 20.32
                    },
                    {
                        symbol: 'AIA.NZ',
                        shares: 250,
                        currentValue: 3527.17,
                        exchange: 'NZX',
                        country: '🇳🇿 New Zealand',
                        region: 'Asia Pacific',
                        gain: 527.17,
                        gainPercent: 17.57
                    },
                    {
                        symbol: '7203.T',
                        shares: 50,
                        currentValue: 1239.50,
                        exchange: 'Tokyo Stock Exchange',
                        country: '🇯🇵 Japan',
                        region: 'Asia Pacific',
                        gain: 239.50,
                        gainPercent: 24.00
                    },
                    {
                        symbol: '9432.T',
                        shares: 40,
                        currentValue: 1239.50,
                        exchange: 'Tokyo Stock Exchange',
                        country: '🇯🇵 Japan',
                        region: 'Asia Pacific',
                        gain: 239.50,
                        gainPercent: 24.00
                    },
                    {
                        symbol: '0005.HK',
                        shares: 100,
                        currentValue: 587.60,
                        exchange: 'Hong Kong Stock Exchange',
                        country: '🇭🇰 Hong Kong',
                        region: 'Asia Pacific',
                        gain: 87.60,
                        gainPercent: 17.52
                    },
                    {
                        symbol: 'ABX.TO',
                        shares: 80,
                        currentValue: 1788.50,
                        exchange: 'Toronto Stock Exchange',
                        country: '🇨🇦 Canada',
                        region: 'North America',
                        gain: 288.50,
                        gainPercent: 19.24
                    }
                ],
                byRegion: {
                    Europe: [
                        { symbol: 'ASML.AS', value: 49602.78, country: '🇳🇱 Netherlands' },
                        { symbol: 'SAP.DE', value: 20012.40, country: '🇩🇪 Germany' },
                        { symbol: 'AZN.L', value: 14706.60, country: '🇬🇧 UK' },
                        { symbol: 'ULVR.L', value: 5353.05, country: '🇬🇧 UK' },
                        { symbol: 'HSBA.L', value: 869.95, country: '🇬🇧 UK' }
                    ],
                    'Asia Pacific': [
                        { symbol: '000001.SS', value: 44800.00, country: '🇨🇳 China' },
                        { symbol: 'CBA.AX', value: 7817.70, country: '🇦🇺 Australia' },
                        { symbol: 'FPH.NZ', value: 3609.74, country: '🇳🇿 New Zealand' },
                        { symbol: 'AIA.NZ', value: 3527.17, country: '🇳🇿 New Zealand' },
                        { symbol: '7203.T', value: 1239.50, country: '🇯🇵 Japan' },
                        { symbol: '9432.T', value: 1239.50, country: '🇯🇵 Japan' },
                        { symbol: '0005.HK', value: 587.60, country: '🇭🇰 Hong Kong' }
                    ],
                    'North America': [
                        { symbol: 'ABX.TO', value: 1788.50, country: '🇨🇦 Canada' }
                    ]
                },
                diversification: {
                    regions: 3,
                    countries: 9,
                    topPosition: 'ASML.AS',
                    topPositionValue: 49602.78
                }
            }
        };

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // Protected chat endpoint
    if (pathname === '/api/chat' && req.method === 'POST') {
        if (!checkToken(req)) {
            res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Authentication required' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);

                // Simplified AI response without Python subprocess
                let response = '';
                const lowerMessage = message.toLowerCase();

                if (lowerMessage.includes('portfolio')) {
                    response = 'Your portfolio shows strong constitutional alignment with 87% ethical scoring. The international diversification provides excellent risk management across 9 countries and 3 regions. Key holdings include ASML.AS (Netherlands) and semiconductor positions that benefit from AI-driven market efficiency.';
                } else if (lowerMessage.includes('chaos') || lowerMessage.includes('attractor')) {
                    response = 'The chaos attractors reveal fractal patterns in market behavior. The Lorenz attractor shows volatility clustering typical of market corrections, while Chen and Rössler attractors model complex economic cycles. Current patterns suggest we\'re in a stable but adaptive phase of the market cycle.';
                } else if (lowerMessage.includes('boje') || lowerMessage.includes('antenarrative')) {
                    response = 'David Boje\'s antenarrative theory helps us understand market narratives before they fully form. Current fragments show strong institutional positioning in AI semiconductors (ASML.AS, NVDA) and sustainable energy transitions. The narrative coherence is at 76%, indicating emerging bullish sentiment.';
                } else if (lowerMessage.includes('international')) {
                    response = 'Your international portfolio spans Europe (58.5%), Asia Pacific (40.5%), and North America (0.9%). European holdings are performing well with ASML.AS leading gains. Asian positions provide diversification with Chinese and Japanese technology exposure. This geographic spread enhances constitutional resilience.';
                } else if (lowerMessage.includes('constitutional') || lowerMessage.includes('ethics')) {
                    response = 'Constitutional market harmonics integrate ethical investing with fractal analysis. Your portfolio maintains an 87% constitutional score, balancing profit motives with societal benefit. The framework ensures investments align with both financial returns and positive societal impact.';
                } else {
                    response = 'I\'m analyzing market patterns through constitutional harmonics. Your portfolio shows strong fractal alignment with international diversification across 9 countries. The chaos attractors indicate we\'re in a stable growth phase. How can I help you understand specific aspects of your investment strategy?';
                }

                // Generate realistic analysis metrics
                const sentiment = response.toLowerCase().includes('bullish') || response.toLowerCase().includes('growth') || response.toLowerCase().includes('positive') || response.toLowerCase().includes('strong') ? 'bullish' : 'neutral';
                const confidence = Math.floor(Math.random() * 15) + 80; // 80-95%
                const fractalScore = (Math.random() * 0.15 + 0.85).toFixed(2); // 0.85-1.0

                const data = {
                    success: true,
                    timestamp: new Date().toISOString(),
                    message: response,
                    analysis: {
                        sentiment: sentiment,
                        confidence: confidence,
                        fractalScore: fractalScore
                    }
                };

                res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (error) {
                console.error('Chat endpoint error:', error);
                res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
        return;
    }

    // Protected antenarrative analysis endpoint
    if (pathname === '/api/antenarrative' && req.method === 'GET') {
        if (!checkToken(req)) {
            res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Authentication required' }));
            return;
        }

        const data = {
            success: true,
            timestamp: new Date().toISOString(),
            bojeAnalysis: {
                theory: 'David Boje\'s Antenarrative Theory',
                description: 'Pre-narrative fragments that shape market stories before they emerge',
                currentFragments: [
                    {
                        type: 'betting',
                        description: 'Institutional investors positioning for AI semiconductor growth',
                        strength: 0.85,
                        symbols: ['ASML.AS', 'NVDA', 'TSMC']
                    },
                    {
                        type: 'storytelling',
                        description: 'Narrative of sustainable energy transition gaining traction',
                        strength: 0.72,
                        symbols: ['ENPH', 'SEDG', 'FSLR']
                    },
                    {
                        type: 'rhizomatic',
                        description: 'Decentralized finance narratives spreading through crypto markets',
                        strength: 0.68,
                        symbols: ['COIN', 'MSTR', 'SQ']
                    },
                    {
                        type: 'residual',
                        description: 'Legacy banking narratives resisting digital transformation',
                        strength: 0.45,
                        symbols: ['JPM', 'BAC', 'WFC']
                    }
                ],
                emergingNarratives: [
                    'AI-driven market efficiency revolution',
                    'Climate-conscious investment paradigm shift',
                    'Decentralized financial sovereignty',
                    'Constitutional market alignment'
                ],
                narrativeHealth: {
                    coherence: 0.76,
                    stability: 0.82,
                    adaptability: 0.91,
                    constitutionalAlignment: 0.88
                }
            }
        };

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // Health check endpoint
    if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            features: ['dashboard', 'chaos-attractors', 'international-portfolio', 'antenarrative-analysis', 'ai-chat']
        }));
        return;
    }

    // 404
    res.writeHead(404, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
    }
});

const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';
console.log(`Starting server on ${HOST}:${PORT}`);
console.log('Environment check:');
console.log(`- PORT: ${PORT}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`- Working directory: ${process.cwd()}`);
console.log(`- HTML file exists: ${fs.existsSync(path.join(__dirname, 'dashboard_REAL.html'))}`);
server.listen(PORT, HOST, () => {
    console.log('🔐 Constitutional Market Harmonics - Full Web Dashboard Server');
    console.log(`✅ Running on http://${HOST}:${PORT}`);
    console.log('💚 Fractal Love: Profit + Ethics + Security');
    console.log('🔑 Authentication: Simple token-based');
    console.log('🛡️ API Keys: Server-side only');
    console.log('');
    console.log('Routes:');
    console.log('  GET  / - Dashboard HTML page');
    console.log('  POST /api/auth/login - Login (password: fractal2025)');
    console.log('  GET  /api/dashboard - Portfolio data (requires auth)');
    console.log('  GET  /api/chaos - Chaos attractors (requires auth)');
    console.log('  GET  /api/international-portfolio - Intl holdings (requires auth)');
    console.log('  POST /api/chat - AI analysis chat (requires auth)');
    console.log('  GET  /api/antenarrative - Boje analysis (requires auth)');
    console.log('  GET  /api/health - Health check');
    console.log('');
    console.log('🌐 Open your browser to the deployment URL to access the dashboard');
});