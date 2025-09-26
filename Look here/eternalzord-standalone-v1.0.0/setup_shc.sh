#!/bin/bash

# EternalZORD Standalone - SHC Setup Script
# This script sets up the critical SHC directory structure and protocols

echo "🏗️  Setting up SHC directory structure for EternalZORD..."
echo "=========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "eternalzord/__init__.py" ]; then
    echo "❌ Error: This script must be run from the eternalzord-standalone directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Create SHC directories
echo "📁 Creating SHC directory structure..."
mkdir -p docs/shc
mkdir -p docs/_protocols
mkdir -p docs/_evergreen
mkdir -p docs/_ai_journals
mkdir -p docs/_kra

# Create core SHC files
echo "📝 Creating core SHC files..."

# CONTEXT_ENTRY.md
cat > docs/shc/CONTEXT_ENTRY.md << 'EOF'
# CONTEXT_ENTRY.md

## EternalZord State Reanchor (MANDATORY)
- At every SHC load or reload, the agent MUST:
  1. Reanchor memory with EternalZord:
     ```bash
     curl http://localhost:7010/memory/reanchor
     ```
  2. Log a note for major actions:
     ```bash
     curl -X POST -H "Content-Type: application/json" \
       -d '{"type": "SHC", "text": "[Action/Context]"}' \
       http://localhost:7010/memory/add_note
     ```

## Current Project Status
- **Project**: Lloyd's EternalZORD Instance
- **Status**: Active
- **P0**: Implement SHC protocols, wire reanchoring
- **Last Updated**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Core Services Required
- EternalZord (memory, protocol/artifact search, state management)

## Session History
- [Link to session summaries]
EOF

# shc_context.md
cat > docs/shc/shc_context.md << 'EOF'
# SHC Context Anchor (shc_context.md)

## EternalZord State Reanchor (MANDATORY)
- At every SHC load or reload (including session start, context refresh, and JAM protocol activation), the agent MUST:
  1. Reanchor memory with EternalZord
  2. Log a note for major actions
- This ensures persistent state, protocol compliance, and auditability across all SHC and JAM actions

## Protocol Registry
| Protocol/Chunk | Description | Link |
|----------------|-------------|------|
| Reanchor | Critical memory persistence protocol | ../data/protocols/reanchor_protocol.md |
| Session Start | SHC session initialization | ../data/protocols/session_start.md |
| Session End | SHC session termination | ../data/protocols/session_end.md |

## Current Project Status & P0
- **Project**: Lloyd's EternalZORD Instance
- **Status**: Active
- **P0**: Implement SHC protocols, wire reanchoring
EOF

# Create session management scripts
echo "⚡ Creating session management scripts..."

# session_start.sh
cat > session_start.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone - Session Start Script
# MUST BE RUN AT EVERY SESSION START

echo "🚀 Starting SHC Session..."

