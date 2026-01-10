import { BaseService } from "../baseService";

export class SocketSessionService extends BaseService {
    protected name = "SocketSessionService";
    private socketToPlayerMap: Map<string, string> = new Map();
    private playerToSocketMap: Map<string, string> = new Map();

    mapSocketToPlayer(socketId: string, playerName: string): void {
        this.socketToPlayerMap.set(socketId, playerName);
        this.playerToSocketMap.set(playerName, socketId);
        this.log(`Mapped socket ${socketId} to player ${playerName}`);
    }

    unmapSocket(socketId: string): void {
        const playerName = this.socketToPlayerMap.get(socketId);
        if (playerName) {
            this.playerToSocketMap.delete(playerName);
        }
        this.socketToPlayerMap.delete(socketId);
        this.log(`Unmapped socket ${socketId}`);
    }

    getPlayerForSocket(socketId: string): string | undefined {
        return this.socketToPlayerMap.get(socketId);
    }

    getSocketForPlayer(playerName: string): string | undefined {
        return this.playerToSocketMap.get(playerName);
    }
}

export const socketSessionService = new SocketSessionService();
