import { player } from "./player";
import { Property, propertyGroup } from "./property";
import { trade } from "./trade";
import { setting } from "./setting";
import { turnPhase } from "./turnPhases";
import { bank } from "./bank";
import { history } from "./history";
import { auction } from "./auction";

export interface gameState {
    admin: string,
    usedColors: string[],
    dice: [number, number],
    turnPhase: turnPhase,
    players: { [key: string]: player },
    currentPlayer: string,
    rollRepeat: number,
    properties: { [key: string]: Property },
    propertyGroups: { [key: string]: propertyGroup },
    bank: bank,
    trades: trade[],
    auction: auction,
    settings: setting,
    gameHistory: history[],
    version: number
}