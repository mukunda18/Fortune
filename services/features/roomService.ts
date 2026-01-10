import { socketService } from "../core/socketService";
import { apiService } from "../core/apiService";
import { roomAtom, playerNameAtom } from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";
import { gameState } from "@/gameInterfaces/gameState";
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
        socketService.on("updateRoom", (room: gameState) => {
            this.log("Room updated:", room.version);
            this.store.set(gameStateAtom, room);
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
            const response = await socketService.emit<gameState | ServerResponse>(
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

    leaveRoom(): void {
        const room = this.store.get(roomAtom);

        if (!socketService.isConnected() || !room.joined) {
            this.log("Not in a room or not connected");
            return;
        }

        try {
            this.log("Leaving room...");
            socketService.emit("leaveRoom");
            this.store.set(roomAtom, { id: "", joined: false });
            this.store.set(gameStateAtom, null);
        } catch (error) {
            this.error("Error leaving room:", error);
            this.store.set(roomAtom, { id: "", joined: false });
            this.store.set(gameStateAtom, null);
        }
    }
}

export const roomService = new RoomService();
