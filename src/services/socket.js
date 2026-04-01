// src/services/socket.js
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'https://api.traveltribe.app';

let socket = null;

export const connectSocket = async () => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => console.log('🔌 Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
  socket.on('error', (err) => console.error('Socket error:', err));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const joinConversation = (convId) => socket?.emit('join_conversation', convId);
export const leaveConversation = (convId) => socket?.emit('leave_conversation', convId);

export const sendMessage = (convId, body, imageUrl = null) => {
  socket?.emit('send_message', { conversation_id: convId, body, image_url: imageUrl });
};

export const emitTyping = (convId) => socket?.emit('typing', { conversation_id: convId });

export const onNewMessage = (handler) => { socket?.on('new_message', handler); return () => socket?.off('new_message', handler); };
export const onTyping = (handler) => { socket?.on('user_typing', handler); return () => socket?.off('user_typing', handler); };
export const onNotification = (handler) => { socket?.on('notification', handler); return () => socket?.off('notification', handler); };
