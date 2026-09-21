// Frontend socket event names — keep string values in sync with server/src/sockets/events.js
const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  DISCONNECT:  'disconnect',
  DISCONNECTED: 'disconnected', // custom event — different from socket.io built-in 'disconnect'
  CODE_CHANGE: 'code-change',
  SYNC_CODE: 'sync-code',
  LEAVE: 'leave',
  SUBMIT: 'submit',
  SUBMITTED: 'submitted',
  BATTLE_START: 'battle-start',
  BATTLE_END: 'battle-end',
};

export default ACTIONS;
