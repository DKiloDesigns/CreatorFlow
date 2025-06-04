#!/usr/bin/env python3
"""
Cash Daily Workflow - Main Orchestrator

This script runs Cash's daily workflow:
1. Market scan for latest crypto trends and opportunities
2. Portfolio check (when API keys are provided)
3. Bot/script hunt for new trading tools
4. Generate actionable playbook
5. Log money moves and lessons

Usage:
    python cash_daily.py [--full] [--market-only] [--portfolio-only] [--bots-only]

Options:
    --full          Run the complete workflow (default)
    --market-only   Only run the market scan
    --portfolio-only Only check the portfolio
    --bots-only     Only hunt for new bots/scripts
"""

import os
import sys
import json
import time
import argparse
import logging
from datetime import datetime
from pathlib import Path

# Import workflow modules
from market_scanner import MarketScanner
from portfolio_tracker import PortfolioTracker
from bot_hunter import BotHunter
from playbook_generator import PlaybookGenerator
from money_logger import MoneyLogger

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"cash_daily_{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("Cash")

# Constants
CONFIG_PATH = Path(__file__).parent / "config.json"
RESULTS_DIR = Path(__file__).parent / "results"
LOGS_DIR = Path(__file__).parent / "logs"

def ensure_dirs():
    """Ensure all required directories exist"""
    for dir_path in [RESULTS_DIR, LOGS_DIR]:
        dir_path.mkdir(exist_ok=True, parents=True)
    logger.info("Directory structure verified")

def load_config():
    """Load configuration from config.json"""
    if not CONFIG_PATH.exists():
        logger.warning(f"Config file not found at {CONFIG_PATH}. Creating default config.")
        default_config = {
            "api_keys": {
                "binance": {
                    "api_key": "",
                    "api_secret": ""
                },
                "coinmarketcap": "",
                "coingecko": ""
            },
            "portfolio": {
                "track_wallets": [],
                "manual_holdings": {}
            },
            "market_scan": {
                "top_coins": 100,
                "trending_threshold": 5,
                "sources": ["coingecko", "reddit", "twitter"]
            },
            "bot_hunt": {
                "github_topics": ["crypto-trading-bot", "trading-bot", "crypto-bot"],
                "min_stars": 100
            }
        }
        with open(CONFIG_PATH, 'w') as f:
            json.dump(default_config, f, indent=4)
        return default_config
    
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def run_market_scan(config):
    """Run the market scanner module"""
    logger.info("Starting market scan...")
    scanner = MarketScanner(config["market_scan"], config["api_keys"])
    results = scanner.scan()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"market_scan_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Market scan complete. Results saved to {output_file}")
    return results

def check_portfolio(config):
    """Check portfolio status using the portfolio tracker"""
    logger.info("Checking portfolio...")
    tracker = PortfolioTracker(config["portfolio"], config["api_keys"])
    results = tracker.check()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"portfolio_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Portfolio check complete. Results saved to {output_file}")
    return results

def hunt_bots(config):
    """Hunt for new trading bots and scripts"""
    logger.info("Hunting for new trading bots and scripts...")
    hunter = BotHunter(config["bot_hunt"])
    results = hunter.hunt()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"bot_hunt_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Bot hunt complete. Results saved to {output_file}")
    return results

def generate_playbook(market_data, portfolio_data, bot_data):
    """Generate an actionable playbook based on collected data"""
    logger.info("Generating actionable playbook...")
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
    
    # Save playbook
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"playbook_{timestamp}.md"
    with open(output_file, 'w') as f:
        f.write(playbook)
    
    logger.info(f"Playbook generated. Saved to {output_file}")
    return playbook

def log_money_moves(market_data, portfolio_data, playbook):
    """Log money moves, wins, losses, and lessons"""
    logger.info("Logging money moves...")
    money_logger = MoneyLogger(LOGS_DIR)
    money_logger.log(market_data, portfolio_data, playbook)
    logger.info("Money moves logged")

def main():
    """Main function to run the Cash daily workflow"""
    parser = argparse.ArgumentParser(description="Cash Daily Workflow")
    parser.add_argument("--full", action="store_true", help="Run the complete workflow")
    parser.add_argument("--market-only", action="store_true", help="Only run the market scan")
    parser.add_argument("--portfolio-only", action="store_true", help="Only check the portfolio")
    parser.add_argument("--bots-only", action="store_true", help="Only hunt for new bots/scripts")
    args = parser.parse_args()
    
    # Default to full workflow if no specific option is selected
    if not (args.market_only or args.portfolio_only or args.bots_only):
        args.full = True
    
    # Ensure directories exist
    ensure_dirs()
    
    # Load configuration
    config = load_config()
    
    # Initialize results
    market_data = None
    portfolio_data = None
    bot_data = None
    
    # Run selected workflow components
    if args.full or args.market_only:
        market_data = run_market_scan(config)
    
    if args.full or args.portfolio_only:
        portfolio_data = check_portfolio(config)
    
    if args.full or args.bots_only:
        bot_data = hunt_bots(config)
    
    # Generate playbook if we have at least some data
    if args.full and (market_data or portfolio_data or bot_data):
        playbook = generate_playbook(market_data, portfolio_data, bot_data)
        log_money_moves(market_data, portfolio_data, playbook)
    
    logger.info("Cash daily workflow completed successfully")

if __name__ == "__main__":
    start_time = time.time()
    logger.info("Starting Cash daily workflow")
    
    try:
        main()
    except Exception as e:
        logger.error(f"Error in Cash daily workflow: {str(e)}", exc_info=True)
        sys.exit(1)
    
    elapsed_time = time.time() - start_time
    logger.info(f"Cash daily workflow completed in {elapsed_time:.2f} seconds")#!/usr/bin/env python3
