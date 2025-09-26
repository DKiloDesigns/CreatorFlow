#!/bin/bash

# EternalZORD Standalone - Periodic Reanchor Daemon
# Run this in background during work sessions to prevent agent drift

# Configuration
REANCHOR_INTERVAL=${REANCHOR_INTERVAL:-1800}  # Default: 30 minutes (1800 seconds)
LOG_FILE="logs/periodic_reanchor.log"
PID_FILE="pids/periodic_reanchor.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure log and pid directories exist
mkdir -p logs
mkdir -p pids

# Function to log messages
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $timestamp: $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $timestamp: $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $timestamp: $message"
            ;;
        "DEBUG")
            echo -e "${BLUE}[DEBUG]${NC} $timestamp: $message"
            ;;
    esac
    
    # Also log to file
    echo "[$level] $timestamp: $message" >> "$LOG_FILE"
}

# Function to check EternalZORD health
check_eternalzord_health() {
    local health_response=$(curl -s http://localhost:7010/health 2>/dev/null)
    
    if echo "$health_response" | grep -q '"status":"ok"'; then
        return 0  # Healthy
    else
        return 1  # Unhealthy
    fi
}

# Function to perform reanchor
perform_reanchor() {
    local attempt="$1"
    
    log_message "INFO" "🧠 Periodic reanchor attempt $attempt"
    
    # Check EternalZORD health first
    if ! check_eternalzord_health; then
        log_message "ERROR" "❌ EternalZORD not healthy - cannot reanchor"
        return 1
    fi
    
    # Perform reanchor
    local reanchor_response=$(curl -s http://localhost:7010/memory/reanchor)
    
    if echo "$reanchor_response" | grep -q '"status":"ok"'; then
        log_message "INFO" "✅ Reanchor successful"
        
        # Extract useful information
        local persona=$(echo "$reanchor_response" | grep -o '"persona":"[^"]*"' | sed 's/"persona":"//g' | sed 's/"//g' || echo "UNKNOWN")
        local breadcrumb_count=$(echo "$reanchor_response" | grep -o '"breadcrumbs":\[[^]]*\]' | grep -o '\[.*\]' | jq 'length' 2>/dev/null || echo "0")
        
        log_message "INFO" "👤 Persona: $persona"
        log_message "INFO" "🍞 Breadcrumbs: $breadcrumb_count"
        
        # Log the maintenance to EternalZORD
        local maintenance_note="Periodic reanchor - $(date '+%Y-%m-%d %H:%M:%S') - Persona: $persona, Breadcrumbs: $breadcrumb_count"
        curl -s -X POST -H "Content-Type: application/json" \
          -d "{\"type\": \"MAINTENANCE\", \"text\": \"$maintenance_note\"}" \
          http://localhost:7010/memory/add_note > /dev/null
        
        return 0
    else
        log_message "ERROR" "❌ Reanchor failed"
        log_message "DEBUG" "Response: $reanchor_response"
        return 1
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}🔄 EternalZORD Periodic Reanchor Daemon Status${NC}"
    echo "=================================================="
    echo ""
    
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Daemon is RUNNING (PID: $pid)${NC}"
            echo "📊 Reanchor interval: $REANCHOR_INTERVAL seconds ($(($REANCHOR_INTERVAL / 60)) minutes)"
            echo "📝 Log file: $LOG_FILE"
            echo "🆔 PID file: $PID_FILE"
            
            # Show recent log entries
            if [ -f "$LOG_FILE" ]; then
                echo ""
                echo "📋 Recent activity:"
                tail -5 "$LOG_FILE" | while read -r line; do
                    echo "   $line"
                done
            fi
        else
            echo -e "${RED}❌ Daemon PID file exists but process is not running${NC}"
            echo "   Cleaning up stale PID file..."
            rm -f "$PID_FILE"
        fi
    else
        echo -e "${YELLOW}⚠️  Daemon is NOT running${NC}"
        echo "   Start with: ./periodic_reanchor.sh start"
    fi
}

# Function to start daemon
start_daemon() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_message "WARN" "Daemon already running (PID: $pid)"
            return 1
        else
            log_message "WARN" "Stale PID file found, removing..."
            rm -f "$PID_FILE"
        fi
    fi
    
    log_message "INFO" "🚀 Starting periodic reanchor daemon..."
    log_message "INFO" "⏰ Reanchor interval: $REANCHOR_INTERVAL seconds ($(($REANCHOR_INTERVAL / 60)) minutes)"
    
    # Start daemon in background
    (
        # Main daemon loop
        local attempt=1
        
        while true; do
            log_message "INFO" "🔄 Daemon cycle $attempt started"
            
            # Perform reanchor
            if perform_reanchor "$attempt"; then
                log_message "INFO" "✅ Cycle $attempt completed successfully"
            else
                log_message "WARN" "⚠️  Cycle $attempt had issues"
            fi
            
            # Wait for next cycle
            log_message "INFO" "⏰ Next reanchor in $(($REANCHOR_INTERVAL / 60)) minutes..."
            sleep "$REANCHOR_INTERVAL"
            
            ((attempt++))
        done
    ) &
    
    local daemon_pid=$!
    echo "$daemon_pid" > "$PID_FILE"
    
    log_message "INFO" "✅ Daemon started successfully (PID: $daemon_pid)"
    log_message "INFO" "📝 PID saved to: $PID_FILE"
    log_message "INFO" "📊 Monitor with: ./periodic_reanchor.sh status"
    log_message "INFO" "🛑 Stop with: ./periodic_reanchor.sh stop"
}

