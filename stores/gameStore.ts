import { atom } from "jotai"
import { gameState } from "@/gameInterfaces/gameState"

export const gameStateAtom = atom<gameState | null>(null,
);