#!/usr/bin/env python3
"""
Playbook Generator for Cash Daily Workflow

This module generates an actionable playbook based on market data, portfolio data, and bot data:
1. Analyzes market trends and opportunities
2. Evaluates portfolio performance and risks
3. Recommends trading bots and scripts
4. Creates a prioritized action plan

Usage:
    from playbook_generator import PlaybookGenerator
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("Cash.PlaybookGenerator")

class PlaybookGenerator:
    """Generates actionable playbooks based on collected data"""
    
    def __init__(self, market_data, portfolio_data, bot_data):
        """
        Initialize the playbook generator
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            bot_data (dict): Bot hunt results
        """
        self.market_data = market_data or {}
        self.portfolio_data = portfolio_data or {}
        self.bot_data = bot_data or {}
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def generate(self):
        """
        Generate an actionable playbook
        
        Returns:
            str: Markdown-formatted playbook
        """
        logger.info("Generating actionable playbook")
        
        # Build playbook sections
        sections = [
            self._generate_header(),
            self._generate_market_summary(),
            self._generate_portfolio_summary(),
            self._generate_bot_recommendations(),
            self._generate_action_plan(),
            self._generate_footer()
        ]
        
        # Combine sections into a single playbook
        playbook = "\n\n".join(sections)
        
        logger.info("Playbook generation complete")
        return playbook
    
    def _generate_header(self):
        """Generate playbook header"""
        return f"""# Cash Playbook - {datetime.now().strftime("%Y-%m-%d")}

**Generated:** {self.timestamp}

This playbook provides actionable insights and recommendations based on the latest market data, your portfolio status, and available trading tools. Use it to guide your crypto trading decisions and automation strategy.

---"""
    
    def _generate_market_summary(self):
        """Generate market summary section"""
        if not self.market_data:
            return """## Market Summary

*No market data available. Run a market scan to get the latest trends and opportunities.*"""
        
        # Extract trending coins
        trending_coins = self.market_data.get("trending_coins", [])
        trending_coins_text = ""
        if trending_coins:
            trending_coins_text = "\n\n### Trending Coins\n\n"
            trending_coins_text += "| Coin | Symbol | Source | Score |\n"
            trending_coins_text += "|------|--------|--------|-------|\n"
            
            for coin in trending_coins[:5]:  # Show top 5
                trending_coins_text += f"| {coin.get('name', 'Unknown')} | {coin.get('symbol', 'Unknown')} | {coin.get('source', 'Unknown')} | {coin.get('score', 'N/A')} |\n"
        
        # Extract opportunities
        opportunities = self.market_data.get("opportunities", [])
        opportunities_text = ""
        if opportunities:
            opportunities_text = "\n\n### Market Opportunities\n\n"
            opportunities_text += "| Type | Asset | Confidence | Sources |\n"
            opportunities_text += "|------|-------|------------|--------|\n"
            
            for opportunity in opportunities:
                opportunity_type = opportunity.get("type", "Unknown").replace("_", " ").title()
                asset = opportunity.get("coin", opportunity.get("symbol", "Unknown"))
                confidence = f"{opportunity.get('confidence', 0) * 100:.1f}%"
                sources = ", ".join(opportunity.get("sources", []))
                
                opportunities_text += f"| {opportunity_type} | {asset} | {confidence} | {sources} |\n"
        
        # Extract warnings
        warnings = self.market_data.get("warnings", [])
        warnings_text = ""
        if warnings:
            warnings_text = "\n\n### Market Warnings\n\n"
            warnings_text += "| Type | Asset | Source | Message |\n"
            warnings_text += "|------|-------|--------|--------|\n"
            
            for warning in warnings:
                warning_type = warning.get("type", "Unknown").replace("_", " ").title()
                asset = warning.get("coin", "N/A")
                source = warning.get("source", "Unknown")
                message = warning.get("message", "No details")
                
                warnings_text += f"| {warning_type} | {asset} | {source} | {message} |\n"
        
        # Build market summary
        market_summary = f"""## Market Summary

### Overall Market

