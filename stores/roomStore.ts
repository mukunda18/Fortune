import { atom } from "jotai";
import { io, type Socket } from "socket.io-client";

export const socketAtom = atom<Socket | null>(null);
export const connectingAtom = atom(false);
export const gameRoomIdAtom = atom("");
export const playersAtom = atom<string[]>([]);
export const joinedRoomAtom = atom(false);
export const playerNameAtom = atom("");

export const connectAtom = atom(
  null,
  (get, set) => {
    const currentSocket = get(socketAtom);
    if (currentSocket) return;

    set(connectingAtom, true);
    const socket = io({
      auth: {
        playerName: get(playerNameAtom)
      }
    });

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
      set(joinedRoomAtom, false);
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
    set(joinedRoomAtom, false);
  }
);

export const joinRoomAtom = atom(
  null,
  async (get, set, roomName: string = "") => {
    if (get(joinedRoomAtom)) return;
    const socket = get(socketAtom);
    if (!socket) throw new Error("Socket not connected.");

    const { roomId, players } = await new Promise<{
      roomId: string;
      players: string[];
    }>((resolve) => {
      socket.emit("joinRoom", roomName, get(playerNameAtom), resolve);
    });

    set(gameRoomIdAtom, roomId);
    set(playersAtom, players);
    set(joinedRoomAtom, true);
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
    set(joinedRoomAtom, false);
  }
);
