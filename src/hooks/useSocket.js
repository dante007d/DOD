import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io("http://localhost:3001", { autoConnect: false });

export default function useSocket(onStateUpdate, onAttackIncoming, onAttackResolved, onRoomError, onTeamUpdated, onEventLogged, onTimeBought) {
  useEffect(() => {
    socket.connect();

    if (onStateUpdate) socket.on("state_update", onStateUpdate);
    if (onAttackIncoming) socket.on("attack_incoming", onAttackIncoming);
    if (onAttackResolved) socket.on("attack_resolved", onAttackResolved);
    if (onRoomError) socket.on("room_error", onRoomError);
    if (onTeamUpdated) socket.on("team_updated", onTeamUpdated);
    if (onEventLogged) socket.on("event_logged", onEventLogged);
    if (onTimeBought) socket.on("time_bought", onTimeBought);

    return () => {
      socket.off("state_update");
      socket.off("attack_incoming");
      socket.off("attack_resolved");
      socket.off("room_error");
      socket.off("team_updated");
      socket.off("event_logged");
      socket.off("time_bought");
    };
  }, [onStateUpdate, onAttackIncoming, onAttackResolved, onRoomError, onTeamUpdated, onEventLogged, onTimeBought]);

  return socket;
}