# STEP 1: Check EternalZORD health
echo "🏥 Checking EternalZORD health..."
HEALTH_CHECK=$(curl -s http://localhost:7010/health)

if ! echo "$HEALTH_CHECK" | grep -q '"status":"ok"'; then
    echo "❌ EternalZORD not healthy - starting service..."
    ./start_eternalzord.sh
    sleep 5
fi

# STEP 2: CRITICAL - Reanchor memory
echo "🧠 Reanchoring memory (MANDATORY)..."
REANCHOR_RESPONSE=$(curl -s http://localhost:7010/memory/reanchor)

if echo "$REANCHOR_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Memory reanchored successfully"
    
    # Extract persona and breadcrumbs
    PERSONA=$(echo "$REANCHOR_RESPONSE" | jq -r '.persona' 2>/dev/null || echo "UNKNOWN")
    BREADCRUMB_COUNT=$(echo "$REANCHOR_RESPONSE" | jq '.breadcrumbs | length' 2>/dev/null || echo "0")
    
    echo "👤 Persona: $PERSONA"
    echo "🍞 Breadcrumbs: $BREADCRUMB_COUNT"
else
    echo "❌ Reanchor failed - cannot continue"
    echo "Response: $REANCHOR_RESPONSE"
    exit 1
fi

# STEP 3: Load SHC context
echo "📚 Loading SHC context..."
curl -s http://localhost:7010/memory/state > /dev/null

# STEP 4: Log session start
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "SHC", "text": "Session started - SHC context loaded"}' \
  http://localhost:7010/memory/add_note

echo "🎉 SHC Session started successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Run load_context.sh to load context"
echo "   2. Start your work session"
echo "   3. Run session_end.sh when done"
EOF

# load_context.sh
cat > load_context.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone - Load Context Script
# MUST BE RUN BEFORE ANY CONTEXT OPERATIONS

echo "📚 Loading SHC Context..."

# ALWAYS reanchor first
echo "🧠 Reanchoring memory..."
curl -s http://localhost:7010/memory/reanchor > /dev/null

# Load state
echo "📊 Loading state..."
STATE=$(curl -s http://localhost:7010/memory/state)
if echo "$STATE" | grep -q '"schemaVersion"'; then
    SCHEMA_VERSION=$(echo "$STATE" | grep '"schemaVersion"' | head -1 | sed 's/.*"schemaVersion": *"\([^"]*\)".*/\1/')
    echo "✅ State loaded: $SCHEMA_VERSION"
else
    echo "⚠️  State format unexpected"
fi

# Load persona
echo "👤 Loading persona..."
PERSONA=$(curl -s http://localhost:7010/memory/persona)
if echo "$PERSONA" | grep -q '"persona"'; then
    PERSONA_NAME=$(echo "$PERSONA" | grep '"persona"' | head -1 | sed 's/.*"persona": *"\([^"]*\)".*/\1/')
    echo "✅ Persona: $PERSONA_NAME"
else
    echo "⚠️  Persona format unexpected"
fi

# Load breadcrumbs
echo "🍞 Loading breadcrumbs..."
BREADCRUMBS=$(curl -s http://localhost:7010/memory/reanchor | grep -o '"text":"[^"]*"' | sed 's/"text":"//g' | sed 's/"//g' | head -3)
if [ -n "$BREADCRUMBS" ]; then
    echo "✅ Recent breadcrumbs:"
    echo "$BREADCRUMBS" | while read -r crumb; do
        if [ -n "$crumb" ]; then
            echo "   - $crumb"
        fi
    done
else
    echo "⚠️  No breadcrumbs found"
fi

echo "✅ SHC Context loaded successfully"
EOF

# session_end.sh
cat > session_end.sh << 'EOF'
#!/bin/bash

# EternalZORD Standalone - Session End Script
# MUST BE RUN AT EVERY SESSION END

echo "🛑 Ending SHC Session..."

# CRITICAL: Final reanchor
echo "🧠 Final memory reanchor..."
REANCHOR_RESPONSE=$(curl -s http://localhost:7010/memory/reanchor)

if echo "$REANCHOR_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Final reanchor successful"
else
    echo "⚠️  Final reanchor failed - check logs"
fi

# Log session end
echo "📝 Logging session end..."
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "EOS", "text": "Session ended - SHC context persisted"}' \
  http://localhost:7010/memory/add_note

# Archive state
echo "📦 Archiving session state..."
ARCHIVE_RESPONSE=$(curl -s -X POST http://localhost:7010/memory/archive)

if echo "$ARCHIVE_RESPONSE" | grep -q '"status":"ok"'; then
    ARCHIVE_FILE=$(echo "$ARCHIVE_RESPONSE" | grep -o '"archive_file":"[^"]*"' | sed 's/"archive_file":"//g' | sed 's/"//g')
    echo "✅ State archived to: $ARCHIVE_FILE"
else
    echo "⚠️  Archive failed - check logs"
fi

echo "🎉 SHC Session ended successfully!"
echo ""
echo "📋 Session summary:"
echo "   - Memory reanchored and persisted"
echo "   - Session logged to EternalZORD"
echo "   - State archived for future reference"
EOF

# Make scripts executable
chmod +x session_start.sh load_context.sh session_end.sh

echo ""
echo "✅ SHC Setup Complete!"
echo "====================="
echo ""
echo "📁 Created directories:"
echo "   - docs/shc/ (SHC core files)"
echo "   - docs/_protocols/ (Protocol definitions)"
echo "   - docs/_evergreen/ (Evergreen content)"
echo "   - docs/_ai_journals/ (AI journal entries)"
echo "   - docs/_kra/ (Knowledge request analysis)"
echo ""
echo "📝 Created core files:"
echo "   - docs/shc/CONTEXT_ENTRY.md (Root context)"
echo "   - docs/shc/shc_context.md (Core context)"
echo ""
echo "⚡ Created session scripts:"
echo "   - session_start.sh (Session initialization)"
echo "   - load_context.sh (Context loading)"
echo "   - session_end.sh (Session termination)"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start EternalZORD: ./start_eternalzord.sh"
echo "   2. Initialize SHC: ./session_start.sh"
echo "   3. Load context: ./load_context.sh"
echo "   4. Start working!"
echo "   5. End session: ./session_end.sh"
echo ""
echo "🎯 CRITICAL: Always run session_start.sh at session start and session_end.sh at session end!"
echo "   This ensures memory persistence and proper SHC operation."
echo ""
echo "📖 Read the protocols in data/protocols/ for detailed information"
