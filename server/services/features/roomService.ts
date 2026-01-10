import { GameState } from "@/gameInterfaces/gameState";
import { ServerResponse } from "@/interfaces/serverResponse";
import { BaseService } from "../baseService";
import type { Server, Socket } from "socket.io";
import { socketSessionService } from "../core/socketSessionService";
import { GameService } from "./gameService";

function randomRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export class RoomService extends BaseService {
    protected name = "RoomService";
    private roomMap: Map<string, GameService> = new Map();
    private playerToRoomMap: Map<string, string> = new Map();

    createRoom(): string {
        let roomId = randomRoomId();
        while (this.roomMap.has(roomId)) {
            roomId = randomRoomId();
        }

        const gameService = new GameService(roomId);
        this.roomMap.set(roomId, gameService);

        this.log(`Room created: ${roomId}`);
        return roomId;
    }

    joinRoom(
        io: Server,
        socket: Socket,
        roomName: string,
        playerName: string
    ): GameState | ServerResponse {
        const gameService = this.roomMap.get(roomName);
        if (!gameService) {
            return { ok: false, code: "ROOM_NOT_FOUND", message: "Room not found" };
        }

        const prevPlayerName = socketSessionService.getPlayerForSocket(socket.id);
        if (prevPlayerName) {
            const previousRoom = this.playerToRoomMap.get(prevPlayerName);
            if (previousRoom && previousRoom !== roomName) {
                this.leaveRoom(prevPlayerName, io, socket);
            }
        }

        const nameToUse = prevPlayerName || playerName || "";

        const result = gameService.addPlayer(nameToUse);

        if (!result.success) {
            return { ok: false, code: "JOIN_FAILED", message: result.message || "Failed to join room" };
        }

        const finalName = result.name || nameToUse;
        const room = gameService.gameState;

        this.playerToRoomMap.set(finalName, roomName);

        if (finalName !== playerName) {
            socket.emit("changePlayerName", finalName);
        }

        room.version++;

        socket.join(roomName);
        socketSessionService.mapSocketToPlayer(socket.id, finalName);
        socket.to(roomName).emit("updateRoom", room);

        return room;
    }

    leaveRoom(playerName: string, io?: Server, socket?: Socket): string {
        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) return "";
        const gameService = this.roomMap.get(roomName);
        if (!gameService) return "";

        gameService.removePlayer(playerName);
        this.playerToRoomMap.delete(playerName);

        const room = gameService.gameState;

        room.version++;

        if (socket && io) {
            socketSessionService.unmapSocket(socket.id);
            socket.leave(roomName);
            io.to(roomName).emit("updateRoom", this.getRoom(roomName));
        }

        return roomName;
    }

    disconnect(io: Server, socketId: string): void {
        const playerName = socketSessionService.getPlayerForSocket(socketId);
        if (!playerName) return;

        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) return;

        const gameService = this.roomMap.get(roomName);
        if (!gameService) return;

        gameService.disconnectPlayer(playerName);

        const room = gameService.gameState;
        room.version++;

        io.to(roomName).emit("updateRoom", room);
    }

    getRoom(roomId: string): GameState | undefined {
        return this.roomMap.get(roomId)?.gameState;
    }
}

export const roomService = new RoomService();
