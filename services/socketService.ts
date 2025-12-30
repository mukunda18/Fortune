/**
 * Client-side socket service for managing Socket.IO connections.
 * Handles socket connection lifecycle and event management.
 */

import { io, type Socket } from "socket.io-client";
import { gameState } from "@/gameInterfaces/gameState";

export interface SocketEventHandler {
  onConnect: (socketId: string) => void;
  onDisconnect: () => void;
  onError: (error: Error) => void;
  onUpdateRoom: (room: gameState) => void;
}

export class SocketService {
  private socket: Socket | null = null;
  private handlers: Partial<SocketEventHandler> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {}

  setHandlers(handlers: Partial<SocketEventHandler>): void {
    this.handlers = handlers;
  }

  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected && this.socket.id) {
        resolve(this.socket.id);
        return;
      }

      console.log("[SocketService] Initiating connection...");
      this.socket = io({
        withCredentials: true,
      });

      this.socket.on("connect", () => {
        if (!this.socket?.id) {
          reject(new Error("Socket connected but no ID"));
          return;
        }
        console.log("[SocketService] Connected with ID:", this.socket.id);
        this.reconnectAttempts = 0;
        const socketId = this.socket.id;
        this.handlers.onConnect?.(socketId);
        resolve(socketId);
      });

      this.socket.on("disconnect", () => {
        console.log("[SocketService] Disconnected");
        this.handlers.onDisconnect?.();
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("[SocketService] Connection error:", error);
        this.reconnectAttempts++;
        if (
          this.reconnectAttempts >= this.maxReconnectAttempts
        ) {
          this.socket?.disconnect();
          reject(error);
        }
      });

      this.socket.on("updateRoom", (room: gameState) => {
        console.log("[SocketService] Room updated:", room.version);
        this.handlers.onUpdateRoom?.(room);
      });

      // Set timeout for connection attempt
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(
            new Error(
              "Connection timeout"
            )
          );
        }
      }, 10000);
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("[SocketService] Disconnecting...");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | null {
    return this.socket?.id ?? null;
  }

  async emit<T>(
    event: string,
    ...args: any[]
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      console.log(
        `[SocketService] Emitting event: ${event}`,
        args
      );

      let called = false;
      const timeout = setTimeout(() => {
        if (!called) {
          called = true;
          reject(
            new Error(
              `Emit timeout: ${event}`
            )
          );
        }
      }, 5000);

      const callback = (data: T) => {
        if (!called) {
          called = true;
          clearTimeout(timeout);
          console.log(
            `[SocketService] Received response for: ${event}`,
            data
          );
          resolve(data);
        }
      };

      this.socket.emit(event, ...args, callback);
    });
  }

  on(event: string, handler: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event: string, handler?: (...args: any[]) => void): void {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }
}

export const socketService = new SocketService();
