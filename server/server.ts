import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { connectionHandler } from "./connectionHandler";
import { gameRoomHandler } from "./gameRoomHandler";

const expressApp = express();
const server = http.createServer(expressApp);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
    console.log(`[Server] New socket connection initialized: ${socket.id}`);
    connectionHandler(io, socket);
    gameRoomHandler(io, socket);
});

export { expressApp, server, io };