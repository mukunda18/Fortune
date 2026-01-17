import { TurnPhase } from "@/gameInterfaces/turnPhases";
import { BaseService } from "../baseService";
import { GameState } from "@/gameInterfaces/gameState";
import { PLAYER_COLORS } from "@/gameInterfaces/color";
import { PROPERTIES, PROPERTY_GROUPS } from "@/seeds/locations";

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
            dice: [1, 1],
            turnPhase: TurnPhase.WAITING_FOR_PLAYERS,
            players: {},
            currentPlayer: "",
            rollRepeat: 0,
            properties: JSON.parse(JSON.stringify(PROPERTIES)),
            propertyGroups: JSON.parse(JSON.stringify(PROPERTY_GROUPS)),
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
        const existingPlayer = this.gameState.players[playerName];

        if (existingPlayer) {
            if (existingPlayer.isDisconnected) {
                existingPlayer.isDisconnected = false;
                existingPlayer.disconnectTime = 0;
                this.gameState.version++;
                this.log(`Player ${playerName} reconnected`);
                return { success: true, isReconnection: true, name: playerName };
            }
        }

        if (Object.keys(this.gameState.players).length >= this.gameState.settings.maxPlayers) {
            return { success: false, isReconnection: false, message: "Room is full" };
        }

        if (this.gameState.turnPhase !== TurnPhase.WAITING_FOR_PLAYERS) {
            return { success: false, isReconnection: false, message: "Game already in progress" };
        }

        let effectiveName = playerName;
        if (!effectiveName || this.gameState.players[effectiveName]) {
            effectiveName = this.getName();
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

        this.gameState.version++;
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

        this.gameState.version++;
        this.log(`Player ${playerName} left`);
    }

    disconnectPlayer(playerName: string) {
        const player = this.gameState.players[playerName];
        if (!player) return;

        player.isDisconnected = true;
        player.disconnectTime = Date.now();
        this.gameState.version++;
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

    updateSettings(newSettings: any) {
        if (newSettings.maxPlayers !== undefined) {
            const minAllowed = this.gameState.settings.minPlayers;
            newSettings.maxPlayers = Math.min(8, Math.max(minAllowed, parseInt(newSettings.maxPlayers)));
        }

        if (newSettings.startingCash !== undefined) {
            const rounded = Math.round(parseInt(newSettings.startingCash) / 100) * 100;
            newSettings.startingCash = Math.max(500, rounded);
        }

        this.gameState.settings = { ...this.gameState.settings, ...newSettings };
        this.gameState.version++;
    }

    startGame(playerName: string): boolean {
        if (this.gameState.admin === playerName) {
            const playerIds = Object.keys(this.gameState.players);
            if (playerIds.length < this.gameState.settings.minPlayers) {
                this.log(`Cannot start game: not enough players (min ${this.gameState.settings.minPlayers})`);
                return false;
            }

            this.gameState.turnPhase = TurnPhase.PRE_ROLL;
            this.gameState.currentPlayer = playerIds[0];

            this.gameState.version++;
            this.log(`Game started by ${playerName}`);
            return true;
        }
        this.log(`Player ${playerName} is not the admin`);
        return false;
    }

    rollDice(playerName: string): boolean {
        if (this.gameState.admin === playerName) {
            this.gameState.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
            this.gameState.version++;
            this.log(`Dice rolled by ${playerName}`);
            return true;
        }
        this.log(`Player ${playerName} is not the admin`);
        return false;
    }
}