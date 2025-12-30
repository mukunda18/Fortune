'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  createRoom,
  playerNameAtom,
} from "@/stores/roomStore";

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setPlayerName] = useAtom(playerNameAtom);
  const router = useRouter();

  useEffect(() => {
    return () => {
      setPlayerInput("");
      setRoomInput("");
      setError("");
    };
  }, []);

  const handleJoinRoom = async () => {
    setError("");
    
    if (!playerInput.trim()) {
      setError("Please enter a player name");
      return;
    }
    if (!roomInput.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setIsLoading(true);
    try {
      setPlayerName(playerInput);
      router.push(`/room/${roomInput}`);
    } catch (err) {
      setError("Failed to join room. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setError("");
    
    if (!playerInput.trim()) {
      setError("Please enter a player name");
      return;
    }

    setIsLoading(true);
    try {
      const roomId = await createRoom();
      if (!roomId) {
        setError("Failed to create room. Please try again.");
        return;
      }
      setPlayerName(playerInput);
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create room. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg">
            <span className="text-4xl">🎲</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Fortune
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            A multiplayer board game experience
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6 fade-in">
          {/* Player Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your player name"
              value={playerInput}
              onChange={(e) => {
                setPlayerInput(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 disabled:opacity-50 transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                or
              </span>
            </div>
          </div>

          {/* Create Room Section */}
          <div>
            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  ✨ Create New Room
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              Start a new game and invite friends
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Join Existing
              </span>
            </div>
          </div>

          {/* Join Room Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room ID (e.g., abc123)"
              value={roomInput}
              onChange={(e) => {
                setRoomInput(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 disabled:opacity-50 transition-all"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Joining...
              </>
            ) : (
              <>
                🚪 Join Room
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              ℹ️ How to Play
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Create a room or join with a room ID to start playing with friends.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
              👥 Multiplayer
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-400">
              Play with up to 8 players in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}