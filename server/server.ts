import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { connectionHandler } from "./connectionHandler";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import { sessionTokenService } from "./services/sessionTokenService";

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
    connectionHandler(io, socket);
});

export { expressApp, server, io };