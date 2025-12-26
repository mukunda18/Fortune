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
} from "@/stores/roomStore";

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const [socket] = useAtom(socketAtom);
  const [connecting] = useAtom(connectingAtom);
  const [, connect] = useAtom(connectAtom);
  const [, disconnect] = useAtom(disconnectAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
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
    if (!roomInput.trim()) {
      alert("Please enter a room ID!");
      return;
    }
    try {
      await joinRoom(roomInput);
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
    try {
      const roomId = await joinRoom(); // joinRoom without param creates new room
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
