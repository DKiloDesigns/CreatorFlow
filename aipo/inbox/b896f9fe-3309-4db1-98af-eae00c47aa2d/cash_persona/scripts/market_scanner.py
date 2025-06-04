#!/usr/bin/env python3
"""
Market Scanner for Cash Daily Workflow

This module scans various sources for crypto market trends, opportunities, and insights:
1. CoinGecko/CoinMarketCap for price data and trending coins
2. Reddit for trending discussions and sentiment
3. Twitter for trending tweets and sentiment
4. News sources for major announcements

Usage:
    from market_scanner import MarketScanner
    scanner = MarketScanner(config, api_keys)
    results = scanner.scan()
"""

import os
import json
import time
import logging
import requests
from datetime import datetime
from pathlib import Path
import concurrent.futures

logger = logging.getLogger("Cash.MarketScanner")

class MarketScanner:
    """Scans various sources for crypto market trends and opportunities"""
    
    def __init__(self, config, api_keys):
        """
        Initialize the market scanner
        
        Args:
            config (dict): Configuration for the market scanner
            api_keys (dict): API keys for various services
        """
        self.config = config
        self.api_keys = api_keys
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "trending_coins": [],
            "market_sentiment": {},
            "opportunities": [],
            "warnings": [],
            "news": []
        }
    
    def scan(self):
        """
        Run the market scan
        
        Returns:
            dict: Scan results
        """
        logger.info("Starting market scan")
        
        # Run scans in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(self._scan_coingecko),
                executor.submit(self._scan_reddit),
                executor.submit(self._scan_twitter),
                executor.submit(self._scan_news)
            ]
            
            # Wait for all scans to complete
            for future in concurrent.futures.as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    logger.error(f"Error in market scan: {str(e)}", exc_info=True)
        
        # Process results to find opportunities and warnings
        self._process_results()
        
        logger.info("Market scan completed")
        return self.results
    
    def _scan_coingecko(self):
        """Scan CoinGecko for price data and trending coins"""
        logger.info("Scanning CoinGecko")
        
        try:
            # Get trending coins
            response = requests.get("https://api.coingecko.com/api/v3/search/trending")
            if response.status_code == 200:
                data = response.json()
                for coin in data.get("coins", []):
                    item = coin.get("item", {})
                    self.results["trending_coins"].append({
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "symbol": item.get("symbol"),
                        "market_cap_rank": item.get("market_cap_rank"),
                        "price_btc": item.get("price_btc"),
                        "score": item.get("score"),
                        "source": "coingecko"
                    })
            
            # Get global market data
            response = requests.get("https://api.coingecko.com/api/v3/global")
            if response.status_code == 200:
                data = response.json().get("data", {})
                self.results["market_sentiment"]["global"] = {
                    "market_cap_change_percentage_24h_usd": data.get("market_cap_change_percentage_24h_usd"),
                    "market_cap_percentage": data.get("market_cap_percentage"),
                    "total_market_cap": data.get("total_market_cap", {}).get("usd"),
                    "total_volume": data.get("total_volume", {}).get("usd"),
                    "source": "coingecko"
                }
            
            # Get top coins by market cap
            top_n = self.config.get("top_coins", 100)
            response = requests.get(
                f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={top_n}&page=1"
            )
            if response.status_code == 200:
                self.results["top_coins"] = []
                for coin in response.json():
                    self.results["top_coins"].append({
                        "id": coin.get("id"),
                        "symbol": coin.get("symbol"),
                        "name": coin.get("name"),
                        "current_price": coin.get("current_price"),
                        "market_cap": coin.get("market_cap"),
                        "market_cap_rank": coin.get("market_cap_rank"),
                        "price_change_percentage_24h": coin.get("price_change_percentage_24h"),
                        "price_change_percentage_7d": coin.get("price_change_percentage_7d"),
                        "source": "coingecko"
                    })
        
        except Exception as e:
            logger.error(f"Error scanning CoinGecko: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "coingecko",
                "message": f"Failed to scan CoinGecko: {str(e)}"
            })
    
    def _scan_reddit(self):
        """Scan Reddit for trending discussions and sentiment"""
        logger.info("Scanning Reddit")
        
        # This is a placeholder - in a real implementation, we would use PRAW (Python Reddit API Wrapper)
        # or scrape Reddit for trending discussions
        
        try:
            # Simulate Reddit data for now
            self.results["reddit_trends"] = [
                {
                    "subreddit": "r/CryptoCurrency",
                    "title": "Daily Discussion - May 11, 2025",
                    "sentiment": "neutral",
                    "trending_coins": ["BTC", "ETH", "SOL"],
                    "url": "https://reddit.com/r/CryptoCurrency/comments/daily",
                    "source": "reddit"
                },
                {
                    "subreddit": "r/Bitcoin",
                    "title": "Bitcoin breaks $100k!",
                    "sentiment": "positive",
                    "trending_coins": ["BTC"],
                    "url": "https://reddit.com/r/Bitcoin/comments/btc100k",
                    "source": "reddit"
                },
                {
                    "subreddit": "r/SatoshiStreetBets",
                    "title": "What's your moonshot for this week?",
                    "sentiment": "bullish",
                    "trending_coins": ["PEPE", "DOGE", "SHIB"],
                    "url": "https://reddit.com/r/SatoshiStreetBets/comments/moonshot",
                    "source": "reddit"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning Reddit: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "reddit",
                "message": f"Failed to scan Reddit: {str(e)}"
            })
    
    def _scan_twitter(self):
        """Scan Twitter for trending tweets and sentiment"""
        logger.info("Scanning Twitter")
        
        # This is a placeholder - in a real implementation, we would use the Twitter API
        # or scrape Twitter for trending tweets
        
        try:
            # Simulate Twitter data for now
            self.results["twitter_trends"] = [
                {
                    "username": "elonmusk",
                    "tweet": "Dogecoin to the moon! 🚀",
                    "sentiment": "positive",
                    "trending_coins": ["DOGE"],
                    "url": "https://twitter.com/elonmusk/status/doge",
                    "source": "twitter"
                },
                {
                    "username": "VitalikButerin",
                    "tweet": "Excited about the latest Ethereum upgrade. Scaling solutions are coming.",
                    "sentiment": "positive",
                    "trending_coins": ["ETH"],
                    "url": "https://twitter.com/VitalikButerin/status/eth",
                    "source": "twitter"
                },
                {
                    "username": "CryptoWhale",
                    "tweet": "Bear market incoming. Protect your assets.",
                    "sentiment": "negative",
                    "trending_coins": ["BTC", "ETH"],
                    "url": "https://twitter.com/CryptoWhale/status/bear",
                    "source": "twitter"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning Twitter: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "twitter",
                "message": f"Failed to scan Twitter: {str(e)}"
            })
    
    def _scan_news(self):
        """Scan news sources for major announcements"""
        logger.info("Scanning news sources")
        
        # This is a placeholder - in a real implementation, we would use a news API
        # or scrape news sources for major announcements
        
        try:
            # Simulate news data for now
            self.results["news"] = [
                {
                    "title": "SEC Approves Spot Ethereum ETF",
                    "summary": "The SEC has approved the first spot Ethereum ETF, opening the door for institutional investment.",
                    "sentiment": "positive",
                    "trending_coins": ["ETH"],
                    "url": "https://example.com/news/eth-etf",
                    "source": "bloomberg"
                },
                {
                    "title": "Major Bank Adds Bitcoin to Balance Sheet",
                    "summary": "A major US bank has added Bitcoin to its balance sheet, following the trend of institutional adoption.",
                    "sentiment": "positive",
                    "trending_coins": ["BTC"],
                    "url": "https://example.com/news/bank-btc",
                    "source": "cnbc"
                },
                {
                    "title": "New Regulations Coming for Crypto Exchanges",
                    "summary": "Regulators are planning new rules for crypto exchanges, focusing on consumer protection.",
                    "sentiment": "neutral",
                    "trending_coins": ["BNB", "CRO"],
                    "url": "https://example.com/news/regulations",
                    "source": "coindesk"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning news: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "news",
                "message": f"Failed to scan news: {str(e)}"
            })
    
    def _process_results(self):
        """Process results to find opportunities and warnings"""
        logger.info("Processing market scan results")
        
        # Find opportunities based on trending coins and positive sentiment
        for coin in self.results.get("trending_coins", []):
            # Check if coin is trending across multiple sources
            sources = []
            if coin.get("source") == "coingecko":
                sources.append("coingecko")
            
            # Check Reddit trends
            for reddit_trend in self.results.get("reddit_trends", []):
                if coin.get("symbol", "").upper() in reddit_trend.get("trending_coins", []):
                    sources.append("reddit")
            
            # Check Twitter trends
            for twitter_trend in self.results.get("twitter_trends", []):
                if coin.get("symbol", "").upper() in twitter_trend.get("trending_coins", []):
                    sources.append("twitter")
            
            # Check news
            for news_item in self.results.get("news", []):
                if coin.get("symbol", "").upper() in news_item.get("trending_coins", []):
                    sources.append(news_item.get("source"))
            
            # If coin is trending across multiple sources, add it as an opportunity
            if len(sources) >= 2:
                self.results["opportunities"].append({
                    "type": "trending_coin",
                    "coin": coin.get("name"),
                    "symbol": coin.get("symbol"),
                    "sources": sources,
                    "confidence": len(sources) / 4.0  # Normalize to 0-1 range (4 possible sources)
                })
        
        # Find warnings based on negative sentiment
        # (This is a placeholder - in a real implementation, we would use more sophisticated analysis)
        for twitter_trend in self.results.get("twitter_trends", []):
            if twitter_trend.get("sentiment") == "negative":
                for coin in twitter_trend.get("trending_coins", []):
                    self.results["warnings"].append({
                        "type": "negative_sentiment",
                        "coin": coin,
                        "source": "twitter",
                        "message": twitter_trend.get("tweet")
                    })
        
        logger.info(f"Found {len(self.results['opportunities'])} opportunities and {len(self.results['warnings'])} warnings")


