import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import { sessionTokenService, roomService, socketSessionService } from "./services";

const expressApp = express();
const server = http.createServer(expressApp);
const io = new SocketIOServer(server);

expressApp.use(cookieParser());
expressApp.use(express.json());

io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const sid = cookies.SID;
    if (sid) {
        sessionTokenService.verifySID(sid, socket.id);
    }
    next();
});

io.on("connection", (socket) => {
    console.log(`[Server] New socket connection initialized: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`[Server] Client disconnected: ${socket.id}`);
        roomService.disconnect(io, socket.id);
    });

    socket.on("joinRoom", (roomId: string, playerName: string, callback: Function) => {
        console.log(`[Server] joinRoom request: socket=${socket.id}, room=${roomId}, player=${playerName}`);
        const response = roomService.joinRoom(io, socket, roomId, playerName);
        callback(response);
    });

    socket.on("leaveRoom", (callback: Function) => {
        const playerName = socketSessionService.getPlayerForSocket(socket.id);
        if (playerName) {
            console.log(`[Server] leaveRoom request: socket=${socket.id}, player=${playerName}`);
            roomService.leaveRoom(playerName, io, socket);
        }
        if (callback) callback({ ok: true });
    });
});

export { expressApp, server, io };