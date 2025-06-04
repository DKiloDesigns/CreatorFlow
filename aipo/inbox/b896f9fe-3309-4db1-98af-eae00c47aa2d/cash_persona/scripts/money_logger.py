#!/usr/bin/env python3
"""
Money Logger for Cash Daily Workflow

This module logs all money moves, wins, losses, and lessons:
1. Tracks portfolio changes over time
2. Records trading decisions and outcomes
3. Captures lessons learned
4. Maintains a historical record for analysis and tax purposes

Usage:
    from money_logger import MoneyLogger
    logger = MoneyLogger(logs_dir)
    logger.log(market_data, portfolio_data, playbook)
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
import re

logger = logging.getLogger("Cash.MoneyLogger")

class MoneyLogger:
    """Logs money moves, wins, losses, and lessons"""
    
    def __init__(self, logs_dir):
        """
        Initialize the money logger
        
        Args:
            logs_dir (str or Path): Directory for storing logs
        """
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(exist_ok=True, parents=True)
        
        # Initialize log files
        self.portfolio_history_file = self.logs_dir / "portfolio_history.json"
        self.money_moves_file = self.logs_dir / "money_moves.md"
        self.lessons_file = self.logs_dir / "lessons_learned.md"
        
        # Initialize log files if they don't exist
        self._initialize_log_files()
    
    def log(self, market_data, portfolio_data, playbook):
        """
        Log money moves, wins, losses, and lessons
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        logger.info("Logging money moves")
        
        # Log portfolio history
        self._log_portfolio_history(portfolio_data)
        
        # Log money moves
        self._log_money_moves(portfolio_data, playbook)
        
        # Log lessons learned
        self._log_lessons(market_data, portfolio_data, playbook)
        
        logger.info("Money moves logged successfully")
    
    def _initialize_log_files(self):
        """Initialize log files if they don't exist"""
        # Initialize portfolio history file
        if not self.portfolio_history_file.exists():
            with open(self.portfolio_history_file, 'w') as f:
                json.dump([], f, indent=4)
        
        # Initialize money moves file
        if not self.money_moves_file.exists():
            with open(self.money_moves_file, 'w') as f:
                f.write("# Money Moves Log\n\n")
                f.write("This file tracks all money moves, including trades, deposits, withdrawals, and other financial actions.\n\n")
                f.write("## Entries\n\n")
        
        # Initialize lessons file
        if not self.lessons_file.exists():
            with open(self.lessons_file, 'w') as f:
                f.write("# Lessons Learned\n\n")
                f.write("This file captures lessons learned from trading decisions, market analysis, and portfolio management.\n\n")
                f.write("## Entries\n\n")
    
    def _log_portfolio_history(self, portfolio_data):
        """
        Log portfolio history
        
        Args:
            portfolio_data (dict): Portfolio check results
        """
        if not portfolio_data:
            logger.warning("No portfolio data to log")
            return
        
        try:
            # Load existing history
            with open(self.portfolio_history_file, 'r') as f:
                history = json.load(f)
            
            # Create new history entry
            entry = {
                "timestamp": datetime.now().isoformat(),
                "total_value_usd": portfolio_data.get("total_value_usd", 0),
                "performance": portfolio_data.get("performance", {}),
                "holdings": portfolio_data.get("holdings", [])
            }
            
            # Add to history
            history.append(entry)
            
            # Save updated history
            with open(self.portfolio_history_file, 'w') as f:
                json.dump(history, f, indent=4)
            
            logger.info("Portfolio history logged")
        
        except Exception as e:
            logger.error(f"Error logging portfolio history: {str(e)}", exc_info=True)
    
    def _log_money_moves(self, portfolio_data, playbook):
        """
        Log money moves
        
        Args:
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        try:
            # Extract action items from playbook
            action_items = self._extract_action_items(playbook)
            
            # Create money moves entry
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            entry = f"### {timestamp}\n\n"
            
            # Add portfolio summary
            if portfolio_data:
                total_value = portfolio_data.get("total_value_usd", 0)
                performance_24h = portfolio_data.get("performance", {}).get("24h", 0)
                
                entry += f"**Portfolio Value:** ${total_value:.2f}\n"
                entry += f"**24h Performance:** {performance_24h:.2f}%\n\n"
            
            # Add action items
            if action_items:
                entry += "**Recommended Actions:**\n\n"
                for item in action_items:
                    entry += f"- {item}\n"
            else:
                entry += "*No specific money moves recommended today.*\n"
            
            entry += "\n---\n\n"
            
            # Append to money moves file
            with open(self.money_moves_file, 'a') as f:
                f.write(entry)
            
            logger.info("Money moves logged")
        
        except Exception as e:
            logger.error(f"Error logging money moves: {str(e)}", exc_info=True)
    
    def _log_lessons(self, market_data, portfolio_data, playbook):
        """
        Log lessons learned
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        try:
            # Extract lessons from data
            lessons = []
            
            # Check for market warnings
            if market_data and "warnings" in market_data:
                for warning in market_data.get("warnings", []):
                    lessons.append(f"Market warning for {warning.get('coin', 'Unknown')}: {warning.get('message', 'No details')}")
            
            # Check for portfolio risks
            if portfolio_data and "risks" in portfolio_data:
                for risk in portfolio_data.get("risks", []):
                    lessons.append(f"Portfolio risk: {risk.get('message', 'No details')}")
            
            # If no specific lessons, add a general note
            if not lessons:
                return  # Skip if no lessons to log
            
            # Create lessons entry
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            entry = f"### {timestamp}\n\n"
            
            # Add lessons
            for lesson in lessons:
                entry += f"- {lesson}\n"
            
            entry += "\n---\n\n"
            
            # Append to lessons file
            with open(self.lessons_file, 'a') as f:
                f.write(entry)
            
            logger.info("Lessons logged")
        
        except Exception as e:
            logger.error(f"Error logging lessons: {str(e)}", exc_info=True)
    
    def _extract_action_items(self, playbook):
        """
        Extract action items from playbook
        
        Args:
            playbook (str): Generated playbook
        
        Returns:
            list: Extracted action items
        """
        action_items = []
        
        # Look for action plan section
        action_plan_match = re.search(r'## Action Plan\s+(.+?)(?=^##|\Z)', playbook, re.DOTALL | re.MULTILINE)
        if action_plan_match:
            action_plan = action_plan_match.group(1)
            
            # Extract high priority actions
            high_priority_match = re.search(r'### High Priority\s+(.+?)(?=^###|\Z)', action_plan, re.DOTALL | re.MULTILINE)
            if high_priority_match:
                high_priority_section = high_priority_match.group(1)
                
                # Extract numbered items
                for item_match in re.finditer(r'\d+\.\s+\*\*(.+?)\*\*', high_priority_section):
                    action_items.append(f"HIGH PRIORITY: {item_match.group(1)}")
            
            # Extract medium priority actions
            medium_priority_match = re.search(r'### Medium Priority\s+(.+?)(?=^###|\Z)', action_plan, re.DOTALL | re.MULTILINE)
            if medium_priority_match:
                medium_priority_section = medium_priority_match.group(1)
                
                # Extract numbered items
                for item_match in re.finditer(r'\d+\.\s+\*\*(.+?)\*\*', medium_priority_section):
                    action_items.append(f"MEDIUM PRIORITY: {item_match.group(1)}")
        
        return action_items


