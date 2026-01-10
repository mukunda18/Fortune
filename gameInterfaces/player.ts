import { Card } from "./card";

export interface Player {
    id: string;
    name: string;
    color: string;
    money: number;
    position: number;
    properties: string[]; // Property IDs
    cards: Card[];
    isBankrupt: boolean;
    inJail: boolean;
    jailTurns: number;
    turnTime: number;
    isDisconnected: boolean;
    disconnectTime: number;
}