import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
  
  fetch("http://localhost:3001/api/rooms/create", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      console.log("Created room:", data.roomCode);
      socket.emit("organizer_join", { roomCode: data.roomCode, authKey: "prometheus-admin-2024" });
    });
});

socket.on("state_update", (state) => {
  console.log("Got state update for room:", state.roomCode);
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.log("Socket connect error:", err.message);
  process.exit(1);
});
