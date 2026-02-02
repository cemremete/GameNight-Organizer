import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

export class SocketHandler {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const decoded = verifyToken(token);
        socket.data.userId = decoded.userId;
        socket.data.email = decoded.email;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  private setupHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      logger.info(`User connected: ${userId}`);

      // join user's personal room for notifications
      socket.join(`user:${userId}`);

      // join event room
      socket.on('join-event', (eventId: string) => {
        socket.join(`event:${eventId}`);
        logger.debug(`User ${userId} joined event room ${eventId}`);
      });

      // leave event room
      socket.on('leave-event', (eventId: string) => {
        socket.leave(`event:${eventId}`);
        logger.debug(`User ${userId} left event room ${eventId}`);
      });

      // send chat message
      socket.on('chat-message', async (data: { eventId: string; message: string }) => {
        try {
          // save to database
          const result = await pool.query(
            `INSERT INTO event_messages (event_id, user_id, message)
             VALUES ($1, $2, $3)
             RETURNING id, created_at`,
            [data.eventId, userId, data.message]
          );

          // get username
          const userResult = await pool.query(
            'SELECT username, avatar_url FROM users WHERE id = $1',
            [userId]
          );

          const messageData = {
            id: result.rows[0].id,
            eventId: data.eventId,
            userId,
            username: userResult.rows[0]?.username || 'Unknown',
            avatarUrl: userResult.rows[0]?.avatar_url,
            message: data.message,
            createdAt: result.rows[0].created_at,
          };

          // broadcast to event room
          this.io.to(`event:${data.eventId}`).emit('new-message', messageData);
        } catch (error) {
          logger.error('Failed to save chat message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // typing indicator
      socket.on('typing', (data: { eventId: string }) => {
        socket.to(`event:${data.eventId}`).emit('user-typing', {
          userId,
          eventId: data.eventId,
        });
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${userId}`);
      });
    });
  }

  // helper methods for emitting from other parts of the app
  notifyEventUpdate(eventId: string, event: any) {
    this.io.to(`event:${eventId}`).emit('event-updated', event);
  }

  notifyNewParticipant(eventId: string, participant: any) {
    this.io.to(`event:${eventId}`).emit('participant-joined', participant);
  }

  notifyParticipantLeft(eventId: string, userId: string) {
    this.io.to(`event:${eventId}`).emit('participant-left', { userId });
  }

  notifyUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  getIO() {
    return this.io;
  }
}

// singleton instance
let socketHandler: SocketHandler | null = null;

export function initializeSocket(httpServer: HttpServer): SocketHandler {
  socketHandler = new SocketHandler(httpServer);
  return socketHandler;
}

export function getSocketHandler(): SocketHandler | null {
  return socketHandler;
}
