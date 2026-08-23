// src/sockets/roomHandler.js – handles room lifecycle events
import { ACTIONS } from './events.js';


const roomModes = {}; // roomId -> "collab" | "battle"

// In‑memory map of socketId → username (will be moved to a service later)
export const userSocketMap = {};

/**
 * Helper that returns an array of all sockets in a room with their usernames.
 */
export function getAllConnectedClients(io, roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

export const registerRoomHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // join
    socket.on(ACTIONS.JOIN, ({ roomId, username , mode="collab"}) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);

      if(!roomModes[roomId]) { //only first user ka store who create or join
        roomModes[roomId] = mode;
      }

      const clients = getAllConnectedClients(io, roomId);
      console.log("Clients in room:", clients.map(c => c.username));

      // Notify every existing participant about the new user
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
          mode: roomModes[roomId],
        });
      });

      // Start the battle timer once 2 *unique* players are in the room.
      // Guard against the same socket connecting twice (e.g. React StrictMode).
      const uniqueUsernames = [
        ...new Set(clients.map((c) => c.username).filter(Boolean)),
      ];

      if (roomModes[roomId] === "battle" && uniqueUsernames.length === 2) {
        io.to(roomId).emit(ACTIONS.BATTLE_START, {
          duration: 30 * 60, // 30 minutes in seconds
          startedAt: Date.now(),
        });
      }
    });

    socket.on(ACTIONS.SUBMIT, ({ roomId, username }) => {
    
      socket.in(roomId).emit(ACTIONS.SUBMITTED, {
        username,
        socketId: socket.id,
      });
      
    });


    // ---- DISCONNECTING (user leaving the room) --------------------
    // ---- LEAVE (explicit leave request) --------------------
    socket.on(ACTIONS.LEAVE, ({ roomId }) => {
      // Notify others in the room that this user is leaving
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id] || null,
      });
      socket.leave(roomId);
    });
    
    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id], // send username for toast
        });
      });
      // Clean up map – avoid memory leaks
      delete userSocketMap[socket.id];
      socket.leave();
    });

    // ---- DISCONNECT (socket.io built‑in) --------------------------
    socket.on(ACTIONS.DISCONNECT, () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
