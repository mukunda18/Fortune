import { atom } from "jotai"
import { GameState } from "@/gameInterfaces/gameState"

export const gameStateAtom = atom<GameState | null>(null);
