import { gameState } from "@/gameInterfaces/gameState";
import { ServerResponse, isServerResponse } from "@/interfaces/serverResponse";
import type { Server, Socket } from "socket.io";
import { roomService } from "./roomService";
import { socketSessionService } from "./socketSessionService";

export class GameConnectionService {
  handleJoinRoom(
    io: Server,
    socket: Socket,
    roomId: string,
    playerName: string
  ): gameState | ServerResponse {
    const reconnectTry =
      socketSessionService.getPlayerForSocket(socket.id) === playerName;

    const response = roomService.joinRoom(roomId, playerName, reconnectTry);

    if (isServerResponse(response)) {
      console.log(
        `[GameConnectionService] Join room failed for ${playerName}: ${response.message}`
      );
      return response;
    }

    socket.join(roomId);
    socketSessionService.mapSocketToPlayer(socket.id, playerName);
    console.log(
      `[GameConnectionService] Player ${playerName} joined room ${roomId}`
    );

    // Broadcast to other players in the room
    socket
      .to(roomId)
      .emit("updateRoom", roomService.getRoom(roomId));

    return response;
  }

  handleLeaveRoom(
    io: Server,
    socket: Socket
  ): void {
    const playerName =
      socketSessionService.getPlayerForSocket(socket.id);
    if (!playerName) return;

    const roomId = roomService.leaveRoom(playerName);
    if (!roomId) return;

    socketSessionService.unmapSocket(socket.id);
    socket.leave(roomId);
    console.log(
      `[GameConnectionService] Player ${playerName} left room ${roomId}`
    );

    // Broadcast to remaining players
    io.to(roomId).emit("updateRoom", roomService.getRoom(roomId));
  }

  handleDisconnect(io: Server, socketId: string): void {
    const playerName =
      socketSessionService.getPlayerForSocket(socketId);
    if (!playerName) return;

    const roomId = roomService.handleDisconnect(playerName);
    if (roomId) {
      console.log(
        `[GameConnectionService] Player ${playerName} disconnected from room ${roomId}`
      );
      io.to(roomId).emit("updateRoom", roomService.getRoom(roomId));
    }

    socketSessionService.unmapSocket(socketId);
  }
}

export const gameConnectionService = new GameConnectionService();
