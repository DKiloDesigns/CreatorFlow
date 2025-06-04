#!/bin/bash
# Run Cash Daily Workflow

# Change to script directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import requests" &> /dev/null; then
    echo "Installing required packages..."
    pip3 install requests
fi

# Create directories if they don't exist
mkdir -p results logs

# Parse arguments
FULL=false
MARKET_ONLY=false
PORTFOLIO_ONLY=false
BOTS_ONLY=false

if [ $# -eq 0 ]; then
    FULL=true
else
    for arg in "$@"; do
        case $arg in
            --full)
                FULL=true
                ;;
            --market-only)
                MARKET_ONLY=true
                ;;
            --portfolio-only)
                PORTFOLIO_ONLY=true
                ;;
            --bots-only)
                BOTS_ONLY=true
                ;;
            *)
                echo "Unknown option: $arg"
                echo "Usage: $0 [--full] [--market-only] [--portfolio-only] [--bots-only]"
                exit 1
                ;;
        esac
    done
fi

# Build command
CMD="python3 cash_daily.py"
if [ "$FULL" = true ]; then
    CMD="$CMD --full"
fi
if [ "$MARKET_ONLY" = true ]; then
    CMD="$CMD --market-only"
fi
if [ "$PORTFOLIO_ONLY" = true ]; then
    CMD="$CMD --portfolio-only"
fi
if [ "$BOTS_ONLY" = true ]; then
    CMD="$CMD --bots-only"
fi

# Run Cash daily workflow
echo "Running Cash daily workflow..."
echo "Command: $CMD"
eval $CMD

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Cash daily workflow completed successfully."
    
    # Find the latest playbook
    LATEST_PLAYBOOK=$(ls -t results/playbook_*.md 2>/dev/null | head -n 1)
    
    # Display the playbook if it exists
    if [ -n "$LATEST_PLAYBOOK" ]; then
        echo ""
        echo "Latest playbook: $LATEST_PLAYBOOK"
        echo ""
        echo "To view the playbook, run:"
        echo "cat $LATEST_PLAYBOOK"
    fi
else
    echo "Cash daily workflow failed."
fi#!/bin/bash
# Run Cash Daily Workflow

# Change to script directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import requests" &> /dev/null; then
    echo "Installing required packages..."
    pip3 install requests
fi

# Create directories if they don't exist
mkdir -p results logs

# Parse arguments
FULL=false
MARKET_ONLY=false
PORTFOLIO_ONLY=false
BOTS_ONLY=false

if [ $# -eq 0 ]; then
    FULL=true
else
    for arg in "$@"; do
        case $arg in
            --full)
                FULL=true
                ;;
            --market-only)
                MARKET_ONLY=true
                ;;
            --portfolio-only)
                PORTFOLIO_ONLY=true
                ;;
            --bots-only)
                BOTS_ONLY=true
                ;;
            *)
                echo "Unknown option: $arg"
                echo "Usage: $0 [--full] [--market-only] [--portfolio-only] [--bots-only]"
                exit 1
                ;;
        esac
    done
fi

# Build command
CMD="python3 cash_daily.py"
if [ "$FULL" = true ]; then
    CMD="$CMD --full"
fi
if [ "$MARKET_ONLY" = true ]; then
    CMD="$CMD --market-only"
fi
if [ "$PORTFOLIO_ONLY" = true ]; then
    CMD="$CMD --portfolio-only"
fi
if [ "$BOTS_ONLY" = true ]; then
    CMD="$CMD --bots-only"
fi

# Run Cash daily workflow
echo "Running Cash daily workflow..."
echo "Command: $CMD"
eval $CMD

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Cash daily workflow completed successfully."
    
    # Find the latest playbook
    LATEST_PLAYBOOK=$(ls -t results/playbook_*.md 2>/dev/null | head -n 1)
    
    # Display the playbook if it exists
    if [ -n "$LATEST_PLAYBOOK" ]; then
        echo ""
        echo "Latest playbook: $LATEST_PLAYBOOK"
        echo ""
        echo "To view the playbook, run:"
        echo "cat $LATEST_PLAYBOOK"
    fi
else
    echo "Cash daily workflow failed."
fi