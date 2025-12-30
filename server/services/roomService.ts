import { gameState } from "@/gameInterfaces/gameState";
import { turnPhase } from "@/gameInterfaces/turnPhases";
import { ServerResponse } from "@/interfaces/serverResponse";

function randomRoomId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export class RoomService {
  private roomMap: Map<string, gameState> = new Map();
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
      turnPhase: turnPhase.preGame,
      players: {},
      currentPlayer: "",
      rollRepeat: 0,
      properties: {},
      propertyGroups: {},
      bank: {
        money: 0,
      },
      trades: [],
      auction: {
        active: false,
        property: "",
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

    console.log(`[RoomService] Room created: ${roomId}`);
    return roomId;
  }

  joinRoom(
    roomName: string,
    playerName: string,
    reconnectTry: boolean
  ): gameState | ServerResponse {
    const room = this.roomMap.get(roomName);

    if (!room)
      return {
        ok: false,
        code: "ROOM_NOT_FOUND",
        message: "Room not found",
      };

    if (reconnectTry) {
      if (room.players[playerName]) {
        room.players[playerName].disconnected = false;
        room.players[playerName].disconnectTime = 0;
        room.version++;
        return room;
      }
    }

    if (
      room.settings.maxPlayers <=
      Object.keys(room.players).length
    )
      return {
        ok: false,
        code: "ROOM_FULL",
        message: "Room is full",
      };

    console.log(
      `[RoomService] Adding player ${playerName} to room ${roomName}`
    );
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
    };
    this.playerToRoomMap.set(playerName, roomName);
    room.version++;
    return room;
  }

  leaveRoom(playerName: string): string {
    const roomName = this.playerToRoomMap.get(playerName);
    if (!roomName) return "";

    this.playerToRoomMap.delete(playerName);
    const room = this.roomMap.get(roomName);
    if (!room) return "";

    console.log(
      `[RoomService] Removing player ${playerName} from room ${roomName}`
    );
    if (room.turnPhase === turnPhase.preGame) {
      delete room.players[playerName];
    } else {
      room.players[playerName].bankrupted = true;
      room.players[playerName].properties.length = 0;
      room.players[playerName].cards.length = 0;
    }
    room.version++;
    return roomName;
  }

  handleDisconnect(playerName: string): string {
    const roomName = this.playerToRoomMap.get(playerName);
    if (!roomName) return "";

    const room = this.roomMap.get(roomName);
    if (!room) return "";

    room.players[playerName].disconnected = true;
    room.players[playerName].disconnectTime = Date.now();
    room.version++;
    return roomName;
  }

  getRoom(roomId: string): gameState | undefined {
    return this.roomMap.get(roomId);
  }

  getRoomForPlayer(playerName: string): string {
    return this.playerToRoomMap.get(playerName) || "";
  }
}

export const roomService = new RoomService();
