# Queue Manager Backend

A scalable, in-memory queue manager REST API written in TypeScript using Express.

## Features
- Multiple named blocking queues
- REST API: enqueue and dequeue with timeout
- Easily replaceable in-memory queue (add DB/external queue later)
- Jest tests for core functionality

## What was not done yet:
- Tests (jest) were written but not checked
- Validation for api requests
- Complex scenarios like having an empty queue, adding 2 messages to it while there are already 2 requests to get them, and see that req1 gets msg1 and req2 gets msg2
- Perhaps use a 3rd party queue instead of writing my own 
- Adding some security measures to avoid abuse (rate limiting, maybe authentication). This was not required though
- Graceful shutdown and some measures to recover from a crash without losing the queues (external DB or at least writing in-mem queues to disk periodically). Was not required.
- Stress testing

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. (Optional) Create a `.env` file to override defaults:
   ```env
   PORT=3000
   DEFAULT_TIMEOUT_MS=10000
   ```

## Running the Server
```sh
npx ts-node src/server.ts
```

## API Endpoints
### POST /api/{queue_name}
- Enqueue a message (JSON body) to the named queue.
- Creates the queue if it doesn't exist.
- Returns: `200 OK` on success, or `201 Created` on success + creating a new queue.

### GET /api/{queue_name}?timeout={ms}
- Dequeue the next message from the queue.
- Waits up to `timeout` ms (default 10s) if empty.
- Returns: `200 OK` with message, or `204 No Content` if timeout.

## Testing
Run all tests:
```sh
npx jest
```

## Security & Scalability Notes
- TODOs for authentication, rate limiting, and input validation are marked in code.
- In-memory queue is for demo/dev only. Replace with DB/external queue for production.

## Manual Testing Scripts

Scripts are provided in the `scripts/` folder for quick manual testing with curl:

### Windows Powershell

#### Enqueue a message
```powershell
.\curl_enqueue.ps1 <queue_name> <json_message>
REM Example:
.\curl_enqueue.ps1 myqueue '{"msg":"msg1"}'
```

#### Dequeue a message
```powershell
.\curl_dequeue.ps1 <queue_name> [timeout_ms]
REM Example:
.\curl_dequeue.ps1 myqueue 5000
```