import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';

const router = Router();
const eventController = new EventController();

// GET /api/events - get user's events
router.get('/', authenticate, eventController.getEvents);

// GET /api/events/public - get public events (no auth required)
router.get('/public', optionalAuth, eventController.getPublicEvents);

// GET /api/events/:id - get single event
router.get('/:id', authenticate, eventController.getEvent);

// POST /api/events - create event
router.post(
  '/',
  authenticate,
  validate(schemas.createEvent),
  eventController.createEvent
);

// PUT /api/events/:id - update event
router.put(
  '/:id',
  authenticate,
  validate(schemas.updateEvent),
  eventController.updateEvent
);

// DELETE /api/events/:id - delete event
router.delete('/:id', authenticate, eventController.deleteEvent);

// POST /api/events/:id/join - join event
router.post('/:id/join', authenticate, eventController.joinEvent);

// POST /api/events/:id/leave - leave event
router.post('/:id/leave', authenticate, eventController.leaveEvent);

// GET /api/events/:id/participants - get participants
router.get('/:id/participants', authenticate, eventController.getParticipants);

// GET /api/events/:id/timezones - get event time in all participant timezones
router.get('/:id/timezones', authenticate, eventController.getEventTimezones);

export default router;
