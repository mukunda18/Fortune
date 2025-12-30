import { sessionTokenService } from "@/server/services/sessionTokenService";

export const getSID = (socketID: string): string => {
    return sessionTokenService.generateOrGetSID(socketID);
};

export const verifySID = (SID: string, socketID: string) => {
    sessionTokenService.verifySID(SID, socketID);
};