"""
        
        # Add global market data if available
        global_market = self.market_data.get("market_sentiment", {}).get("global", {})
        if global_market:
            market_cap_change = global_market.get("market_cap_change_percentage_24h_usd")
            if market_cap_change is not None:
                market_summary += f"- **24h Market Cap Change:** {market_cap_change:.2f}%\n"
            
            total_market_cap = global_market.get("total_market_cap")
            if total_market_cap:
                market_summary += f"- **Total Market Cap:** ${total_market_cap / 1e9:.2f}B\n"
            
            total_volume = global_market.get("total_volume")
            if total_volume:
                market_summary += f"- **24h Volume:** ${total_volume / 1e9:.2f}B\n"
        
        # Add trending coins, opportunities, and warnings
        market_summary += trending_coins_text + opportunities_text + warnings_text
        
        return market_summary
    
    def _generate_portfolio_summary(self):
        """Generate portfolio summary section"""
        if not self.portfolio_data:
            return """## Portfolio Summary

*No portfolio data available. Configure API keys and run a portfolio check to get your current status.*"""
        
        # Extract portfolio data
        total_value = self.portfolio_data.get("total_value_usd", 0)
        performance = self.portfolio_data.get("performance", {})
        holdings = self.portfolio_data.get("holdings", [])
        
        # Sort holdings by value (descending)
        sorted_holdings = sorted(
            holdings,
            key=lambda x: x.get("value_usd", 0),
            reverse=True
        )
        
        # Build holdings table
        holdings_text = ""
        if sorted_holdings:
            holdings_text = "\n\n### Holdings\n\n"
            holdings_text += "| Asset | Balance | Value (USD) | Allocation | Source |\n"
            holdings_text += "|-------|---------|-------------|------------|--------|\n"
            
            for holding in sorted_holdings:
                asset = holding.get("asset", "Unknown")
                balance = f"{holding.get('balance', 0):.8f}".rstrip("0").rstrip(".")
                value = f"${holding.get('value_usd', 0):.2f}"
                allocation = f"{holding.get('allocation_percentage', 0):.1f}%"
                source = holding.get("source", "Unknown")
                
                holdings_text += f"| {asset} | {balance} | {value} | {allocation} | {source} |\n"
        
        # Extract opportunities and risks
        opportunities = self.portfolio_data.get("opportunities", [])
        risks = self.portfolio_data.get("risks", [])
        
        opportunities_text = ""
        if opportunities:
            opportunities_text = "\n\n### Portfolio Opportunities\n\n"
            for opportunity in opportunities:
                opportunities_text += f"- **{opportunity.get('type', 'Opportunity').replace('_', ' ').title()}:** {opportunity.get('message', 'No details')}\n"
        
        risks_text = ""
        if risks:
            risks_text = "\n\n### Portfolio Risks\n\n"
            for risk in risks:
                risks_text += f"- **{risk.get('type', 'Risk').replace('_', ' ').title()}:** {risk.get('message', 'No details')}\n"
        
        # Build portfolio summary
        portfolio_summary = f"""## Portfolio Summary

- **Total Value:** ${total_value:.2f}
- **24h Performance:** {performance.get('24h', 0):.2f}%
- **7d Performance:** {performance.get('7d', 0):.2f}%
- **30d Performance:** {performance.get('30d', 0):.2f}%"""
        
        # Add holdings, opportunities, and risks
        portfolio_summary += holdings_text + opportunities_text + risks_text
        
        return portfolio_summary
    
    def _generate_bot_recommendations(self):
        """Generate bot recommendations section"""
        if not self.bot_data:
            return """## Trading Bot Recommendations

*No bot data available. Run a bot hunt to discover new trading tools and automation options.*"""
        
        # Extract top picks
        top_picks = self.bot_data.get("top_picks", [])
        
        # Build top picks section
        top_picks_text = ""
        if top_picks:
            for i, pick in enumerate(top_picks, 1):
                repo_name = pick.get("repository", "Unknown")
                url = pick.get("url", "#")
                score = pick.get("overall_score", 0)
                recommendation = pick.get("recommendation", "No recommendation available.")
                
                top_picks_text += f"### {i}. [{repo_name}]({url}) - Score: {score:.1f}/100\n\n"
                top_picks_text += f"{recommendation}\n\n"
        else:
            top_picks_text = "*No top picks available.*\n\n"
        
        # Extract security concerns
        security_concerns = self.bot_data.get("security_concerns", [])
        
        security_concerns_text = ""
        if security_concerns:
            security_concerns_text = "### Security Concerns\n\n"
            for concern in security_concerns:
                repo_name = concern.get("repository", "Unknown")
                score = concern.get("score", 0)
                message = concern.get("message", "No details available.")
                
                security_concerns_text += f"- **{repo_name}** (Score: {score:.1f}/100): {message}\n"
        
        # Build bot recommendations
        bot_recommendations = f"""## Trading Bot Recommendations

