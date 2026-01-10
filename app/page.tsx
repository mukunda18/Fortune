'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { playerNameAtom } from "@/stores/roomStore";
import { apiService } from "@/services";

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
    if (!roomInput.trim()) {
      setError("Please enter a room ID");
      return;
    }
    setIsLoading(true);
    setPlayerName(playerInput.trim());
    router.push(`/room/${roomInput}`);
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const roomId = await apiService.createRoom();
      if (!roomId) throw new Error();
      setPlayerName(playerInput.trim());
      router.push(`/room/${roomId}`);
    } catch {
      setError("Failed to create room");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>FORTUNE</h1>
      </div>

      <div>
        <label>
          Your Name
          <input
            type="text"
            value={playerInput}
            onChange={e => {
              setPlayerInput(e.target.value);
              setError("");
            }}
            disabled={isLoading}
            placeholder="Enter your player name..."
            maxLength={20}
          />
        </label>

        {error && (
          <div>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div>
          <button onClick={handleCreateRoom} disabled={isLoading}>
            {isLoading ? "Creating Room..." : "Create New Room"}
          </button>
        </div>

        <div>
          <label>
            Room ID
            <input
              type="text"
              value={roomInput}
              onChange={e => {
                setRoomInput(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              placeholder="Enter room code..."
              maxLength={30}
            />
          </label>

          <button onClick={handleJoinRoom} disabled={isLoading}>
            {isLoading ? "Joining Room..." : "Join Room"}
          </button>
        </div>
      </div>

      <footer>
        <p>2-8 Players | Online Multiplayer | Real-time</p>
        <p>Build your empire, bankrupt your opponents, dominate the board</p>
      </footer>
    </div>
  );
}