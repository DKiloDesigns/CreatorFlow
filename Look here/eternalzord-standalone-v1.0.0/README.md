# EternalZORD Standalone

🚀 **A standalone memory and knowledge management system for AI agents**

## What is EternalZORD?

EternalZORD is your personal JARVIS memory system - a standalone service that provides:
- **Persistent Memory**: Store notes, breadcrumbs, and session history
- **Protocol Management**: Organize workflows and procedures
- **Artifact Storage**: Keep documents and knowledge searchable
- **API-First Design**: Easy integration with any application

## 🚀 Super Simple Installation

### For macOS/Linux:
```bash
# Just run this one command!
./install.sh
```

### For Windows:
```bash
# Just run this one command!
install.bat
```

## 🚨 **CRITICAL: SHC Integration Required**

**After installation, Lloyd MUST run the SHC setup to enable memory persistence:**

```bash
# Set up SHC protocols (CRITICAL for memory persistence)
./setup_shc.sh

# Start EternalZORD
./start_eternalzord.sh

# Initialize SHC session (MANDATORY at every session start)
./session_start.sh

# Load context before working
./load_context.sh

# Start periodic reanchoring (CRITICAL to prevent agent drift)
./periodic_reanchor.sh start

# End session when done (MANDATORY at every session end)
./session_end.sh

# Stop periodic reanchoring
./periodic_reanchor.sh stop
```

**Without SHC integration, EternalZORD will lose all memory on restart!**

## ⏰ **Periodic Reanchoring - Prevent Agent Drift**

**Reanchoring isn't just session boundaries - it's continuous memory maintenance:**

- **Every 30 minutes** during work sessions (default)
- **Every 15 minutes** during intensive work
- **Automated background daemon** prevents forgetting
- **Prevents context loss** and persona drift

```bash
# Start 30-minute periodic reanchoring (default)
./periodic_reanchor.sh start

# Start 15-minute periodic reanchoring (intensive work)
REANCHOR_INTERVAL=900 ./periodic_reanchor.sh start

# Check daemon status
./periodic_reanchor.sh status

# Stop daemon
./periodic_reanchor.sh stop
```

That's it! The script will:
1. ✅ Check Python installation
2. ✅ Create virtual environment
3. ✅ Install dependencies
4. ✅ Set up data directories
5. ✅ Create startup scripts

## 🎯 Quick Start

1. **Start EternalZORD:**
   ```bash
   ./start_eternalzord.sh  # macOS/Linux
   start_eternalzord.bat   # Windows
   ```

2. **Test it works:**
   ```bash
   curl http://localhost:7010/health
   ```

3. **Start using it:**
   ```bash
   # Add a note
   curl -X POST -H "Content-Type: application/json" \
     -d '{"type": "IDEA", "text": "Great idea!"}' \
     http://localhost:7010/memory/add_note
   ```

## 🌐 API Endpoints

- **Health Check:** `GET /health`
- **Memory Reanchor:** `GET/POST /memory/reanchor`
- **Session Info:** `GET /session/info`
- **Memory Search:** `GET /memory/search?q=query`
- **Add Note:** `POST /memory/add_note`
- **Memory State:** `GET /memory/state`
- **Memory Archive:** `POST /memory/archive`

## 📁 What You Get

```
eternalzord-standalone/
├── eternalzord/           # Core package
├── data/                  # Your data storage
│   ├── artifacts/         # Documents and files
│   ├── protocols/         # Workflow definitions
│   ├── knowledge/         # Knowledge base
│   └── docs/             # Documentation
├── logs/                  # Log files
├── eternalzord_env/       # Python environment
├── start_eternalzord.sh   # Start script
├── stop_eternalzord.sh    # Stop script
└── test_eternalzord.sh    # Test script
```

## 🔧 Configuration

Environment variables (optional):
- `EZ_DATA_DIR`: Custom data directory
- `EZ_LOG_DIR`: Custom log directory
- `EZ_PORT`: Custom port (default: 7010)

## 📚 Use Cases

- **Personal Knowledge Base**: Store ideas, notes, and research
- **Workflow Management**: Define and track protocols
- **Document Organization**: Keep files searchable and organized
- **AI Agent Foundation**: Build your own AI assistant on top
- **Session Memory**: Remember what you were working on

## 🆘 Troubleshooting

- **Port already in use:** Change port in start script
- **Permission denied:** Make scripts executable with `chmod +x *.sh`
- **Python not found:** Install Python 3.8+ from python.org

## 🎯 Why This Matters

EternalZORD gives you the same memory capabilities as Iron Man's JARVIS:
- **Never lose information** - Everything is persistent
- **Find anything instantly** - Powerful search capabilities
- **Organize your thoughts** - Structured knowledge management
- **Build on top** - Ready for AI integration

## 🚀 Ready to Launch?

1. **Download the package**
2. **Extract to your directory**
3. **Run the install script**
4. **Start using EternalZORD!**

Welcome to the future of personal knowledge management! 🎉

---

**Built with ❤️ by Project Moonshot**
