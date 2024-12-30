# practice-problems
Here are some **practice questions** on **Child Processes**, **Cluster**, and **Worker Threads** to help you strengthen your understanding of these concepts in Node.js:

---

### **Child Process**

1. **Basic Concepts:**
   - What are the different methods provided by the `child_process` module in Node.js? Explain each with an example.
   - How do you handle communication between a parent process and a child process in Node.js?

   ** Answers:**
   ### **1. Methods Provided by the `child_process` Module in Node.js**

The `child_process` module in Node.js allows you to spawn child processes and execute external commands or scripts. It provides four primary methods:

---

#### **1.1. spawn()**

- **Description**: Spawns a new process to run a command. It’s used for long-running processes and streams data between the parent and child.
- **Returns**: An instance of `ChildProcess`.

**Example:**
```javascript
const { spawn } = require('child_process');

// Spawn a child process to run the `ls` command
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

ls.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
```

---

#### **1.2. exec()**

- **Description**: Executes a shell command and buffers the output. It’s suitable for commands where you don’t expect streaming data.
- **Returns**: A `ChildProcess` object.

**Example:**
```javascript
const { exec } = require('child_process');

// Execute a shell command
exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
```

---

#### **1.3. execFile()**

- **Description**: Executes a file directly without spawning a shell, making it more secure and efficient than `exec` for specific programs or scripts.
- **Returns**: A `ChildProcess` object.

**Example:**
```javascript
const { execFile } = require('child_process');

// Execute a script file directly
execFile('node', ['-v'], (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Node.js Version: ${stdout}`);
});
```

---

#### **1.4. fork()**

- **Description**: Spawns a new Node.js process to run a specified module. It is specifically designed for spawning child processes to run Node.js scripts and includes built-in IPC (Inter-Process Communication) for messaging.
- **Returns**: A `ChildProcess` object.

**Example:**
Parent script:
```javascript
const { fork } = require('child_process');

// Fork a child process to execute a Node.js script
const child = fork('./child.js');

// Send a message to the child process
child.send({ task: 'start' });

child.on('message', (message) => {
  console.log(`Message from child: ${message}`);
});
```

Child script (`child.js`):
```javascript
process.on('message', (message) => {
  console.log(`Message from parent: ${JSON.stringify(message)}`);
  process.send('Task completed');
});
```

---

### **2. Handling Communication Between Parent and Child Processes**

#### **Communication Mechanisms:**

1. **Using IPC (Inter-Process Communication):**
   - Available with `fork()` and allows parent and child processes to communicate via `send()` and `on('message')`.

**Example (Using `fork`):**
Parent:
```javascript
const { fork } = require('child_process');

const child = fork('./child.js');
child.send({ action: 'compute', number: 5 });

child.on('message', (result) => {
  console.log(`Result from child: ${result}`);
});
```

Child (`child.js`):
```javascript
process.on('message', (msg) => {
  if (msg.action === 'compute') {
    const result = msg.number * 2; // Example computation
    process.send(result);
  }
});
```

2. **Using Standard I/O Streams:**
   - Child processes communicate with the parent via `stdin`, `stdout`, and `stderr`.

**Example (Using `spawn`):**
```javascript
const { spawn } = require('child_process');

// Spawn a child process to run a command
const child = spawn('node', ['-e', 'console.log("Hello, parent!");']);

child.stdout.on('data', (data) => {
  console.log(`Message from child: ${data.toString()}`);
});

child.stderr.on('data', (data) => {
  console.error(`Error: ${data.toString()}`);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
```

3. **Using Shared Resources:**
   - Shared files, databases, or message queues can also be used for communication when IPC is not sufficient.

---

### **Summary**

- **spawn()**: For long-running tasks with streaming data (e.g., running commands with large outputs).
- **exec()**: For running shell commands with buffered output.
- **execFile()**: For executing a specific file without a shell.
- **fork()**: For spawning Node.js processes with built-in IPC.
- **Communication**:
  - Use `send()` and `on('message')` for direct IPC with `fork`.
  - Use `stdin`, `stdout`, and `stderr` for communicating with spawned child processes.

2. **Practical Tasks:**
   - Write a Node.js script to spawn a child process that runs a shell command (e.g., `ls` or `dir`).
   - Implement a Node.js program that spawns a child process to execute a Python script and logs the output.
   - Create a parent process that spawns multiple child processes to calculate the factorial of different numbers concurrently.

3. **Error Handling:**
   - How can you handle errors in a spawned child process? Write code to demonstrate this.

4. **Advanced:**
   - Compare the use of `exec`, `spawn`, and `fork`. When should you use each? Provide examples.
   - Implement a multi-tasking system where the parent process distributes tasks among several child processes and collects the results.

---

### **Cluster**

1. **Basic Concepts:**
   - What is the purpose of the `cluster` module in Node.js? How does it utilize multiple CPU cores?
   - What is the role of the master process in a clustered Node.js application?

2. **Practical Tasks:**
   - Write a Node.js application using the `cluster` module to handle HTTP requests with multiple worker processes.
   - Implement a clustered application where each worker logs its process ID when handling a request.
   - Write a program to demonstrate how to restart a worker process if it crashes.

3. **Load Balancing:**
   - Explain how Node.js automatically balances requests between worker processes in a clustered setup.
   - Modify a clustered application to handle a situation where one worker intentionally delays processing. How does it affect other workers?

4. **Advanced:**
   - Compare the `cluster` module with external load balancers like Nginx. What are the trade-offs?
   - Demonstrate how to pass custom messages between the master process and workers in a clustered application.

---

### **Worker Threads**

1. **Basic Concepts:**
   - What are Worker Threads in Node.js, and how do they differ from the event loop?
   - Why are Worker Threads not suitable for I/O operations? Explain with examples.

2. **Practical Tasks:**
   - Write a Node.js script that uses a Worker Thread to perform a CPU-intensive operation (e.g., Fibonacci series or matrix multiplication).
   - Create a Node.js program where the main thread sends data to a Worker Thread for processing and receives the processed result.

3. **Shared Memory:**
   - How do you share memory between Worker Threads using `SharedArrayBuffer`? Write a program to demonstrate this.

4. **Error Handling:**
   - Write a Node.js program to handle errors in a Worker Thread and ensure that the main thread continues to execute.

5. **Advanced:**
   - Compare the use of Worker Threads with `child_process` for a CPU-intensive task. Measure and analyze performance.
   - Implement a Worker Pool using Worker Threads to handle multiple tasks in parallel while limiting the number of threads.

---

### **Combined Questions**

1. **Scenario-Based:**
   - Design a system where a Node.js application:
     - Uses `cluster` to handle incoming HTTP requests across multiple CPU cores.
     - Spawns a child process for each request to execute an external program.
     - Utilizes Worker Threads within the child process for computational tasks.

2. **Performance Testing:**
   - Compare the performance of a Node.js application using `cluster` for scaling, Worker Threads for parallel computation, and child processes for isolation. Identify bottlenecks.

3. **Design Questions:**
   - When would you use `cluster`, `child_process`, and `worker_threads` in the same application? Provide a detailed use case and implementation.

4. **Concurrency:**
   - Write a Node.js application that processes a large dataset:
     - Divide the dataset into chunks.
     - Use Worker Threads to process the chunks in parallel.
     - Use child processes to perform post-processing.
     - Combine results using a clustered HTTP server.

---

### **Tips:**
- Focus on understanding when and why to use each feature (Child Processes, Cluster, Worker Threads).
- Pay attention to error handling and communication between processes/threads.
- Test your implementations with large data or CPU-intensive tasks to analyze performance.