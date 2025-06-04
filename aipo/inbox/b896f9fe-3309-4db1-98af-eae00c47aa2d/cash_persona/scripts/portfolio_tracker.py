#!/usr/bin/env python3
"""
Portfolio Tracker for Cash Daily Workflow

This module tracks your crypto portfolio:
1. Connects to exchanges via API (Binance, etc.)
2. Tracks wallet balances
3. Calculates portfolio performance
4. Identifies opportunities and risks

Usage:
    from portfolio_tracker import PortfolioTracker
    tracker = PortfolioTracker(config, api_keys)
    results = tracker.check()
"""

import os
import json
import time
import logging
import requests
from datetime import datetime, timedelta
from pathlib import Path
import hmac
import hashlib
from urllib.parse import urlencode

logger = logging.getLogger("Cash.PortfolioTracker")

class PortfolioTracker:
    """Tracks crypto portfolio across exchanges and wallets"""
    
    def __init__(self, config, api_keys):
        """
        Initialize the portfolio tracker
        
        Args:
            config (dict): Configuration for the portfolio tracker
            api_keys (dict): API keys for various exchanges and services
        """
        self.config = config
        self.api_keys = api_keys
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "total_value_usd": 0,
            "holdings": [],
            "performance": {
                "24h": 0,
                "7d": 0,
                "30d": 0
            },
            "opportunities": [],
            "risks": []
        }
        
        # Initialize exchange clients
        self.exchange_clients = {}
        if "binance" in self.api_keys and self.api_keys["binance"]["api_key"] and self.api_keys["binance"]["api_secret"]:
            self.exchange_clients["binance"] = BinanceClient(
                self.api_keys["binance"]["api_key"],
                self.api_keys["binance"]["api_secret"]
            )
    
    def check(self):
        """
        Check portfolio status
        
        Returns:
            dict: Portfolio status
        """
        logger.info("Checking portfolio status")
        
        # Check exchange balances
        self._check_exchange_balances()
        
        # Check wallet balances (if configured)
        self._check_wallet_balances()
        
        # Add manual holdings (if configured)
        self._add_manual_holdings()
        
        # Calculate total value and performance
        self._calculate_totals()
        
        # Identify opportunities and risks
        self._identify_opportunities_and_risks()
        
        logger.info(f"Portfolio check complete. Total value: ${self.results['total_value_usd']:.2f}")
        return self.results
    
    def _check_exchange_balances(self):
        """Check balances on configured exchanges"""
        logger.info("Checking exchange balances")
        
        for exchange_name, client in self.exchange_clients.items():
            try:
                logger.info(f"Checking {exchange_name} balances")
                balances = client.get_account_balances()
                
                for asset, balance in balances.items():
                    if balance["free"] > 0 or balance["locked"] > 0:
                        # Get current price in USD
                        price_usd = client.get_asset_price(asset, "USDT")
                        
                        # Calculate total balance and value
                        total_balance = balance["free"] + balance["locked"]
                        value_usd = total_balance * price_usd
                        
                        # Add to holdings
                        self.results["holdings"].append({
                            "asset": asset,
                            "balance": total_balance,
                            "value_usd": value_usd,
                            "price_usd": price_usd,
                            "source": exchange_name
                        })
            
            except Exception as e:
                logger.error(f"Error checking {exchange_name} balances: {str(e)}", exc_info=True)
                self.results["risks"].append({
                    "type": "exchange_error",
                    "exchange": exchange_name,
                    "message": f"Failed to check balances: {str(e)}"
                })
    
    def _check_wallet_balances(self):
        """Check balances in configured wallets"""
        logger.info("Checking wallet balances")
        
        # This is a placeholder - in a real implementation, we would use blockchain APIs
        # to check wallet balances for various chains (ETH, BTC, etc.)
        
        for wallet_address in self.config.get("track_wallets", []):
            try:
                # Placeholder - simulate wallet balance check
                logger.info(f"Checking wallet {wallet_address}")
                
                # In a real implementation, we would determine the chain from the address format
                # and use the appropriate API to check the balance
                
                # For now, just add a placeholder entry
                self.results["holdings"].append({
                    "asset": "ETH",
                    "balance": 0,
                    "value_usd": 0,
                    "price_usd": 0,
                    "source": f"wallet:{wallet_address[:8]}...{wallet_address[-6:]}"
                })
            
            except Exception as e:
                logger.error(f"Error checking wallet {wallet_address}: {str(e)}", exc_info=True)
                self.results["risks"].append({
                    "type": "wallet_error",
                    "wallet": wallet_address,
                    "message": f"Failed to check balance: {str(e)}"
                })
    
    def _add_manual_holdings(self):
        """Add manually tracked holdings from config"""
        logger.info("Adding manual holdings")
        
        for asset, details in self.config.get("manual_holdings", {}).items():
            try:
                # Get current price in USD (if not provided)
                price_usd = details.get("price_usd")
                if not price_usd and "binance" in self.exchange_clients:
                    price_usd = self.exchange_clients["binance"].get_asset_price(asset, "USDT")
                
                # Calculate value
                balance = details.get("balance", 0)
                value_usd = balance * (price_usd or 0)
                
                # Add to holdings
                self.results["holdings"].append({
                    "asset": asset,
                    "balance": balance,
                    "value_usd": value_usd,
                    "price_usd": price_usd,
                    "source": "manual"
                })
            
            except Exception as e:
                logger.error(f"Error adding manual holding {asset}: {str(e)}", exc_info=True)
    
    def _calculate_totals(self):
        """Calculate total portfolio value and performance"""
        logger.info("Calculating portfolio totals")
        
        # Calculate total value
        total_value = sum(holding.get("value_usd", 0) for holding in self.results["holdings"])
        self.results["total_value_usd"] = total_value
        
        # Calculate performance (placeholder - in a real implementation, we would compare to historical data)
        # For now, just set random values
        self.results["performance"] = {
            "24h": 2.5,  # 2.5% gain in last 24 hours
            "7d": -1.2,  # 1.2% loss in last 7 days
            "30d": 15.7  # 15.7% gain in last 30 days
        }
        
        # Calculate allocation percentages
        for holding in self.results["holdings"]:
            if total_value > 0:
                holding["allocation_percentage"] = (holding.get("value_usd", 0) / total_value) * 100
            else:
                holding["allocation_percentage"] = 0
    
    def _identify_opportunities_and_risks(self):
        """Identify portfolio opportunities and risks"""
        logger.info("Identifying portfolio opportunities and risks")
        
        # Check for concentration risk (more than 20% in a single asset)
        for holding in self.results["holdings"]:
            if holding.get("allocation_percentage", 0) > 20:
                self.results["risks"].append({
                    "type": "concentration_risk",
                    "asset": holding.get("asset"),
                    "allocation": holding.get("allocation_percentage"),
                    "message": f"High concentration in {holding.get('asset')} ({holding.get('allocation_percentage'):.1f}% of portfolio)"
                })
        
        # Check for staking opportunities (placeholder)
        # In a real implementation, we would check for assets that can be staked for yield
        for holding in self.results["holdings"]:
            if holding.get("asset") in ["ETH", "SOL", "ADA", "DOT"]:
                self.results["opportunities"].append({
                    "type": "staking",
                    "asset": holding.get("asset"),
                    "message": f"Consider staking {holding.get('asset')} for passive income"
                })
        
        # Check for rebalancing opportunities (if allocation is significantly different from target)
        # This is a placeholder - in a real implementation, we would compare to target allocation
        
        logger.info(f"Identified {len(self.results['opportunities'])} opportunities and {len(self.results['risks'])} risks")


