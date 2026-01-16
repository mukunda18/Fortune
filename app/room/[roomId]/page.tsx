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
import { GameBoard } from "@/components/game/GameBoard";
import { GameSidebarLeft } from "@/components/game/GameSidebarLeft";
import { GameSidebarRight } from "@/components/game/GameSidebarRight";


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
    socketService.disconnect();
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

  if (room.joined) {
    return (
      <div style={{ display: 'flex', height: '100vh', border: '5px solid green', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, height: '100%' }}>
          <GameSidebarLeft />
        </div>
        <GameBoard />
        <div style={{ flexShrink: 0, height: '100%' }}>
          <GameSidebarRight />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid black' }}>
      <h1>Room Lobby (Logic Test)</h1>
      <p>Room ID: {roomId}</p>
      <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
        <p>Playing as: {playerName || "Guest"}</p>
      </div>

      {(error || connectionError) && (
        <div style={{ border: '1px solid red', padding: '10px', color: 'red', marginBottom: '10px' }}>
          {connectionError ? (
            <strong>{connectionError}</strong>
          ) : (
            <><strong>Error:</strong> {error}</>
          )}
        </div>
      )}

      {connecting && <p>...Connecting...</p>}

      {!room.joined && !connecting && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleJoinRoom} disabled={isJoining} style={{ padding: '10px', border: '2px solid black' }}>
            {isJoining ? "Joining..." : "JOIN ROOM"}
          </button>
        </div>
      )}

      <button onClick={handleLeaveRoom} style={{ marginTop: '10px' }}>
        Cancel
      </button>
    </div>
  );
}