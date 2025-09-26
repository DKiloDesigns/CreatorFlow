#!/bin/bash

# EternalZORD Standalone - Super Simple Installation
# Just drop this package in your main directory and run this script!

echo "🚀 EternalZORD Standalone Installation"
echo "======================================"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    echo "   Download from: https://www.python.org/downloads/"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "✅ Python $PYTHON_VERSION detected"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv eternalzord_env

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source eternalzord_env/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create data and log directories
echo "📁 Creating data directories..."
mkdir -p data/{artifacts,protocols,knowledge,docs}
mkdir -p logs

# Create startup script
echo "⚡ Creating startup script..."
cat > start_eternalzord.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone Startup Script
echo "🚀 Starting EternalZORD Standalone..."

# Activate virtual environment
source eternalzord_env/bin/activate

# Start EternalZORD
python -m eternalzord.eternal_zord --port 7010

echo "✅ EternalZORD started on http://localhost:7010"
echo "📊 Health check: http://localhost:7010/health"
echo "🧠 Memory reanchor: http://localhost:7010/memory/reanchor"
EOF

chmod +x start_eternalzord.sh

# Create stop script
echo "🛑 Creating stop script..."
cat > stop_eternalzord.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone Stop Script
echo "🛑 Stopping EternalZORD..."

# Find and kill EternalZORD process
pkill -f "eternal_zord"

echo "✅ EternalZORD stopped"
EOF

chmod +x stop_eternalzord.sh

# Create test script
echo "🧪 Creating test script..."
cat > test_eternalzord.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone Test Script
echo "🧪 Testing EternalZORD..."

# Activate virtual environment
source eternalzord_env/bin/activate

# Test the installation
python -c "
from eternalzord.eternal_zord import EternalZord
ez = EternalZord()
print('✅ EternalZORD import successful')
print(f'📁 Data directory: {ez.data_dir}')
print(f'📝 Log directory: {ez.log_dir}')
"

echo "✅ Test completed successfully!"
EOF

chmod +x test_eternalzord.sh

# Create README
echo "📖 Creating README..."
cat > README.md << 'EOF'
# EternalZORD Standalone

A standalone memory and knowledge management system for AI agents.

## 🚀 Quick Start

1. **Start EternalZORD:**
   ```bash
   ./start_eternalzord.sh
   ```

2. **Stop EternalZORD:**
   ```bash
   ./stop_eternalzord.sh
   ```

3. **Test Installation:**
   ```bash
   ./test_eternalzord.sh
   ```

## 🌐 API Endpoints

- **Health Check:** http://localhost:7010/health
- **Memory Reanchor:** http://localhost:7010/memory/reanchor
- **Session Info:** http://localhost:7010/session/info
- **Memory Search:** http://localhost:7010/memory/search?q=your_query
- **Add Note:** POST http://localhost:7010/memory/add_note

## 📁 Directory Structure

```
eternalzord-standalone/
├── eternalzord/           # Core package
├── data/                  # Data storage
│   ├── artifacts/         # Artifacts and documents
│   ├── protocols/         # Protocol definitions
│   ├── knowledge/         # Knowledge base
│   └── docs/             # Documentation
├── logs/                  # Log files
├── eternalzord_env/       # Python virtual environment
├── start_eternalzord.sh   # Startup script
├── stop_eternalzord.sh    # Stop script
└── test_eternalzord.sh    # Test script
```

## 🔧 Configuration

Environment variables (optional):
- `EZ_DATA_DIR`: Custom data directory path
- `EZ_LOG_DIR`: Custom log directory path
- `EZ_PORT`: Custom port (default: 7010)

## 📚 Usage Examples

### Memory Reanchor
```bash
curl http://localhost:7010/memory/reanchor
```

### Add Note
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "TEST", "text": "Hello EternalZORD!"}' \
  http://localhost:7010/memory/add_note
```

### Search Memory
```bash
curl "http://localhost:7010/memory/search?q=protocol"
```

## 🆘 Troubleshooting

- **Port already in use:** Change port with `--port 7011` in start script
- **Permission denied:** Make scripts executable with `chmod +x *.sh`
- **Python not found:** Ensure Python 3.8+ is installed and in PATH

## 🔗 More Information

- **Health Check:** Always check `/health` first
- **Logs:** Check `logs/eternalzord.log` for detailed information
- **Data:** All data is stored in the `data/` directory
EOF

echo ""
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "✅ EternalZORD Standalone is ready to use!"
echo ""
echo "🚀 To start: ./start_eternalzord.sh"
echo "🛑 To stop:  ./stop_eternalzord.sh"
echo "🧪 To test:  ./test_eternalzord.sh"
echo ""
echo "📖 Read README.md for full documentation"
echo "🌐 Service will run on: http://localhost:7010"
echo ""
echo "🎯 Lloyd can now run: ./start_eternalzord.sh"
echo ""
