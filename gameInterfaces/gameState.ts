import { Player } from "./player";
import { Property, PropertyGroup } from "./property";
import { Trade } from "./trade";
import { Setting } from "./setting";
import { TurnPhase } from "./turnPhases";
import { Bank } from "./bank";
import { HistoryEntry } from "./history";
import { Auction } from "./auction";

export interface GameState {
    admin: string;
    usedColors: string[];
    dice: [number, number];
    turnPhase: TurnPhase;
    players: { [key: string]: Player };
    currentPlayer: string;
    rollRepeat: number;
    properties: { [key: string]: Property };
    propertyGroups: { [key: string]: PropertyGroup };
    bank: Bank;
    trades: Trade[];
    auction: Auction;
    settings: Setting;
    gameHistory: HistoryEntry[];
    version: number;
}
