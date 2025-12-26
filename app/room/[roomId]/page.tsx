'use client'

import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import {
  playersAtom,
  joinRoomAtom,
  leaveRoomAtom,
  connectAtom,
} from "@/stores/roomStore";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [players] = useAtom(playersAtom);
  const [, joinRoom] = useAtom(joinRoomAtom);
  const [, leaveRoom] = useAtom(leaveRoomAtom);
  const [, connect] = useAtom(connectAtom);
  const router = useRouter();
  const hasJoined = useRef(false);

  useEffect(() => {
    connect();

    if (!hasJoined.current) {
      (async () => {
        try {
          await joinRoom(roomId);
          hasJoined.current = true;
        } catch (err) {
          console.error(err);
          router.push("/");
        }
      })();
    }

    return () => {
      hasJoined.current = false;
      leaveRoom();
    };
  }, [roomId, router, joinRoom, leaveRoom, connect]);

  return (
    <main>
      <h1>Room: {roomId}</h1>
      <p>This is the room page for room ID: {roomId}</p>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </main>
  );
}