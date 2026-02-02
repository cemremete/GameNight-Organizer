import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import dotenv from 'dotenv';

// load env vars first
dotenv.config();

import { checkDatabaseConnection } from './config/database';
import { checkRedisConnection } from './config/redis';
import { logger, morganStream } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { initializeSocket } from './websocket/socketHandler';

// routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/events.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();
const httpServer = createServer(app);

// initialize websocket
const socketHandler = initializeSocket(httpServer);

// middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined', { stream: morganStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiting for API routes
app.use('/api/', rateLimiter);

// health check
app.get('/health', async (req, res) => {
  const dbOk = await checkDatabaseConnection();
  const redisOk = await checkRedisConnection();

  res.json({
    status: dbOk && redisOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: dbOk ? 'connected' : 'disconnected',
      redis: redisOk ? 'connected' : 'disconnected',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3001;

async function start() {
  // check connections
  const dbOk = await checkDatabaseConnection();
  const redisOk = await checkRedisConnection();

  if (!dbOk) {
    logger.warn('Database connection failed - some features may not work');
  }

  if (!redisOk) {
    logger.warn('Redis connection failed - caching disabled');
  }

  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📡 WebSocket enabled`);
    logger.info(`🌍 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  });
}

start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { app, httpServer, socketHandler };