if __name__ == "__main__":
    # If run directly, perform a test log
    logging.basicConfig(level=logging.INFO)
    
    # Create test directory
    test_dir = Path("test_logs")
    test_dir.mkdir(exist_ok=True)
    
    # Create test logger
    money_logger = MoneyLogger(test_dir)
    
    # Test portfolio data
    portfolio_data = {
        "total_value_usd": 25000,
        "performance": {
            "24h": 2.5,
            "7d": -1.2,
            "30d": 15.7
        },
        "holdings": [
            {
                "asset": "BTC",
                "balance": 0.5,
                "value_usd": 42500,
                "price_usd": 85000,
                "allocation_percentage": 60,
                "source": "binance"
            },
            {
                "asset": "ETH",
                "balance": 5.0,
                "value_usd": 22500,
                "price_usd": 4500,
                "allocation_percentage": 30,
                "source": "binance"
            }
        ],
        "risks": [
            {
                "type": "concentration_risk",
                "asset": "BTC",
                "allocation": 60,
                "message": "High concentration in BTC (60.0% of portfolio)"
            }
        ]
    }
    
    # Test market data
    market_data = {
        "warnings": [
            {
                "type": "negative_sentiment",
                "coin": "BTC",
                "source": "twitter",
                "message": "Bear market incoming. Protect your assets."
            }
        ]
    }
    
    # Test playbook
    test_playbook = """# Cash Playbook - 2025-05-11

**Generated:** 2025-05-11 12:34:56

This playbook provides actionable insights and recommendations based on the latest market data, your portfolio status, and available trading tools.

## Action Plan

### High Priority

1. **Consider rebalancing portfolio to reduce BTC exposure**
   - *Rationale:* High concentration in BTC (60.0% of portfolio)
   - *Category:* Portfolio

### Medium Priority

1. **Stake ETH for passive income**
   - *Rationale:* Consider staking ETH for passive income
   - *Category:* Portfolio

2. **Test freqtrade in a sandbox environment**
   - *Rationale:* Highest-rated trading bot with score 95.5/100
   - *Category:* Automation

"""
    
    # Log test data
    money_logger.log(market_data, portfolio_data, test_playbook)
    
    print(f"Test logs created in {test_dir}")
    print(f"Portfolio history: {test_dir / 'portfolio_history.json'}")
    print(f"Money moves: {test_dir / 'money_moves.md'}")
    print(f"Lessons learned: {test_dir / 'lessons_learned.md'}")#!/usr/bin/env python3