class BinanceClient:
    """Client for interacting with the Binance API"""
    
    def __init__(self, api_key, api_secret):
        """
        Initialize the Binance client
        
        Args:
            api_key (str): Binance API key
            api_secret (str): Binance API secret
        """
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.binance.com"
    
    def _generate_signature(self, params):
        """
        Generate signature for authenticated requests
        
        Args:
            params (dict): Request parameters
        
        Returns:
            str: HMAC SHA256 signature
        """
        query_string = urlencode(params)
        signature = hmac.new(
            self.api_secret.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def _send_request(self, endpoint, method="GET", params=None, signed=False):
        """
        Send request to Binance API
        
        Args:
            endpoint (str): API endpoint
            method (str): HTTP method
            params (dict): Request parameters
            signed (bool): Whether the request needs to be signed
        
        Returns:
            dict: Response data
        """
        url = f"{self.base_url}{endpoint}"
        headers = {"X-MBX-APIKEY": self.api_key}
        
        if params is None:
            params = {}
        
        if signed:
            params["timestamp"] = int(time.time() * 1000)
            params["signature"] = self._generate_signature(params)
        
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, params=params)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        if response.status_code != 200:
            raise Exception(f"Binance API error: {response.text}")
        
        return response.json()
    
    def get_account_balances(self):
        """
        Get account balances
        
        Returns:
            dict: Account balances
        """
        # If we don't have API keys, return empty balances
        if not self.api_key or not self.api_secret:
            logger.warning("Binance API keys not configured. Returning empty balances.")
            return {}
        
        # This is a placeholder - in a real implementation, we would call the Binance API
        # For now, return simulated balances
        
        # Simulated balances
        simulated_balances = {
            "BTC": {"free": 0.5, "locked": 0},
            "ETH": {"free": 5.0, "locked": 0},
            "BNB": {"free": 10.0, "locked": 0},
            "USDT": {"free": 1000.0, "locked": 0}
        }
        
        return simulated_balances
    
    def get_asset_price(self, asset, quote="USDT"):
        """
        Get current price for an asset
        
        Args:
            asset (str): Asset symbol
            quote (str): Quote currency
        
        Returns:
            float: Current price
        """
        # This is a placeholder - in a real implementation, we would call the Binance API
        # For now, return simulated prices
        
        # Simulated prices
        simulated_prices = {
            "BTC": 85000.0,
            "ETH": 4500.0,
            "BNB": 750.0,
            "SOL": 180.0,
            "ADA": 1.2,
            "DOT": 25.0,
            "USDT": 1.0
        }
        
        return simulated_prices.get(asset, 0)


