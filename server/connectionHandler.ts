import type { Server, Socket } from "socket.io";
import { handleJoinRoom, handleLeaveRoom, handleDisconnect } from "./gameRooms";
import { gameState } from "@/gameInterfaces/gameState";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";
import { roomMap } from "./gameRooms";

const socketToPlayerMap: Map<string, string> = new Map<string, string>();

export const connectionHandler = (io: Server, socket: Socket): void => {
    console.log("[Server] Client connected: " + socket.id);

    socket.on("disconnect", () => {
        console.log("[Server] Client disconnected: " + socket.id);
        const playerName = socketToPlayerMap.get(socket.id);
        if (!playerName) return;
        const roomName = handleDisconnect(playerName);
        if (roomName) {
            socket.to(roomName).emit("updateRoom", roomMap.get(roomName));
        }
    });

    socket.on("joinRoom", (roomId: string, playerName: string, callback: (response: gameState | ServerResponse) => void) => {
        console.log(`[Server] joinRoom request: socket=${socket.id}, room=${roomId}, player=${playerName}`);
        const response = handleJoinRoom(roomId, playerName);
        if (isServerResponse(response)) {
            callback(response);
            return;
        }
        socket.join(roomId);
        socketToPlayerMap.set(socket.id, playerName);
        callback(response);
        socket.to(roomId).emit("updateRoom", roomMap.get(roomId));
    });

    socket.on("leaveRoom", () => {
        console.log(`[Server] leaveRoom request: socket=${socket.id}`);
        const playerName = socketToPlayerMap.get(socket.id);
        if (!playerName) return;

        const roomToLeave = handleLeaveRoom(playerName);
        if (!roomToLeave) return;

        socketToPlayerMap.delete(socket.id);
        socket.leave(roomToLeave);
        io.to(roomToLeave).emit("updateRoom", roomMap.get(roomToLeave));
    });
}
