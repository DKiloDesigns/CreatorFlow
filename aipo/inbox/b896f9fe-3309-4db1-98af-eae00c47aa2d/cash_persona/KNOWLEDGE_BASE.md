# Cash Knowledge Base

**Harvest Date:** 2025-05-11

## Top Open-Source Crypto Trading Bots & Frameworks (2025)

### 1. [Freqtrade](https://github.com/freqtrade/freqtrade)
- Python, 39k stars, 7.7k forks
- Supports all major exchanges (Binance, Kraken, OKX, Bybit, etc.)
- Features: Backtesting, strategy optimization (ML), Telegram/web UI, dry-run, edge position sizing, adaptive prediction modeling
- Highly active, well-documented, community support

### 2. [Awesome Crypto Trading Bots List](https://github.com/botcrypto-io/awesome-crypto-trading-bots)
- Curated list of top open-source bots, frameworks, and libraries
- Includes: Backtrader, Hummingbot, Octobot, Jesse, Kelp, Magic8bot, Superalgos, Zenbot, WolfBot, and more
- Also indexes technical analysis libraries, market data APIs, and charting tools

### 3. [Hummingbot](https://hummingbot.org/)
- Open-source, market-making and liquidity provision bot
- Supports CEXs and DEXs, arbitrage, liquidity mining, visual editor
- Free, community-driven, advanced strategies

### 4. [Jesse](https://github.com/jesse-ai/jesse)
- Advanced Python framework for researching, backtesting, and running live crypto trading strategies
- Focus on algorithmic trading, ML, and risk management

### 5. [3Commas](https://3commas.io/)
- Popular commercial platform with open API, supports grid, DCA, arbitrage, portfolio management
- Pre-built and custom strategies, paper trading, analytics

### 6. [Pionex](https://www.pionex.com/)
- Exchange with 16+ free built-in trading bots (Grid, DCA, Arbitrage, etc.)
- No coding required, easy for beginners

### 7. [Cryptohopper](https://www.cryptohopper.com/)
- AI-driven, supports 17+ exchanges, strategy marketplace, backtesting, paper trading
- Paid plans, but robust features and community

### 8. [WunderTrading](https://wundertrading.com/)
- AI-powered bots, DCA, GRID, arbitrage, copy trading, risk management
- Paper trading, multi-exchange support

### 9. [SuperX Memecoin Copy Trading Bot](https://trysuper.co/blog/best-ai-trading-bot-for-crypto-beginners-in-2025)
- Telegram-based, copy trades from premium wallets, high win rates
- User-friendly, real-time alerts, scalable

### 10. [Solana Trading Bots (GoodCryptoX)](https://goodcrypto.app/solana-trading-bot/)
- DEX trading bots for Solana: Grid, DCA, Sniper, portfolio rebalancer
- Non-custodial, advanced DeFi automation

---

## Technical Analysis & Market Data Libraries
- [TA-Lib](https://github.com/TA-Lib/ta-lib-python): Python technical analysis library
- [ccxt](https://github.com/ccxt/ccxt): Unified crypto exchange API (Python/JS/PHP)
- [pandas-ta](https://github.com/twopirllc/pandas-ta): 120+ indicators for Pandas
- [TradingView](https://www.tradingview.com/): Charts, signals, and community scripts

---

## Cash Daily Workflow (Implemented 2025-05-11)

### Core Components
- **Market Scanner**: Analyzes crypto market trends, opportunities, and risks from multiple sources
- **Portfolio Tracker**: Tracks crypto holdings across exchanges and wallets (Binance integration ready)
- **Bot Hunter**: Discovers and evaluates new trading bots and scripts based on quality, security, and activity
- **Playbook Generator**: Creates actionable recommendations based on collected data
- **Money Logger**: Tracks all money moves, wins, losses, and lessons for continuous improvement

### Usage
```bash
# Run the complete workflow
./run_cash.sh

# Run specific components
./run_cash.sh --market-only
./run_cash.sh --portfolio-only
./run_cash.sh --bots-only
```

### Implementation
- All scripts are located in the `scripts` directory
- Configuration is stored in `scripts/config.json`
- Results are saved in the `scripts/results` directory
- Logs are saved in the `scripts/logs` directory

---

## Next Steps
- Add Binance API keys to `scripts/config.json`
- Run the daily workflow to generate the first playbook
- Vet, test, and adapt the top bots for our wallets/exchanges
- Set up daily/weekly harvest for new tools, strategies, and market changes
- Document all findings, scripts, and results in this knowledge base

---

*This file is the foundation for Cash's automated trading intelligence. Update regularly with new tools, scripts, and lessons learned.* 