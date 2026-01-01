import { gameState } from "@/gameInterfaces/gameState";
import { turnPhase } from "@/gameInterfaces/turnPhases";
import { ServerResponse } from "@/interfaces/serverResponse";
import { PLAYER_COLORS } from "@/gameInterfaces/color";

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
    if (!room) {
      return { ok: false, code: "ROOM_NOT_FOUND", message: "Room not found" };
    }
    if (reconnectTry){
      const player = room.players[playerName];
      if (player){
        player.disconnected = false;
        player.disconnectTime = 0;
        console.log(
          `[RoomService] Player ${playerName} reconnected to room ${roomName}`
        );
        if (!room.admin) room.admin = playerName;
        room.version++;
        
        return room;
      }
      else if (this.playerToRoomMap.get(playerName) !== roomName){
        this.leaveRoom(playerName);
      }
    }
    if (Object.keys(room.players).length >= room.settings.maxPlayers) {
      return { ok: false, code: "ROOM_FULL", message: "Room is full" };
    }
    if (room.turnPhase !== turnPhase.preGame) {
      return { ok: false, code: "GAME_IN_PROGRESS", message: "Game already in progress" };
    }

    room.players[playerName] = this.createPlayer(playerName, room.usedColors);
    this.playerToRoomMap.set(playerName, roomName);

    if (!room.admin) room.admin = playerName;

    console.log(
      `[RoomService] Player ${playerName} joined room ${roomName}`
    );
    room.version++;
    return room;
  }

  leaveRoom(playerName: string): string {
    const roomName = this.playerToRoomMap.get(playerName);
    if (!roomName) return "";
    const room = this.roomMap.get(roomName);
    if (!room) return "";
    
    room.usedColors = room.usedColors.filter(color => color !== room.players[playerName]?.color);
    delete room.players[playerName];
    this.playerToRoomMap.delete(playerName);

    if (room.admin === playerName) {
      const remainingPlayers = Object.keys(room.players).filter(player => !(room.players[player].bankrupted) && !(room.players[player].disconnected));
      room.admin = remainingPlayers.length > 0 ? remainingPlayers[0] : "";
    }

    console.log(
      `[RoomService] Player ${playerName} left room ${roomName}`
    );
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

  createPlayer(playerName: string, usedColors: string[] = []) {
    const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color));
    const color = availableColors.length > 0 ? availableColors[0] : "nothing";
    usedColors.push(color);

    return ({
      name: playerName,
      color: color,
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
    });
  }
}

export const roomService = new RoomService();