"""
Cash Daily Workflow - Main Orchestrator

This script runs Cash's daily workflow:
1. Market scan for latest crypto trends and opportunities
2. Portfolio check (when API keys are provided)
3. Bot/script hunt for new trading tools
4. Generate actionable playbook
5. Log money moves and lessons

Usage:
    python cash_daily.py [--full] [--market-only] [--portfolio-only] [--bots-only]

Options:
    --full          Run the complete workflow (default)
    --market-only   Only run the market scan
    --portfolio-only Only check the portfolio
    --bots-only     Only hunt for new bots/scripts
"""

import os
import sys
import json
import time
import argparse
import logging
from datetime import datetime
from pathlib import Path

# Import workflow modules
from market_scanner import MarketScanner
from portfolio_tracker import PortfolioTracker
from bot_hunter import BotHunter
from playbook_generator import PlaybookGenerator
from money_logger import MoneyLogger

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"cash_daily_{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("Cash")

# Constants
CONFIG_PATH = Path(__file__).parent / "config.json"
RESULTS_DIR = Path(__file__).parent / "results"
LOGS_DIR = Path(__file__).parent / "logs"

def ensure_dirs():
    """Ensure all required directories exist"""
    for dir_path in [RESULTS_DIR, LOGS_DIR]:
        dir_path.mkdir(exist_ok=True, parents=True)
    logger.info("Directory structure verified")

def load_config():
    """Load configuration from config.json"""
    if not CONFIG_PATH.exists():
        logger.warning(f"Config file not found at {CONFIG_PATH}. Creating default config.")
        default_config = {
            "api_keys": {
                "binance": {
                    "api_key": "",
                    "api_secret": ""
                },
                "coinmarketcap": "",
                "coingecko": ""
            },
            "portfolio": {
                "track_wallets": [],
                "manual_holdings": {}
            },
            "market_scan": {
                "top_coins": 100,
                "trending_threshold": 5,
                "sources": ["coingecko", "reddit", "twitter"]
            },
            "bot_hunt": {
                "github_topics": ["crypto-trading-bot", "trading-bot", "crypto-bot"],
                "min_stars": 100
            }
        }
        with open(CONFIG_PATH, 'w') as f:
            json.dump(default_config, f, indent=4)
        return default_config
    
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def run_market_scan(config):
    """Run the market scanner module"""
    logger.info("Starting market scan...")
    scanner = MarketScanner(config["market_scan"], config["api_keys"])
    results = scanner.scan()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"market_scan_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Market scan complete. Results saved to {output_file}")
    return results

def check_portfolio(config):
    """Check portfolio status using the portfolio tracker"""
    logger.info("Checking portfolio...")
    tracker = PortfolioTracker(config["portfolio"], config["api_keys"])
    results = tracker.check()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"portfolio_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Portfolio check complete. Results saved to {output_file}")
    return results

def hunt_bots(config):
    """Hunt for new trading bots and scripts"""
    logger.info("Hunting for new trading bots and scripts...")
    hunter = BotHunter(config["bot_hunt"])
    results = hunter.hunt()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"bot_hunt_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    
    logger.info(f"Bot hunt complete. Results saved to {output_file}")
    return results

def generate_playbook(market_data, portfolio_data, bot_data):
    """Generate an actionable playbook based on collected data"""
    logger.info("Generating actionable playbook...")
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
    
    # Save playbook
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = RESULTS_DIR / f"playbook_{timestamp}.md"
    with open(output_file, 'w') as f:
        f.write(playbook)
    
    logger.info(f"Playbook generated. Saved to {output_file}")
    return playbook

def log_money_moves(market_data, portfolio_data, playbook):
    """Log money moves, wins, losses, and lessons"""
    logger.info("Logging money moves...")
    money_logger = MoneyLogger(LOGS_DIR)
    money_logger.log(market_data, portfolio_data, playbook)
    logger.info("Money moves logged")

def main():
    """Main function to run the Cash daily workflow"""
    parser = argparse.ArgumentParser(description="Cash Daily Workflow")
    parser.add_argument("--full", action="store_true", help="Run the complete workflow")
    parser.add_argument("--market-only", action="store_true", help="Only run the market scan")
    parser.add_argument("--portfolio-only", action="store_true", help="Only check the portfolio")
    parser.add_argument("--bots-only", action="store_true", help="Only hunt for new bots/scripts")
    args = parser.parse_args()
    
    # Default to full workflow if no specific option is selected
    if not (args.market_only or args.portfolio_only or args.bots_only):
        args.full = True
    
    # Ensure directories exist
    ensure_dirs()
    
    # Load configuration
    config = load_config()
    
    # Initialize results
    market_data = None
    portfolio_data = None
    bot_data = None
    
    # Run selected workflow components
    if args.full or args.market_only:
        market_data = run_market_scan(config)
    
    if args.full or args.portfolio_only:
        portfolio_data = check_portfolio(config)
    
    if args.full or args.bots_only:
        bot_data = hunt_bots(config)
    
    # Generate playbook if we have at least some data
    if args.full and (market_data or portfolio_data or bot_data):
        playbook = generate_playbook(market_data, portfolio_data, bot_data)
        log_money_moves(market_data, portfolio_data, playbook)
    
    logger.info("Cash daily workflow completed successfully")

if __name__ == "__main__":
    start_time = time.time()
    logger.info("Starting Cash daily workflow")
    
    try:
        main()
    except Exception as e:
        logger.error(f"Error in Cash daily workflow: {str(e)}", exc_info=True)
        sys.exit(1)
    
    elapsed_time = time.time() - start_time
    logger.info(f"Cash daily workflow completed in {elapsed_time:.2f} seconds")