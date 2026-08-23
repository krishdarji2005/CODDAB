// src/sockets/events.js – single source of truth for backend socket event names
// Keep string values in sync with client/src/Actions.js
export const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  DISCONNECT: 'disconnect',
  DISCONNECTED: 'disconnected',
  CODE_CHANGE: 'code-change',
  SYNC_CODE: 'sync-code',
  LEAVE: 'leave',
  SUBMIT: 'submit',
  SUBMITTED: 'submitted',
  BATTLE_START: 'battle-start',
};
