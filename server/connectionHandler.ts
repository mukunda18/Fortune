import type { Server, Socket } from "socket.io";
import { addPlayer, removePlayer } from "./gameRooms";
import { gameState } from "@/gameInterfaces/gameState";
import { roomMap } from "./gameRooms";

const socketToPlayerMap: Map<string, string> = new Map<string, string>();
const playerToRoomMap: Map<string, string> = new Map<string, string>();

export const connectionHandler = (io: Server, socket: Socket): void => {
    console.log("[Server] Client connected: " + socket.id);

    socket.on("disconnect", () => {
        console.log("[Server] Client disconnected: " + socket.id);
        const playerName = socketToPlayerMap.get(socket.id);
        if (playerName) {
            const roomName = playerToRoomMap.get(playerName);
            if (roomName) {
                removePlayer(roomName, playerName);
                playerToRoomMap.delete(playerName);
                const state = roomMap.get(roomName);
                if (state) {
                    io.to(roomName).emit("roomUpdate", state);
                }
            }
            socketToPlayerMap.delete(socket.id);
        }
    });

    socket.on("joinRoom", (roomId: string, playerName: string, callback: (gameState: gameState | null) => void) => {
        console.log(`[Server] joinRoom request: socket=${socket.id}, room=${roomId}, player=${playerName}`);
        if (!roomMap.has(roomId)) {
            console.warn(`[Server] Room not found: ${roomId}`);
            callback(null);
            return;
        }
        if (roomMap.get(roomId)?.players[playerName]) {
            console.warn(`[Server] Player already in room: ${playerName}`);
            callback(null);
            return;
        }

        addPlayer(roomId, playerName);
        socketToPlayerMap.set(socket.id, playerName);
        playerToRoomMap.set(playerName, roomId);
        socket.join(roomId);
        const state = roomMap.get(roomId) || null;
        callback(state);

        if (state) {
            io.to(roomId).emit("roomUpdate", state);
        }
    });

    socket.on("leaveRoom", () => {
        console.log(`[Server] leaveRoom request: socket=${socket.id}`);
        const playerName = socketToPlayerMap.get(socket.id);
        if (playerName) {
            const roomName = playerToRoomMap.get(playerName);
            if (roomName) {
                removePlayer(roomName, playerName);
                playerToRoomMap.delete(playerName);
                socket.leave(roomName);
            }
        }
    });
}