if __name__ == "__main__":
    # If run directly, perform a test scan
    logging.basicConfig(level=logging.INFO)
    
    # Test configuration
    config = {
        "top_coins": 10,
        "trending_threshold": 5,
        "sources": ["coingecko", "reddit", "twitter"]
    }
    
    api_keys = {
        "coingecko": "",
        "coinmarketcap": ""
    }
    
    # Run test scan
    scanner = MarketScanner(config, api_keys)
    results = scanner.scan()
    
    # Print results
    print(json.dumps(results, indent=4))#!/usr/bin/env python3
"""
Market Scanner for Cash Daily Workflow

This module scans various sources for crypto market trends, opportunities, and insights:
1. CoinGecko/CoinMarketCap for price data and trending coins
2. Reddit for trending discussions and sentiment
3. Twitter for trending tweets and sentiment
4. News sources for major announcements

Usage:
    from market_scanner import MarketScanner
    scanner = MarketScanner(config, api_keys)
    results = scanner.scan()
"""

import os
import json
import time
import logging
import requests
from datetime import datetime
from pathlib import Path
import concurrent.futures

logger = logging.getLogger("Cash.MarketScanner")

class MarketScanner:
    """Scans various sources for crypto market trends and opportunities"""
    
    def __init__(self, config, api_keys):
        """
        Initialize the market scanner
        
        Args:
            config (dict): Configuration for the market scanner
            api_keys (dict): API keys for various services
        """
        self.config = config
        self.api_keys = api_keys
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "trending_coins": [],
            "market_sentiment": {},
            "opportunities": [],
            "warnings": [],
            "news": []
        }
    
    def scan(self):
        """
        Run the market scan
        
        Returns:
            dict: Scan results
        """
        logger.info("Starting market scan")
        
        # Run scans in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(self._scan_coingecko),
                executor.submit(self._scan_reddit),
                executor.submit(self._scan_twitter),
                executor.submit(self._scan_news)
            ]
            
            # Wait for all scans to complete
            for future in concurrent.futures.as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    logger.error(f"Error in market scan: {str(e)}", exc_info=True)
        
        # Process results to find opportunities and warnings
        self._process_results()
        
        logger.info("Market scan completed")
        return self.results
    
    def _scan_coingecko(self):
        """Scan CoinGecko for price data and trending coins"""
        logger.info("Scanning CoinGecko")
        
        try:
            # Get trending coins
            response = requests.get("https://api.coingecko.com/api/v3/search/trending")
            if response.status_code == 200:
                data = response.json()
                for coin in data.get("coins", []):
                    item = coin.get("item", {})
                    self.results["trending_coins"].append({
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "symbol": item.get("symbol"),
                        "market_cap_rank": item.get("market_cap_rank"),
                        "price_btc": item.get("price_btc"),
                        "score": item.get("score"),
                        "source": "coingecko"
                    })
            
            # Get global market data
            response = requests.get("https://api.coingecko.com/api/v3/global")
            if response.status_code == 200:
                data = response.json().get("data", {})
                self.results["market_sentiment"]["global"] = {
                    "market_cap_change_percentage_24h_usd": data.get("market_cap_change_percentage_24h_usd"),
                    "market_cap_percentage": data.get("market_cap_percentage"),
                    "total_market_cap": data.get("total_market_cap", {}).get("usd"),
                    "total_volume": data.get("total_volume", {}).get("usd"),
                    "source": "coingecko"
                }
            
            # Get top coins by market cap
            top_n = self.config.get("top_coins", 100)
            response = requests.get(
                f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={top_n}&page=1"
            )
            if response.status_code == 200:
                self.results["top_coins"] = []
                for coin in response.json():
                    self.results["top_coins"].append({
                        "id": coin.get("id"),
                        "symbol": coin.get("symbol"),
                        "name": coin.get("name"),
                        "current_price": coin.get("current_price"),
                        "market_cap": coin.get("market_cap"),
                        "market_cap_rank": coin.get("market_cap_rank"),
                        "price_change_percentage_24h": coin.get("price_change_percentage_24h"),
                        "price_change_percentage_7d": coin.get("price_change_percentage_7d"),
                        "source": "coingecko"
                    })
        
        except Exception as e:
            logger.error(f"Error scanning CoinGecko: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "coingecko",
                "message": f"Failed to scan CoinGecko: {str(e)}"
            })
    
    def _scan_reddit(self):
        """Scan Reddit for trending discussions and sentiment"""
        logger.info("Scanning Reddit")
        
        # This is a placeholder - in a real implementation, we would use PRAW (Python Reddit API Wrapper)
        # or scrape Reddit for trending discussions
        
        try:
            # Simulate Reddit data for now
            self.results["reddit_trends"] = [
                {
                    "subreddit": "r/CryptoCurrency",
                    "title": "Daily Discussion - May 11, 2025",
                    "sentiment": "neutral",
                    "trending_coins": ["BTC", "ETH", "SOL"],
                    "url": "https://reddit.com/r/CryptoCurrency/comments/daily",
                    "source": "reddit"
                },
                {
                    "subreddit": "r/Bitcoin",
                    "title": "Bitcoin breaks $100k!",
                    "sentiment": "positive",
                    "trending_coins": ["BTC"],
                    "url": "https://reddit.com/r/Bitcoin/comments/btc100k",
                    "source": "reddit"
                },
                {
                    "subreddit": "r/SatoshiStreetBets",
                    "title": "What's your moonshot for this week?",
                    "sentiment": "bullish",
                    "trending_coins": ["PEPE", "DOGE", "SHIB"],
                    "url": "https://reddit.com/r/SatoshiStreetBets/comments/moonshot",
                    "source": "reddit"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning Reddit: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "reddit",
                "message": f"Failed to scan Reddit: {str(e)}"
            })
    
    def _scan_twitter(self):
        """Scan Twitter for trending tweets and sentiment"""
        logger.info("Scanning Twitter")
        
        # This is a placeholder - in a real implementation, we would use the Twitter API
        # or scrape Twitter for trending tweets
        
        try:
            # Simulate Twitter data for now
            self.results["twitter_trends"] = [
                {
                    "username": "elonmusk",
                    "tweet": "Dogecoin to the moon! 🚀",
                    "sentiment": "positive",
                    "trending_coins": ["DOGE"],
                    "url": "https://twitter.com/elonmusk/status/doge",
                    "source": "twitter"
                },
                {
                    "username": "VitalikButerin",
                    "tweet": "Excited about the latest Ethereum upgrade. Scaling solutions are coming.",
                    "sentiment": "positive",
                    "trending_coins": ["ETH"],
                    "url": "https://twitter.com/VitalikButerin/status/eth",
                    "source": "twitter"
                },
                {
                    "username": "CryptoWhale",
                    "tweet": "Bear market incoming. Protect your assets.",
                    "sentiment": "negative",
                    "trending_coins": ["BTC", "ETH"],
                    "url": "https://twitter.com/CryptoWhale/status/bear",
                    "source": "twitter"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning Twitter: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "twitter",
                "message": f"Failed to scan Twitter: {str(e)}"
            })
    
    def _scan_news(self):
        """Scan news sources for major announcements"""
        logger.info("Scanning news sources")
        
        # This is a placeholder - in a real implementation, we would use a news API
        # or scrape news sources for major announcements
        
        try:
            # Simulate news data for now
            self.results["news"] = [
                {
                    "title": "SEC Approves Spot Ethereum ETF",
                    "summary": "The SEC has approved the first spot Ethereum ETF, opening the door for institutional investment.",
                    "sentiment": "positive",
                    "trending_coins": ["ETH"],
                    "url": "https://example.com/news/eth-etf",
                    "source": "bloomberg"
                },
                {
                    "title": "Major Bank Adds Bitcoin to Balance Sheet",
                    "summary": "A major US bank has added Bitcoin to its balance sheet, following the trend of institutional adoption.",
                    "sentiment": "positive",
                    "trending_coins": ["BTC"],
                    "url": "https://example.com/news/bank-btc",
                    "source": "cnbc"
                },
                {
                    "title": "New Regulations Coming for Crypto Exchanges",
                    "summary": "Regulators are planning new rules for crypto exchanges, focusing on consumer protection.",
                    "sentiment": "neutral",
                    "trending_coins": ["BNB", "CRO"],
                    "url": "https://example.com/news/regulations",
                    "source": "coindesk"
                }
            ]
        
        except Exception as e:
            logger.error(f"Error scanning news: {str(e)}", exc_info=True)
            self.results["warnings"].append({
                "source": "news",
                "message": f"Failed to scan news: {str(e)}"
            })
    
    def _process_results(self):
        """Process results to find opportunities and warnings"""
        logger.info("Processing market scan results")
        
        # Find opportunities based on trending coins and positive sentiment
        for coin in self.results.get("trending_coins", []):
            # Check if coin is trending across multiple sources
            sources = []
            if coin.get("source") == "coingecko":
                sources.append("coingecko")
            
            # Check Reddit trends
            for reddit_trend in self.results.get("reddit_trends", []):
                if coin.get("symbol", "").upper() in reddit_trend.get("trending_coins", []):
                    sources.append("reddit")
            
            # Check Twitter trends
            for twitter_trend in self.results.get("twitter_trends", []):
                if coin.get("symbol", "").upper() in twitter_trend.get("trending_coins", []):
                    sources.append("twitter")
            
            # Check news
            for news_item in self.results.get("news", []):
                if coin.get("symbol", "").upper() in news_item.get("trending_coins", []):
                    sources.append(news_item.get("source"))
            
            # If coin is trending across multiple sources, add it as an opportunity
            if len(sources) >= 2:
                self.results["opportunities"].append({
                    "type": "trending_coin",
                    "coin": coin.get("name"),
                    "symbol": coin.get("symbol"),
                    "sources": sources,
                    "confidence": len(sources) / 4.0  # Normalize to 0-1 range (4 possible sources)
                })
        
        # Find warnings based on negative sentiment
        # (This is a placeholder - in a real implementation, we would use more sophisticated analysis)
        for twitter_trend in self.results.get("twitter_trends", []):
            if twitter_trend.get("sentiment") == "negative":
                for coin in twitter_trend.get("trending_coins", []):
                    self.results["warnings"].append({
                        "type": "negative_sentiment",
                        "coin": coin,
                        "source": "twitter",
                        "message": twitter_trend.get("tweet")
                    })
        
        logger.info(f"Found {len(self.results['opportunities'])} opportunities and {len(self.results['warnings'])} warnings")


if __name__ == "__main__":
    # If run directly, perform a test scan
    logging.basicConfig(level=logging.INFO)
    
    # Test configuration
    config = {
        "top_coins": 10,
        "trending_threshold": 5,
        "sources": ["coingecko", "reddit", "twitter"]
    }
    
    api_keys = {
        "coingecko": "",
        "coinmarketcap": ""
    }
    
    # Run test scan
    scanner = MarketScanner(config, api_keys)
    results = scanner.scan()
    
    # Print results
    print(json.dumps(results, indent=4))