import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { asyncHandler } from '../middleware/errorHandler';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const stats = await analyticsService.getUserStats(userId);

    res.json({ stats });
  });

  getEventTrends = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const months = parseInt(req.query.months as string) || 6;

    const trends = await analyticsService.getEventTrends(userId, months);

    res.json({ trends });
  });

  getGameTypeDistribution = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const distribution = await analyticsService.getGameTypeDistribution(userId);

    res.json({ distribution });
  });

  getTimezoneDistribution = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const distribution = await analyticsService.getTimezoneDistribution(userId);

    res.json({ distribution });
  });

  getResponseTimes = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const responseTimes = await analyticsService.getResponseTimes(userId);

    res.json({ responseTimes });
  });

  // combined analytics endpoint for dashboard
  getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const [stats, trends, gameTypes, timezones] = await Promise.all([
      analyticsService.getUserStats(userId),
      analyticsService.getEventTrends(userId),
      analyticsService.getGameTypeDistribution(userId),
      analyticsService.getTimezoneDistribution(userId),
    ]);

    res.json({
      stats,
      trends,
      gameTypes,
      timezones,
    });
  });
}
