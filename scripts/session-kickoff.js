#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');

const statePath = path.resolve(__dirname, '../../dfai_state.json');

function checkServer(cb) {
  const req = http.request({ hostname: 'localhost', port: 3001, path: '/', method: 'GET', timeout: 2000 }, res => {
    cb(res.statusCode === 200);
  });
  req.on('error', () => cb(false));
  req.end();
}

function printState() {
  if (!fs.existsSync(statePath)) {
    console.log('No dfai_state.json found.');
    return;
  }
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const op = state.operationalContext || {};
  console.log('--- Session Kickoff ---');
  console.log(`User: ${state.userIdentity?.userFirstName || ''} ${state.userIdentity?.userLastName || ''}`);
  console.log(`Agent: ${state.agentPersona}`);
  console.log(`Project: ${state.currentProject?.projectName}`);
  console.log(`Current Task: ${op.currentTask}`);
  console.log(`Next Task: ${op.nextTask}`);
  if (op.lastPerceivedUserState) console.log(`User State: ${op.lastPerceivedUserState}`);
  if (op.lastAssessmentTakeaways) console.log(`Assessment: ${op.lastAssessmentTakeaways}`);
  if (op.recentLogs && op.recentLogs.length) {
    console.log('Recent Logs:');
    op.recentLogs.slice(-3).forEach(log => console.log(`- ${log}`));
  }
  console.log('-----------------------');
}

checkServer(running => {
  if (running) {
    console.log('Dev server is running on http://localhost:3001');
  } else {
    console.log('WARNING: Dev server is NOT running on http://localhost:3001');
  }
  printState();
}); 