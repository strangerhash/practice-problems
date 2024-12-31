const { spawn } = require('child_process');

// Determine the platform
const command = process.platform === 'win32' ? 'dir' : 'ls';
const args = process.platform === 'win32' ? [''] : ['.'];

const ls = spawn(command, args, { shell: true });

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
