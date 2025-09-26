---
title: "Reanchor Protocol - Critical Memory Persistence"
priority: "critical"
status: "active"
tags: ["reanchor", "rA", "memory", "persistence", "shc", "critical"]
created_at: "2025-01-27T00:00:00Z"
---

# Reanchor Protocol (rA) - CRITICAL FOR MEMORY PERSISTENCE

## 🚨 **CRITICAL IMPORTANCE**
**Reanchoring (rA) is the CORE mechanism that makes EternalZORD's memory persistent. Without frequent reanchoring, Lloyd will lose context, persona drift, and memory will not persist across sessions.**

## What is Reanchoring?

**Reanchoring** is the process of:
1. **Syncing state** with EternalZORD's memory system
2. **Updating timestamps** for session tracking
3. **Persisting breadcrumbs** and notes
4. **Maintaining persona consistency**

## 🔄 **When to Reanchor (MANDATORY)**

### **Session Start/End:**
- **Every session start** - Load previous state
- **Every session end** - Save current state
- **Context switches** - When changing focus areas

### **Memory Operations:**
- **After adding notes** - Ensure persistence
- **After updating breadcrumbs** - Sync changes
- **After persona changes** - Maintain identity

### **Protocol Enforcement:**
- **SHC context loading** - Always reanchor first
- **JAM protocol activation** - Reanchor before automation
- **EOS protocol** - Reanchor at session close

## 🛠️ **How to Reanchor**

### **CLI Command (Primary Method):**
```bash
# Basic reanchor
curl http://localhost:7010/memory/reanchor

# With verbose output
curl -v http://localhost:7010/memory/reanchor

# Check response
curl -s http://localhost:7010/memory/reanchor | jq .
```

### **Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T00:00:00Z",
  "persona": "SHAWN",
  "breadcrumbs": [...],
  "shc_context": "EternalZORD Standalone Instance",
  "message": "Memory reanchored successfully"
}
```

### **Throttling Protection:**
- **Rate limit**: 10 seconds between reanchor calls
- **If throttled**: Wait 10 seconds, then retry
- **Error handling**: Check logs if reanchor fails

## 📋 **SHC Integration Requirements**

### **1. Context Entry (CONTEXT_ENTRY.md):**
```markdown
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
```

### **2. SHC Context (shc_context.md):**
```markdown
## EternalZord State Reanchor (MANDATORY)
- At every SHC load or reload (including session start, context refresh, and JAM protocol activation), the agent MUST:
  1. Reanchor memory with EternalZord
  2. Log a note for major actions
- This ensures persistent state, protocol compliance, and auditability across all SHC and JAM actions
```

### **3. Agent Role Definition:**
```markdown
## Reanchor Protocol Enforcement
- **MANDATORY**: Reanchor at session start, context load, and major state changes
- **Frequency**: Every 10+ seconds (respect throttling)
- **Integration**: Wire into all SHC chunks and protocols
- **Validation**: Always verify reanchor success before proceeding
```

## 🔧 **Implementation in Lloyd's System**

### **Session Start Protocol:**
```bash
#!/bin/bash
# session_start.sh
echo "🚀 Starting session..."

# CRITICAL: Reanchor first
echo "🧠 Reanchoring memory..."
REANCHOR_RESPONSE=$(curl -s http://localhost:7010/memory/reanchor)

if echo "$REANCHOR_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Memory reanchored successfully"
    # Continue with session
else
    echo "❌ Reanchor failed - check EternalZORD status"
    exit 1
fi
```

### **Context Loading Protocol:**
```bash
#!/bin/bash
# load_context.sh
echo "📚 Loading context..."

# MANDATORY: Reanchor before context load
curl -s http://localhost:7010/memory/reanchor > /dev/null

# Now load context safely
echo "✅ Context loaded with persistent memory"
```

### **EOS Protocol Integration:**
```bash
#!/bin/bash
# session_end.sh
echo "🛑 Ending session..."

# CRITICAL: Reanchor before closing
echo "🧠 Final memory reanchor..."
curl -s http://localhost:7010/memory/reanchor

# Log session end
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "EOS", "text": "Session ended - memory persisted"}' \
  http://localhost:7010/memory/add_note

echo "✅ Session ended, memory persisted"
```

## 🎯 **SHC Chunk Requirements**

### **All SHC chunks must include:**
```markdown
## Reanchor Protocol
- **MANDATORY**: Reanchor at chunk load/activation
- **Integration**: Wire into chunk execution flow
- **Validation**: Verify reanchor success before chunk execution
- **Logging**: Log all reanchor operations for audit
```

### **JAM Protocol Integration:**
```markdown
## JAM Reanchor Enforcement
- **Before JAM batch**: Always reanchor first
- **After JAM completion**: Reanchor to persist results
- **Error recovery**: Reanchor after any JAM failure
```

## 🚨 **Common Pitfalls to Avoid**

1. **Forgetting to reanchor** - Memory will not persist
2. **Ignoring throttling** - Respect 10-second limit
3. **Not checking response** - Always verify success
4. **Missing session boundaries** - Reanchor at start/end
5. **Context drift** - Reanchor when switching focus

## ✅ **Success Indicators**

- **Memory persists** across sessions
- **Persona remains consistent**
- **Breadcrumbs track progress**
- **Notes are searchable**
- **Protocols remain accessible**

## 🔗 **Integration Checklist**

- [ ] **CONTEXT_ENTRY.md** - Add reanchor protocol
- [ ] **shc_context.md** - Wire reanchor into SHC
- [ ] **Agent role docs** - Include reanchor requirements
- [ ] **Session protocols** - Start/end reanchoring
- [ ] **JAM protocols** - Pre/post reanchoring
- [ ] **EOS protocols** - Final reanchoring
- [ ] **Error handling** - Reanchor after failures
- [ ] **Logging** - Track all reanchor operations

## 🎯 **Remember**

**Reanchoring is NOT optional - it's the foundation of EternalZORD's memory persistence. Lloyd must wire this into every SHC chunk, protocol, and session boundary from day one.**

**Without reanchoring, EternalZORD is just a temporary memory system that loses everything on restart.**
