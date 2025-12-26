'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  socketAtom,
  connectingAtom,
  connectAtom,
  disconnectAtom,
  joinRoomAtom,
  playerNameAtom
} from "@/stores/roomStore";

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [socket] = useAtom(socketAtom);
  const [connecting] = useAtom(connectingAtom);
  const [, connect] = useAtom(connectAtom);
  const [, disconnect] = useAtom(disconnectAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
  const [playerName, setPlayerName] = useAtom(playerNameAtom);
  const router = useRouter();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleJoinRoom = async () => {
    if (!socket) {
      alert("Please connect first!");
      return;
    }
    if (!playerInput.trim()) {
      alert("Please enter a player name!");
      return;
    }
    if (!roomInput.trim()) {
      alert("Please enter a room ID!");
      return;
    }
    try {
      setPlayerName(playerInput);
      router.push(`/room/${roomInput}`);
      setRoomInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to join room");
    }
  };

  const handleCreateRoom = async () => {
    if (!socket) {
      alert("Please connect first!");
      return;
    }
    if (!playerInput.trim()) {
      alert("Please enter a player name!");
      return;
    }
    try {
      setPlayerName(playerInput);
      const roomId = await joinRoom();
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  return (
    <main>
      <h1>Welcome to Fortune</h1>

      {!socket ? (
        <button onClick={handleConnect} disabled={connecting}>
          Connect
        </button>
      ) : (
        <button onClick={handleDisconnect}>Disconnect</button>
      )}

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
        <button onClick={handleJoinRoom} disabled={!socket}>
          Join Room
        </button>
      </div>

      <div>
        <button onClick={handleCreateRoom} disabled={!socket}>
          Create Room
        </button>
      </div>
    </main>
  );
}
