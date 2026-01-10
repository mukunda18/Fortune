import { io, type Socket } from "socket.io-client";
import { connectionAtom, roomAtom } from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";
import { apiService } from "./apiService";
import { BaseService } from "../baseService";

export class SocketService extends BaseService {
    protected name = "SocketService";
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private connectTimeout: NodeJS.Timeout | null = null;

    async connect(): Promise<string> {
        const currentSocketId = this.store.get(connectionAtom).socket;
        const isConnecting = this.store.get(connectionAtom).connecting;

        if (currentSocketId || isConnecting) {
            this.log("Already connected or connecting");
            return currentSocketId || "";
        }

        return new Promise((resolve, reject) => {
            this.log("Initiating connection...");

            this.store.set(connectionAtom, (prev) => ({
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
                this.log("Connected with ID:", socketId);

                this.reconnectAttempts = 0;

                this.store.set(connectionAtom, {
                    socket: socketId,
                    connecting: false,
                    error: null,
                });

                try {
                    // Request SID cookie after connection
                    await apiService.getCookie(socketId);
                    resolve(socketId);
                } catch (error) {
                    this.error("Failed to get cookie after connect:", error);
                    // We don't necessarily reject here if the socket is connected, 
                    // but the cookie is important for session.
                    resolve(socketId);
                }
            });

            this.socket.on("disconnect", (reason) => {
                this.log("Disconnected:", reason);
                if (this.connectTimeout) {
                    clearTimeout(this.connectTimeout);
                    this.connectTimeout = null;
                }

                this.store.set(connectionAtom, {
                    socket: null,
                    connecting: false,
                    error: reason === "io client disconnect" ? null : "Disconnected",
                });

                // Reset room state on disconnect
                this.store.set(roomAtom, { id: "", joined: false });
                this.store.set(gameStateAtom, null);
            });

            this.socket.on("connect_error", (error: Error) => {
                this.error("Connection error:", error);
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

            // Set timeout for connection attempt
            this.connectTimeout = setTimeout(() => {
                if (!this.socket?.connected && this.store.get(connectionAtom).connecting) {
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
        this.store.set(connectionAtom, {
            socket: null,
            connecting: false,
            error: error.message,
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.log("Disconnecting...");
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

    on(event: string, callback: (...args: any[]) => void): void {
        if (!this.socket) {
            this.warn(`Attempted to register listener for ${event} before socket initialization`);
            return;
        }
        this.socket.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void): void {
        if (!this.socket) return;
        this.socket.off(event, callback);
    }

    async emit<T>(event: string, ...args: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.socket || !this.socket.connected) {
                reject(new Error("Socket not connected"));
                return;
            }

            this.log(`Emitting event: ${event}`, args);

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
                    this.log(`Received response for: ${event}`, data);
                    resolve(data);
                }
            });
        });
    }
}

export const socketService = new SocketService();
