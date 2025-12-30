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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎮</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Room: {roomId}
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Player: <span className="font-semibold text-slate-900 dark:text-white">{playerName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Status: 
                <span className={`ml-2 font-bold ${room.joined ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {room.joined ? '✅ Joined' : '⏳ Waiting'}
                </span>
              </p>
            </div>

            <button
              onClick={handleLeaveRoom}
              disabled={connecting || isJoining}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 font-medium flex items-center gap-3">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {connecting && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-400 font-medium flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Connecting to server...</span>
        </div>
      )}

      {/* Join Room Section */}
      {!room.joined && !connecting && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-lg p-8 border border-yellow-200 dark:border-yellow-800">
          <div className="text-center space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Ready to Join?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Click the button below to join this room and start playing
              </p>
            </div>

            {isJoining && (
              <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-400">
                <div className="w-5 h-5 border-2 border-yellow-400 border-t-yellow-600 rounded-full animate-spin"></div>
                <span className="font-semibold">Joining room...</span>
              </div>
            )}

            {!isJoining && (
              <button
                onClick={handleJoinRoom}
                className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                🚀 Join Room Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Game Board */}
      {room.joined && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-800 fade-in">
          <GameStateViewer />
        </div>
      )}
    </div>
  );
}