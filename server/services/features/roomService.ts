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

        let nameToUse = playerName;
        const prevPlayerName = socketSessionService.getPlayerForSocket(socket.id);

        if (prevPlayerName) {
            const previousRoom = this.playerToRoomMap.get(prevPlayerName);
            if (previousRoom && previousRoom !== roomName) {
                this.leaveRoom(prevPlayerName, io, socket);
            } else if (previousRoom === roomName) {
                nameToUse = prevPlayerName;
            }
        }

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

        socket.join(roomName);
        socketSessionService.mapSocketToPlayer(socket.id, finalName);
        socket.to(roomName).emit("updateRoom", room);

        return room;
    }

    leaveRoom(playerName: string, io: Server, socket?: Socket): void {
        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) return;

        this.playerToRoomMap.delete(playerName);

        const gameService = this.roomMap.get(roomName);
        if (!gameService) return;

        gameService.removePlayer(playerName);

        if (socket) {
            socketSessionService.unmapSocket(socket.id);
            socket.leave(roomName);
        }

        io.to(roomName).emit("updateRoom", gameService.gameState);
    }

    disconnect(io: Server, socketId: string, playerName: string): void {
        if (!playerName) return;

        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) return;

        const gameService = this.roomMap.get(roomName);
        if (!gameService) return;


        if (gameService.gameState.turnPhase === "WAITING_FOR_PLAYERS") {
            socketSessionService.unmapSocket(socketId);
            this.playerToRoomMap.delete(playerName);
            gameService.removePlayer(playerName);
        } else {
            gameService.disconnectPlayer(playerName);
        }

        io.to(roomName).emit("updateRoom", gameService.gameState);
    }

    updateSettings(io: Server, playerName: string, newSettings: any): void {
        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) {
            this.log(`Player ${playerName} not in any room`);
            return;
        }

        const gameService = this.roomMap.get(roomName);
        if (!gameService) {
            this.log(`Room ${roomName} not found`);
            return;
        }

        if (gameService.gameState.admin !== playerName) {
            this.log(`Non-admin ${playerName} tried to update settings in ${roomName} (Admin is ${gameService.gameState.admin})`);
            return;
        }

        if (gameService.gameState.turnPhase !== "WAITING_FOR_PLAYERS") {
            this.log(`Game in progress in ${roomName}`);
            return;
        }

        gameService.updateSettings(newSettings);

        io.to(roomName).emit("updateRoom", gameService.gameState);
        this.log(`Settings updated for room ${roomName} by admin ${playerName}:`, newSettings);
    }

    getRoom(roomId: string): GameState | undefined {
        return this.roomMap.get(roomId)?.gameState;
    }

    startGame(playerName: string, io: Server): void {
        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) {
            this.log(`Player ${playerName} not in any room`);
            return;
        }
        const gameService = this.roomMap.get(roomName);
        if (!gameService) {
            this.log(`Room ${roomName} not found`);
            return;
        }
        const success = gameService.startGame(playerName);
        if (!success) {
            this.log(`Player ${playerName} is not the admin`);
            return;
        }
        io.to(roomName).emit("updateRoom", gameService.gameState);
    }
}

export const roomService = new RoomService();
