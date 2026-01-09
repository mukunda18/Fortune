'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import {
  roomAtom,
  connectingAtom,
  playerNameAtom,
} from "@/stores/roomStore";
import { roomService } from "@/services/roomService";
import { socketService } from "@/services/socketService";
import GameStateViewer from "@/components/gameboard";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId?.toString();

  const [room] = useAtom(roomAtom);
  const [connecting] = useAtom(connectingAtom);
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
    try {
      roomService.leaveRoom();
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
      await roomService.joinRoom(roomId);
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