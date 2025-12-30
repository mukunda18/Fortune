import type { Server, Socket } from "socket.io";
import { gameConnectionService } from "./services/gameConnectionService";

export const connectionHandler = (io: Server, socket: Socket): void => {
    console.log("[ConnectionHandler] Client connected: " + socket.id);

    socket.on("disconnect", () => {
        console.log("[ConnectionHandler] Client disconnected: " + socket.id);
        gameConnectionService.handleDisconnect(io, socket.id);
    });

    socket.on(
        "joinRoom",
        (roomId: string, playerName: string, callback: Function) => {
            console.log(
                `[ConnectionHandler] joinRoom request: socket=${socket.id}, room=${roomId}, player=${playerName}`
            );
            const response = gameConnectionService.handleJoinRoom(
                io,
                socket,
                roomId,
                playerName
            );
            callback(response);
        }
    );

    socket.on("leaveRoom", () => {
        console.log(`[ConnectionHandler] leaveRoom request: socket=${socket.id}`);
        gameConnectionService.handleLeaveRoom(io, socket);
    });
}
