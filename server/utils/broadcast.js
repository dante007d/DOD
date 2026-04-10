export function broadcastState(io, roomCode, gameState) {
  if (io) {
    io.to(roomCode).emit("state_update", gameState);
  }
}

export function emitToSocket(io, socketId, event, data) {
  if (io && socketId) {
    io.to(socketId).emit(event, data);
  }
}
