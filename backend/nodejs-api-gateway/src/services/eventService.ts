import { pool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { CacheService } from './cacheService';

const cacheService = new CacheService();

export class EventService {
  async createEvent(
    creatorId: string,
    data: {
      name: string;
      description?: string;
      gameType?: string;
      eventTime: string;
      maxParticipants?: number;
      isPublic?: boolean;
    }
  ) {
    const result = await pool.query(
      `INSERT INTO events (name, description, game_type, creator_id, event_time, max_participants, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.name,
        data.description || null,
        data.gameType || null,
        creatorId,
        data.eventTime,
        data.maxParticipants || 12,
        data.isPublic || false,
      ]
    );

    const event = result.rows[0];

    // creator automatically joins as participant
    await pool.query(
      `INSERT INTO participants (event_id, user_id, status, rsvp_time)
       VALUES ($1, $2, 'confirmed', NOW())`,
      [event.id, creatorId]
    );

    // invalidate cache
    await cacheService.invalidateUserEvents(creatorId);

    return this.getEventById(event.id, creatorId);
  }

  async getEventById(eventId: string, userId?: string) {
    // try cache first
    const cached = await cacheService.getEvent(eventId);
    if (cached) return cached;

    const result = await pool.query(
      `SELECT e.*, u.username as creator_name, u.avatar_url as creator_avatar,
              (SELECT COUNT(*) FROM participants WHERE event_id = e.id AND status = 'confirmed') as participant_count
       FROM events e
       JOIN users u ON e.creator_id = u.id
       WHERE e.id = $1`,
      [eventId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Event not found', 404);
    }

    const event = result.rows[0];

    // get participants
    const participants = await pool.query(
      `SELECT p.*, u.username, u.avatar_url, u.timezone
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.event_id = $1
       ORDER BY p.joined_at`,
      [eventId]
    );

    event.participants = participants.rows;

    // cache it
    await cacheService.cacheEvent(eventId, event);

    return event;
  }

  async getUserEvents(userId: string) {
    // try cache first
    const cached = await cacheService.getUserEvents(userId);
    if (cached) return cached;

    const result = await pool.query(
      `SELECT e.*, u.username as creator_name,
              (SELECT COUNT(*) FROM participants WHERE event_id = e.id AND status = 'confirmed') as participant_count
       FROM events e
       JOIN users u ON e.creator_id = u.id
       WHERE e.creator_id = $1
          OR e.id IN (SELECT event_id FROM participants WHERE user_id = $1)
       ORDER BY e.event_time DESC`,
      [userId]
    );

    const events = result.rows;

    // cache it
    await cacheService.cacheUserEvents(userId, events);

    return events;
  }

  async getPublicEvents(limit: number = 20, offset: number = 0) {
    const result = await pool.query(
      `SELECT e.*, u.username as creator_name,
              (SELECT COUNT(*) FROM participants WHERE event_id = e.id AND status = 'confirmed') as participant_count
       FROM events e
       JOIN users u ON e.creator_id = u.id
       WHERE e.is_public = true AND e.event_time > NOW() AND e.status != 'cancelled'
       ORDER BY e.event_time ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  async updateEvent(
    eventId: string,
    userId: string,
    updates: {
      name?: string;
      description?: string;
      gameType?: string;
      eventTime?: string;
      maxParticipants?: number;
      isPublic?: boolean;
      status?: string;
    }
  ) {
    // check ownership
    const event = await this.getEventById(eventId);
    if (event.creator_id !== userId) {
      throw new AppError('Not authorized to update this event', 403);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.gameType) {
      fields.push(`game_type = $${paramCount++}`);
      values.push(updates.gameType);
    }
    if (updates.eventTime) {
      fields.push(`event_time = $${paramCount++}`);
      values.push(updates.eventTime);
    }
    if (updates.maxParticipants) {
      fields.push(`max_participants = $${paramCount++}`);
      values.push(updates.maxParticipants);
    }
    if (updates.isPublic !== undefined) {
      fields.push(`is_public = $${paramCount++}`);
      values.push(updates.isPublic);
    }
    if (updates.status) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    if (fields.length === 0) {
      return event;
    }

    fields.push(`updated_at = NOW()`);
    values.push(eventId);

    await pool.query(
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    // invalidate caches
    await cacheService.invalidateEvent(eventId);
    await cacheService.invalidateUserEvents(userId);

    return this.getEventById(eventId, userId);
  }

  async deleteEvent(eventId: string, userId: string) {
    const event = await this.getEventById(eventId);
    if (event.creator_id !== userId) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await pool.query('DELETE FROM events WHERE id = $1', [eventId]);

    // invalidate caches
    await cacheService.invalidateEvent(eventId);
    await cacheService.invalidateUserEvents(userId);

    return { message: 'Event deleted' };
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.getEventById(eventId);

    // check if already joined
    const existing = await pool.query(
      'SELECT id FROM participants WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existing.rows.length > 0) {
      throw new AppError('Already joined this event', 400);
    }

    // check if event is full
    const participantCount = parseInt(event.participant_count);
    if (participantCount >= event.max_participants) {
      throw new AppError('Event is full', 400);
    }

    // get user timezone
    const userResult = await pool.query(
      'SELECT timezone FROM users WHERE id = $1',
      [userId]
    );
    const userTimezone = userResult.rows[0]?.timezone || 'UTC';

    await pool.query(
      `INSERT INTO participants (event_id, user_id, status, rsvp_time, user_timezone)
       VALUES ($1, $2, 'confirmed', NOW(), $3)`,
      [eventId, userId, userTimezone]
    );

    // invalidate caches
    await cacheService.invalidateEvent(eventId);
    await cacheService.invalidateUserEvents(userId);

    return this.getEventById(eventId, userId);
  }

  async leaveEvent(eventId: string, userId: string) {
    const event = await this.getEventById(eventId);

    // can't leave if you're the creator
    if (event.creator_id === userId) {
      throw new AppError('Creator cannot leave the event', 400);
    }

    await pool.query(
      'DELETE FROM participants WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    // invalidate caches
    await cacheService.invalidateEvent(eventId);
    await cacheService.invalidateUserEvents(userId);

    return { message: 'Left event successfully' };
  }

  async getParticipants(eventId: string) {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email, u.avatar_url, u.timezone
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.event_id = $1
       ORDER BY p.joined_at`,
      [eventId]
    );

    return result.rows;
  }
}
