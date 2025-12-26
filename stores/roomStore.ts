import { atom, useAtom } from "jotai";
import { io, type Socket } from "socket.io-client";

export const socketAtom = atom<Socket | null>(null);
export const connectingAtom = atom(false);
export const gameRoomIdAtom = atom("");
export const playersAtom = atom<string[]>([]);

export const roomStateAtom = atom((get) => ({
  gameRoomId: get(gameRoomIdAtom),
  players: get(playersAtom),
  socket: get(socketAtom),
  connecting: get(connectingAtom),
}));

export const connectAtom = atom(
  null,
  (get, set) => {
    const currentSocket = get(socketAtom);
    if (currentSocket) return;

    set(connectingAtom, true);
    const socket = io();

    socket.on("connect", () => {
      set(socketAtom, socket);
      set(connectingAtom, false);
    });

    socket.on("playerListUpdate", (players: string[]) => {
      set(playersAtom, players);
    });

    socket.on("disconnect", () => {
      set(socketAtom, null);
      set(gameRoomIdAtom, "");
      set(playersAtom, []);
      set(connectingAtom, false);
    });
  }
);

export const disconnectAtom = atom(
  null,
  (get, set) => {
    const socket = get(socketAtom);
    if (!socket) return;
    socket.disconnect();
    set(socketAtom, null);
    set(gameRoomIdAtom, "");
    set(playersAtom, []);
    set(connectingAtom, false);
  }
);

export const joinRoomAtom = atom(
  null,
  async (get, set, roomName: string = "") => {
    const socket = get(socketAtom);
    if (!socket) throw new Error("Socket not connected.");

    const { roomId, players } = await new Promise<{
      roomId: string;
      players: string[];
    }>((resolve) => {
      socket.emit("joinRoom", roomName, resolve);
    });

    set(gameRoomIdAtom, roomId);
    set(playersAtom, players);
    return roomId;
  }
);

export const leaveRoomAtom = atom(
  null,
  (get, set) => {
    const socket = get(socketAtom);
    if (!socket) return;
    socket.emit("leaveRoom");
    set(gameRoomIdAtom, "");
    set(playersAtom, []);
  }
);

export function useRoom<T>(selector: (state: {
  gameRoomId: string;
  players: string[];
  socket: Socket | null;
  connecting: boolean;
}) => T): T {
  const roomState = useAtom(roomStateAtom)[0];
  return selector(roomState);
}