"""
Money Logger for Cash Daily Workflow

This module logs all money moves, wins, losses, and lessons:
1. Tracks portfolio changes over time
2. Records trading decisions and outcomes
3. Captures lessons learned
4. Maintains a historical record for analysis and tax purposes

Usage:
    from money_logger import MoneyLogger
    logger = MoneyLogger(logs_dir)
    logger.log(market_data, portfolio_data, playbook)
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
import re

logger = logging.getLogger("Cash.MoneyLogger")

class MoneyLogger:
    """Logs money moves, wins, losses, and lessons"""
    
    def __init__(self, logs_dir):
        """
        Initialize the money logger
        
        Args:
            logs_dir (str or Path): Directory for storing logs
        """
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(exist_ok=True, parents=True)
        
        # Initialize log files
        self.portfolio_history_file = self.logs_dir / "portfolio_history.json"
        self.money_moves_file = self.logs_dir / "money_moves.md"
        self.lessons_file = self.logs_dir / "lessons_learned.md"
        
        # Initialize log files if they don't exist
        self._initialize_log_files()
    
    def log(self, market_data, portfolio_data, playbook):
        """
        Log money moves, wins, losses, and lessons
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        logger.info("Logging money moves")
        
        # Log portfolio history
        self._log_portfolio_history(portfolio_data)
        
        # Log money moves
        self._log_money_moves(portfolio_data, playbook)
        
        # Log lessons learned
        self._log_lessons(market_data, portfolio_data, playbook)
        
        logger.info("Money moves logged successfully")
    
    def _initialize_log_files(self):
        """Initialize log files if they don't exist"""
        # Initialize portfolio history file
        if not self.portfolio_history_file.exists():
            with open(self.portfolio_history_file, 'w') as f:
                json.dump([], f, indent=4)
        
        # Initialize money moves file
        if not self.money_moves_file.exists():
            with open(self.money_moves_file, 'w') as f:
                f.write("# Money Moves Log\n\n")
                f.write("This file tracks all money moves, including trades, deposits, withdrawals, and other financial actions.\n\n")
                f.write("## Entries\n\n")
        
        # Initialize lessons file
        if not self.lessons_file.exists():
            with open(self.lessons_file, 'w') as f:
                f.write("# Lessons Learned\n\n")
                f.write("This file captures lessons learned from trading decisions, market analysis, and portfolio management.\n\n")
                f.write("## Entries\n\n")
    
    def _log_portfolio_history(self, portfolio_data):
        """
        Log portfolio history
        
        Args:
            portfolio_data (dict): Portfolio check results
        """
        if not portfolio_data:
            logger.warning("No portfolio data to log")
            return
        
        try:
            # Load existing history
            with open(self.portfolio_history_file, 'r') as f:
                history = json.load(f)
            
            # Create new history entry
            entry = {
                "timestamp": datetime.now().isoformat(),
                "total_value_usd": portfolio_data.get("total_value_usd", 0),
                "performance": portfolio_data.get("performance", {}),
                "holdings": portfolio_data.get("holdings", [])
            }
            
            # Add to history
            history.append(entry)
            
            # Save updated history
            with open(self.portfolio_history_file, 'w') as f:
                json.dump(history, f, indent=4)
            
            logger.info("Portfolio history logged")
        
        except Exception as e:
            logger.error(f"Error logging portfolio history: {str(e)}", exc_info=True)
    
    def _log_money_moves(self, portfolio_data, playbook):
        """
        Log money moves
        
        Args:
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        try:
            # Extract action items from playbook
            action_items = self._extract_action_items(playbook)
            
            # Create money moves entry
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            entry = f"### {timestamp}\n\n"
            
            # Add portfolio summary
            if portfolio_data:
                total_value = portfolio_data.get("total_value_usd", 0)
                performance_24h = portfolio_data.get("performance", {}).get("24h", 0)
                
                entry += f"**Portfolio Value:** ${total_value:.2f}\n"
                entry += f"**24h Performance:** {performance_24h:.2f}%\n\n"
            
            # Add action items
            if action_items:
                entry += "**Recommended Actions:**\n\n"
                for item in action_items:
                    entry += f"- {item}\n"
            else:
                entry += "*No specific money moves recommended today.*\n"
            
            entry += "\n---\n\n"
            
            # Append to money moves file
            with open(self.money_moves_file, 'a') as f:
                f.write(entry)
            
            logger.info("Money moves logged")
        
        except Exception as e:
            logger.error(f"Error logging money moves: {str(e)}", exc_info=True)
    
    def _log_lessons(self, market_data, portfolio_data, playbook):
        """
        Log lessons learned
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            playbook (str): Generated playbook
        """
        try:
            # Extract lessons from data
            lessons = []
            
            # Check for market warnings
            if market_data and "warnings" in market_data:
                for warning in market_data.get("warnings", []):
                    lessons.append(f"Market warning for {warning.get('coin', 'Unknown')}: {warning.get('message', 'No details')}")
            
            # Check for portfolio risks
            if portfolio_data and "risks" in portfolio_data:
                for risk in portfolio_data.get("risks", []):
                    lessons.append(f"Portfolio risk: {risk.get('message', 'No details')}")
            
            # If no specific lessons, add a general note
            if not lessons:
                return  # Skip if no lessons to log
            
            # Create lessons entry
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            entry = f"### {timestamp}\n\n"
            
            # Add lessons
            for lesson in lessons:
                entry += f"- {lesson}\n"
            
            entry += "\n---\n\n"
            
            # Append to lessons file
            with open(self.lessons_file, 'a') as f:
                f.write(entry)
            
            logger.info("Lessons logged")
        
        except Exception as e:
            logger.error(f"Error logging lessons: {str(e)}", exc_info=True)
    
    def _extract_action_items(self, playbook):
        """
        Extract action items from playbook
        
        Args:
            playbook (str): Generated playbook
        
        Returns:
            list: Extracted action items
        """
        action_items = []
        
        # Look for action plan section
        action_plan_match = re.search(r'## Action Plan\s+(.+?)(?=^##|\Z)', playbook, re.DOTALL | re.MULTILINE)
        if action_plan_match:
            action_plan = action_plan_match.group(1)
            
            # Extract high priority actions
            high_priority_match = re.search(r'### High Priority\s+(.+?)(?=^###|\Z)', action_plan, re.DOTALL | re.MULTILINE)
            if high_priority_match:
                high_priority_section = high_priority_match.group(1)
                
                # Extract numbered items
                for item_match in re.finditer(r'\d+\.\s+\*\*(.+?)\*\*', high_priority_section):
                    action_items.append(f"HIGH PRIORITY: {item_match.group(1)}")
            
            # Extract medium priority actions
            medium_priority_match = re.search(r'### Medium Priority\s+(.+?)(?=^###|\Z)', action_plan, re.DOTALL | re.MULTILINE)
            if medium_priority_match:
                medium_priority_section = medium_priority_match.group(1)
                
                # Extract numbered items
                for item_match in re.finditer(r'\d+\.\s+\*\*(.+?)\*\*', medium_priority_section):
                    action_items.append(f"MEDIUM PRIORITY: {item_match.group(1)}")
        
        return action_items


if __name__ == "__main__":
    # If run directly, perform a test log
    logging.basicConfig(level=logging.INFO)
    
    # Create test directory
    test_dir = Path("test_logs")
    test_dir.mkdir(exist_ok=True)
    
    # Create test logger
    money_logger = MoneyLogger(test_dir)
    
    # Test portfolio data
    portfolio_data = {
        "total_value_usd": 25000,
        "performance": {
            "24h": 2.5,
            "7d": -1.2,
            "30d": 15.7
        },
        "holdings": [
            {
                "asset": "BTC",
                "balance": 0.5,
                "value_usd": 42500,
                "price_usd": 85000,
                "allocation_percentage": 60,
                "source": "binance"
            },
            {
                "asset": "ETH",
                "balance": 5.0,
                "value_usd": 22500,
                "price_usd": 4500,
                "allocation_percentage": 30,
                "source": "binance"
            }
        ],
        "risks": [
            {
                "type": "concentration_risk",
                "asset": "BTC",
                "allocation": 60,
                "message": "High concentration in BTC (60.0% of portfolio)"
            }
        ]
    }
    
    # Test market data
    market_data = {
        "warnings": [
            {
                "type": "negative_sentiment",
                "coin": "BTC",
                "source": "twitter",
                "message": "Bear market incoming. Protect your assets."
            }
        ]
    }
    
    # Test playbook
    test_playbook = """# Cash Playbook - 2025-05-11

**Generated:** 2025-05-11 12:34:56

This playbook provides actionable insights and recommendations based on the latest market data, your portfolio status, and available trading tools.

## Action Plan

### High Priority

1. **Consider rebalancing portfolio to reduce BTC exposure**
   - *Rationale:* High concentration in BTC (60.0% of portfolio)
   - *Category:* Portfolio

### Medium Priority

1. **Stake ETH for passive income**
   - *Rationale:* Consider staking ETH for passive income
   - *Category:* Portfolio

2. **Test freqtrade in a sandbox environment**
   - *Rationale:* Highest-rated trading bot with score 95.5/100
   - *Category:* Automation

"""
    
    # Log test data
    money_logger.log(market_data, portfolio_data, test_playbook)
    
    print(f"Test logs created in {test_dir}")
    print(f"Portfolio history: {test_dir / 'portfolio_history.json'}")
    print(f"Money moves: {test_dir / 'money_moves.md'}")
    print(f"Lessons learned: {test_dir / 'lessons_learned.md'}")