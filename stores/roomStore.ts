import { atom } from "jotai";

interface ConnectionState {
  socket: string | null;
  connecting: boolean;
  error: string | null;
};

export const connectionAtom = atom<ConnectionState>({
  socket: null,
  connecting: false,
  error: null,
});

interface RoomState {
  id: string;
  joined: boolean;
};

export const roomAtom = atom<RoomState>({
  id: "",
  joined: false,
});

export const playerNameAtom = atom("");
export const socketIdAtom = atom((get) => get(connectionAtom).socket);
export const connectingAtom = atom((get) => get(connectionAtom).connecting);
export const gameRoomIdAtom = atom((get) => get(roomAtom).id);
export const connectionErrorAtom = atom((get) => get(connectionAtom).error);