if __name__ == "__main__":
    # If run directly, perform a test check
    logging.basicConfig(level=logging.INFO)
    
    # Test configuration
    config = {
        "track_wallets": [],
        "manual_holdings": {
            "BTC": {"balance": 0.5},
            "ETH": {"balance": 5.0}
        }
    }
    
    api_keys = {
        "binance": {
            "api_key": "",
            "api_secret": ""
        }
    }
    
    # Run test check
    tracker = PortfolioTracker(config, api_keys)
    results = tracker.check()
    
    # Print results
    print(json.dumps(results, indent=4))#!/usr/bin/env python3
"""
Portfolio Tracker for Cash Daily Workflow

This module tracks your crypto portfolio:
1. Connects to exchanges via API (Binance, etc.)
2. Tracks wallet balances
3. Calculates portfolio performance
4. Identifies opportunities and risks

Usage:
    from portfolio_tracker import PortfolioTracker
    tracker = PortfolioTracker(config, api_keys)
    results = tracker.check()
"""

import os
import json
import time
import logging
import requests
from datetime import datetime, timedelta
from pathlib import Path
import hmac
import hashlib
from urllib.parse import urlencode

logger = logging.getLogger("Cash.PortfolioTracker")

class PortfolioTracker:
    """Tracks crypto portfolio across exchanges and wallets"""
    
    def __init__(self, config, api_keys):
        """
        Initialize the portfolio tracker
        
        Args:
            config (dict): Configuration for the portfolio tracker
            api_keys (dict): API keys for various exchanges and services
        """
        self.config = config
        self.api_keys = api_keys
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "total_value_usd": 0,
            "holdings": [],
            "performance": {
                "24h": 0,
                "7d": 0,
                "30d": 0
            },
            "opportunities": [],
            "risks": []
        }
        
        # Initialize exchange clients
        self.exchange_clients = {}
        if "binance" in self.api_keys and self.api_keys["binance"]["api_key"] and self.api_keys["binance"]["api_secret"]:
            self.exchange_clients["binance"] = BinanceClient(
                self.api_keys["binance"]["api_key"],
                self.api_keys["binance"]["api_secret"]
            )
    
    def check(self):
        """
        Check portfolio status
        
        Returns:
            dict: Portfolio status
        """
        logger.info("Checking portfolio status")
        
        # Check exchange balances
        self._check_exchange_balances()
        
        # Check wallet balances (if configured)
        self._check_wallet_balances()
        
        # Add manual holdings (if configured)
        self._add_manual_holdings()
        
        # Calculate total value and performance
        self._calculate_totals()
        
        # Identify opportunities and risks
        self._identify_opportunities_and_risks()
        
        logger.info(f"Portfolio check complete. Total value: ${self.results['total_value_usd']:.2f}")
        return self.results
    
    def _check_exchange_balances(self):
        """Check balances on configured exchanges"""
        logger.info("Checking exchange balances")
        
        for exchange_name, client in self.exchange_clients.items():
            try:
                logger.info(f"Checking {exchange_name} balances")
                balances = client.get_account_balances()
                
                for asset, balance in balances.items():
                    if balance["free"] > 0 or balance["locked"] > 0:
                        # Get current price in USD
                        price_usd = client.get_asset_price(asset, "USDT")
                        
                        # Calculate total balance and value
                        total_balance = balance["free"] + balance["locked"]
                        value_usd = total_balance * price_usd
                        
                        # Add to holdings
                        self.results["holdings"].append({
                            "asset": asset,
                            "balance": total_balance,
                            "value_usd": value_usd,
                            "price_usd": price_usd,
                            "source": exchange_name
                        })
            
            except Exception as e:
                logger.error(f"Error checking {exchange_name} balances: {str(e)}", exc_info=True)
                self.results["risks"].append({
                    "type": "exchange_error",
                    "exchange": exchange_name,
                    "message": f"Failed to check balances: {str(e)}"
                })
    
    def _check_wallet_balances(self):
        """Check balances in configured wallets"""
        logger.info("Checking wallet balances")
        
        # This is a placeholder - in a real implementation, we would use blockchain APIs
        # to check wallet balances for various chains (ETH, BTC, etc.)
        
        for wallet_address in self.config.get("track_wallets", []):
            try:
                # Placeholder - simulate wallet balance check
                logger.info(f"Checking wallet {wallet_address}")
                
                # In a real implementation, we would determine the chain from the address format
                # and use the appropriate API to check the balance
                
                # For now, just add a placeholder entry
                self.results["holdings"].append({
                    "asset": "ETH",
                    "balance": 0,
                    "value_usd": 0,
                    "price_usd": 0,
                    "source": f"wallet:{wallet_address[:8]}...{wallet_address[-6:]}"
                })
            
            except Exception as e:
                logger.error(f"Error checking wallet {wallet_address}: {str(e)}", exc_info=True)
                self.results["risks"].append({
                    "type": "wallet_error",
                    "wallet": wallet_address,
                    "message": f"Failed to check balance: {str(e)}"
                })
    
    def _add_manual_holdings(self):
        """Add manually tracked holdings from config"""
        logger.info("Adding manual holdings")
        
        for asset, details in self.config.get("manual_holdings", {}).items():
            try:
                # Get current price in USD (if not provided)
                price_usd = details.get("price_usd")
                if not price_usd and "binance" in self.exchange_clients:
                    price_usd = self.exchange_clients["binance"].get_asset_price(asset, "USDT")
                
                # Calculate value
                balance = details.get("balance", 0)
                value_usd = balance * (price_usd or 0)
                
                # Add to holdings
                self.results["holdings"].append({
                    "asset": asset,
                    "balance": balance,
                    "value_usd": value_usd,
                    "price_usd": price_usd,
                    "source": "manual"
                })
            
            except Exception as e:
                logger.error(f"Error adding manual holding {asset}: {str(e)}", exc_info=True)
    
    def _calculate_totals(self):
        """Calculate total portfolio value and performance"""
        logger.info("Calculating portfolio totals")
        
        # Calculate total value
        total_value = sum(holding.get("value_usd", 0) for holding in self.results["holdings"])
        self.results["total_value_usd"] = total_value
        
        # Calculate performance (placeholder - in a real implementation, we would compare to historical data)
        # For now, just set random values
        self.results["performance"] = {
            "24h": 2.5,  # 2.5% gain in last 24 hours
            "7d": -1.2,  # 1.2% loss in last 7 days
            "30d": 15.7  # 15.7% gain in last 30 days
        }
        
        # Calculate allocation percentages
        for holding in self.results["holdings"]:
            if total_value > 0:
                holding["allocation_percentage"] = (holding.get("value_usd", 0) / total_value) * 100
            else:
                holding["allocation_percentage"] = 0
    
    def _identify_opportunities_and_risks(self):
        """Identify portfolio opportunities and risks"""
        logger.info("Identifying portfolio opportunities and risks")
        
        # Check for concentration risk (more than 20% in a single asset)
        for holding in self.results["holdings"]:
            if holding.get("allocation_percentage", 0) > 20:
                self.results["risks"].append({
                    "type": "concentration_risk",
                    "asset": holding.get("asset"),
                    "allocation": holding.get("allocation_percentage"),
                    "message": f"High concentration in {holding.get('asset')} ({holding.get('allocation_percentage'):.1f}% of portfolio)"
                })
        
        # Check for staking opportunities (placeholder)
        # In a real implementation, we would check for assets that can be staked for yield
        for holding in self.results["holdings"]:
            if holding.get("asset") in ["ETH", "SOL", "ADA", "DOT"]:
                self.results["opportunities"].append({
                    "type": "staking",
                    "asset": holding.get("asset"),
                    "message": f"Consider staking {holding.get('asset')} for passive income"
                })
        
        # Check for rebalancing opportunities (if allocation is significantly different from target)
        # This is a placeholder - in a real implementation, we would compare to target allocation
        
        logger.info(f"Identified {len(self.results['opportunities'])} opportunities and {len(self.results['risks'])} risks")


