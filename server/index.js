import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameRoom } from './game/GameRoom.js';
import { emitToSocket } from './utils/broadcast.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

// Helper to send error to a specific socket
function sendError(socket, code, message) {
  emitToSocket(io, socket.id, "room_error", { code, message });
}

io.on('connection', (socket) => {
  // CLIENT -> SERVER EVENTS
  
  socket.on("join_room", ({ teamId, roomCode, displayName }) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");
      
      socket.join(roomCode);
      room.addTeam(teamId, displayName, socket.id);
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  socket.on("submit_answer", ({ teamId, roomCode, puzzleId, answer }) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");
      
      const result = room.submitAnswer(teamId, puzzleId, answer);
      if (result.correct) {
        emitToSocket(io, socket.id, "answer_result", {
          correct: true,
          tokensEarned: result.tokensEarned,
          nextPuzzle: result.nextPuzzle
        });
      } else {
        emitToSocket(io, socket.id, "answer_result", { correct: false, tokensEarned: 0 });
      }
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  socket.on("launch_attack", ({ fromTeamId, targetTeamId, roomCode }) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");

      const result = room.launchAttack(fromTeamId, targetTeamId);
      if (!result.success) {
        sendError(socket, "ATTACK_FAILED", result.error);
      }
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  socket.on("submit_defense", ({ teamId, roomCode, attackId, answer }) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");

      const result = room.submitDefense(teamId, attackId, answer);
      if (!result.correct) {
        sendError(socket, "WRONG_ANSWER", "Incorrect defense code");
      }
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  socket.on("use_token_gamble", ({ teamId, roomCode }) => {
    try {
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");

      const result = room.useTokenGamble(teamId);
      if (!result.success) {
        sendError(socket, "GAMBLE_FAILED", result.error || "Cannot gamble");
      } else {
        // Emit gamble puzzle
        emitToSocket(io, socket.id, "gamble_puzzle", result.puzzle);
      }
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  // ORGANIZER
  socket.on("organizer_join", ({ roomCode, authKey }) => {
    try {
      // Bypassed auth check for local MVP
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");
      
      socket.join(roomCode);
      room.broadcastState(); // send state to organizer
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });

  socket.on("organizer_cmd", ({ roomCode, authKey, command, payload }) => {
    try {
      // Bypassed auth check for local MVP
      const room = rooms.get(roomCode);
      if (!room) return sendError(socket, "ROOM_NOT_FOUND", "Room does not exist");

      switch(command) {
        case 'advance_phase':
          room.advancePhase(payload.phaseOverride);
          break;
        case 'advance_round':
          room.advanceRound();
          break;
        case 'set_round':
          if (payload && payload.round) {
            room.state.round = payload.round;
            room.broadcastState();
          }
          break;
        case 'toggle_safe_zone':
          room.toggleSafeZone();
          break;
        case 'grant_tokens':
          room.grantTokens(payload.teamId, payload.amount, "organizer grant");
          room.broadcastState();
          break;
        case 'adjust_lives':
          if (room.state.teams[payload.teamId]) {
            room.state.teams[payload.teamId].lives = payload.lives;
            room.broadcastState();
          }
          break;
        case 'eliminate_team':
          room.eliminateTeam(payload.teamId);
          break;
        case 'restore_team':
          if (room.state.teams[payload.teamId]) {
            room.state.teams[payload.teamId].status = "active";
            room.state.teams[payload.teamId].lives = 3;
            room.broadcastState();
          }
          break;
        case 'reset_game':
          const codes = room.state.roomCode;
          rooms.delete(codes);
          const newRoom = new GameRoom(codes);
          newRoom.setIO(io);
          rooms.set(codes, newRoom);
          io.to(codes).emit("room_error", { code: "GAME_RESET", message: "Game has been reset by organizer" });
          break;
        default:
          sendError(socket, "INVALID_COMMAND", "Unknown organizer command");
      }
    } catch (err) {
      sendError(socket, "INTERNAL_ERROR", err.message);
    }
  });
});

// REST Routes
app.get('/', (req, res) => {
  res.send('⬡ Operation Prometheus Server is running!');
});

app.post('/api/rooms/create', (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const room = new GameRoom(roomCode);
  room.setIO(io);
  rooms.set(roomCode, room);
  res.json({ roomCode });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`⬡ Operation Prometheus server running on port ${PORT}`);
});
