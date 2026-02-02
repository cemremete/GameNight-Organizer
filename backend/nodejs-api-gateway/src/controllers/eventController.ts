import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { TimezoneService } from '../services/timezoneService';
import { asyncHandler } from '../middleware/errorHandler';

const eventService = new EventService();
const timezoneService = new TimezoneService();

export class EventController {
  getEvents = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    const events = await eventService.getUserEvents(userId);

    res.json({ events });
  });

  getPublicEvents = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const events = await eventService.getPublicEvents(limit, offset);

    res.json({ events });
  });

  getEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    const event = await eventService.getEventById(id, userId);

    res.json({ event });
  });

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const eventData = req.body;

    const event = await eventService.createEvent(userId, eventData);

    res.status(201).json({
      message: 'Event created',
      event,
    });
  });

  updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    const updates = req.body;

    const event = await eventService.updateEvent(id, userId, updates);

    res.json({
      message: 'Event updated',
      event,
    });
  });

  deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    await eventService.deleteEvent(id, userId);

    res.json({ message: 'Event deleted' });
  });

  joinEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    const event = await eventService.joinEvent(id, userId);

    res.json({
      message: 'Joined event',
      event,
    });
  });

  leaveEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    await eventService.leaveEvent(id, userId);

    res.json({ message: 'Left event' });
  });

  getParticipants = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const participants = await eventService.getParticipants(id);

    res.json({ participants });
  });

  // get event time in all participant timezones
  getEventTimezones = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await eventService.getEventById(id);
    const participants = await eventService.getParticipants(id);

    const timezones = participants.map((p: any) => p.timezone).filter(Boolean);
    const uniqueTimezones = [...new Set(timezones)] as string[];

    // try Go service first, fallback to local conversion
    try {
      const conversions = await timezoneService.batchConvert(
        event.event_time,
        'UTC',
        uniqueTimezones
      );

      res.json({
        eventTime: event.event_time,
        conversions: conversions.conversions,
      });
    } catch {
      // fallback to local conversion
      const conversions: Record<string, string> = {};
      for (const tz of uniqueTimezones) {
        const result = timezoneService.convertTimeLocal(event.event_time, 'UTC', tz);
        conversions[tz] = result.convertedTime;
      }

      res.json({
        eventTime: event.event_time,
        conversions,
      });
    }
  });
}
