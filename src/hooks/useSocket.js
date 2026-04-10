import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io("http://localhost:3001", { autoConnect: false });

export default function useSocket(onStateUpdate, onAttackIncoming, onAttackResolved, onRoomError) {
  useEffect(() => {
    socket.connect();

    if (onStateUpdate) socket.on("state_update", onStateUpdate);
    if (onAttackIncoming) socket.on("attack_incoming", onAttackIncoming);
    if (onAttackResolved) socket.on("attack_resolved", onAttackResolved);
    if (onRoomError) socket.on("room_error", onRoomError);

    return () => {
      socket.off("state_update");
      socket.off("attack_incoming");
      socket.off("attack_resolved");
      socket.off("room_error");
    };
  }, [onStateUpdate, onAttackIncoming, onAttackResolved, onRoomError]);

  return socket;
}
