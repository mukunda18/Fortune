import { gameState } from "@/gameInterfaces/gameState";
import { turnPhase } from "@/gameInterfaces/turnPhases";


function randomRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export const roomMap: Map<string, gameState> = new Map<string, gameState>();
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
    });
    console.log(`[Server] Room created: ${roomId}`);
    return roomId;
}
export function addPlayer(roomName: string, playerName: string) {
    const room = roomMap.get(roomName);
    if (!room) return;
    console.log(`[Server] Adding player ${playerName} to room ${roomName}`);
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
}

export function removePlayer(roomName: string, playerName: string) {
    const room = roomMap.get(roomName);
    if (!room) return;
    console.log(`[Server] Removing player ${playerName} from room ${roomName}`);
    if (room.turnPhase == turnPhase.preGame) {
        delete room.players[playerName];
    }
    else {
        room.players[playerName].bankrupted = true;
        room.players[playerName].properties.length = 0;
        room.players[playerName].cards.length = 0;
    }
}
