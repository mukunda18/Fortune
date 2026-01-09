import { io, type Socket } from "socket.io-client";
import { getDefaultStore } from "jotai";
import { connectionAtom, roomAtom } from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";
import { gameState } from "@/gameInterfaces/gameState";
import { apiService } from "./apiService";

const store = getDefaultStore();

export class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() { }

  private connectTimeout: NodeJS.Timeout | null = null;

  async connect(): Promise<string> {
    const currentSocketId = store.get(connectionAtom).socket;
    const isConnecting = store.get(connectionAtom).connecting;

    if (currentSocketId || isConnecting) {
      console.log("[SocketService] Already connected or connecting");
      return currentSocketId || "";
    }

    return new Promise((resolve, reject) => {
      console.log("[SocketService] Initiating connection...");

      store.set(connectionAtom, (prev) => ({
        ...prev,
        connecting: true,
        error: null,
      }));

      this.socket = io({
        withCredentials: true,
      });

      this.socket.on("connect", async () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }

        if (!this.socket?.id) {
          const error = new Error("Socket connected but no ID");
          this.handleConnectionError(error);
          reject(error);
          return;
        }

        const socketId = this.socket.id;
        console.log("[SocketService] Connected with ID:", socketId);

        this.reconnectAttempts = 0;

        store.set(connectionAtom, {
          socket: socketId,
          connecting: false,
          error: null,
        });

        try {
          // Request SID cookie after connection
          await apiService.getCookie(socketId);
          resolve(socketId);
        } catch (error) {
          console.error("[SocketService] Failed to get cookie after connect:", error);
          // We don't necessarily reject here if the socket is connected, 
          // but the cookie is important for session.
          resolve(socketId);
        }
      });

      this.socket.on("disconnect", (reason) => {
        console.log("[SocketService] Disconnected:", reason);
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }

        store.set(connectionAtom, {
          socket: null,
          connecting: false,
          error: reason === "io client disconnect" ? null : "Disconnected",
        });

        // Reset room state on disconnect
        store.set(roomAtom, { id: "", joined: false });
        store.set(gameStateAtom, null);
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("[SocketService] Connection error:", error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
          }
          this.socket?.disconnect();
          this.handleConnectionError(error);
          reject(error);
        }
      });

      this.socket.on("updateRoom", (room: gameState) => {
        console.log("[SocketService] Room updated:", room.version);
        store.set(gameStateAtom, room);
      });

      // Set timeout for connection attempt
      this.connectTimeout = setTimeout(() => {
        if (!this.socket?.connected && store.get(connectionAtom).connecting) {
          const error = new Error("Connection timeout");
          this.handleConnectionError(error);
          this.socket?.disconnect();
          reject(error);
        }
        this.connectTimeout = null;
      }, 10000);
    });
  }

  private handleConnectionError(error: Error) {
    store.set(connectionAtom, {
      socket: null,
      connecting: false,
      error: error.message,
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("[SocketService] Disconnecting...");
      this.socket.disconnect();
      this.socket = null;
      // Note: the 'disconnect' listener will update the store
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | null {
    return this.socket?.id ?? null;
  }

  async emit<T>(event: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      console.log(`[SocketService] Emitting event: ${event}`, args);

      let finished = false;
      const timeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          reject(new Error(`Emit timeout: ${event}`));
        }
      }, 5000);

      this.socket.emit(event, ...args, (data: T) => {
        if (!finished) {
          finished = true;
          clearTimeout(timeout);
          console.log(`[SocketService] Received response for: ${event}`, data);
          resolve(data);
        }
      });
    });
  }
}

export const socketService = new SocketService();
