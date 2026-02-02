import { pool } from '../config/database';
import { CacheService } from './cacheService';

const cacheService = new CacheService();

export class AnalyticsService {
  async getUserStats(userId: string) {
    // try cache first
    const cached = await cacheService.getAnalytics(userId);
    if (cached) return cached;

    // events created by user
    const createdResult = await pool.query(
      'SELECT COUNT(*) as count FROM events WHERE creator_id = $1',
      [userId]
    );

    // events attended
    const attendedResult = await pool.query(
      `SELECT COUNT(*) as count FROM participants 
       WHERE user_id = $1 AND status = 'confirmed'`,
      [userId]
    );

    // upcoming events
    const upcomingResult = await pool.query(
      `SELECT COUNT(*) as count FROM events e
       JOIN participants p ON e.id = p.event_id
       WHERE p.user_id = $1 AND e.event_time > NOW() AND e.status != 'cancelled'`,
      [userId]
    );

    // total participants in user's events
    const totalParticipantsResult = await pool.query(
      `SELECT COUNT(*) as count FROM participants p
       JOIN events e ON p.event_id = e.id
       WHERE e.creator_id = $1 AND p.status = 'confirmed'`,
      [userId]
    );

    const stats = {
      eventsCreated: parseInt(createdResult.rows[0].count),
      eventsAttended: parseInt(attendedResult.rows[0].count),
      upcomingEvents: parseInt(upcomingResult.rows[0].count),
      totalParticipants: parseInt(totalParticipantsResult.rows[0].count),
    };

    // cache it
    await cacheService.cacheAnalytics(userId, stats);

    return stats;
  }

  async getEventTrends(userId: string, months: number = 6) {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(event_time, 'Mon') as month,
         EXTRACT(MONTH FROM event_time) as month_num,
         COUNT(*) as events
       FROM events
       WHERE creator_id = $1 
         AND event_time > NOW() - INTERVAL '${months} months'
       GROUP BY TO_CHAR(event_time, 'Mon'), EXTRACT(MONTH FROM event_time)
       ORDER BY month_num`,
      [userId]
    );

    return result.rows.map((row) => ({
      month: row.month,
      events: parseInt(row.events),
    }));
  }

  async getGameTypeDistribution(userId: string) {
    const result = await pool.query(
      `SELECT 
         COALESCE(game_type, 'Other') as name,
         COUNT(*) as value
       FROM events
       WHERE creator_id = $1 OR id IN (
         SELECT event_id FROM participants WHERE user_id = $1
       )
       GROUP BY game_type
       ORDER BY value DESC`,
      [userId]
    );

    const colors = ['#FF9B9B', '#60A5FA', '#4ADE80', '#FCD34D', '#A78BFA'];

    return result.rows.map((row, i) => ({
      name: row.name,
      value: parseInt(row.value),
      color: colors[i % colors.length],
    }));
  }

  async getTimezoneDistribution(userId: string) {
    const result = await pool.query(
      `SELECT 
         u.timezone as zone,
         COUNT(*) as count
       FROM participants p
       JOIN users u ON p.user_id = u.id
       JOIN events e ON p.event_id = e.id
       WHERE e.creator_id = $1
       GROUP BY u.timezone
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );

    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);

    return result.rows.map((row) => ({
      zone: row.zone || 'UTC',
      percentage: Math.round((parseInt(row.count) / total) * 100),
    }));
  }

  async getResponseTimes(userId: string) {
    // average time between event creation and RSVP for participants
    const result = await pool.query(
      `SELECT 
         u.username as name,
         AVG(EXTRACT(EPOCH FROM (p.rsvp_time - e.created_at)) / 3600) as hours
       FROM participants p
       JOIN events e ON p.event_id = e.id
       JOIN users u ON p.user_id = u.id
       WHERE e.creator_id = $1 AND p.rsvp_time IS NOT NULL
       GROUP BY u.username
       ORDER BY hours ASC
       LIMIT 10`,
      [userId]
    );

    return result.rows.map((row) => ({
      name: row.name,
      hours: parseFloat(row.hours?.toFixed(1) || '0'),
    }));
  }
}
