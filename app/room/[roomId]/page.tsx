'use client'

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import {
  playersAtom,
  joinRoomAtom,
  leaveRoomAtom,
} from "@/stores/roomStore";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [players] = useAtom(playersAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
  const [, leaveRoom] = useAtom(leaveRoomAtom);
  const router = useRouter();

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  useEffect(() => {
    (async () => {
      try {
        await joinRoom(roomId);
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    })();

    return () => {
      leaveRoom();
    };
  }, [roomId, router, joinRoom, leaveRoom]);

  return (
    <main>
      <h1>Room: {roomId}</h1>
      <p>This is the room page for room ID: {roomId}</p>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <button onClick={handleLeaveRoom}>
        Leave Room
      </button>
    </main>
  );
}