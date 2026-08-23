// src/sockets/index.js – initialise all socket handlers
import { registerRoomHandlers } from './roomHandler.js';
import { registerCollaborationHandlers } from './collaborationHandler.js';

/**
 * Called from server.js with the freshly created `io` instance.
 * Registers every domain‑specific socket handler.
 */
export const initializeSocket = (io) => {
  registerRoomHandlers(io);
  registerCollaborationHandlers(io);
};
