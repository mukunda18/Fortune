import { atom } from "jotai";
import { io, type Socket } from "socket.io-client";
import { emitWithTimeout } from "./emit";
import { gameState } from "@/gameInterfaces/gameState";
import { gameStateAtom } from "./gameStore";

type ConnectionState = {
  socket: Socket | null;
  connecting: boolean;
};
export const connectionAtom = atom<ConnectionState>({
  socket: null,
  connecting: false,
});

type RoomState = {
  id: string;
  joined: boolean;
};
export const roomAtom = atom<RoomState>({
  id: "",
  joined: false,
});

export const playerNameAtom = atom("");
export const socketAtom = atom((get) => get(connectionAtom).socket);
export const connectingAtom = atom((get) => get(connectionAtom).connecting);
export const gameRoomIdAtom = atom((get) => get(roomAtom).id);

export const connectAtom = atom(
  null,
  (get, set) => {
    if (get(socketAtom) || get(connectingAtom)) return;

    set(connectionAtom, { socket: null, connecting: true });
    console.log("[roomStore] Connecting to socket...");
    const socket = io();

    socket.on("connect", () => {
      console.log("[roomStore] Socket connected:", socket.id);
      set(connectionAtom, { socket, connecting: false });
    });

    socket.on("roomUpdate", (newState: gameState) => {
      console.log("[roomStore] Received room update:", newState);
      set(gameStateAtom, newState);
    });

    socket.on("disconnect", () => {
      console.log("[roomStore] Socket disconnected");
      set(connectionAtom, { socket: null, connecting: false });
      set(roomAtom, { id: "", joined: false });
    });

    socket.on("connect_error", (err) => {
      console.error("[roomStore] Socket connection error:", err);
      set(connectionAtom, { socket: null, connecting: false });
      set(roomAtom, { id: "", joined: false });
    });
  }
);

export const disconnectAtom = atom(
  null,
  (get, set) => {
    const socket = get(socketAtom);
    if (!socket) return;
    console.log("[roomStore] Disconnecting socket...");
    socket.disconnect();
    set(connectionAtom, { socket: null, connecting: false });
    set(roomAtom, { id: "", joined: false });
  }
);

export const createRoom = async () => {
  try {
    console.log("[roomStore] Creating room...");
    const response = await fetch('/api/createRoom', {
      method: 'POST',
    });
    const data = await response.json();
    console.log("[roomStore] Room created:", data.roomId);
    return data.roomId;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const joinRoomAtom = atom(
  null,
  async (get, set, roomName: string | undefined) => {
    if (!roomName) return;

    const socket = get(socketAtom);
    if (!socket) throw new Error("Socket not connected.");
    try {
      console.log("[roomStore] Joining room:", roomName);
      const state = await emitWithTimeout<gameState | null>(
        socket,
        "joinRoom",
        roomName,
        get(playerNameAtom)
      );
      set(roomAtom, { id: roomName, joined: true });
      set(gameStateAtom, state);
      console.log("[roomStore] Joined room successfully", state);
    } catch (error) {
      console.log(error);
      set(roomAtom, { id: "", joined: false });
    }
  }
);

export const leaveRoomAtom = atom(
  null,
  (get, set) => {
    const socket = get(socketAtom);
    if (!socket || !get(roomAtom).joined) return;
    console.log("[roomStore] Leaving room...");
    socket.emit("leaveRoom");
    set(roomAtom, { id: "", joined: false });
    set(gameStateAtom, null);
  }
);