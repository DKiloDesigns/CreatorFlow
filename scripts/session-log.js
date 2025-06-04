#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const statePath = path.resolve(__dirname, '../../dfai_state.json');
const logsDir = path.resolve(__dirname, '../../logs');
const now = new Date();
const dateStr = now.toISOString().slice(0, 10);
const logFile = path.join(logsDir, `session-${dateStr}.md`);

if (!fs.existsSync(statePath)) {
  console.error('No dfai_state.json found.');
  process.exit(1);
}
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const op = state.operationalContext || {};

const md = `# Session Log - ${dateStr}

**User:** ${state.userIdentity?.userFirstName || ''} ${state.userIdentity?.userLastName || ''}
**Agent:** ${state.agentPersona}
**Project:** ${state.currentProject?.projectName}

## Key Actions
${(op.recentLogs || []).map(log => `- ${log}`).join('\n')}

## State & Roadmap Changes
- Current Task: ${op.currentTask}
- Next Task: ${op.nextTask}
- User State: ${op.lastPerceivedUserState || ''}
- Assessment: ${op.lastAssessmentTakeaways || ''}

## Continuity Anchor
- Resume here next session: ${op.nextTask}
`;

fs.writeFileSync(logFile, md, 'utf8');
console.log(`Session log written to ${logFile}`); 