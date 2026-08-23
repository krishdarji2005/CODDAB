// src/sockets/collaborationHandler.js – handles collaboration events (code sync, etc.)
import { ACTIONS } from './events.js';

/**
 * Registers collaboration‑related socket listeners.
 * Currently handles:
 *   - CODE_CHANGE: broadcast code edits to other participants in the same room.
 *   - SYNC_CODE: send the current code to a newly‑joined socket.
 * Future collaboration features (cursor sync, language changes, etc.)
 * will live in this module.
 */
export const registerCollaborationHandlers = (io) => {
  io.on('connection', (socket) => {
    // ---- CODE_CHANGE ------------------------------------------------
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      // Broadcast the new code to every other socket in the room
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // ---- SYNC_CODE --------------------------------------------------
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      // Send the current code directly to the socket that just joined
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
  });
};
