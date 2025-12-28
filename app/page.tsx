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
  const [, setPlayerName] = useAtom(playerNameAtom);
  const router = useRouter();

  useEffect(() => {
    return () => {
      setPlayerInput("");
      setRoomInput("");
    };
  }, []);

  const handleJoinRoom = async () => {
    if (!playerInput.trim()) {
      alert("Please enter a player name!");
      return;
    }
    if (!roomInput.trim()) {
      alert("Please enter a room ID!");
      return;
    }
    setPlayerName(playerInput);
    router.push(`/room/${roomInput}`);
  };

  const handleCreateRoom = async () => {
    if (!playerInput.trim()) {
      alert("Please enter a player name!");
      return;
    }
    try {
      const roomId = await createRoom();
      setPlayerName(playerInput);
      if (!roomId) {
        alert("Failed to create room");
        return;
      }
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  return (
    <main>
      <h1>Welcome to Fortune</h1>
      <div>
        <h2>Join a Room</h2>
        <input
          type="text"
          placeholder="Enter player name"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <button onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>

      <div>
        <button onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>
    </main>
  );
}