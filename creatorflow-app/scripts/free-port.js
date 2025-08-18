import { execSync } from 'child_process';

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
    console.log(`Port ${PORT} is available.`);
    process.exit(0);
  }
  
  if (!pids) {
    console.log(`Port ${PORT} is available.`);
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
  
  // Only kill if there are actually processes using the port
  if (pids.length > 0) {
    console.log(`Found ${pids.length} process(es) using port ${PORT}.`);
    
    // Check if any of these are Next.js dev servers
    const hasNextDev = pids.some(pid => {
      try {
        const cmd = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf8' });
        return cmd.includes('next dev') || cmd.includes('next');
      } catch (e) {
        return false;
      }
    });
    
    if (hasNextDev) {
      console.log(`Port ${PORT} is in use by Next.js. Using next available port.`);
      process.exit(0);
    }
    
    // Only kill non-Next.js processes
    console.log(`Terminating non-Next.js processes on port ${PORT}...`);
    
    pids.forEach(pid => {
      try {
        const cmd = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf8' });
        if (!cmd.includes('next')) {
          const killCommand = process.platform === 'win32'
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;
          
          execSync(killCommand);
          console.log(`Terminated process ${pid}`);
        }
      } catch (e) {
        // Process might have already ended
      }
    });
    
    console.log(`Port ${PORT} should now be available.`);
  }
} catch (error) {
  console.error(`Error checking port ${PORT}:`, error.message);
  process.exit(1);
}