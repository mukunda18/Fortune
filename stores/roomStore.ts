import { atom } from "jotai";
import { gameState } from "@/gameInterfaces/gameState";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";
import { gameStateAtom } from "./gameStore";
import { apiService } from "@/services/apiService";
import { socketService } from "@/services/socketService";

type ConnectionState = {
  socket: string | null;
  connecting: boolean;
  error: string | null;
};

export const connectionAtom = atom<ConnectionState>({
  socket: null,
  connecting: false,
  error: null,
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
export const socketIdAtom = atom((get) => get(connectionAtom).socket);
export const connectingAtom = atom((get) => get(connectionAtom).connecting);
export const gameRoomIdAtom = atom((get) => get(roomAtom).id);

/**
 * Atom to establish socket connection
 */
export const connectAtom = atom(
  null,
  async (get, set) => {
    const existingSocket = get(socketIdAtom);
    const isConnecting = get(connectingAtom);

    if (existingSocket || isConnecting) {
      console.log(
        "[roomStore] Already connected or connecting"
      );
      return;
    }

    set(connectionAtom, {
      socket: null,
      connecting: true,
      error: null,
    });

    try {
      console.log("[roomStore] Connecting to socket...");

      socketService.setHandlers({
        onConnect: (socketId) => {
          set(connectionAtom, {
            socket: socketId,
            connecting: false,
            error: null,
          });
        },
        onDisconnect: () => {
          set(connectionAtom, {
            socket: null,
            connecting: false,
            error: "Disconnected",
          });
          set(roomAtom, { id: "", joined: false });
        },
        onError: (error) => {
          set(connectionAtom, {
            socket: null,
            connecting: false,
            error: error.message,
          });
        },
        onUpdateRoom: (room) => {
          set(gameStateAtom, room);
        },
      });

      const socketId = await socketService.connect();
      console.log("[roomStore] Connected with ID:", socketId);

      // Request SID cookie after connection
      await apiService.getCookie(socketId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown connection error";
      console.error("[roomStore] Connection failed:", error);
      set(connectionAtom, {
        socket: null,
        connecting: false,
        error: errorMessage,
      });
    }
  }
);

/**
 * Atom to disconnect from socket
 */
export const disconnectAtom = atom(
  null,
  (get, set) => {
    const socketId = get(socketIdAtom);
    if (!socketId) return;

    console.log("[roomStore] Disconnecting socket...");
    socketService.disconnect();
    set(connectionAtom, {
      socket: null,
      connecting: false,
      error: null,
    });
    set(roomAtom, { id: "", joined: false });
  }
);

/**
 * Atom to create a new game room
 */
export const createRoom = async (): Promise<string> => {
  try {
    console.log("[roomStore] Creating room...");
    const roomId = await apiService.createRoom();
    console.log("[roomStore] Room created:", roomId);
    return roomId;
  } catch (error) {
    console.error("[roomStore] Failed to create room:", error);
    throw error;
  }
};

/**
 * Atom to join an existing room
 */
export const joinRoomAtom = atom(
  null,
  async (get, set, roomId: string | undefined) => {
    if (!roomId) {
      throw new Error("Room ID is required");
    }

    const socketId = get(socketIdAtom);
    if (!socketId) {
      throw new Error("Socket not connected");
    }

    const playerName = get(playerNameAtom);

    try {
      console.log("[roomStore] Joining room:", roomId);
      const response = await socketService.emit<
        gameState | ServerResponse
      >("joinRoom", roomId, playerName);

      if (isServerResponse(response)) {
        console.error(
          "[roomStore] Join room failed:",
          response.message
        );
        set(roomAtom, { id: "", joined: false });
        throw new Error(response.message);
      }

      set(gameStateAtom, response);
      set(roomAtom, { id: roomId, joined: true });
      console.log("[roomStore] Joined room successfully");
    } catch (error) {
      console.error("[roomStore] Error joining room:", error);
      set(roomAtom, { id: "", joined: false });
      throw error;
    }
  }
);

/**
 * Atom to leave the current room
 */
export const leaveRoomAtom = atom(
  null,
  (get, set) => {
    const socketId = get(socketIdAtom);
    const room = get(roomAtom);

    if (!socketId || !room.joined) {
      console.log("[roomStore] Not in a room or not connected");
      return;
    }

    try {
      console.log("[roomStore] Leaving room...");
      socketService.emit("leaveRoom");
      set(roomAtom, { id: "", joined: false });
      set(gameStateAtom, null);
    } catch (error) {
      console.error("[roomStore] Error leaving room:", error);
      // Still update local state even if emit fails
      set(roomAtom, { id: "", joined: false });
      set(gameStateAtom, null);
    }
  }
);