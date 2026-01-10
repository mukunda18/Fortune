import { GameState } from "@/gameInterfaces/gameState";
import { TurnPhase } from "@/gameInterfaces/turnPhases";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";
import { PLAYER_COLORS } from "@/gameInterfaces/color";
import { BaseService } from "../baseService";
import type { Server, Socket } from "socket.io";
import { socketSessionService } from "../core/socketSessionService";

function randomRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export class RoomService extends BaseService {
    protected name = "RoomService";
    private roomMap: Map<string, GameState> = new Map();
    private playerToRoomMap: Map<string, string> = new Map();

    createRoom(): string {
        let roomId = randomRoomId();
        while (this.roomMap.has(roomId)) {
            roomId = randomRoomId();
        }

        this.roomMap.set(roomId, {
            admin: "",
            usedColors: [],
            dice: [0, 0],
            turnPhase: TurnPhase.WAITING_FOR_PLAYERS,
            players: {},
            currentPlayer: "",
            rollRepeat: 0,
            properties: {},
            propertyGroups: {},
            bank: {
                money: 0,
                houses: 32,
                hotels: 12,
            },
            trades: [],
            auction: {
                active: false,
                propertyId: "",
                highestBid: 0,
                highestBidder: "",
                auctionTimer: 0,
                log: [],
            },
            settings: {
                minPlayers: 2,
                maxPlayers: 8,
                privateRoom: false,
                allowBots: false,
                doubleRentOnFullSet: false,
                vacationCash: false,
                auction: false,
                noRentInPrison: false,
                mortgage: false,
                evenBuild: false,
                startingCash: 1500,
                randomizePlayerOrder: false,
            },
            gameHistory: [],
            version: 0,
        });

        this.log(`Room created: ${roomId}`);
        return roomId;
    }

    joinRoom(
        io: Server,
        socket: Socket,
        roomName: string,
        playerName: string
    ): GameState | ServerResponse {
        const reconnectTry = socketSessionService.getPlayerForSocket(socket.id) === playerName;
        const room = this.roomMap.get(roomName);
        if (!room) {
            return { ok: false, code: "ROOM_NOT_FOUND", message: "Room not found" };
        }

        if (reconnectTry) {
            const player = room.players[playerName];
            if (player) {
                player.isDisconnected = false;
                player.disconnectTime = 0;
                this.log(`Player ${playerName} reconnected to room ${roomName}`);
                if (!room.admin) room.admin = playerName;
                room.version++;

                socket.join(roomName);
                socketSessionService.mapSocketToPlayer(socket.id, playerName);
                socket.to(roomName).emit("updateRoom", room);

                return room;
            } else if (this.playerToRoomMap.get(playerName) !== roomName) {
                this.leaveRoom(playerName, io, socket);
            }
        }

        if (Object.keys(room.players).length >= room.settings.maxPlayers) {
            return { ok: false, code: "ROOM_FULL", message: "Room is full" };
        }
        if (room.turnPhase !== TurnPhase.WAITING_FOR_PLAYERS) {
            return { ok: false, code: "GAME_IN_PROGRESS", message: "Game already in progress" };
        }

        room.players[playerName] = this.createPlayer(playerName, room.usedColors);
        this.playerToRoomMap.set(playerName, roomName);

        if (!room.admin) room.admin = playerName;

        this.log(`Player ${playerName} joined room ${roomName}`);
        room.version++;

        socket.join(roomName);
        socketSessionService.mapSocketToPlayer(socket.id, playerName);
        socket.to(roomName).emit("updateRoom", room);

        return room;
    }

    leaveRoom(playerName: string, io?: Server, socket?: Socket): string {
        const roomName = this.playerToRoomMap.get(playerName);
        if (!roomName) return "";
        const room = this.roomMap.get(roomName);
        if (!room) return "";

        room.usedColors = room.usedColors.filter(color => color !== room.players[playerName]?.color);
        delete room.players[playerName];
        this.playerToRoomMap.delete(playerName);

        if (room.admin === playerName) {
            const remainingPlayers = Object.keys(room.players).filter(player => !(room.players[player].isBankrupt) && !(room.players[player].isDisconnected));
            room.admin = remainingPlayers.length > 0 ? remainingPlayers[0] : "";
        }

        this.log(`Player ${playerName} left room ${roomName}`);
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

        const room = this.roomMap.get(roomName);
        if (!room) return;

        room.players[playerName].isDisconnected = true;
        room.players[playerName].disconnectTime = Date.now();
        room.version++;

        this.log(`Player ${playerName} disconnected from room ${roomName}`);
        io.to(roomName).emit("updateRoom", room);
    }

    getRoom(roomId: string): GameState | undefined {
        return this.roomMap.get(roomId);
    }

    getRoomForPlayer(playerName: string): string {
        return this.playerToRoomMap.get(playerName) || "";
    }

    createPlayer(playerName: string, usedColors: string[] = []) {
        const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color));
        const color = availableColors.length > 0 ? availableColors[0] : "nothing";
        usedColors.push(color);

        return ({
            id: Math.random().toString(36).substring(2, 9),
            name: playerName,
            color: color,
            money: 1500,
            properties: [],
            cards: [],
            isBankrupt: false,
            position: 0,
            inJail: false,
            jailTurns: 0,
            turnTime: 0,
            isDisconnected: false,
            disconnectTime: 0,
        });
    }
}

export const roomService = new RoomService();
