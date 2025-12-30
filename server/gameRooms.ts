/**
 * DEPRECATED: This file has been replaced with server/services/roomService.ts
 * Please use the RoomService class from services/roomService.ts instead.
 */

import { gameState } from "@/gameInterfaces/gameState";
import { turnPhase } from "@/gameInterfaces/turnPhases";
import { ServerResponse } from "@/interfaces/serverResponse";

function randomRoomId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export const roomMap: Map<string, gameState> = new Map<string, gameState>();
export const playerToRoomMap: Map<string, string> = new Map<string, string>();

export function createRoom() {
    throw new Error("Use RoomService.createRoom() instead");
}

export function handleJoinRoom(roomName: string, playerName: string, reconnectTry: boolean): gameState | ServerResponse {
    throw new Error("Use RoomService.joinRoom() instead");
}

export function handleLeaveRoom(playerName: string): string {
    throw new Error("Use RoomService.leaveRoom() instead");
}

export function handleDisconnect(playerName: string): string {
    throw new Error("Use RoomService.handleDisconnect() instead");
}
