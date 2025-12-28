import { gameState } from "@/gameInterfaces/gameState";
import { turnPhase } from "@/gameInterfaces/turnPhases";
import { ServerResponse } from "@/interfaces/serverResponse";

function randomRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export const roomMap: Map<string, gameState> = new Map<string, gameState>();
export const playerToRoomMap: Map<string, string> = new Map<string, string>();

export function createRoom() {
    let roomId = randomRoomId();
    while (roomMap.has(roomId)) {
        roomId = randomRoomId();
    }
    roomMap.set(roomId, {
        admin: "",
        usedColors: [],
        dice: [0, 0],
        turnPhase: turnPhase.preGame,
        players: {},
        currentPlayer: "",
        rollRepeat: 0,
        properties: {},
        propertyGroups: {},
        bank: {
            money: 0
        },
        trades: [],
        auction: {
            active: false,
            property: "",
            highestBid: 0,
            highestBidder: "",
            auctionTimer: 0,
            log: []
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
        version: 0
    });
    console.log(`[Server] Room created: ${roomId}`);
    return roomId;
}
export function handleJoinRoom(roomName: string, playerName: string): gameState | ServerResponse {
    const room = roomMap.get(roomName);

    if (!room) return { ok: false, code: "ROOM_NOT_FOUND", message: "Room not found" };
    if (room.settings.maxPlayers <= Object.keys(room.players).length) return { ok: false, code: "ROOM_FULL", message: "Room is full" };

    console.log(`[Server] Adding player ${playerName} to room ${roomName}`);

    if (room.players[playerName]) {
        room.players[playerName].disconnected = false;
        room.players[playerName].disconnectTime = 0;
    }
    else {
        room.players[playerName] = {
            name: playerName,
            color: "nothing",
            money: 1500,
            properties: [],
            cards: [],
            bankrupted: false,
            position: 0,
            inJail: false,
            jailTurns: 0,
            turnTime: 0,
            disconnected: false,
            disconnectTime: 0,
        }
        playerToRoomMap.set(playerName, roomName);
    }
    room.version++;
    return room;
}

export function handleLeaveRoom(playerName: string): string {
    const roomName = playerToRoomMap.get(playerName);
    if (!roomName) return "";
    playerToRoomMap.delete(playerName);
    const room = roomMap.get(roomName);
    if (!room) return "";
    console.log(`[Server] Removing player ${playerName} from room ${roomName}`);
    if (room.turnPhase == turnPhase.preGame) {
        delete room.players[playerName];
    }
    else {
        room.players[playerName].bankrupted = true;
        room.players[playerName].properties.length = 0;
        room.players[playerName].cards.length = 0;
    }
    room.version++;
    return roomName;
}

export function handleDisconnect(playerName: string): string {
    const roomName = playerToRoomMap.get(playerName);
    if (!roomName) return "";
    const room = roomMap.get(roomName);
    if (!room) return "";
    room.players[playerName].disconnected = true;
    room.players[playerName].disconnectTime = Date.now();
    room.version++;
    return roomName;
}
