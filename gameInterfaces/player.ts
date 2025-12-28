import { card } from "./card";

export interface player {
    name: string,
    color: string,
    bankrupted: boolean,
    money: number,
    properties: string[],
    cards: card[],
    position: number,
    inJail: boolean,
    jailTurns: number,
    turnTime: number,
    disconnected: boolean,
    disconnectTime: number,
}