import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password, timezone } = req.body;

    const result = await authService.register(email, username, password, timezone);

    res.status(201).json({
      message: 'Registration successful',
      user: result.user,
      token: result.token,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const user = await authService.getUserById(userId);

    res.json({ user });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const updates = req.body;

    const user = await authService.updateUser(userId, updates);

    res.json({
      message: 'Profile updated',
      user,
    });
  });
}