{top_picks_text}"""
        
        # Add security concerns if any
        if security_concerns_text:
            bot_recommendations += security_concerns_text
        
        return bot_recommendations
    
    def _generate_action_plan(self):
        """Generate action plan section"""
        # Initialize action items
        action_items = []
        
        # Add market-based actions
        if self.market_data:
            opportunities = self.market_data.get("opportunities", [])
            for opportunity in opportunities:
                if opportunity.get("confidence", 0) > 0.7:  # High confidence
                    coin = opportunity.get("coin", opportunity.get("symbol", "Unknown"))
                    action_items.append({
                        "priority": "high",
                        "category": "market",
                        "action": f"Research {coin} for potential entry positions",
                        "rationale": f"High confidence opportunity based on multiple sources: {', '.join(opportunity.get('sources', []))}"
                    })
        
        # Add portfolio-based actions
        if self.portfolio_data:
            risks = self.portfolio_data.get("risks", [])
            for risk in risks:
                if risk.get("type") == "concentration_risk":
                    asset = risk.get("asset", "Unknown")
                    action_items.append({
                        "priority": "high",
                        "category": "portfolio",
                        "action": f"Consider rebalancing portfolio to reduce {asset} exposure",
                        "rationale": risk.get("message", "High concentration risk")
                    })
            
            opportunities = self.portfolio_data.get("opportunities", [])
            for opportunity in opportunities:
                if opportunity.get("type") == "staking":
                    asset = opportunity.get("asset", "Unknown")
                    action_items.append({
                        "priority": "medium",
                        "category": "portfolio",
                        "action": f"Stake {asset} for passive income",
                        "rationale": opportunity.get("message", "Staking opportunity")
                    })
        
        # Add bot-based actions
        if self.bot_data:
            top_picks = self.bot_data.get("top_picks", [])
            if top_picks:
                top_repo = top_picks[0]
                repo_name = top_repo.get("repository", "Unknown")
                action_items.append({
                    "priority": "medium",
                    "category": "automation",
                    "action": f"Test {repo_name} in a sandbox environment",
                    "rationale": f"Highest-rated trading bot with score {top_repo.get('overall_score', 0):.1f}/100"
                })
        
        # Sort action items by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        sorted_actions = sorted(
            action_items,
            key=lambda x: priority_order.get(x.get("priority", "low"), 3)
        )
        
        # Build action plan
        if not sorted_actions:
            return """## Action Plan

*No action items generated. Run more scans to get actionable recommendations.*"""
        
        action_plan = "## Action Plan\n\n"
        
        # Group by priority
        for priority in ["high", "medium", "low"]:
            priority_actions = [a for a in sorted_actions if a.get("priority") == priority]
            if priority_actions:
                action_plan += f"### {priority.title()} Priority\n\n"
                for i, action in enumerate(priority_actions, 1):
                    action_plan += f"{i}. **{action.get('action')}**\n"
                    action_plan += f"   - *Rationale:* {action.get('rationale')}\n"
                    action_plan += f"   - *Category:* {action.get('category', 'general').title()}\n\n"
        
        return action_plan
    
    def _generate_footer(self):
        """Generate playbook footer"""
        return f"""---

