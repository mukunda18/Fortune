'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import {
  leaveRoomAtom,
  joinRoomAtom,
  connectAtom,
  disconnectAtom,
  roomAtom,
  connectingAtom,
  playerNameAtom,
} from "@/stores/roomStore";
import GameStateViewer from "@/components/gameboard";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId?.toString();

  const [room] = useAtom(roomAtom);
  const [, connect] = useAtom(connectAtom);
  const [, leaveRoom] = useAtom(leaveRoomAtom);
  const [, disconnect] = useAtom(disconnectAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
  const [connecting] = useAtom(connectingAtom);
  const [playerName] = useAtom(playerNameAtom);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const router = useRouter();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleLeaveRoom = async () => {
    try {
      leaveRoom();
      router.push("/");
    } catch (error) {
      setError("Failed to leave room");
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId) return;
    
    setError("");
    setIsJoining(true);
    try {
      await joinRoom(roomId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to join room";
      setError(message);
      setIsJoining(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <span>🎮</span>
            </div>
            <h1>
              Room: {roomId}
            </h1>
          </div>
          <p>
            Player: <span>{playerName}</span>
          </p>
        </div>

        <div>
          <div>
            <p>
              Status: 
              <span>
                {room.joined ? '✅ Joined' : '⏳ Waiting'}
              </span>
            </p>
          </div>

          <button
            onClick={handleLeaveRoom}
            disabled={connecting || isJoining}
          >
            Leave
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div>
          <span>⚠️</span>
          <div>
            <p>Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {connecting && (
        <div>
          <div></div>
          <span>Connecting to server...</span>
        </div>
      )}

      {/* Join Room Section */}
      {!room.joined && !connecting && (
        <div>
          <div>
            <h2>
              Ready to Join?
            </h2>
            <p>
              Click the button below to join this room and start playing
            </p>
          </div>

          {isJoining && (
            <div>
              <div></div>
              <span>Joining room...</span>
            </div>
          )}

          {!isJoining && (
            <button
              onClick={handleJoinRoom}
            >
              🚀 Join Room Now
            </button>
          )}
        </div>
      )}

      {/* Game Board */}
      {room.joined && (
        <div>
          <GameStateViewer />
        </div>
      )}
    </div>
  );
}