import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

// extend express request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    logger.warn('Auth failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// optional auth - doesn't fail if no token, just sets userId if present
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }

    next();
  } catch {
    // just continue without auth
    next();
  }
};
