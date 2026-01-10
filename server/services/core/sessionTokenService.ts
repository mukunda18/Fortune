import { BaseService } from "../baseService";
import { socketSessionService } from "./socketSessionService";
import { randomUUID } from "crypto";

export class SessionTokenService extends BaseService {
    protected name = "SessionTokenService";
    private socketToSIDMap: Map<string, string> = new Map();
    private sidToSocketMap: Map<string, string> = new Map();

    generateOrGetSID(socketID: string): string {
        if (!socketID) return this.generateUUID();

        let sid = this.socketToSIDMap.get(socketID) || this.generateUUID();

        this.socketToSIDMap.set(socketID, sid);
        this.sidToSocketMap.set(sid, socketID);

        return sid;
    }

    private generateUUID(): string {
        return randomUUID();
    }

    verifySID(SID: string, socketID: string): void {
        const existingSocketID = this.sidToSocketMap.get(SID);

        if (!existingSocketID) {
            this.sidToSocketMap.set(SID, socketID);
            this.socketToSIDMap.set(socketID, SID);
            return;
        }

        if (existingSocketID !== socketID) {
            socketSessionService.mapSocketToPlayer(socketID, socketSessionService.getPlayerForSocket(existingSocketID) || "");
            this.sidToSocketMap.set(SID, socketID);
            this.socketToSIDMap.set(socketID, SID);
            this.log(`Updated SID mapping from socket ${existingSocketID} to ${socketID}`);
        }
    }

    getSocketForSID(SID: string): string | undefined {
        return this.sidToSocketMap.get(SID);
    }

    getSIDForSocket(socketID: string): string | undefined {
        return this.socketToSIDMap.get(socketID);
    }
}

export const sessionTokenService = new SessionTokenService();
