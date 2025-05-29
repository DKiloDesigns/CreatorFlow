const { execSync } = require('child_process');

// Port to check and free
const PORT = 3001;

try {
  console.log(`Checking for processes using port ${PORT}...`);
  
  // Get processes using the port
  const findCommand = process.platform === 'win32'
    ? `netstat -ano | findstr :${PORT}`
    : `lsof -i :${PORT} -t`;
  
  let pids;
  try {
    pids = execSync(findCommand, { encoding: 'utf8' }).trim();
  } catch (e) {
    // No processes found, which is fine
    console.log(`No processes found using port ${PORT}.`);
    process.exit(0);
  }
  
  if (!pids) {
    console.log(`No processes found using port ${PORT}.`);
    process.exit(0);
  }
  
  // On non-Windows, lsof -t returns just the PIDs, one per line
  // On Windows, we need to extract the PIDs from netstat output
  if (process.platform === 'win32') {
    pids = pids
      .split('\n')
      .map(line => {
        const match = line.match(/\s+(\d+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
  } else {
    pids = pids.split('\n').filter(Boolean);
  }
  
  // Kill each process
  if (pids.length > 0) {
    console.log(`Found ${pids.length} process(es) using port ${PORT}. Terminating...`);
    
    pids.forEach(pid => {
      try {
        const killCommand = process.platform === 'win32'
          ? `taskkill /F /PID ${pid}`
          : `kill -9 ${pid}`;
        
        execSync(killCommand);
        console.log(`Successfully terminated process ${pid}`);
      } catch (e) {
        console.error(`Failed to terminate process ${pid}: ${e.message}`);
      }
    });
    
    console.log(`Port ${PORT} should now be free.`);
  }
} catch (error) {
  console.error(`Error checking/freeing port ${PORT}:`, error.message);
  process.exit(1);
}