*This playbook was generated by Cash on {self.timestamp}. All recommendations should be reviewed and validated before implementation. Past performance is not indicative of future results.*"""


if __name__ == "__main__":
    # If run directly, generate a test playbook
    logging.basicConfig(level=logging.INFO)
    
    # Load test data
    import os
    
    # Test market data
    market_data = {
        "trending_coins": [
            {"name": "Bitcoin", "symbol": "BTC", "source": "coingecko", "score": 0.95},
            {"name": "Ethereum", "symbol": "ETH", "source": "coingecko", "score": 0.92},
            {"name": "Solana", "symbol": "SOL", "source": "coingecko", "score": 0.88}
        ],
        "market_sentiment": {
            "global": {
                "market_cap_change_percentage_24h_usd": 2.5,
                "total_market_cap": 2.5e12,
                "total_volume": 150e9
            }
        },
        "opportunities": [
            {
                "type": "trending_coin",
                "coin": "Solana",
                "symbol": "SOL",
                "sources": ["coingecko", "reddit", "twitter"],
                "confidence": 0.75
            }
        ],
        "warnings": [
            {
                "type": "negative_sentiment",
                "coin": "BTC",
                "source": "twitter",
                "message": "Bear market incoming. Protect your assets."
            }
        ]
    }
    
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
            },
            {
                "asset": "USDT",
                "balance": 10000,
                "value_usd": 10000,
                "price_usd": 1.0,
                "allocation_percentage": 10,
                "source": "binance"
            }
        ],
        "opportunities": [
            {
                "type": "staking",
                "asset": "ETH",
                "message": "Consider staking ETH for passive income"
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
    
    # Test bot data
    bot_data = {
        "top_picks": [
            {
                "repository": "freqtrade/freqtrade",
                "url": "https://github.com/freqtrade/freqtrade",
                "overall_score": 95.5,
                "recommendation": "Consider using freqtrade for its Python-based approach, making it easy to customize and integrate with our existing tools. With 39000 stars, it has a strong community and active development."
            },
            {
                "repository": "hummingbot/hummingbot",
                "url": "https://github.com/hummingbot/hummingbot",
                "overall_score": 88.2,
                "recommendation": "Consider using hummingbot for its market-making capabilities and support for both CEX and DEX trading. With 6800 stars, it has a solid community backing."
            }
        ],
        "security_concerns": []
    }
    
    # Generate playbook
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
    
    # Print playbook
    print(playbook)
    
    # Save playbook to file
    with open("test_playbook.md", "w") as f:
        f.write(playbook)#!/usr/bin/env python3
"""
Playbook Generator for Cash Daily Workflow

This module generates an actionable playbook based on market data, portfolio data, and bot data:
1. Analyzes market trends and opportunities
2. Evaluates portfolio performance and risks
3. Recommends trading bots and scripts
4. Creates a prioritized action plan

Usage:
    from playbook_generator import PlaybookGenerator
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("Cash.PlaybookGenerator")

