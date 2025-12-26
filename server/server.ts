import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const expressApp = express();
const server = http.createServer(expressApp);
const io = new SocketIOServer(server);

const rooms = new Map<string, Set<string>>();
const playerMap = new Map<string, string>();

function randomString(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        result += chars[idx];
    }
    return result;
}

io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);
    playerMap.set(socket.id, socket.handshake.auth.playerName);
    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
        rooms.forEach((players, roomName) => {
            if (players.has(socket.id)) {
                players.delete(socket.id);
                io.to(roomName).emit("playerListUpdate", Array.from(players).map(id => playerMap.get(id)));
                if (players.size === 0) {
                    rooms.delete(roomName);
                }
            }
        });
    });

    socket.on("joinRoom", (roomName: string, playerName: string, callback: (data: { roomId: string, players: string[] }) => void) => {
        playerMap.set(socket.id, playerName);
        if (!roomName.trim()) {
            roomName = randomString();
            while (rooms.has(roomName)) roomName = randomString();
        }
        if (!rooms.has(roomName)) {
            rooms.set(roomName, new Set());
        }
        socket.join(roomName);
        rooms.get(roomName)!.add(socket.id);

        const players = Array.from(rooms.get(roomName)!);
        callback({ roomId: roomName, players });

        io.to(roomName).emit("playerListUpdate", Array.from(players).map(id => playerMap.get(id)));
        console.log(`➡️ Client ${playerMap.get(socket.id)} joined room: ${roomName}`);
    });


    socket.on("leaveRoom", () => {
        const roomsArray = Array.from(socket.rooms).filter(r => r !== socket.id);
        roomsArray.forEach(roomName => {
            const players = rooms.get(roomName);
            if (players) {
                players.delete(socket.id);
                console.log(`⬅️ Client ${playerMap.get(socket.id)} left room: ${roomName}`);

                if (players.size > 0) {
                    io.to(roomName).emit("playerListUpdate", Array.from(players).map(id => playerMap.get(id)));
                } else {
                    rooms.delete(roomName);
                }
            }
            socket.leave(roomName);
        });
    });
});

export { expressApp, server, io };