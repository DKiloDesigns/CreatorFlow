const readline = require('readline');

function promptReflection(cb) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Session reflection/Den note (optional): ', answer => {
    rl.close();
    cb(answer);
  });
}

promptReflection(reflection => {
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

## Session Reflection / Den Note
${reflection || '_None provided_'}
`;
  fs.writeFileSync(logFile, md, 'utf8');
  console.log(`Session log written to ${logFile}`);
}); 