class PlaybookGenerator:
    """Generates actionable playbooks based on collected data"""
    
    def __init__(self, market_data, portfolio_data, bot_data):
        """
        Initialize the playbook generator
        
        Args:
            market_data (dict): Market scan results
            portfolio_data (dict): Portfolio check results
            bot_data (dict): Bot hunt results
        """
        self.market_data = market_data or {}
        self.portfolio_data = portfolio_data or {}
        self.bot_data = bot_data or {}
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def generate(self):
        """
        Generate an actionable playbook
        
        Returns:
            str: Markdown-formatted playbook
        """
        logger.info("Generating actionable playbook")
        
        # Build playbook sections
        sections = [
            self._generate_header(),
            self._generate_market_summary(),
            self._generate_portfolio_summary(),
            self._generate_bot_recommendations(),
            self._generate_action_plan(),
            self._generate_footer()
        ]
        
        # Combine sections into a single playbook
        playbook = "\n\n".join(sections)
        
        logger.info("Playbook generation complete")
        return playbook
    
    def _generate_header(self):
        """Generate playbook header"""
        return f"""# Cash Playbook - {datetime.now().strftime("%Y-%m-%d")}

**Generated:** {self.timestamp}

This playbook provides actionable insights and recommendations based on the latest market data, your portfolio status, and available trading tools. Use it to guide your crypto trading decisions and automation strategy.

---"""
    
    def _generate_market_summary(self):
        """Generate market summary section"""
        if not self.market_data:
            return """## Market Summary

*No market data available. Run a market scan to get the latest trends and opportunities.*"""
        
        # Extract trending coins
        trending_coins = self.market_data.get("trending_coins", [])
        trending_coins_text = ""
        if trending_coins:
            trending_coins_text = "\n\n### Trending Coins\n\n"
            trending_coins_text += "| Coin | Symbol | Source | Score |\n"
            trending_coins_text += "|------|--------|--------|-------|\n"
            
            for coin in trending_coins[:5]:  # Show top 5
                trending_coins_text += f"| {coin.get('name', 'Unknown')} | {coin.get('symbol', 'Unknown')} | {coin.get('source', 'Unknown')} | {coin.get('score', 'N/A')} |\n"
        
        # Extract opportunities
        opportunities = self.market_data.get("opportunities", [])
        opportunities_text = ""
        if opportunities:
            opportunities_text = "\n\n### Market Opportunities\n\n"
            opportunities_text += "| Type | Asset | Confidence | Sources |\n"
            opportunities_text += "|------|-------|------------|--------|\n"
            
            for opportunity in opportunities:
                opportunity_type = opportunity.get("type", "Unknown").replace("_", " ").title()
                asset = opportunity.get("coin", opportunity.get("symbol", "Unknown"))
                confidence = f"{opportunity.get('confidence', 0) * 100:.1f}%"
                sources = ", ".join(opportunity.get("sources", []))
                
                opportunities_text += f"| {opportunity_type} | {asset} | {confidence} | {sources} |\n"
        
        # Extract warnings
        warnings = self.market_data.get("warnings", [])
        warnings_text = ""
        if warnings:
            warnings_text = "\n\n### Market Warnings\n\n"
            warnings_text += "| Type | Asset | Source | Message |\n"
            warnings_text += "|------|-------|--------|--------|\n"
            
            for warning in warnings:
                warning_type = warning.get("type", "Unknown").replace("_", " ").title()
                asset = warning.get("coin", "N/A")
                source = warning.get("source", "Unknown")
                message = warning.get("message", "No details")
                
                warnings_text += f"| {warning_type} | {asset} | {source} | {message} |\n"
        
        # Build market summary
        market_summary = f"""## Market Summary

### Overall Market

"""
        
        # Add global market data if available
        global_market = self.market_data.get("market_sentiment", {}).get("global", {})
        if global_market:
            market_cap_change = global_market.get("market_cap_change_percentage_24h_usd")
            if market_cap_change is not None:
                market_summary += f"- **24h Market Cap Change:** {market_cap_change:.2f}%\n"
            
            total_market_cap = global_market.get("total_market_cap")
            if total_market_cap:
                market_summary += f"- **Total Market Cap:** ${total_market_cap / 1e9:.2f}B\n"
            
            total_volume = global_market.get("total_volume")
            if total_volume:
                market_summary += f"- **24h Volume:** ${total_volume / 1e9:.2f}B\n"
        
        # Add trending coins, opportunities, and warnings
        market_summary += trending_coins_text + opportunities_text + warnings_text
        
        return market_summary
    
    def _generate_portfolio_summary(self):
        """Generate portfolio summary section"""
        if not self.portfolio_data:
            return """## Portfolio Summary

*No portfolio data available. Configure API keys and run a portfolio check to get your current status.*"""
        
        # Extract portfolio data
        total_value = self.portfolio_data.get("total_value_usd", 0)
        performance = self.portfolio_data.get("performance", {})
        holdings = self.portfolio_data.get("holdings", [])
        
        # Sort holdings by value (descending)
        sorted_holdings = sorted(
            holdings,
            key=lambda x: x.get("value_usd", 0),
            reverse=True
        )
        
        # Build holdings table
        holdings_text = ""
        if sorted_holdings:
            holdings_text = "\n\n### Holdings\n\n"
            holdings_text += "| Asset | Balance | Value (USD) | Allocation | Source |\n"
            holdings_text += "|-------|---------|-------------|------------|--------|\n"
            
            for holding in sorted_holdings:
                asset = holding.get("asset", "Unknown")
                balance = f"{holding.get('balance', 0):.8f}".rstrip("0").rstrip(".")
                value = f"${holding.get('value_usd', 0):.2f}"
                allocation = f"{holding.get('allocation_percentage', 0):.1f}%"
                source = holding.get("source", "Unknown")
                
                holdings_text += f"| {asset} | {balance} | {value} | {allocation} | {source} |\n"
        
        # Extract opportunities and risks
        opportunities = self.portfolio_data.get("opportunities", [])
        risks = self.portfolio_data.get("risks", [])
        
        opportunities_text = ""
        if opportunities:
            opportunities_text = "\n\n### Portfolio Opportunities\n\n"
            for opportunity in opportunities:
                opportunities_text += f"- **{opportunity.get('type', 'Opportunity').replace('_', ' ').title()}:** {opportunity.get('message', 'No details')}\n"
        
        risks_text = ""
        if risks:
            risks_text = "\n\n### Portfolio Risks\n\n"
            for risk in risks:
                risks_text += f"- **{risk.get('type', 'Risk').replace('_', ' ').title()}:** {risk.get('message', 'No details')}\n"
        
        # Build portfolio summary
        portfolio_summary = f"""## Portfolio Summary

- **Total Value:** ${total_value:.2f}
- **24h Performance:** {performance.get('24h', 0):.2f}%
- **7d Performance:** {performance.get('7d', 0):.2f}%
- **30d Performance:** {performance.get('30d', 0):.2f}%"""
        
        # Add holdings, opportunities, and risks
        portfolio_summary += holdings_text + opportunities_text + risks_text
        
        return portfolio_summary
    
    def _generate_bot_recommendations(self):
        """Generate bot recommendations section"""
        if not self.bot_data:
            return """## Trading Bot Recommendations

*No bot data available. Run a bot hunt to discover new trading tools and automation options.*"""
        
        # Extract top picks
        top_picks = self.bot_data.get("top_picks", [])
        
        # Build top picks section
        top_picks_text = ""
        if top_picks:
            for i, pick in enumerate(top_picks, 1):
                repo_name = pick.get("repository", "Unknown")
                url = pick.get("url", "#")
                score = pick.get("overall_score", 0)
                recommendation = pick.get("recommendation", "No recommendation available.")
                
                top_picks_text += f"### {i}. [{repo_name}]({url}) - Score: {score:.1f}/100\n\n"
                top_picks_text += f"{recommendation}\n\n"
        else:
            top_picks_text = "*No top picks available.*\n\n"
        
        # Extract security concerns
        security_concerns = self.bot_data.get("security_concerns", [])
        
        security_concerns_text = ""
        if security_concerns:
            security_concerns_text = "### Security Concerns\n\n"
            for concern in security_concerns:
                repo_name = concern.get("repository", "Unknown")
                score = concern.get("score", 0)
                message = concern.get("message", "No details available.")
                
                security_concerns_text += f"- **{repo_name}** (Score: {score:.1f}/100): {message}\n"
        
        # Build bot recommendations
        bot_recommendations = f"""## Trading Bot Recommendations

{top_picks_text}"""
        
        # Add security concerns if any
        if security_concerns_text:
            bot_recommendations += security_concerns_text
        
        return bot_recommendations
    
    def _generate_action_plan(self):
        """Generate action plan section"""
        # Initialize action items
        action_items = []
        
        # Add market-based actions
        if self.market_data:
            opportunities = self.market_data.get("opportunities", [])
            for opportunity in opportunities:
                if opportunity.get("confidence", 0) > 0.7:  # High confidence
                    coin = opportunity.get("coin", opportunity.get("symbol", "Unknown"))
                    action_items.append({
                        "priority": "high",
                        "category": "market",
                        "action": f"Research {coin} for potential entry positions",
                        "rationale": f"High confidence opportunity based on multiple sources: {', '.join(opportunity.get('sources', []))}"
                    })
        
        # Add portfolio-based actions
        if self.portfolio_data:
            risks = self.portfolio_data.get("risks", [])
            for risk in risks:
                if risk.get("type") == "concentration_risk":
                    asset = risk.get("asset", "Unknown")
                    action_items.append({
                        "priority": "high",
                        "category": "portfolio",
                        "action": f"Consider rebalancing portfolio to reduce {asset} exposure",
                        "rationale": risk.get("message", "High concentration risk")
                    })
            
            opportunities = self.portfolio_data.get("opportunities", [])
            for opportunity in opportunities:
                if opportunity.get("type") == "staking":
                    asset = opportunity.get("asset", "Unknown")
                    action_items.append({
                        "priority": "medium",
                        "category": "portfolio",
                        "action": f"Stake {asset} for passive income",
                        "rationale": opportunity.get("message", "Staking opportunity")
                    })
        
        # Add bot-based actions
        if self.bot_data:
            top_picks = self.bot_data.get("top_picks", [])
            if top_picks:
                top_repo = top_picks[0]
                repo_name = top_repo.get("repository", "Unknown")
                action_items.append({
                    "priority": "medium",
                    "category": "automation",
                    "action": f"Test {repo_name} in a sandbox environment",
                    "rationale": f"Highest-rated trading bot with score {top_repo.get('overall_score', 0):.1f}/100"
                })
        
        # Sort action items by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        sorted_actions = sorted(
            action_items,
            key=lambda x: priority_order.get(x.get("priority", "low"), 3)
        )
        
        # Build action plan
        if not sorted_actions:
            return """## Action Plan

*No action items generated. Run more scans to get actionable recommendations.*"""
        
        action_plan = "## Action Plan\n\n"
        
        # Group by priority
        for priority in ["high", "medium", "low"]:
            priority_actions = [a for a in sorted_actions if a.get("priority") == priority]
            if priority_actions:
                action_plan += f"### {priority.title()} Priority\n\n"
                for i, action in enumerate(priority_actions, 1):
                    action_plan += f"{i}. **{action.get('action')}**\n"
                    action_plan += f"   - *Rationale:* {action.get('rationale')}\n"
                    action_plan += f"   - *Category:* {action.get('category', 'general').title()}\n\n"
        
        return action_plan
    
    def _generate_footer(self):
        """Generate playbook footer"""
        return f"""---

*This playbook was generated by Cash on {self.timestamp}. All recommendations should be reviewed and validated before implementation. Past performance is not indicative of future results.*"""


