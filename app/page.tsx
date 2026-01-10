'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { playerNameAtom } from "@/stores/roomStore";
import { roomService } from "@/services";

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
    if (!playerInput.trim() || !roomInput.trim()) {
      setError("Please enter name and room ID");
      return;
    }
    setIsLoading(true);
    setPlayerName(playerInput);
    router.push(`/room/${roomInput}`);
  };

  const handleCreateRoom = async () => {
    if (!playerInput.trim()) {
      setError("Please enter a player name");
      return;
    }
    setIsLoading(true);
    try {
      const roomId = await roomService.createRoom();
      if (!roomId) throw new Error();
      setPlayerName(playerInput);
      router.push(`/room/${roomId}`);
    } catch {
      setError("Failed to create room");
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2>🎲 Welcome to Fortune</h2>

      <p>
        <label>Your Name: </label>
        <input
          type="text"
          value={playerInput}
          onChange={e => setPlayerInput(e.target.value)}
          disabled={isLoading}
        />
      </p>

      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      <section>
        <button onClick={handleCreateRoom} disabled={isLoading}>
          {isLoading ? "Creating..." : "✨ Create New Room"}
        </button>
      </section>

      <hr />

      <section>
        <p>
          <label>Room ID: </label>
          <input
            type="text"
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            disabled={isLoading}
          />
        </p>
        <button onClick={handleJoinRoom} disabled={isLoading}>
          {isLoading ? "Joining..." : "🚪 Join Room"}
        </button>
      </section>

      <footer>
        <p>ℹ️ Info: Create a room or join with a room ID. Play with up to 8 players.</p>
      </footer>
    </section>
  );
}