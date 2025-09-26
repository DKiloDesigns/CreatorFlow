---
title: "Demo Protocol - Getting Started with EternalZORD"
priority: "high"
status: "active"
tags: ["demo", "getting-started", "tutorial"]
created_at: "2025-01-27T00:00:00Z"
---

# Demo Protocol - Getting Started with EternalZORD

## Overview
This is a demo protocol to show you what EternalZORD can do! EternalZORD is your personal memory and knowledge management system.

## What You Can Do

### 1. Memory Management
- **Store Notes**: Add notes about your work, ideas, or anything important
- **Track Progress**: Keep breadcrumbs of what you've accomplished
- **Session History**: Remember what you were working on across sessions

### 2. Protocol Management
- **Create Protocols**: Define workflows and procedures
- **Search Protocols**: Find relevant protocols by keyword or tags
- **Organize Knowledge**: Keep your knowledge base structured and searchable

### 3. Artifact Management
- **Store Documents**: Keep markdown files, notes, and documentation
- **Search Content**: Find information quickly using semantic search
- **Organize Files**: Categorize artifacts by type and purpose

## Quick Examples

### Add a Note
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "IDEA", "text": "Great idea for a new project!"}' \
  http://localhost:7010/memory/add_note
```

### Search for Content
```bash
curl "http://localhost:7010/memory/search?q=project"
```

### Check Health
```bash
curl http://localhost:7010/health
```

## Next Steps
1. **Explore the API**: Try the endpoints above
2. **Add Your Own Protocols**: Create protocols for your workflows
3. **Store Your Knowledge**: Add documents and notes
4. **Build Your Memory**: Let EternalZORD remember everything for you

## Why This Matters
EternalZORD gives you:
- **Persistent Memory**: Never lose important information
- **Structured Knowledge**: Organize your thoughts and workflows
- **Searchable Content**: Find what you need instantly
- **Personal AI Ready**: Build your own AI assistant on top of this foundation

Welcome to the future of personal knowledge management! 🚀
