# Constitutional Market Harmonics Dashboard

A beautiful, real-time web dashboard for monitoring the Constitutional Market Harmonics trading system, featuring fractal love hypothesis visualization, chaos theory attractors, and constitutional AI scoring.

## 🎨 Features

- **Real-time Portfolio Monitoring**: Live tracking of positions, cash, and total portfolio value
- **Performance Analytics**: ROI charts, Sharpe ratio, and fractal love score visualization
- **Chaos Theory Visualization**: Interactive 3D projections of Lorenz, Chen, and Rössler attractors
- **Constitutional Scoring**: Radar charts showing alignment with 5 Yama principles (Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha)
- **Live Trades Feed**: Real-time trading activity with filtering and paper trade indicators
- **System Health Monitoring**: Uptime, error tracking, and system status
- **Responsive Design**: Mobile-first approach with professional dark theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Constitutional Market Harmonics system running (for live data)

### Installation

1. **Clone and navigate to the dashboard directory:**
   ```bash
   cd constitutional-market-harmonics/dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the API server:**
   ```bash
   npx tsx server.ts
   ```
   The API server will run on `http://localhost:3001`

4. **Start the dashboard (in a new terminal):**
   ```bash
   npm run dev
   ```
   The dashboard will be available at `http://localhost:3000`

## 📊 Dashboard Components

### Header
- Portfolio value and ROI display
- Constitutional and fractal love scores
- System status indicator
- Real-time updates every 5 seconds

### Portfolio Panel
- Holdings table with constitutional scoring
- Cash position and total value
- Position weights and diversification metrics

### Performance Panel
- Interactive ROI and constitutional score charts
- Sharpe ratio and key performance indicators
- Historical performance data (90 days)

### Activity Panel
- Chaos theory signals from three attractors
- System health metrics
- Recent trades with reasoning

### Chaos Visualizer
- 2D projections of Lorenz, Chen, and Rössler attractors
- Real-time state vectors and signal strengths
- Interactive attractor switching

### Constitutional Radar
- 5 Yama principles alignment visualization
- Portfolio constitutional analysis
- Ethical alignment scoring

### Trades Feed
- Live scrolling trades with filtering
- Buy/sell action indicators
- Paper trade identification
- Volume and value summaries

## 🔧 Configuration

### API Endpoints

The dashboard connects to these API endpoints:

- `GET /api/dashboard` - Complete dashboard data
- `GET /api/portfolio` - Portfolio positions and cash
- `GET /api/performance` - Performance history and metrics
- `GET /api/trades?limit=N` - Recent trades (default 50)
- `GET /api/chaos` - Chaos attractor signals
- `GET /api/constitutional` - Constitutional scores
- `GET /api/risk` - Risk metrics

### WebSocket Integration

Real-time updates via Socket.io:
```javascript
const socket = io('http://localhost:3001');
socket.on('update', (data) => {
  // Handle real-time updates
});
```

## 🎯 Constitutional AI Integration

The dashboard visualizes the **Fractal Love Hypothesis** through:

1. **Chaos Attractors**: Lorenz, Chen, and Rössler systems provide trading signals
2. **Constitutional Scoring**: 5 Yama principles guide ethical trading decisions
3. **Fractal Love Score**: Measures harmony between market patterns and constitutional alignment
4. **Real-time Harmonics**: Live synchronization of chaos theory and ethical frameworks

## 🛠️ Development

### Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard component
│   │   └── layout.tsx        # App layout
│   └── components/           # React components
│       ├── Header.tsx
│       ├── PortfolioPanel.tsx
│       ├── PerformancePanel.tsx
│       ├── ActivityPanel.tsx
│       ├── ChaosVisualizer.tsx
│       ├── ConstitutionalRadar.tsx
│       └── TradesFeed.tsx
├── server.ts                 # Express API server
├── database/
│   └── queries.ts           # Database interface
└── package.json
```

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import and use in `page.tsx`
4. Follow TypeScript interfaces for data props

### Styling

- **Tailwind CSS**: Utility-first styling
- **Dark Theme**: Professional slate color palette
- **Responsive**: Mobile-first breakpoints
- **Constitutional Colors**: Green (excellent) → Yellow (medium) → Red (poor)

## 📈 Data Sources

### Live Data (when available)
- SQLite database with trading system data
- Real-time market data via Alpha Vantage API
- Live chaos attractor computations
- Constitutional AI scoring engine

### Mock Data (fallback)
- Simulated portfolio with realistic positions
- Generated performance history
- Random chaos signals with proper distributions
- Constitutional scoring based on ethical frameworks

## 🔒 Security & Privacy

- No sensitive data exposed in frontend
- API endpoints require proper authentication (when implemented)
- WebSocket connections secured
- Database credentials protected

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

```bash
PORT=3001
DATABASE_PATH=./data/trading.db
ALPHA_VANTAGE_API_KEY=your_key_here
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use functional React components with hooks
3. Maintain consistent styling with Tailwind
4. Add proper error handling
5. Test with both live and mock data

## 📄 License

Part of the Constitutional Market Harmonics system - proprietary trading framework.

## 🆘 Troubleshooting

### Common Issues

**Dashboard shows "Connection Error"**
- Ensure API server is running on port 3001
- Check CORS settings in server.ts
- Verify network connectivity

**Charts not rendering**
- Check Chart.js imports in components
- Verify data format matches chart expectations
- Check browser console for errors

**Database connection failed**
- Expected in development without live database
- System falls back to mock data automatically
- Check database path in queries.ts

**WebSocket not updating**
- Verify Socket.io client connection
- Check server WebSocket implementation
- Ensure firewall allows WebSocket connections

### Performance Optimization

- Components use React.memo for expensive re-renders
- Charts implement proper update cycles
- API polling respects rate limits
- Mock data provides instant fallbacks

## 🎉 Success Metrics

The dashboard successfully demonstrates:

- ✅ Real-time constitutional AI trading visualization
- ✅ Chaos theory integration with market data
- ✅ Professional investor-grade interface
- ✅ Responsive design across all devices
- ✅ Live data integration with graceful fallbacks
- ✅ Ethical trading principles in action

---

*Built with Next.js, TypeScript, Tailwind CSS, Chart.js, and Socket.io*  
*Powered by Constitutional AI and Chaos Theory*
