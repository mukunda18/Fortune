import { TurnPhase } from "@/gameInterfaces/turnPhases";
import { BaseService } from "../baseService";
import { GameState } from "@/gameInterfaces/gameState";
import { PLAYER_COLORS } from "@/gameInterfaces/color";

const DEFAULT_NAMES = [
    "ShadowVex", "NeonRaptor", "VoidStrike", "FrostByte", "DarkPulse",
    "EmberKnight", "RuneWarden", "NightDrake", "NovaCore", "PixelPhantom",
    "QuantumZed", "Zynx", "Nox", "Raze", "LagWizard"
];

export class GameService extends BaseService {
    protected name = "GameService";
    public gameState: GameState;
    private remainingNames: Set<string>;

    constructor(roomId: string) {
        super();
        this.name = `GameService-${roomId}`;
        this.remainingNames = new Set<string>(DEFAULT_NAMES);
        this.gameState = {
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
        }
    }

    addPlayer(playerName: string): { success: boolean, isReconnection: boolean, player?: any, message?: string, name?: string } {
        let effectiveName = playerName;
        let playerExists = !!this.gameState.players[effectiveName];

        if (!effectiveName || (playerExists && !this.gameState.players[effectiveName].isDisconnected)) {
            do {
                effectiveName = this.getName();
                playerExists = !!this.gameState.players[effectiveName];
            } while (playerExists);
        }

        if (this.gameState.players[effectiveName]) {
            const player = this.gameState.players[effectiveName];
            if (player.isDisconnected) {
                player.isDisconnected = false;
                player.disconnectTime = 0;
                this.log(`Player ${effectiveName} reconnected`);
                return { success: true, isReconnection: true, player, name: effectiveName };
            } else {
                return { success: false, isReconnection: false, message: "Name taken" };
            }
        }

        if (Object.keys(this.gameState.players).length >= this.gameState.settings.maxPlayers) {
            return { success: false, isReconnection: false, message: "Room is full" };
        }
        if (this.gameState.turnPhase !== TurnPhase.WAITING_FOR_PLAYERS) {
            return { success: false, isReconnection: false, message: "Game already in progress" };
        }

        const usedColors = this.gameState.usedColors;
        const startingCash = this.gameState.settings.startingCash;
        const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color));
        const color = availableColors.length > 0 ? availableColors[0] : "nothing";
        usedColors.push(color);

        this.gameState.players[effectiveName] = {
            name: effectiveName,
            color: color,
            money: startingCash,
            properties: [],
            cards: [],
            isBankrupt: false,
            position: 0,
            inJail: false,
            jailTurns: 0,
            turnTime: 0,
            isDisconnected: false,
            disconnectTime: 0,
        };

        if (!this.gameState.admin) this.gameState.admin = effectiveName;

        this.log(`Player ${effectiveName} joined`);
        return { success: true, isReconnection: false, player: this.gameState.players[effectiveName], name: effectiveName };
    }

    removePlayer(playerName: string) {
        const player = this.gameState.players[playerName];
        if (!player) return;

        this.gameState.usedColors = this.gameState.usedColors.filter(c => c !== player.color);

        delete this.gameState.players[playerName];

        this.putName(playerName);
        if (this.gameState.admin === playerName) {
            const remainingPlayers = Object.keys(this.gameState.players).filter(p =>
                !this.gameState.players[p].isBankrupt && !this.gameState.players[p].isDisconnected
            );
            this.gameState.admin = remainingPlayers.length > 0 ? remainingPlayers[0] : "";
        }

        this.log(`Player ${playerName} left`);
    }

    disconnectPlayer(playerName: string) {
        const player = this.gameState.players[playerName];
        if (!player) return;

        if (this.gameState.turnPhase === TurnPhase.WAITING_FOR_PLAYERS) {
            this.removePlayer(playerName);
            return;
        }

        player.isDisconnected = true;
        player.disconnectTime = Date.now();
        this.log(`Player ${playerName} disconnected`);
    }

    getName(): string {
        if (this.remainingNames.size === 0) {
            return `Player${Object.keys(this.gameState.players).length + 1}`;
        }
        const namesArray = Array.from(this.remainingNames);
        const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];
        this.remainingNames.delete(randomName);
        return randomName;
    }

    putName(name: string) {
        if (DEFAULT_NAMES.includes(name)) {
            this.remainingNames.add(name);
        }
    }
}