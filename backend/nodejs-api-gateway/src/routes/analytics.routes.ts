import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

// GET /api/analytics/stats - user stats
router.get('/stats', authenticate, analyticsController.getUserStats);

// GET /api/analytics/trends - event trends
router.get('/trends', authenticate, analyticsController.getEventTrends);

// GET /api/analytics/game-types - game type distribution
router.get('/game-types', authenticate, analyticsController.getGameTypeDistribution);

// GET /api/analytics/timezones - timezone distribution
router.get('/timezones', authenticate, analyticsController.getTimezoneDistribution);

// GET /api/analytics/response-times - response times
router.get('/response-times', authenticate, analyticsController.getResponseTimes);

// GET /api/analytics/dashboard - combined dashboard data
router.get('/dashboard', authenticate, analyticsController.getDashboardAnalytics);

export default router;
