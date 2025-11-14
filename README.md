# Agent Crypto Frontend

Next.js frontend application for visualizing cryptocurrency and Indian market analysis with Smart Money Concepts (SMC) based trading insights.

## Project Structure

```
agent-crypto-frontend/
├── src/
│   ├── app/          # Next.js app directory
│   │   ├── page.jsx   # Main page
│   │   ├── layout.jsx # App layout
│   │   └── globals.css # Global styles
│   ├── components/    # React components
│   │   ├── SMCAnalysis.jsx
│   │   ├── TradingSetups.jsx
│   │   ├── PriceActionChart.jsx
│   │   ├── MarketAnalysis.jsx
│   │   └── PriceActionDetail.jsx
│   └── lib/          # Utility functions
│       └── utils.js
├── public/           # Static assets
└── package.json      # Dependencies
```

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:8000`

## Setup

1. **Install dependencies**:

```bash
npm install
```

## Running the Frontend

### Development Mode

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Usage

1. **Start the backend** (port 8000) - see `agent-crypto-backend` README
2. **Start the frontend** (port 3000) in a separate terminal
3. **Open your browser** and visit: `http://localhost:3000`
4. **Select market type**: Cryptocurrency or Indian Market
5. **Select a coin/index/stock** from the dropdown
6. **Choose timeframes**: Higher timeframe (1h, 4h, 1d) and Lower timeframe (1m, 5m, 15m, 1h)
7. **Enter number of candles** (1-1000)
8. **Click "Analyze"**
9. **View the analysis** in the tabs:
   - **Price Action**: Interactive price chart with support/resistance levels
   - **SMC Analysis**: Market structure, CHoCH, resistance/support levels, order blocks, FVG
   - **Trading Setups**: Entry, stop loss, and target levels with risk:reward ratios
   - **Market Analysis**: Overall market sentiment and structure
   - **Price Action & Indicators**: Detailed technical indicators (RSI, ADX, EMA)

## Supported Markets

### Cryptocurrency

- Bitcoin (BTCUSDT)
- Ethereum (ETHUSDT)
- Binance Coin (BNBUSDT)
- Solana (SOLUSDT)
- Ripple (XRPUSDT)
- Cardano (ADAUSDT)
- Dogecoin (DOGEUSDT)
- Polkadot (DOTUSDT)
- Polygon (MATICUSDT)
- Litecoin (LTCUSDT)

### Indian Market

- **Indices**: Nifty 50, Bank Nifty
- **Stocks**: 50+ major Indian stocks including:
  - TCS, RELIANCE, HDFCBANK, INFY, AXISBANK
  - ICICIBANK, SBIN, KOTAKBANK, BAJFINANCE
  - And many more...

## Features

- **Interactive Charts**: Price action visualization with support/resistance levels
- **SMC Analysis**: Smart Money Concepts based analysis
- **Trading Setups**: Entry, stop loss, and target levels
- **Technical Indicators**: RSI, ADX, EMA 9/20/50
- **Multiple Timeframes**: Analyze higher and lower timeframes simultaneously
- **Responsive Design**: Works on desktop and mobile devices

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:8000`. If your backend is running on a different host or port, update the API endpoint in `src/app/page.jsx`:

```javascript
const response = await fetch("http://localhost:8000/analyze", {
  // ...
});
```

## Troubleshooting

- **Frontend can't connect**: Verify backend is running on `http://localhost:8000`
- **Build errors**: Ensure Node.js 18+ is installed and run `npm install`
- **Port already in use**: Change the port by running `npm run dev -- -p 3001`
