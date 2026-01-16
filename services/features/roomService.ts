import { socketService } from "../core/socketService";
import { apiService } from "../core/apiService";
import { roomAtom, playerNameAtom } from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";
import { GameState } from "@/gameInterfaces/gameState";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";
import { BaseService } from "../baseService";

export class RoomService extends BaseService {
    protected name = "RoomService";

    constructor() {
        super();
        this.registerListeners();
    }

    private registerListeners() {
        // Handle room updates from socket
        socketService.on("updateRoom", (room: GameState) => {
            this.log("Room updated:", room.version);
            this.store.set(gameStateAtom, room);
        });
        socketService.on("changePlayerName", (playerName: string) => {
            this.log("Player name changed:", playerName);
            this.store.set(playerNameAtom, playerName);
        });
    }

    async createRoom(): Promise<string> {
        try {
            this.log("Creating room...");
            const roomId = await apiService.createRoom();
            this.log("Room created:", roomId);
            return roomId;
        } catch (error) {
            this.error("Failed to create room:", error);
            throw error;
        }
    }

    async joinRoom(roomId: string): Promise<void> {
        if (!roomId) {
            throw new Error("Room ID is required");
        }

        if (!socketService.isConnected()) {
            this.log("Socket not connected, connecting first...");
            await socketService.connect();
        }

        const playerName = this.store.get(playerNameAtom);

        try {
            this.log("Joining room:", roomId);
            const response = await socketService.emit<GameState | ServerResponse>(
                "joinRoom",
                roomId,
                playerName
            );

            if (isServerResponse(response)) {
                this.error("Join room failed:", response.message);
                this.store.set(roomAtom, { id: "", joined: false });
                throw new Error(response.message);
            }

            this.store.set(gameStateAtom, response);
            this.store.set(roomAtom, { id: roomId, joined: true });
            this.log("Joined room successfully");
        } catch (error) {
            this.error("Error joining room:", error);
            this.store.set(roomAtom, { id: "", joined: false });
            throw error;
        }
    }

    async leaveRoom(): Promise<void> {
        const room = this.store.get(roomAtom);

        if (!socketService.isConnected() || !room.joined) {
            this.log("Not in a room or not connected");
            return;
        }

        try {
            this.log("Leaving room...");
            await socketService.emit("leaveRoom");
            this.store.set(roomAtom, { id: "", joined: false });
            this.store.set(gameStateAtom, null);
        } catch (error) {
            this.error("Error leaving room:", error);
            this.store.set(roomAtom, { id: "", joined: false });
            this.store.set(gameStateAtom, null);
        }
    }

    async updateSettings(settings: any): Promise<void> {
        try {
            this.log("Updating settings:", settings);
            await socketService.emit("updateSettings", settings);
            this.log("Settings update sent successfully");
        } catch (error) {
            this.error("Failed to update settings:", error);
        }
    }
    async startGame(): Promise<void> {
        try {
            this.log("Starting game...");
            await socketService.emit("startGame");
            this.log("Game started successfully");
        } catch (error) {
            this.error("Failed to start game:", error);
        }
    }
}

export const roomService = new RoomService();
