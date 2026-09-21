// src/sockets/roomHandler.js – handles room lifecycle events
import { ACTIONS } from './events.js';
import { evaluateSubmission } from "../services/testcase.service.js";
import { validateUserToken } from "../utils/token.js";
import { getRandomProblem, problems } from "../data/problems.js";

const roomModes = {}; // roomId -> "collab" | "battle"
const battleRooms = {};

const BATTLE_DURATION_SECONDS =
  parseInt(process.env.BATTLE_DURATION_SECONDS, 10) || 30 * 60;

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

    // Helper to clean up empty room mode
    const cleanRoomIfEmpty = (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room || room.size === 0) {
        if (battleRooms[roomId]?.timer) {
          clearTimeout(battleRooms[roomId].timer);
        }
        roomModes[roomId] = "closed";
        delete battleRooms[roomId];
      }
    };

    // join
    socket.on(ACTIONS.JOIN, ({ roomId, username, mode = "collab", token, isCreate }) => {
      const existingMode = roomModes[roomId];

      // If room was closed after all participants left
      if (existingMode === "closed") {
        socket.emit("join-error", {
          message: "This room has ended and is no longer available.",
        });
        return;
      }

      // If trying to join a room that does not exist
      if (!existingMode && !isCreate) {
        socket.emit("join-error", {
          message: "Room not found. Please check the Room ID or create a new room.",
        });
        return;
      }

      // If trying to create a room that already exists
      if (existingMode && isCreate) {
        socket.emit("join-error", {
          message: "A room with this ID already exists. Please join it instead.",
        });
        return;
      }

      // If room already exists, ensure requested mode matches existing mode
      if (existingMode && existingMode !== mode) {
        socket.emit("join-error", {
          message: `This room is a ${existingMode} room. Please join using ${existingMode} mode.`,
        });
        return;
      }

      const authToken = token || socket.handshake.auth?.token;

      // Authentication enforcement: Battle rooms require a valid JWT token
      if (mode === "battle") {
        const payload = authToken ? validateUserToken(authToken) : null;
        if (!payload || !payload.id) {
          socket.emit("join-error", {
            message: "Authentication required for 1v1 Battle rooms. Please log in first.",
          });
          return;
        }
      }

      userSocketMap[socket.id] = username;
      socket.join(roomId);

      const clients = getAllConnectedClients(io, roomId);
      console.log("Clients in room:", clients.map((c) => c.username));

      // If room mode is not set, initialize mode
      if (!roomModes[roomId]) {
        roomModes[roomId] = mode;
      }

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
        const selectedProblem = getRandomProblem();

        const timer = setTimeout(() => {
          const battle = battleRooms[roomId];
          if (battle && battle.status === "active") {
            battle.status = "finished";

            io.to(roomId).emit(ACTIONS.BATTLE_END, {
              winnerSocketId: null,
              winnerUsername: null,
              result: null,
              reason: "timeout",
            });
          }
        }, BATTLE_DURATION_SECONDS * 1000);

        battleRooms[roomId] = {
          status: "active",
          winner: null,
          problemId: selectedProblem.id,
          timer,
        };

        const activeProblem = problems[battleRooms[roomId].problemId];

        io.to(roomId).emit(ACTIONS.BATTLE_START, {
          duration: BATTLE_DURATION_SECONDS,
          startedAt: Date.now(),
          problem: {
            id: activeProblem.id,
            title: activeProblem.title,
            difficulty: activeProblem.difficulty,
            description: activeProblem.description,
            examples: activeProblem.examples,
            constraints: activeProblem.constraints,
            starterCode: activeProblem.starterCode?.cpp,
          },
        });
      }
    });

    socket.on(
      ACTIONS.SUBMIT,
      async ({ roomId, username, sourceCode, language }) => {
        console.log("SUBMIT received:", {
          roomId,
          username,
          language,
        });

        const battle = battleRooms[roomId];
        if (!battle || !battle.problemId) {
          socket.emit("submit-error", {
            message: "Battle problem not found. Please restart the battle.",
          });
          return;
        }

        if (battle.status !== "active") {
          socket.emit("submit-error", {
            message: "This battle has already ended.",
          });
          return;
        }

        try {
          const result = await evaluateSubmission({
            problemId: battle.problemId,
            sourceCode,
            language,
          });

          console.log("Evaluation result:", result);

          // Return full result to the submitter (Player A)
          socket.emit(ACTIONS.SUBMITTED, {
            username,
            socketId: socket.id,
            result,
            isSelf: true,
          });

          // Inform opponent (Player B) that a submission occurred
          socket.in(roomId).emit(ACTIONS.SUBMITTED, {
            username,
            socketId: socket.id,
            result: {
              success: result.success,
              passedTests: result.passedTests,
              totalTests: result.totalTests,
            },
            isSelf: false,
          });

          // If accepted → finish battle
          if (result.success) {
            if (battle && battle.status === "active") {
              if (battle.timer) {
                clearTimeout(battle.timer);
              }
              battle.status = "finished";
              battle.winner = socket.id;

              io.to(roomId).emit(ACTIONS.BATTLE_END, {
                winnerSocketId: socket.id,
                winnerUsername: username,
                result,
              });
            }
          }
        } catch (error) {
          console.error("Submission evaluation failed:", error.message);

          socket.emit("submit-error", {
            message: error.message || "Evaluation failed. Please try again.",
          });
        }
      }
    );

    // ---- DISCONNECTING (user leaving the room) --------------------
    // ---- LEAVE (explicit leave request) --------------------
    socket.on(ACTIONS.LEAVE, ({ roomId }) => {
      // Notify others in the room that this user is leaving
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id] || null,
      });
      socket.leave(roomId);
      cleanRoomIfEmpty(roomId);
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
      rooms.forEach((roomId) => {
        if (roomId === socket.id) return;
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && room.size === 1 && room.has(socket.id)) {
          if (battleRooms[roomId]?.timer) {
            clearTimeout(battleRooms[roomId].timer);
          }
          roomModes[roomId] = "closed";
          delete battleRooms[roomId];
        }
      });
    });

    // ---- DISCONNECT (socket.io built‑in) --------------------------
    socket.on(ACTIONS.DISCONNECT, () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
