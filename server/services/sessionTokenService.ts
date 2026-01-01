import { randomUUID } from "crypto";
import { socketSessionService } from "./socketSessionService";

export class SessionTokenService {
  private socketToSIDMap: Map<string, string> = new Map();
  private sidToSocketMap: Map<string, string> = new Map();

  generateOrGetSID(socketID: string): string {
    
    if (!socketID) return randomUUID();

    let sid = this.socketToSIDMap.get(socketID) || randomUUID();

    this.socketToSIDMap.set(socketID, sid);
    this.sidToSocketMap.set(sid, socketID);

    return sid;

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
      console.log(
        `[SessionTokenService] Updated SID mapping from socket ${existingSocketID} to ${socketID}`
      );
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
