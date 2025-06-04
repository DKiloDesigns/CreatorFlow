# Cash Scripts

This directory contains scripts for Cash's daily workflow, including market scanning, portfolio tracking, bot hunting, and playbook generation.

## Overview

Cash's daily workflow consists of the following steps:

1. **Market Scan**: Analyze the latest crypto market trends, opportunities, and risks
2. **Portfolio Check**: Track your crypto holdings across exchanges and wallets
3. **Bot Hunt**: Discover new trading bots, scripts, and automation tools
4. **Playbook Generation**: Create actionable recommendations based on collected data
5. **Money Logging**: Track all money moves, wins, losses, and lessons

## Scripts

- `cash_daily.py`: Main orchestrator for Cash's daily workflow
- `market_scanner.py`: Scans various sources for crypto market trends and opportunities
- `portfolio_tracker.py`: Tracks your crypto portfolio across exchanges and wallets
- `bot_hunter.py`: Hunts for new trading bots, scripts, and automation tools
- `playbook_generator.py`: Generates actionable playbooks based on collected data
- `money_logger.py`: Logs all money moves, wins, losses, and lessons

## Setup

1. Install required dependencies:
   ```bash
   pip install requests
   ```

2. Configure API keys in `config.json`:
   - Binance API key and secret
   - CoinMarketCap API key
   - CoinGecko API key (optional)

3. Configure portfolio in `config.json`:
   - Add wallet addresses to track
   - Add manual holdings

## Usage

### Run the complete workflow

```bash
python cash_daily.py
```

### Run specific components

```bash
# Only run market scan
python cash_daily.py --market-only

# Only check portfolio
python cash_daily.py --portfolio-only

# Only hunt for new bots/scripts
python cash_daily.py --bots-only
```

## Output

All results are saved in the `results` directory:
- Market scan results: `results/market_scan_YYYYMMDD_HHMMSS.json`
- Portfolio check results: `results/portfolio_YYYYMMDD_HHMMSS.json`
- Bot hunt results: `results/bot_hunt_YYYYMMDD_HHMMSS.json`
- Generated playbook: `results/playbook_YYYYMMDD_HHMMSS.md`

Money moves and lessons are logged in the `logs` directory:
- Portfolio history: `logs/portfolio_history.json`
- Money moves log: `logs/money_moves.md`
- Lessons learned: `logs/lessons_learned.md`

## Extending

### Adding new market data sources

To add a new market data source, modify the `MarketScanner` class in `market_scanner.py`:

1. Add a new method for the data source (e.g., `_scan_new_source`)
2. Call the method from the `scan` method
3. Process the results in the `_process_results` method

### Adding new exchanges

To add a new exchange, modify the `PortfolioTracker` class in `portfolio_tracker.py`:

1. Create a new client class for the exchange (similar to `BinanceClient`)
2. Initialize the client in the `__init__` method
3. Use the client in the `_check_exchange_balances` method

## Security

- API keys are stored locally in `config.json` and are never transmitted to external services
- All scripts run locally on your machine
- No automatic trading is performed without explicit confirmation
- Always review the generated playbook before taking any action

## Disclaimer

These scripts are provided for educational and informational purposes only. They do not constitute financial advice. Always do your own research before making investment decisions. Use at your own risk.# Cash Scripts

This directory contains scripts for Cash's daily workflow, including market scanning, portfolio tracking, bot hunting, and playbook generation.

## Overview

Cash's daily workflow consists of the following steps:

1. **Market Scan**: Analyze the latest crypto market trends, opportunities, and risks
2. **Portfolio Check**: Track your crypto holdings across exchanges and wallets
3. **Bot Hunt**: Discover new trading bots, scripts, and automation tools
4. **Playbook Generation**: Create actionable recommendations based on collected data
5. **Money Logging**: Track all money moves, wins, losses, and lessons

## Scripts

- `cash_daily.py`: Main orchestrator for Cash's daily workflow
- `market_scanner.py`: Scans various sources for crypto market trends and opportunities
- `portfolio_tracker.py`: Tracks your crypto portfolio across exchanges and wallets
- `bot_hunter.py`: Hunts for new trading bots, scripts, and automation tools
- `playbook_generator.py`: Generates actionable playbooks based on collected data
- `money_logger.py`: Logs all money moves, wins, losses, and lessons

## Setup

1. Install required dependencies:
   ```bash
   pip install requests
   ```

2. Configure API keys in `config.json`:
   - Binance API key and secret
   - CoinMarketCap API key
   - CoinGecko API key (optional)

3. Configure portfolio in `config.json`:
   - Add wallet addresses to track
   - Add manual holdings

## Usage

### Run the complete workflow

```bash
python cash_daily.py
```

### Run specific components

```bash
# Only run market scan
python cash_daily.py --market-only

# Only check portfolio
python cash_daily.py --portfolio-only

# Only hunt for new bots/scripts
python cash_daily.py --bots-only
```

## Output

All results are saved in the `results` directory:
- Market scan results: `results/market_scan_YYYYMMDD_HHMMSS.json`
- Portfolio check results: `results/portfolio_YYYYMMDD_HHMMSS.json`
- Bot hunt results: `results/bot_hunt_YYYYMMDD_HHMMSS.json`
- Generated playbook: `results/playbook_YYYYMMDD_HHMMSS.md`

Money moves and lessons are logged in the `logs` directory:
- Portfolio history: `logs/portfolio_history.json`
- Money moves log: `logs/money_moves.md`
- Lessons learned: `logs/lessons_learned.md`

## Extending

### Adding new market data sources

To add a new market data source, modify the `MarketScanner` class in `market_scanner.py`:

1. Add a new method for the data source (e.g., `_scan_new_source`)
2. Call the method from the `scan` method
3. Process the results in the `_process_results` method

### Adding new exchanges

To add a new exchange, modify the `PortfolioTracker` class in `portfolio_tracker.py`:

1. Create a new client class for the exchange (similar to `BinanceClient`)
2. Initialize the client in the `__init__` method
3. Use the client in the `_check_exchange_balances` method

## Security

- API keys are stored locally in `config.json` and are never transmitted to external services
- All scripts run locally on your machine
- No automatic trading is performed without explicit confirmation
- Always review the generated playbook before taking any action

## Disclaimer

These scripts are provided for educational and informational purposes only. They do not constitute financial advice. Always do your own research before making investment decisions. Use at your own risk.