if __name__ == "__main__":
    # If run directly, generate a test playbook
    logging.basicConfig(level=logging.INFO)
    
    # Load test data
    import os
    
    # Test market data
    market_data = {
        "trending_coins": [
            {"name": "Bitcoin", "symbol": "BTC", "source": "coingecko", "score": 0.95},
            {"name": "Ethereum", "symbol": "ETH", "source": "coingecko", "score": 0.92},
            {"name": "Solana", "symbol": "SOL", "source": "coingecko", "score": 0.88}
        ],
        "market_sentiment": {
            "global": {
                "market_cap_change_percentage_24h_usd": 2.5,
                "total_market_cap": 2.5e12,
                "total_volume": 150e9
            }
        },
        "opportunities": [
            {
                "type": "trending_coin",
                "coin": "Solana",
                "symbol": "SOL",
                "sources": ["coingecko", "reddit", "twitter"],
                "confidence": 0.75
            }
        ],
        "warnings": [
            {
                "type": "negative_sentiment",
                "coin": "BTC",
                "source": "twitter",
                "message": "Bear market incoming. Protect your assets."
            }
        ]
    }
    
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
            },
            {
                "asset": "USDT",
                "balance": 10000,
                "value_usd": 10000,
                "price_usd": 1.0,
                "allocation_percentage": 10,
                "source": "binance"
            }
        ],
        "opportunities": [
            {
                "type": "staking",
                "asset": "ETH",
                "message": "Consider staking ETH for passive income"
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
    
    # Test bot data
    bot_data = {
        "top_picks": [
            {
                "repository": "freqtrade/freqtrade",
                "url": "https://github.com/freqtrade/freqtrade",
                "overall_score": 95.5,
                "recommendation": "Consider using freqtrade for its Python-based approach, making it easy to customize and integrate with our existing tools. With 39000 stars, it has a strong community and active development."
            },
            {
                "repository": "hummingbot/hummingbot",
                "url": "https://github.com/hummingbot/hummingbot",
                "overall_score": 88.2,
                "recommendation": "Consider using hummingbot for its market-making capabilities and support for both CEX and DEX trading. With 6800 stars, it has a solid community backing."
            }
        ],
        "security_concerns": []
    }
    
    # Generate playbook
    generator = PlaybookGenerator(market_data, portfolio_data, bot_data)
    playbook = generator.generate()
    
    # Print playbook
    print(playbook)
    
    # Save playbook to file
    with open("test_playbook.md", "w") as f:
        f.write(playbook)