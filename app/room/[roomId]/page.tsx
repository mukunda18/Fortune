'use client';

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import {
  leaveRoomAtom,
  joinRoomAtom,
  connectAtom,
  disconnectAtom,
  roomAtom,
  connectingAtom
} from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId?.toString();

  const [room] = useAtom(roomAtom);
  const [gameState] = useAtom(gameStateAtom);

  const [, connect] = useAtom(connectAtom);
  const [, leaveRoom] = useAtom(leaveRoomAtom);
  const [, disconnect] = useAtom(disconnectAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
  const [connecting] = useAtom(connectingAtom);

  const router = useRouter();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  const handleJoinRoom = async () => {
    if (!roomId) return;
    await joinRoom(roomId);
  };

  return (
    <main>
      <h1>Room: {roomId}</h1>
      <p>Status: {room.joined ? "Joined" : "Not joined"}</p>
      <p>Game State: {gameState ? JSON.stringify(gameState) : "Not joined"}</p>
      <button onClick={handleLeaveRoom}>
        Leave Room
      </button>
      <button onClick={handleJoinRoom} disabled={room.joined || connecting}>
        Join Room
      </button>
    </main>
  );
}