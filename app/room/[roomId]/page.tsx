'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";

import {
  roomAtom,
  connectingAtom,
  playerNameAtom,
  connectionErrorAtom,
} from "@/stores/roomStore";
import { roomService, socketService } from "@/services";

import GameStateViewer from "@/components/gameboard";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId?.toString();

  const [room] = useAtom(roomAtom);
  const [connecting] = useAtom(connectingAtom);
  const [connectionError] = useAtom(connectionErrorAtom);
  const [playerName] = useAtom(playerNameAtom);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleLeaveRoom = async () => {
    await roomService.leaveRoom();
    router.push("/");
  };

  const handleJoinRoom = async () => {
    if (!roomId) return;
    setError("");
    setIsJoining(true);
    try {
      await roomService.joinRoom(roomId);
      setIsJoining(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <article>
      <header>
        <h2>🎮 Room: {roomId}</h2>
        <p>Player: {playerName}</p>
        <p>Status: {room.joined ? '✅ Joined' : '⏳ Waiting'}</p>
        <button onClick={handleLeaveRoom} disabled={connecting || isJoining}>Leave</button>
      </header>

      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
      {connectionError && <p style={{ color: 'red' }}>⚠️ Connection Error: {connectionError}</p>}
      {connecting && <p>Connecting to server...</p>}

      {!room.joined && !connecting && (
        <section>
          <h3>Ready to Join?</h3>
          <p>Click below to start playing</p>
          <button onClick={handleJoinRoom} disabled={isJoining}>
            {isJoining ? "Joining..." : "🚀 Join Room Now"}
          </button>
        </section>
      )}

      {room.joined && <GameStateViewer />}
    </article>
  );
}