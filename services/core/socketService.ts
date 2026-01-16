import { io, type Socket } from "socket.io-client";
import { connectionAtom } from "@/stores/roomStore";
import { apiService } from "./apiService";
import { BaseService } from "../baseService";

export class SocketService extends BaseService {
    protected name = "SocketService";
    private socket: Socket | null = null;

    private listenerBuffer: Map<string, Array<(...args: any[]) => void>> = new Map();

    async connect(): Promise<string> {
        const currentSocketId = this.store.get(connectionAtom).socket;
        const isConnecting = this.store.get(connectionAtom).connecting;

        if ((currentSocketId || isConnecting) && this.socket) {
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
                transports: ["websocket"],
            });

            this.listenerBuffer.forEach((callbacks, event) => {
                callbacks.forEach(cb => this.socket?.on(event, cb));
            });

            this.socket.on("connect", async () => {

                if (!this.socket?.id) {
                    const error = new Error("Socket connected but no ID");
                    this.handleConnectionError(error);
                    reject(error);
                    return;
                }

                const socketId = this.socket.id;
                this.log("Connected with ID:", socketId);


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

                this.store.set(connectionAtom, {
                    socket: null,
                    connecting: false,
                    error: reason === "io client disconnect" ? null : "Disconnected",
                });
            });

            this.socket.on("connect_error", (error: Error) => {
                if (error.message !== this.store.get(connectionAtom).error) {
                    this.log("Connection attempt failed:", error.message);
                }

                this.store.set(connectionAtom, (prev) => ({
                    ...prev,
                    connecting: false,
                    error: "Disconnected",
                }));
            });
        });
    }

    private handleConnectionError(error: Error) {
        this.store.set(connectionAtom, {
            socket: null,
            connecting: false,
            error: "Disconnected",
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.log("Disconnecting...");
            this.socket.disconnect();
            this.socket = null;

            this.store.set(connectionAtom, {
                socket: null,
                connecting: false,
                error: null,
            });
        }
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    getSocketId(): string | null {
        return this.socket?.id ?? null;
    }

    on(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }

        // Always buffer the listener so it persists across re-connections
        const listeners = this.listenerBuffer.get(event) || [];
        listeners.push(callback);
        this.listenerBuffer.set(event, listeners);
    }

    off(event: string, callback?: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        }

        if (callback) {
            const listeners = this.listenerBuffer.get(event) || [];
            const newListeners = listeners.filter(l => l !== callback);
            if (newListeners.length > 0) {
                this.listenerBuffer.set(event, newListeners);
            } else {
                this.listenerBuffer.delete(event);
            }
        } else {
            this.listenerBuffer.delete(event);
        }
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
