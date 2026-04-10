# Operation Prometheus Backend

This is the Node.js / Express / Socket.io authoritative server for the real-time multiplayer puzzle battle royale game **Operation Prometheus**.

## Project Structure
- `/game` - Core state machine and game logic (`GameRoom.js`, `PuzzleManager.js`, `BattleManager.js`, `RoundManager.js`)
- `/data` - Static puzzle bank containing 30 puzzles across 5 cipher types and 3 difficulties (`puzzles.js`)
- `/utils` - Socket.io broadcasting utilities
- `index.js` - Express + Socket.io entry point, CORS config, and socket event mapping

## How to run locally

### Install dependencies
```bash
npm install
```

### Configure environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `FRONTEND_URL` is set to your local Vite dev server (usually `http://localhost:5173`).

### Start the server
```bash
# Production setup
npm start

# Development setup with auto-reloading
npm run dev
```

The server will automatically run on port 3001 (or the one provided in `.env`) and you will see:
`⬡ Operation Prometheus server running on port 3001`

## API Endpoints
- `POST /api/rooms/create` -> returns `{ roomCode: "..." }`
- `GET /api/health` -> returns server health and `activeRooms` count

## Socket.io Events

### Client -> Server
- `join_room` args: `{ teamId, roomCode, displayName }`
- `submit_answer` args: `{ teamId, roomCode, puzzleId, answer }`
- `launch_attack` args: `{ fromTeamId, targetTeamId, roomCode }`
- `submit_defense` args: `{ teamId, roomCode, attackId, answer }`
- `use_token_gamble` args: `{ teamId, roomCode }`
- `organizer_join` args: `{ roomCode, authKey }`
- `organizer_cmd` args: `{ roomCode, authKey, command, payload }`

### Server -> Client
- `state_update`: Emitted to the whole room with the full authoritative `gameState`.
- `attack_incoming`: Sent to a defending team containing `{ attackId, fromTeam, puzzle, deadline }`.
- `attack_resolved`: Sent to a defending team containing `{ success, teamId, livesRemaining }`.
- `answer_result`: Sent to submitting team containing `{ correct, tokensEarned, nextPuzzle }`.
- `room_error`: Sent to specific sockets on failures `{ code, message }`.

## Connecting the React Frontend

The React app should have Socket.io-client installed. 
Connect to the server using the backend URL (e.g., `http://localhost:3001`):

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.emit("join_room", { teamId: "t_alpha", roomCode: "XK-7721", displayName: "Team Alpha" });

socket.on("state_update", (gameState) => {
  // Update React context
});
```

To integrate with the mock frontend built in the previous step, replace the mock `useReducer` logic inside `useGameState` with Socket.io event listeners that update the overall state according to payloads from `state_update`.