# Function to stop daemon
stop_daemon() {
    if [ ! -f "$PID_FILE" ]; then
        log_message "WARN" "No PID file found - daemon not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    
    if ps -p "$pid" > /dev/null 2>&1; then
        log_message "INFO" "🛑 Stopping daemon (PID: $pid)..."
        kill "$pid"
        
        # Wait for graceful shutdown
        local count=0
        while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            ((count++))
        done
        
        if ps -p "$pid" > /dev/null 2>&1; then
            log_message "WARN" "⚠️  Daemon not responding, force killing..."
            kill -9 "$pid"
        fi
        
        rm -f "$PID_FILE"
        log_message "INFO" "✅ Daemon stopped successfully"
    else
        log_message "WARN" "⚠️  PID file exists but process not running"
        rm -f "$PID_FILE"
    fi
}

# Function to restart daemon
restart_daemon() {
    log_message "INFO" "🔄 Restarting daemon..."
    stop_daemon
    sleep 2
    start_daemon
}

# Function to show help
show_help() {
    echo -e "${BLUE}🔄 EternalZORD Periodic Reanchor Daemon${NC}"
    echo "=============================================="
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the periodic reanchor daemon"
    echo "  stop      Stop the daemon"
    echo "  restart   Restart the daemon"
    echo "  status    Show daemon status"
    echo "  help      Show this help message"
    echo ""
    echo "Configuration:"
    echo "  REANCHOR_INTERVAL  Reanchor interval in seconds (default: 1800 = 30 min)"
    echo ""
    echo "Examples:"
    echo "  ./periodic_reanchor.sh start                    # Start with default 30min interval"
    echo "  REANCHOR_INTERVAL=900 ./periodic_reanchor.sh start  # Start with 15min interval"
    echo "  ./periodic_reanchor.sh status                   # Check status"
    echo "  ./periodic_reanchor.sh stop                     # Stop daemon"
    echo ""
    echo "Background Operation:"
    echo "  The daemon runs in the background and automatically reanchors"
    echo "  EternalZORD memory at the specified interval to prevent agent drift."
    echo ""
    echo "Logs:"
    echo "  All activity is logged to: $LOG_FILE"
    echo "  Monitor with: tail -f $LOG_FILE"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_daemon
        ;;
    "stop")
        stop_daemon
        ;;
    "restart")
        restart_daemon
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
