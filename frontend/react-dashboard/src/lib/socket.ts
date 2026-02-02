// WebSocket client for real-time features
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './api';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://127.0.0.1:3001';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  const token = getAuthToken();

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

// Event room helpers
export function joinEventRoom(eventId: string) {
  socket?.emit('join-event', eventId);
}

export function leaveEventRoom(eventId: string) {
  socket?.emit('leave-event', eventId);
}

export function sendChatMessage(eventId: string, message: string) {
  socket?.emit('chat-message', { eventId, message });
}

export function sendTypingIndicator(eventId: string) {
  socket?.emit('typing', { eventId });
}

// Event listeners
export function onNewMessage(callback: (data: any) => void) {
  socket?.on('new-message', callback);
  return () => socket?.off('new-message', callback);
}

export function onEventUpdated(callback: (data: any) => void) {
  socket?.on('event-updated', callback);
  return () => socket?.off('event-updated', callback);
}

export function onParticipantJoined(callback: (data: any) => void) {
  socket?.on('participant-joined', callback);
  return () => socket?.off('participant-joined', callback);
}

export function onParticipantLeft(callback: (data: any) => void) {
  socket?.on('participant-left', callback);
  return () => socket?.off('participant-left', callback);
}

export function onUserTyping(callback: (data: any) => void) {
  socket?.on('user-typing', callback);
  return () => socket?.off('user-typing', callback);
}

export function onNotification(callback: (data: any) => void) {
  socket?.on('notification', callback);
  return () => socket?.off('notification', callback);
}
