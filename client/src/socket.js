import { io } from 'socket.io-client';

export const initSocket = () => {
  const token = localStorage.getItem('token');
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket', 'polling'],
    auth: {
      token,
    },
  };
  return io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', options);
};