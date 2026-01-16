import { atom } from "jotai"
import { GameState } from "@/gameInterfaces/gameState"
import { Player } from "@/gameInterfaces/player"
import { Property, PropertyGroup } from "@/gameInterfaces/property"
import { Trade } from "@/gameInterfaces/trade"
import { Setting } from "@/gameInterfaces/setting"
import { TurnPhase } from "@/gameInterfaces/turnPhases"
import { Bank } from "@/gameInterfaces/bank"
import { HistoryEntry } from "@/gameInterfaces/history"
import { Auction } from "@/gameInterfaces/auction"

export const adminAtom = atom<string>("");
export const usedColorsAtom = atom<string[]>([]);
export const diceAtom = atom<[number, number]>([0, 0]);
export const turnPhaseAtom = atom<TurnPhase>(TurnPhase.WAITING_FOR_PLAYERS);
export const playersAtom = atom<Record<string, Player>>({});
export const currentPlayerAtom = atom<string>("");
export const rollRepeatAtom = atom<number>(0);
export const propertiesAtom = atom<Record<string, Property>>({});
export const propertyGroupsAtom = atom<Record<string, PropertyGroup>>({});
export const bankAtom = atom<Bank>({ money: 0 });
export const tradesAtom = atom<Trade[]>([]);
export const auctionAtom = atom<Auction | null>(null);
export const settingsAtom = atom<Setting | null>(null);
export const gameHistoryAtom = atom<HistoryEntry[]>([]);
export const versionAtom = atom<number>(0);

export const gameStateAtom = atom(
    null,
    (get, set, newState: GameState | null) => {
        if (!newState) {
            set(adminAtom, "");
            set(usedColorsAtom, []);
            set(diceAtom, [0, 0]);
            set(turnPhaseAtom, TurnPhase.WAITING_FOR_PLAYERS);
            set(playersAtom, {});
            set(currentPlayerAtom, "");
            set(rollRepeatAtom, 0);
            set(propertiesAtom, {});
            set(propertyGroupsAtom, {});
            set(bankAtom, { money: 0 });
            set(tradesAtom, []);
            set(auctionAtom, null);
            set(settingsAtom, null);
            set(gameHistoryAtom, []);
            set(versionAtom, 0);
            return;
        }

        set(adminAtom, newState.admin);
        set(usedColorsAtom, newState.usedColors);
        set(diceAtom, newState.dice);
        set(turnPhaseAtom, newState.turnPhase);
        set(playersAtom, newState.players);
        set(currentPlayerAtom, newState.currentPlayer);
        set(rollRepeatAtom, newState.rollRepeat);
        set(propertiesAtom, newState.properties);
        set(propertyGroupsAtom, newState.propertyGroups);
        set(bankAtom, newState.bank);
        set(tradesAtom, newState.trades);
        set(auctionAtom, newState.auction);
        set(settingsAtom, newState.settings);
        set(gameHistoryAtom, newState.gameHistory);
        set(versionAtom, newState.version);
    }
);
