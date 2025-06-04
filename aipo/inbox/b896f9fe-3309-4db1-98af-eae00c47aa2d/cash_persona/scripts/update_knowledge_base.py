#!/usr/bin/env python3
"""
Update Cash Knowledge Base

This script updates the Cash knowledge base with the latest findings from the daily workflow:
1. Extracts key insights from market scans, portfolio checks, and bot hunts
2. Updates the knowledge base markdown file
3. Maintains a historical record of findings

Usage:
    python update_knowledge_base.py
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
import glob

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("Cash.KnowledgeBase")

# Constants
RESULTS_DIR = Path(__file__).parent / "results"
KNOWLEDGE_BASE_FILE = Path(__file__).parent.parent / "KNOWLEDGE_BASE.md"

def get_latest_results():
    """Get the latest results from each category"""
    latest_results = {}
    
    # Find latest market scan
    market_scan_files = glob.glob(str(RESULTS_DIR / "market_scan_*.json"))
    if market_scan_files:
        latest_market_scan = max(market_scan_files, key=os.path.getctime)
        with open(latest_market_scan, 'r') as f:
            latest_results["market_scan"] = json.load(f)
    
    # Find latest portfolio check
    portfolio_files = glob.glob(str(RESULTS_DIR / "portfolio_*.json"))
    if portfolio_files:
        latest_portfolio = max(portfolio_files, key=os.path.getctime)
        with open(latest_portfolio, 'r') as f:
            latest_results["portfolio"] = json.load(f)
    
    # Find latest bot hunt
    bot_hunt_files = glob.glob(str(RESULTS_DIR / "bot_hunt_*.json"))
    if bot_hunt_files:
        latest_bot_hunt = max(bot_hunt_files, key=os.path.getctime)
        with open(latest_bot_hunt, 'r') as f:
            latest_results["bot_hunt"] = json.load(f)
    
    return latest_results

def extract_top_bots(bot_hunt_data):
    """Extract top bots from bot hunt data"""
    top_bots = []
    
    # Extract repositories
    repositories = bot_hunt_data.get("repositories", [])
    
    # Sort by stars
    sorted_repos = sorted(repositories, key=lambda x: x.get("stars", 0), reverse=True)
    
    # Take top 10
    for repo in sorted_repos[:10]:
        top_bots.append({
            "name": repo.get("name", "Unknown"),
            "url": repo.get("url", "#"),
            "stars": repo.get("stars", 0),
            "description": repo.get("description", "No description"),
            "language": repo.get("language", "Unknown")
        })
    
    return top_bots

def extract_trending_coins(market_data):
    """Extract trending coins from market data"""
    trending_coins = []
    
    # Extract trending coins
    coins = market_data.get("trending_coins", [])
    
    # Sort by score
    sorted_coins = sorted(coins, key=lambda x: x.get("score", 0), reverse=True)
    
    # Take top 5
    for coin in sorted_coins[:5]:
        trending_coins.append({
            "name": coin.get("name", "Unknown"),
            "symbol": coin.get("symbol", "Unknown"),
            "score": coin.get("score", 0)
        })
    
    return trending_coins

def update_knowledge_base(latest_results):
    """Update the knowledge base with latest results"""
    # Read existing knowledge base
    if KNOWLEDGE_BASE_FILE.exists():
        with open(KNOWLEDGE_BASE_FILE, 'r') as f:
            existing_content = f.read()
    else:
        existing_content = f"""# Cash Knowledge Base

**Harvest Date:** {datetime.now().strftime("%Y-%m-%d")}

"""
    
    # Extract data for the update
    update_sections = []
    
    # Extract top bots if available
    if "bot_hunt" in latest_results:
        top_bots = extract_top_bots(latest_results["bot_hunt"])
        if top_bots:
            bots_section = f"""## Top Open-Source Crypto Trading Bots & Frameworks ({datetime.now().strftime("%Y-%m-%d")})

"""
            for i, bot in enumerate(top_bots, 1):
                bots_section += f"""### {i}. [{bot['name']}]({bot['url']})
- {bot['language']}, {bot['stars']} stars
- {bot['description']}

"""
            update_sections.append(bots_section)
    
    # Extract trending coins if available
    if "market_scan" in latest_results:
        trending_coins = extract_trending_coins(latest_results["market_scan"])
        if trending_coins:
            coins_section = f"""## Trending Coins ({datetime.now().strftime("%Y-%m-%d")})

"""
            for i, coin in enumerate(trending_coins, 1):
                coins_section += f"""### {i}. {coin['name']} ({coin['symbol']})
- Trend Score: {coin['score']:.2f}

"""
            update_sections.append(coins_section)
    
    # Extract technical analysis libraries if available
    if "bot_hunt" in latest_results:
        ta_section = """## Technical Analysis & Market Data Libraries
- [TA-Lib](https://github.com/TA-Lib/ta-lib-python): Python technical analysis library
- [ccxt](https://github.com/ccxt/ccxt): Unified crypto exchange API (Python/JS/PHP)
- [pandas-ta](https://github.com/twopirllc/pandas-ta): 120+ indicators for Pandas
- [TradingView](https://www.tradingview.com/): Charts, signals, and community scripts

"""
        update_sections.append(ta_section)
    
    # Add next steps
    next_steps_section = f"""## Next Steps
- Vet, test, and adapt the top bots for our wallets/exchanges
- Integrate best strategies and automation into Cash's daily workflow
- Set up daily/weekly harvest for new tools, strategies, and market changes
- Document all findings, scripts, and results in this knowledge base

---

*This file is the foundation for Cash's automated trading intelligence. Update regularly with new tools, scripts, and lessons learned.*
"""
    update_sections.append(next_steps_section)
    
    # Update the knowledge base
    with open(KNOWLEDGE_BASE_FILE, 'w') as f:
        # Update the harvest date
        header = f"""# Cash Knowledge Base

**Harvest Date:** {datetime.now().strftime("%Y-%m-%d")}

"""
        # Write the updated content
        f.write(header)
        f.write("\n".join(update_sections))
    
    logger.info(f"Knowledge base updated: {KNOWLEDGE_BASE_FILE}")

def main():
    """Main function"""
    logger.info("Updating Cash knowledge base")
    
    # Get latest results
    latest_results = get_latest_results()
    
    # Update knowledge base
    if latest_results:
        update_knowledge_base(latest_results)
        logger.info("Knowledge base updated successfully")
    else:
        logger.warning("No results found. Run the daily workflow first.")

if __name__ == "__main__":
    main()