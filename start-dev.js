const { spawn } = require('child_process');
const path = require('path');

// Start the TikTok server
console.log('Starting TikTok server...');
const serverPath = path.join(__dirname, 'server');
const serverProcess = spawn('node', ['start.js'], {
  cwd: serverPath,
  stdio: 'inherit',
  shell: true
});

// Start the Next.js app
console.log('Starting Next.js app...');
const nextProcess = spawn('pnpm', ['dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  serverProcess.kill();
  nextProcess.kill();
  process.exit();
});

// Log errors
serverProcess.on('error', (error) => {
  console.error('Server process error:', error);
});

nextProcess.on('error', (error) => {
  console.error('Next.js process error:', error);
});

console.log('Development environment started!');
console.log('Press Ctrl+C to stop both servers.'); 