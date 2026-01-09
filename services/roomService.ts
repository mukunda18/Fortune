import { getDefaultStore } from "jotai";
import { socketService } from "./socketService";
import { apiService } from "./apiService";
import { roomAtom, playerNameAtom } from "@/stores/roomStore";
import { gameStateAtom } from "@/stores/gameStore";
import { gameState } from "@/gameInterfaces/gameState";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";

const store = getDefaultStore();

export class RoomService {
    async createRoom(): Promise<string> {
        try {
            console.log("[RoomService] Creating room...");
            const roomId = await apiService.createRoom();
            console.log("[RoomService] Room created:", roomId);
            return roomId;
        } catch (error) {
            console.error("[RoomService] Failed to create room:", error);
            throw error;
        }
    }

    async joinRoom(roomId: string): Promise<void> {
        if (!roomId) {
            throw new Error("Room ID is required");
        }

        if (!socketService.isConnected()) {
            console.log("[RoomService] Socket not connected, connecting first...");
            await socketService.connect();
        }

        const playerName = store.get(playerNameAtom);

        try {
            console.log("[RoomService] Joining room:", roomId);
            const response = await socketService.emit<gameState | ServerResponse>(
                "joinRoom",
                roomId,
                playerName
            );

            if (isServerResponse(response)) {
                console.error("[RoomService] Join room failed:", response.message);
                store.set(roomAtom, { id: "", joined: false });
                throw new Error(response.message);
            }

            store.set(gameStateAtom, response);
            store.set(roomAtom, { id: roomId, joined: true });
            console.log("[RoomService] Joined room successfully");
        } catch (error) {
            console.error("[RoomService] Error joining room:", error);
            store.set(roomAtom, { id: "", joined: false });
            throw error;
        }
    }

    leaveRoom(): void {
        const room = store.get(roomAtom);

        if (!socketService.isConnected() || !room.joined) {
            console.log("[RoomService] Not in a room or not connected");
            return;
        }

        try {
            console.log("[RoomService] Leaving room...");
            socketService.emit("leaveRoom");
            store.set(roomAtom, { id: "", joined: false });
            store.set(gameStateAtom, null);
        } catch (error) {
            console.error("[RoomService] Error leaving room:", error);
            store.set(roomAtom, { id: "", joined: false });
            store.set(gameStateAtom, null);
        }
    }
}

export const roomService = new RoomService();
