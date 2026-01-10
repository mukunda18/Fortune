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
      setError("Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <div>
      <h1>Room Lobby</h1>
      <p>Room ID: {roomId}</p>
      <button onClick={handleLeaveRoom} disabled={connecting || isJoining}>
        Leave Room
      </button>

      <div>
        <p>Playing as: {playerName || "Guest"}</p>
      </div>

      {(error || connectionError) && (
        <div>
          <strong>Connection Error:</strong>
          <p>{error || connectionError}</p>
        </div>
      )}

      {connecting && <p>Connecting to server...</p>}

      {!room.joined && !connecting && (
        <div>
          <h2>Ready to Play?</h2>
          <button onClick={handleJoinRoom} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join Room"}
          </button>
        </div>
      )}

      <footer>
        <p>Once you join, you'll see the game board and other players</p>
      </footer>
    </div>
  );
}