class BinanceClient:
    """Client for interacting with the Binance API"""
    
    def __init__(self, api_key, api_secret):
        """
        Initialize the Binance client
        
        Args:
            api_key (str): Binance API key
            api_secret (str): Binance API secret
        """
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.binance.com"
    
    def _generate_signature(self, params):
        """
        Generate signature for authenticated requests
        
        Args:
            params (dict): Request parameters
        
        Returns:
            str: HMAC SHA256 signature
        """
        query_string = urlencode(params)
        signature = hmac.new(
            self.api_secret.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def _send_request(self, endpoint, method="GET", params=None, signed=False):
        """
        Send request to Binance API
        
        Args:
            endpoint (str): API endpoint
            method (str): HTTP method
            params (dict): Request parameters
            signed (bool): Whether the request needs to be signed
        
        Returns:
            dict: Response data
        """
        url = f"{self.base_url}{endpoint}"
        headers = {"X-MBX-APIKEY": self.api_key}
        
        if params is None:
            params = {}
        
        if signed:
            params["timestamp"] = int(time.time() * 1000)
            params["signature"] = self._generate_signature(params)
        
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, params=params)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        if response.status_code != 200:
            raise Exception(f"Binance API error: {response.text}")
        
        return response.json()
    
    def get_account_balances(self):
        """
        Get account balances
        
        Returns:
            dict: Account balances
        """
        # If we don't have API keys, return empty balances
        if not self.api_key or not self.api_secret:
            logger.warning("Binance API keys not configured. Returning empty balances.")
            return {}
        
        # This is a placeholder - in a real implementation, we would call the Binance API
        # For now, return simulated balances
        
        # Simulated balances
        simulated_balances = {
            "BTC": {"free": 0.5, "locked": 0},
            "ETH": {"free": 5.0, "locked": 0},
            "BNB": {"free": 10.0, "locked": 0},
            "USDT": {"free": 1000.0, "locked": 0}
        }
        
        return simulated_balances
    
    def get_asset_price(self, asset, quote="USDT"):
        """
        Get current price for an asset
        
        Args:
            asset (str): Asset symbol
            quote (str): Quote currency
        
        Returns:
            float: Current price
        """
        # This is a placeholder - in a real implementation, we would call the Binance API
        # For now, return simulated prices
        
        # Simulated prices
        simulated_prices = {
            "BTC": 85000.0,
            "ETH": 4500.0,
            "BNB": 750.0,
            "SOL": 180.0,
            "ADA": 1.2,
            "DOT": 25.0,
            "USDT": 1.0
        }
        
        return simulated_prices.get(asset, 0)


if __name__ == "__main__":
    # If run directly, perform a test check
    logging.basicConfig(level=logging.INFO)
    
    # Test configuration
    config = {
        "track_wallets": [],
        "manual_holdings": {
            "BTC": {"balance": 0.5},
            "ETH": {"balance": 5.0}
        }
    }
    
    api_keys = {
        "binance": {
            "api_key": "",
            "api_secret": ""
        }
    }
    
    # Run test check
    tracker = PortfolioTracker(config, api_keys)
    results = tracker.check()
    
    # Print results
    print(json.dumps(results, indent=4))