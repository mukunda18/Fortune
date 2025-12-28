import { atom } from "jotai"
import { emitWithTimeout } from "./emit"
import { gameState } from "@/gameInterfaces/gameState"

export const gameStateAtom = atom<gameState | null>(null);