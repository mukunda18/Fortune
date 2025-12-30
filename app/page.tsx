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
    <div>
      <div>
        {/* Welcome Section */}
        <div>
          <div>
            <span>🎲</span>
          </div>
          <h1>
            Welcome to Fortune
          </h1>
          <p>
            A multiplayer board game experience
          </p>
        </div>

        {/* Main Card */}
        <div>
          {/* Player Name Input */}
          <div>
            <label>
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
            />
          </div>

          {/* Error Message */}
          {error && (
            <div>
              ⚠️ {error}
            </div>
          )}

          {/* Divider */}
          <div>
            <div>
              <div></div>
            </div>
            <div>
              <span>
                or
              </span>
            </div>
          </div>

          {/* Create Room Section */}
          <div>
            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div></div>
                  Creating...
                </>
              ) : (
                <>
                  ✨ Create New Room
                </>
              )}
            </button>
            <p>
              Start a new game and invite friends
            </p>
          </div>

          {/* Divider */}
          <div>
            <div>
              <div></div>
            </div>
            <div>
              <span>
                Join Existing
              </span>
            </div>
          </div>

          {/* Join Room Section */}
          <div>
            <label>
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
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div></div>
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
        <div>
          <div>
            <p>
              ℹ️ How to Play
            </p>
            <p>
              Create a room or join with a room ID to start playing with friends.
            </p>
          </div>
          <div>
            <p>
              👥 Multiplayer
            </p>
            <p>
              Play with up to 8 players in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}