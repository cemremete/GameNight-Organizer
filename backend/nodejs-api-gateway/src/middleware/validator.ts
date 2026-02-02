import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// generic validation middleware
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      next(error);
    }
  };
};

// common validation schemas
export const schemas = {
  register: z.object({
    email: z.string().email('Invalid email format'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(50),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    timezone: z.string().optional().default('UTC'),
  }),

  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),

  createEvent: z.object({
    name: z.string().min(1, 'Event name is required').max(255),
    description: z.string().optional(),
    gameType: z.string().optional(),
    eventTime: z.string().datetime('Invalid date format'),
    maxParticipants: z.number().min(2).max(100).optional().default(12),
    isPublic: z.boolean().optional().default(false),
  }),

  updateEvent: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    gameType: z.string().optional(),
    eventTime: z.string().datetime().optional(),
    maxParticipants: z.number().min(2).max(100).optional(),
    isPublic: z.boolean().optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  }),

  updateUser: z.object({
    username: z.string().min(3).max(50).optional(),
    timezone: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
};
